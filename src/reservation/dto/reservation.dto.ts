import { Transform } from 'class-transformer';
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Matches,
    Min,
    Max,
    IsInt,
} from 'class-validator';

export class ReservationDto {
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt({ message: 'Restaurant ID must be an integer' })
    restaurantId: number;

    @IsString({ message: 'Date must be a string' })
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in YYYY-MM-DD format',
    })
    date: string;

    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    @Min(1, { message: 'Duration must be at least 1 minute' })
    @Max(240, { message: 'Duration cannot exceed 240 minutes' })
    duration: number;

    @IsString()
    @IsNotEmpty({ message: 'Time is required' })
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: 'Time must be in HH:MM 24-hour format',
    })
    time: string;

    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    @Min(1, { message: 'Seats must be at least 1' })
    seats: number;

    @IsOptional()
    @IsArray({ message: 'Cuisines must be an array of strings' })
    @IsString({ each: true, message: 'Each cuisine must be a string' })
    @IsNotEmpty({ each: true, message: 'Cuisine names cannot be empty' })
    cuisines?: string[];
}
