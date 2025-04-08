import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto, RegisterDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
    ) {}

    async login(dto: LoginDto) {
        try {
            const { email, password } = dto;
            const user = await this.prisma.user.findUnique({
                where: {
                    email,
                },
            });
            if (!user) {
                throw new ForbiddenException('User does not exist');
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
        const { password, ...rest } = dto;
        const hashedPassword = await argon.hash(password);
        try {
            const user = await this.prisma.user.create({
                data: {
                    ...rest,
                    password: hashedPassword,
                },
            });
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
