import { IsOptional, IsString, IsNotEmpty, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @Type(() => Number)
  @IsInt({ message: 'User ID must be an integer' })
  id: number;

  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password?: string;

  @IsOptional()
  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name cannot be empty' })
  fullname?: string;
}
