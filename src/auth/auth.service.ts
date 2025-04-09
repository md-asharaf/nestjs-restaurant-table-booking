import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto, RegisterDto } from './dto';
import * as argon from 'argon2';
import { Role } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
        private userService: UserService,
    ) {}

    async login(dto: LoginDto) {
        try {
            const { email, password, role = Role.USER } = dto;
            const user = await this.prisma.user.findUnique({
                where: {
                    email,
                },
            });
            if (!user) {
                throw new ForbiddenException('User does not exist');
            }
            if (user.role !== role) {
                throw new ForbiddenException('Invalid credentials');
            }
            const isPasswordMatching = await argon.verify(
                user.password,
                password,
            );
            if (!isPasswordMatching) {
                throw new ForbiddenException('Invalid credentials');
            }
            const { password: _, ...details } = user;
            return {
                accessToken: await this.signToken(
                    user.id,
                    user.email,
                    user.fullname,
                ),
                user: details,
            };
        } catch (error) {
            throw error;
        }
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

    private async signToken(userId: number, email: string, fullname: string) {
        try {
            const payload = {
                id: userId,
                email,
                fullname,
            };
            const secret = this.config.get('JWT_SECRET');
            return await this.jwt.signAsync(payload, {
                expiresIn: '1h',
                secret,
            });
        } catch (error) {
            throw error;
        }
    }
}
