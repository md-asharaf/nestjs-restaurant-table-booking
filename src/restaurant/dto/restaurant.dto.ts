import { Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    IsArray,
    ArrayNotEmpty,
    IsNumber,
    Min,
    IsPositive,
    IsOptional,
    IsDate,
    Matches,
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

    @Type(() => Number)
    @IsNumber()
    @Min(1, { message: 'Capacity must be at least 1' })
    capacity: number;
}

export class SearchRestaurantDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true, message: 'Each cuisine must be a string' })
    @IsNotEmpty({ each: true, message: 'Cuisine names cannot be empty' })
    cuisines?: string[];

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive({ message: 'Capacity must be a positive number' })
    capacity?: number;
}
