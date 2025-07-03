import {
    BadRequestException,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Body,
    Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/users.dto';
import { UpdateUserDto } from './dto/users-update.dto';
import { User } from './users.entity';
import { Public } from 'src/custom-decorators/public-decorators';

@Controller('user')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }


    @Public()
    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<{ user: any }> {
        const existing = await this.usersService.findOneByName(createUserDto.displayname);
        if (existing.user) {
            throw new BadRequestException({ message: 'Display name already exists' });
        }
        return this.usersService.create(createUserDto);
    }

    @Get()
    async findAll(): Promise<{ users: any[] }> {
        return this.usersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<{ user: any }> {
        return this.usersService.findOneById(id);
    }

    @Put(':id')
    async updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUser: UpdateUserDto,
    ): Promise<{ user: User }> {
        return this.usersService.updateUser(id, updateUser);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
        return this.usersService.deleteUser(id);
    }
}

