import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchRestaurantDto {
    @ApiPropertyOptional({
        example: 'The Food Palace',
        description: 'Optional search by restaurant name',
    })
    @IsOptional()
    @IsString({ message: 'Name must be a string' })
    name?: string;

    @ApiPropertyOptional({
        example: 'New York',
        description: 'Optional search by restaurant location',
    })
    @IsOptional()
    @IsString({ message: 'Location must be a string' })
    location?: string;

    @ApiPropertyOptional({
        example: ['Italian', 'Mexican'],
        description: 'Optional search by list of cuisines',
        type: [String],
    })
    @IsOptional()
    @IsArray({ message: 'Cuisines must be an array' })
    @IsString({ each: true, message: 'Each cuisine must be a string' })
    cuisines?: string[];

    @ApiPropertyOptional({
        example: 1,
        description: 'Page number for pagination (default: 1)',
    })
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt({ message: 'Page must be an integer' })
    @Min(1, { message: 'Page must be at least 1' })
    page?: number;

    @ApiPropertyOptional({
        example: 10,
        description: 'Number of results per page (default: 10)',
    })
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt({ message: 'Limit must be an integer' })
    @Min(1, { message: 'Limit must be at least 1' })
    limit?: number;
}