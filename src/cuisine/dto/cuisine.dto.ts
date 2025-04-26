import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CuisineDto {
    @ApiProperty({
        example: 'Italian',
        description: 'Name of the cuisine',
    })
    @IsString({ message: 'name must be a string' })
    @IsNotEmpty({ message: 'name cannot be empty' })
    name: string;
}
