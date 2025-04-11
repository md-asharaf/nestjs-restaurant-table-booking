import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    login(
        @Body() dto: LoginDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        return this.authService.login(dto, req, res);
    }

    @Post('logout')
    logout(
        @Req() req: Request,
        @Res({ passthrough: true }) response: Response,
    ) {
        const refreshToken = (req.cookies?.refresh_token as string) || '';
        return this.authService.logout(refreshToken, response);
    }
    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('refresh')
    refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) response: Response,
        @Req() request: Request,
    ) {
        const refreshToken = (req.cookies?.refresh_token as string) || '';
        return this.authService.refreshTokens(refreshToken, response, request);
    }
}
