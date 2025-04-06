import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRestaurantDto, SearchRestaurantDto } from './dto';

@Injectable()
export class RestaurantService {
    constructor(private prisma: PrismaService) {}
    // TODO: implement search functionality
    async getRestaurants(
        page: number,
        limit: number,
        dto: SearchRestaurantDto,
    ) {
        try {
            const { name, location, cuisine, seats, date, time, duration } =
                dto;
            const skip = (page - 1) * limit;

            const restaurants = await this.prisma.restaurant.findMany({
                skip,
                take: limit,
            });

            if (!restaurants || restaurants.length === 0) {
                throw new NotFoundException('No restaurants found');
            }

            return {
                message: 'retrieved restaurants successfully',
                restaurants,
            };
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(
                'Failed to fetch restaurants',
            );
        }
    }

    async createRestaurant(dto: CreateRestaurantDto) {
        try {
            const restaurant = await this.prisma.restaurant.create({
                data: {
                    ...dto,
                },
            });
            if (!restaurant) {
                throw new NotFoundException('Failed to create restaurant');
            }
            return {
                message: 'restaurant created successfully',
                restaurant,
            };
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(
                'Failed to create restaurant',
            );
        }
    }
}
