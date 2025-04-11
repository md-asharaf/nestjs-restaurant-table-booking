import { IsOptional, IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString({ message: 'Full name must be a string' })
    @IsNotEmpty({ message: 'Full name cannot be empty' })
    fullname?: string;
}
