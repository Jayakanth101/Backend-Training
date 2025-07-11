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
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiCreatedResponse,
    ApiOkResponse,
} from '@nestjs/swagger';
import {
    CreateUserResponseDto,
    FindAllUsersResponseDto,
    FindOneUserResponseDto,
    UpdateUserResponseDto,
    DeleteUserResponseDto,
} from './dto/users-response.dto';

@ApiTags('1. User')
@Controller('user')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @ApiOperation({ summary: 'Endpoint to create a new user' })
    @ApiCreatedResponse({ description: 'User created', type: CreateUserResponseDto })
    @Public()
    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<{ user: User | null }> {
        const existing = await this.usersService.findOneByName(createUserDto.displayname);
        if (existing.user) {
            throw new BadRequestException({ message: 'Display name already exists' });
        }
        return this.usersService.create(createUserDto);
    }

    @ApiOperation({ summary: 'Find all the users' })
    @ApiOkResponse({ description: 'All users', type: FindAllUsersResponseDto })
    @ApiBearerAuth()
    @Get()
    async findAll(): Promise<{ users: User[] }> {
        return this.usersService.findAll();
    }

    @ApiOperation({ summary: 'Find a user by ID' })
    @ApiOkResponse({ description: 'User found', type: FindOneUserResponseDto })
    @ApiBearerAuth()
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<{ user: User }> {
        return this.usersService.findOneById(id);
    }

    @ApiOperation({ summary: 'Update a user by ID' })
    @ApiOkResponse({ description: 'User updated', type: UpdateUserResponseDto })
    @ApiBearerAuth()
    @Put(':id')
    async updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUser: UpdateUserDto,
    ): Promise<{ user: User }> {
        return this.usersService.updateUser(id, updateUser);
    }

    @ApiOperation({ summary: 'Delete a user by ID' })
    @ApiOkResponse({ description: 'User deleted', type: DeleteUserResponseDto })
    @ApiBearerAuth()
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
        return this.usersService.deleteUser(id);
    }
}

