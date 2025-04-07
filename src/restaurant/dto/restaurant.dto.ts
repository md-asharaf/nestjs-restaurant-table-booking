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

    @Type(() => Number)
    @IsNumber()
    @IsPositive({ message: 'Seats must be a positive number' })
    seats: number;

    @Type(() => Date)
    @IsDate({ message: 'Date must be a valid ISO date' })
    date: Date;

    @IsString()
    @IsNotEmpty({ message: 'Time is required' })
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: 'Time must be in HH:MM 24-hour format',
    })
    time: string;

    @Type(() => Number)
    @IsNumber()
    @IsPositive({ message: 'Duration must be a positive number (in minutes)' })
    duration: number;
}
