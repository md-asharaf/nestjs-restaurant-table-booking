import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  fullname: string;
}
