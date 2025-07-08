import {
    Injectable,
    NotFoundException,
    ConflictException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dto/users.dto';
import { UpdateUserDto } from './dto/users-update.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async findAll(): Promise<{ users: User[] }> {
        const users = await this.userRepository.find();
        return { users };
    }

    async create(userDto: CreateUserDto): Promise<{ user: User }> {
        try {
            const user = this.userRepository.create(userDto);
            const savedUser = await this.userRepository.save(user);
            return { user: savedUser };
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException(
                    'User with this email or displayname already exists',
                );
            }
            throw new InternalServerErrorException(
                'Unexpected error during user creation',
            );
        }
    }

    async updateUser(
        id: number,
        updatedUser: UpdateUserDto,
    ): Promise<{ user: User }> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException(`User with Id ${id} not found`);
        }
        await this.userRepository.update(id, updatedUser);
        const updated = await this.userRepository.findOneBy({ id: user.id });
        if (!updated) {
            throw new NotFoundException(`User with Id ${id} after updation  not found`);
        }
        return { user: updated };
    }

    async findOneById(id: number): Promise<{ user: User }> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException(`User with Id ${id} not found`);
        }
        return { user };
    }

    async findOneByName(name: string): Promise<{ user: User | null }> {
        const user = await this.userRepository.findOne({
            where: { displayname: name },
        });
        return { user };
    }

    async deleteUser(id: number): Promise<{ message: string }> {
        const existing = await this.userRepository.findOneBy({ id });
        if (!existing) {
            throw new NotFoundException(`User with Id ${id} not found`);
        }
        await this.userRepository.delete(id);
        return { message: `User ${id} successfully deleted` };
    }
}

