import { BadRequestException, Controller, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { Get, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/users.dto';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Controller('user')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {

        const existing = await this.usersService.findOneByName(createUserDto.displayname);
        if (existing) {
            throw new BadRequestException('Display name already exists');
        }
        return this.usersService.create(createUserDto);

    }

    @Get()
    async findAll(): Promise<User[]> {
        try {
            return this.usersService.findAll();
        }
        catch (err) {
            throw new ExceptionsHandler(err);
        }
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
        return this.usersService.findOneById(id);
    }


    @Delete(':id')
    async Delete(@Param('id') id: number): Promise<string> {
        await this.usersService.DeleteUser(id);
        return `User ${id} has been deleted`;
    }

}
