import { IsNotEmpty, IsString } from 'class-validator';

export class CuisineDto {
    @IsString({ message: 'name must be a string' })
    @IsNotEmpty({ message: 'name cannot be empty' })
    name: string;
}
