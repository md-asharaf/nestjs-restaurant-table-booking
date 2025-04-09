import {
    BadGatewayException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto';
import * as argon from 'argon2';
import { User } from '@prisma/client';
import { generateOtp, verifyOtp } from 'src/common/utils/otp.utils';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private emailService: EmailService,
    ) {}

    async update(id: number, dto: UpdateUserDto) {
        const { fullname, password } = dto;
        const data: any = {};
        if (fullname) {
            data.fullname = fullname;
        }
        if (password) {
            data.password = await argon.hash(password);
        }
        const updatedUser = await this.prisma.user.update({
            where: {
                id,
            },
            data,
        });
        const { password: _, ...details } = updatedUser;
        return {
            updatedUser: details,
        };
    }

    async verifyEmail(otp: string, email: string) {
        const isVerified = verifyOtp(email, otp);
        if (!isVerified) {
            throw new UnauthorizedException('Invalid or expired OTP');
        }
        const verifiedUser = await this.prisma.user.update({
            where: {
                email,
            },
            data: {
                isVerified,
            },
        });
        return {
            message: 'email verified successfully',
            user: verifiedUser,
        };
    }

    async sendOtpToEmail(user: User) {
        const { isVerified, email, fullname } = user;
        if (isVerified) {
            throw new ConflictException('User is already verified');
        }
        const otp = generateOtp(email);
        const { error } = await this.emailService.sendEmailVerificationCode({
            to: email,
            otp,
            name: fullname,
        });
        if (error) {
            throw new BadGatewayException(error.message);
        }
        return {
            message: 'Verification code sent successfully',
        };
    }

    async remove(id: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
            include: {
                reservations: true,
                restaurants: true,
            },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const hasActiveReservations = user.reservations.some(
            (reservation) => reservation.end > new Date(),
        );
        if (hasActiveReservations) {
            throw new ForbiddenException(
                'Cannot delete user with active reservations',
            );
        }
        const hasRestaurants = user.restaurants.length > 0;
        if (hasRestaurants) {
            throw new ForbiddenException(
                'Cannot delete user owning restaurants',
            );
        }
        const deletedUser = await this.prisma.user.delete({
            where: {
                id,
            },
        });
        const { password: _, ...details } = deletedUser;
        return {
            message: 'User deleted successfully',
            user: details,
        };
    }

    async findOne(id: number) {
        const user = await this.prisma.user.findUnique({
            select: {
                id: true,
                fullname: true,
                email: true,
                role: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
            },
            where: {
                id,
            },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return {
            message: 'User retrieved successfully',
            user,
        };
    }

    async findAll(query: any) {
        const { page = 1, limit = 10, isVerified } = query;
        const skip = (page - 1) * limit;
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                fullname: true,
                email: true,
                role: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
            },
            where: {
                ...(isVerified !== undefined && { isVerified }),
            },
            skip,
            take: limit,
        });
        return {
            message: users.length
                ? 'Users retrieved successfully'
                : 'No users found',
            users,
        };
    }

    async myReservations(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                reservations: {
                    include: {
                        restaurant: true,
                    },
                },
            },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return {
            message: 'Reservations retrieved successfully',
            reservations: user.reservations,
        };
    }

    async myRestaurants(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                restaurants: true,
            },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return {
            message: 'Restaurants retrieved successfully',
            restaurants: user.restaurants,
        };
    }
}
