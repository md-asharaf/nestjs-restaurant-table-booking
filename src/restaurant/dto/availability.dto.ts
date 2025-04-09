import { Transform } from 'class-transformer';
import {
    IsInt,
    IsOptional,
    IsString,
    Matches,
    Min,
    Max,
} from 'class-validator';

export class AvailabilityDto {
    @IsOptional()
    @IsString({ message: 'Date must be a string' })
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in YYYY-MM-DD format',
    })
    date?: string;

    @IsOptional()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: 'Time must be in HH:MM 24-hour format',
    })
    time?: string;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt({ message: 'Seats must be an integer' })
    @Min(1, { message: 'Seats must be at least 1' })
    seats?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt({ message: 'Duration must be an integer' })
    @Min(1, { message: 'Duration must be at least 1 minute' })
    @Max(240, { message: 'Duration cannot exceed 240 minutes' })
    duration?: number;
}
