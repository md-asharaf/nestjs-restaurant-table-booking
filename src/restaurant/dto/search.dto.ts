import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class SearchRestaurantDto {
    @IsOptional()
    @IsString({ message: 'Name must be a string' })
    name?: string;

    @IsOptional()
    @IsString({ message: 'Location must be a string' })
    location?: string;

    @IsOptional()
    @IsArray({ message: 'Cuisines must be an array' })
    @IsString({ each: true, message: 'Each cuisine must be a string' })
    cuisines?: string[];

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt({ message: 'Page must be an integer' })
    @Min(1, { message: 'Page must be at least 1' })
    page?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt({ message: 'Limit must be an integer' })
    @Min(1, { message: 'Limit must be at least 1' })
    limit?: number;
}
