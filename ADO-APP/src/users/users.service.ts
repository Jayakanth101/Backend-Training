import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/users.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async create(userDto: CreateUserDto): Promise<User> {
        try {
            const user = this.userRepository.create(userDto);
            return await this.userRepository.save(user);
        } catch (error) {
            if (error.code === '23505') { // Postgres duplicate key error code
                throw new ConflictException('User with this email or username already exists');
            }
            throw new InternalServerErrorException(`Unexpected error during user creation: ${error}`);
        }
    }

    async findOneById(id: number): Promise<User | null> {
        const user = this.userRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException(`User with Id ${id} not found`);
        }
        return user;
    }

    async findOneByName(name: string): Promise<User | null> {
        const user = this.userRepository.findOne({ where: { displayname: name } });
        if (!user) {
            throw new NotFoundException(`User with id not found`);
        }
        return user;
    }

    async DeleteUser(id: number): Promise<void> {
        const existing = await this.userRepository.findOneBy({ id });
        if (!existing) {
            throw new NotFoundException(`User with ${id} not found`);
        }
        await this.userRepository.delete(id);
    }
}
