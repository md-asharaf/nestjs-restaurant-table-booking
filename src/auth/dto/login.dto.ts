import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsIn,
    IsOptional,
} from 'class-validator';

export class LoginDto {
    @ApiProperty({
        description: 'User email address',
        example: 'example@gmail.com',
    })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @ApiProperty({
        description: 'User password',
        example: '12345678',
    })
    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password is required' })
    password: string;

    @ApiProperty({
        description: 'User role',
        example: 'ADMIN',
    })
    @IsOptional()
    @IsString({ message: 'Role must be a string' })
    @IsIn(['ADMIN', 'USER', 'OWNER'], {
        message: 'Role must be either admin, user, or owner',
    })
    role?: Role = 'USER';
}
