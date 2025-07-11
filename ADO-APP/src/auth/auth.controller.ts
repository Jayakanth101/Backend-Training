import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/custom-decorators/public-decorators';
import {
    ApiTags,
    ApiOperation,
    ApiOkResponse,
} from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';
import { SignInResponseDto } from './dto/auth-response.dto';

@ApiTags('2. Login for JWT token')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiOperation({ summary: 'Login and get JWT token' })
    @ApiOkResponse({ description: 'JWT access token', type: SignInResponseDto })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Post('login')
    signIn(@Body() signInDto: SignInDto): Promise<{ access_token: string }> {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }
}

