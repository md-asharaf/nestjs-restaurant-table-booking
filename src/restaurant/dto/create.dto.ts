import { Transform } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    IsArray,
    ArrayNotEmpty,
    Min,
    IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRestaurantDto {
    @ApiProperty({
        example: 'The Fancy Spoon',
        description: 'Name of the restaurant',
    })
    @IsString()
    @IsNotEmpty({ message: 'Restaurant name is required' })
    name: string;

    @ApiProperty({
        example: 'New York City',
        description: 'Location where the restaurant is based',
    })
    @IsString()
    @IsNotEmpty({ message: 'Location is required' })
    location: string;

    @ApiProperty({
        example: ['Italian', 'Mexican', 'Indian'],
        description: 'List of cuisines offered by the restaurant',
        type: [String],
    })
    @IsArray({ message: 'Cuisines must be an array of strings' })
    @ArrayNotEmpty({ message: 'At least one cuisine is required' })
    @IsString({ each: true, message: 'Each cuisine must be a string' })
    @IsNotEmpty({ each: true, message: 'Cuisine names cannot be empty' })
    cuisines: string[];

    @ApiProperty({
        example: 50,
        description: 'Total seating capacity of the restaurant',
        minimum: 1,
    })
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @Min(1, { message: 'Capacity must be at least 1' })
    capacity: number;
}
