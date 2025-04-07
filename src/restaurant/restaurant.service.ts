import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRestaurantDto, SearchRestaurantDto } from './dto';
import { addMinutes } from 'date-fns';

@Injectable()
export class RestaurantService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateRestaurantDto) {
        const { name, location, capacity, cuisines } = dto;

        const loweredName = name.toLowerCase();
        const loweredLocation = location.toLowerCase();
        const loweredCuisines = cuisines.map((c) => c.toLowerCase());

        try {
            const existingRestaurant = await this.prisma.restaurant.findFirst({
                where: {
                    name: loweredName,
                    location: loweredLocation,
                },
            });

            if (existingRestaurant) {
                throw new ConflictException('Restaurant already exists');
            }

            const existingCuisines = await this.prisma.cuisine.findMany({
                where: {
                    name: { in: loweredCuisines },
                },
            });

            const missingCuisines = loweredCuisines.filter((cuisine) =>
                existingCuisines.every((e) => e.name !== cuisine),
            );

            if (missingCuisines.length > 0) {
                throw new NotFoundException(
                    `Cuisines not found: ${missingCuisines.join(', ')}`,
                );
            }

            const restaurant = await this.prisma.restaurant.create({
                data: {
                    name: loweredName,
                    location: loweredLocation,
                    capacity,
                    cuisines: {
                        connect: loweredCuisines.map((name) => ({ name })),
                    },
                },
            });

            return {
                message: 'Restaurant created successfully',
                restaurant,
            };
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(
                'Failed to create restaurant',
            );
        }
    }

    async findOne(restaurantId: number) {
        try {
            const restaurant = await this.prisma.restaurant.findUnique({
                where: {
                    id: restaurantId,
                },
                include: {
                    cuisines: true,
                },
            });
            if (!restaurant) {
                throw new NotFoundException('Restaurant not found');
            }
            return {
                message: 'Restaurant retrieved successfully',
                restaurant,
            };
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(
                'Failed to fetch restaurant details',
            );
        }
    }

    async findAll(
        page: number,
        limit: number,
        dto: SearchRestaurantDto,
    ) {
        try {
            const { name, location, cuisines, seats, date, time, duration } =
                dto;
            const skip = (page - 1) * limit;

            const filter: any = {
                ...(name && { name: { contains: name, mode: 'insensitive' } }),
                ...(location && {
                    location: { contains: location, mode: 'insensitive' },
                }),
                ...(cuisines?.length && {
                    cuisines: {
                        some: {
                            name: { in: cuisines },
                        },
                    },
                }),
            };

            const allMatchingRestaurants =
                await this.prisma.restaurant.findMany({
                    where: filter,
                    include: {
                        reservations: true,
                        cuisines: true,
                    },
                });

            if (!allMatchingRestaurants.length) {
                throw new NotFoundException('No matching restaurants found');
            }

            const [hour, minute] = time.split(':').map(Number);
            const start = new Date(date);
            start.setHours(hour, minute, 0, 0);
            const end = addMinutes(start, duration);

            const availableRestaurants = allMatchingRestaurants.filter((r) => {
                const overlappingReservations = r.reservations.filter(
                    (res) => !(res.end <= start || res.start >= end),
                );
                return r.capacity >= seats + overlappingReservations.length;
            });

            if (!availableRestaurants.length) {
                throw new NotFoundException(
                    'No available restaurants for the given time',
                );
            }

            const paginated = availableRestaurants.slice(skip, skip + limit);

            return {
                message: 'Restaurants retrieved successfully',
                restaurants: paginated,
                page,
                totalCount: availableRestaurants.length,
            };
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(
                'Failed to fetch restaurants',
            );
        }
    }

    async update(restaurantId: number, dto: CreateRestaurantDto) {
        try {
            const { cuisines, ...rest } = dto;

            const restaurant = await this.prisma.restaurant.findUnique({
                where: { id: restaurantId },
                include: {
                    cuisines: true,
                    reservations: true,
                },
            });
            if (!restaurant) {
                throw new NotFoundException('Restaurant not found');
            }

            if (restaurant.reservations.length) {
                throw new ConflictException(
                    'Cannot update restaurant with existing reservations',
                );
            }

            const existingRestaurant = await this.prisma.restaurant.findFirst({
                where: {
                    id: { not: restaurantId },
                    name: { contains: rest.name, mode: 'insensitive' },
                    location: { contains: rest.location, mode: 'insensitive' },
                },
            });
            if (existingRestaurant) {
                throw new ConflictException('Restaurant already exists');
            }

            const normalizedCuisines = cuisines.map((name) =>
                name.toLowerCase(),
            );

            const existingCuisines = await this.prisma.cuisine.findMany({
                where: {
                    name: { in: normalizedCuisines },
                },
            });

            if (existingCuisines.length !== normalizedCuisines.length) {
                const existingNames = existingCuisines.map((c) => c.name);
                const missing = normalizedCuisines.filter(
                    (c) => !existingNames.includes(c),
                );
                throw new NotFoundException(
                    `The following cuisines do not exist: ${missing.join(', ')}`,
                );
            }

            const updatedRestaurant = await this.prisma.restaurant.update({
                where: { id: restaurantId },
                data: {
                    ...rest,
                    cuisines: {
                        set: [],
                        connect: normalizedCuisines.map((name) => ({ name })),
                    },
                },
            });

            return {
                message: 'Restaurant updated successfully',
                updatedRestaurant,
            };
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(
                'Failed to update restaurant',
            );
        }
    }

    async remove(restaurantId: number) {
        try {
            const restaurant = await this.prisma.restaurant.findUnique({
                where: { id: restaurantId },
                include: { reservations: true },
            });

            if (!restaurant) {
                throw new NotFoundException('Restaurant not found');
            }

            if (restaurant.reservations.length > 0) {
                throw new ConflictException(
                    'Cannot delete restaurant with existing reservations',
                );
            }

            const deletedRestaurant = await this.prisma.restaurant.delete({
                where: { id: restaurantId },
            });

            return {
                message: 'Restaurant deleted successfully',
                deletedRestaurant,
            };
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(
                'Failed to delete restaurant',
            );
        }
    }
}
