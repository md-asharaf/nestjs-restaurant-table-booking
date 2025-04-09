import { IsOptional, IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password cannot be empty' })
    password?: string;

    @IsOptional()
    @IsString({ message: 'Full name must be a string' })
    @IsNotEmpty({ message: 'Full name cannot be empty' })
    fullname?: string;

    @IsOptional()
    @IsBoolean()
    isVerified?: boolean;
}
