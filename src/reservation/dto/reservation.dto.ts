import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Matches,
    Min,
    Max,
    IsDate,
} from 'class-validator';

export class ReservationDto {
    @IsDate({ message: 'Date is required' })
    date: string;

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

    @IsString()
    @IsNotEmpty({ message: 'Location is required' })
    location: string;

    @IsNumber()
    @Min(1, { message: 'Seats must be at least 1' })
    seats: number;

    @IsString()
    @IsNotEmpty({ message: 'Restaurant name is required' })
    name: string;

    @IsOptional()
    @IsArray({ message: 'Cuisines must be an array of strings' })
    @IsString({ each: true, message: 'Each cuisine must be a string' })
    @IsNotEmpty({ each: true, message: 'Cuisine names cannot be empty' })
    cuisines?: string[];
}
