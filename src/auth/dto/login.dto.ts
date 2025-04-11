import { Role } from '@prisma/client';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsIn,
    IsOptional,
} from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password is required' })
    password: string;

    @IsOptional()
    @IsString({ message: 'Role must be a string' })
    @IsIn(['ADMIN', 'USER', 'OWNER'], {
        message: 'Role must be either admin, user, or owner',
    })
    role?: Role = 'USER';
}
