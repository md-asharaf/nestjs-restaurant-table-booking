import { Transform } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    IsArray,
    ArrayNotEmpty,
    Min,
    IsInt,
} from 'class-validator';

export class CreateRestaurantDto {
    @IsString()
    @IsNotEmpty({ message: 'Restaurant name is required' })
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'Location is required' })
    location: string;

    @IsArray({ message: 'Cuisines must be an array of strings' })
    @ArrayNotEmpty({ message: 'At least one cuisine is required' })
    @IsString({ each: true, message: 'Each cuisine must be a string' })
    @IsNotEmpty({ each: true, message: 'Cuisine names cannot be empty' })
    cuisines: string[];

    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @Min(1, { message: 'Capacity must be at least 1' })
    capacity: number;
}
