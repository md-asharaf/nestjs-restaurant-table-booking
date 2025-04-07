import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async update(id: number, dto: UpdateUserDto) {
        try {
            const { fullname, password } = dto;
            let hashedPassword: string = '';
            if (password) {
                hashedPassword = await argon.hash(password);
            }
            const updatedUser = await this.prisma.user.update({
                where: {
                    id,
                },
                data: {
                    fullname,
                    password: hashedPassword,
                },
            });
            if (!updatedUser) {
                throw new UnauthorizedException();
            }
            const { password: _, ...details } = updatedUser;
            return {
                updatedUser: details,
            };
        } catch (error) {
            throw error;
        }
    }
}
