import {
    Body,
    Controller,
    Post,
    Req,
    Res,
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiCookieAuth,
  } from '@nestjs/swagger';
  import { AuthService } from './auth.service';
  import { LoginDto, RegisterDto } from './dto';
  import { Response, Request } from 'express';
  
  @ApiTags('Auth')
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @Post('login')
    @ApiOperation({ summary: 'Login a user' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: 200, description: 'Login successful' })
    login(
      @Body() dto: LoginDto,
      @Req() req: Request,
      @Res({ passthrough: true }) res: Response,
    ) {
      return this.authService.login(dto, req, res);
    }
  
    @Post('logout')
    @ApiOperation({ summary: 'Logout the current user' })
    @ApiCookieAuth()
    @ApiResponse({ status: 200, description: 'Logout successful' })
    logout(
      @Req() req: Request,
      @Res({ passthrough: true }) response: Response,
    ) {
      const refreshToken = (req.cookies?.refresh_token as string) || '';
      return this.authService.logout(refreshToken, response);
    }
  
    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: RegisterDto })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    register(@Body() dto: RegisterDto) {
      return this.authService.register(dto);
    }
  
    @Post('refresh')
    @ApiOperation({ summary: 'Refresh access and refresh tokens' })
    @ApiCookieAuth()
    @ApiResponse({ status: 200, description: 'Tokens refreshed' })
    refresh(
      @Req() req: Request,
      @Res({ passthrough: true }) response: Response,
      @Req() request: Request,
    ) {
      const refreshToken = (req.cookies?.refresh_token as string) || '';
      return this.authService.refreshTokens(refreshToken, response, request);
    }
  }
  