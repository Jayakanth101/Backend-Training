import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) { }

    async signIn(userName: string, pass: string): Promise<{ access_token: string }> {
        const user = await this.usersService.findOneByName(userName);
        if (!user) {
            throw new NotFoundException("User not found please create an user first");
        }
        if (user.user?.password != pass) {
            throw new UnauthorizedException();
        }

        const payload = { sub: user.user.id, userName: user.user.displayname };

        return {
            access_token: await this.jwtService.signAsync(payload)
        };
    }
}
