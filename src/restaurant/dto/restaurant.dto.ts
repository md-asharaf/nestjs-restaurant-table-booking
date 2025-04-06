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
} from 'class-validator';

export class CreateRestaurantDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    cuisine: string[];

    @IsNumber()
    @Min(1)
    tableCount: number;
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
    @IsString({ each: true })
    cuisine?: string[];

    @IsNumber()
    @IsPositive()
    seats: number;

    @Type(() => Date)
    @IsDate()
    date: Date;

    @IsString()
    @IsNotEmpty()
    time: string;

    @IsNumber()
    @IsPositive()
    duration: number;
}
