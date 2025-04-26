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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReservationDto {
    @ApiProperty({
        example: 1,
        description: 'ID of the restaurant to reserve',
    })
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt({ message: 'Restaurant ID must be an integer' })
    restaurantId: number;

    @ApiProperty({
        example: '2025-05-01',
        description: 'Reservation date in YYYY-MM-DD format',
    })
    @IsString({ message: 'Date must be a string' })
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in YYYY-MM-DD format',
    })
    date: string;

    @ApiProperty({
        example: 90,
        description: 'Duration of the reservation in minutes (1 to 240)',
    })
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    @Min(1, { message: 'Duration must be at least 1 minute' })
    @Max(240, { message: 'Duration cannot exceed 240 minutes' })
    duration: number;

    @ApiProperty({
        example: '18:30',
        description: 'Time of the reservation in HH:MM 24-hour format',
    })
    @IsString()
    @IsNotEmpty({ message: 'Time is required' })
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: 'Time must be in HH:MM 24-hour format',
    })
    time: string;

    @ApiProperty({
        example: 4,
        description: 'Number of seats required for the reservation',
    })
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    @Min(1, { message: 'Seats must be at least 1' })
    seats: number;

    @ApiPropertyOptional({
        example: ['Italian', 'Chinese'],
        description: 'Optional list of preferred cuisines',
        type: [String],
    })
    @IsOptional()
    @IsArray({ message: 'Cuisines must be an array of strings' })
    @IsString({ each: true, message: 'Each cuisine must be a string' })
    @IsNotEmpty({ each: true, message: 'Cuisine names cannot be empty' })
    cuisines?: string[];
}
