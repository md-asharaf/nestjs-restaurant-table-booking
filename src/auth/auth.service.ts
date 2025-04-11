import {
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto, RegisterDto } from './dto';
import * as argon from 'argon2';
import { Role } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { Response, Request } from 'express';

@Injectable()
export class AuthService {
    private cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'none' as const,
    };
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
        private userService: UserService,
    ) {}

    async login(dto: LoginDto, req: Request, res: Response) {
        const { email, password, role = Role.USER } = dto;

        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) throw new ForbiddenException('User does not exist');
        if (user.role !== role) throw new ForbiddenException('Invalid role');

        const isPasswordMatching = await argon.verify(user.password, password);
        if (!isPasswordMatching)
            throw new ForbiddenException('Invalid credentials');

        const ipAddress =
            (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
            req.socket?.remoteAddress ||
            req.ip ||
            'Unknown IP';

        const userAgent = req.get('user-agent') || 'Unknown';
        const session =
            (await this.prisma.session.findFirst({
                where: {
                    userId: user.id,
                    userAgent: userAgent,
                    ipAddress: ipAddress,
                },
            })) ||
            (await this.prisma.session.create({
                data: {
                    userId: user.id,
                    userAgent,
                    ipAddress,
                },
            }));
        if (!session) {
            throw new ForbiddenException('Failed to create session');
        }
        const accessToken = await this.signAccessToken(user.id, session.id);
        const refreshToken = await this.signRefreshToken(user.id, session.id);
        res.cookie('refresh_token', refreshToken, this.cookieOptions);
        const { password: _, ...userData } = user;

        return {
            user: userData,
            accessToken,
            message: 'Login successful',
        };
    }

    async register(dto: RegisterDto) {
        try {
            const { password, fullname, role, email } = dto;
            const hashedPassword = await argon.hash(password);
            const user = await this.prisma.user.create({
                data: {
                    email,
                    fullname,
                    role,
                    password: hashedPassword,
                },
            });
            await this.userService.sendOtpToEmail(user);
            const { password: _, ...details } = user;
            return {
                message: 'User created successfully',
                user: details,
            };
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ForbiddenException('Credentials taken');
            }
            throw error;
        }
    }

    async logout(refreshToken: string, res: Response) {
        try {
            const { userId, sessionId } = await this.jwt.verifyAsync(
                refreshToken,
                {
                    secret: this.config.get('REFRESH_TOKEN_SECRET'),
                },
            );

            const session = await this.prisma.session.findUnique({
                where: { id: sessionId },
            });

            if (!session || session.userId !== userId) {
                throw new ForbiddenException('Invalid session or user');
            }

            await this.prisma.session.delete({ where: { id: sessionId } });

            res.clearCookie('refresh_token', this.cookieOptions);

            return { message: 'Logged out successfully' };
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Refresh token expired');
            }
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async refreshTokens(refreshToken: string, res: Response, req: Request) {
        try {
            const { userId, sessionId } = await this.jwt.verifyAsync(
                refreshToken,
                {
                    secret: this.config.get('REFRESH_TOKEN_SECRET'),
                },
            );
            let session = await this.prisma.session.findUnique({
                where: { id: sessionId },
            });
            if (session && session.userId !== userId) {
                throw new ForbiddenException('Invalid session or user');
            }
            if (!session) {
                const ipAddress =
                    (req.headers['x-forwarded-for'] as string)
                        ?.split(',')[0]
                        ?.trim() ||
                    req.socket?.remoteAddress ||
                    req.ip ||
                    'Unknown IP';

                const userAgent = req.get('user-agent') || 'Unknown';
                session = await this.prisma.session.create({
                    data: {
                        userId,
                        userAgent,
                        ipAddress,
                    },
                });
            }

            const newAccessToken = await this.signAccessToken(
                userId,
                session.id,
            );
            const newRefreshToken = await this.signRefreshToken(
                userId,
                session.id,
            );

            res.cookie('refresh_token', newRefreshToken, this.cookieOptions);

            return {
                accessToken: newAccessToken,
                message: 'Tokens refreshed successfully',
            };
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Refresh token expired');
            }
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    private async signAccessToken(userId: number, sessionId: string) {
        const secret = this.config.get('ACCESS_TOKEN_SECRET');
        const expiresIn = this.config.get('ACCESS_TOKEN_EXPIRY');
        return await this.jwt.signAsync(
            {
                userId,
                sessionId,
            },
            {
                expiresIn,
                secret,
            },
        );
    }

    private async signRefreshToken(userId: number, sessionId: string) {
        const secret = this.config.get('REFRESH_TOKEN_SECRET');
        const expiresIn = this.config.get('REFRESH_TOKEN_EXPIRY');
        return await this.jwt.signAsync(
            {
                userId,
                sessionId,
            },
            {
                expiresIn,
                secret,
            },
        );
    }
}
