import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users.entity';

export class CreateUserResponseDto {
    @ApiProperty({ type: () => User, nullable: true })
    user: User | null;
}

export class FindAllUsersResponseDto {
    @ApiProperty({ type: () => [User] })
    users: User[];
}

export class FindOneUserResponseDto {
    @ApiProperty({ type: () => User })
    user: User;
}

export class UpdateUserResponseDto {
    @ApiProperty({ type: () => User })
    user: User;
}

export class DeleteUserResponseDto {
    @ApiProperty({ example: 'User deleted successfully' })
    message: string;
}

