import { Role } from '@prisma/client';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsIn,
    IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'Email address of the user',
    })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @ApiProperty({
        example: 'strongPassword123',
        description: 'Password for the account',
    })
    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password is required' })
    password: string;

    @ApiProperty({
        example: 'John Doe',
        description: 'Full name of the user',
    })
    @IsString({ message: 'Full name must be a string' })
    @IsNotEmpty({ message: 'Full name is required' })
    fullname: string;

    @ApiPropertyOptional({
        example: 'USER',
        description: 'Role assigned to the user. Defaults to USER. Must be one of ADMIN, USER, OWNER.',
        enum: ['ADMIN', 'USER', 'OWNER'],
        default: 'USER',
    })
    @IsOptional()
    @IsString({ message: 'Role must be a string' })
    @IsNotEmpty({ message: 'Role is required' })
    @IsIn(['ADMIN', 'USER', 'OWNER'], {
        message: 'Role must be either admin, user, or owner',
    })
    role?: Role = 'USER';
}
