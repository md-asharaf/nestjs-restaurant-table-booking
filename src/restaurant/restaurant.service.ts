import {
    Injectable,
    NotFoundException,
    ConflictException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
    CreateRestaurantDto,
    SearchRestaurantDto,
    UpdateRestaurantDto,
} from './dto';
import { Prisma, User } from '@prisma/client';
import { AvailabilityDto } from './dto';

@Injectable()
export class RestaurantService {
    constructor(private prisma: PrismaService) {}

    async create(user: User, dto: CreateRestaurantDto) {
        const { role, id: ownerId } = user;
        if (role !== 'ADMIN' && role !== 'OWNER') {
            throw new ForbiddenException(
                'Only ADMIN or OWNER can create a restaurant',
            );
        }
        const { name, location, capacity, cuisines } = dto;

        const loweredName = name.toLowerCase();
        const loweredLocation = location.toLowerCase();
        const loweredCuisines = cuisines.map((c) => c.toLowerCase());
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
                ownerId,
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
    }

    async findOne(restaurantId: number) {
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
    }

    async findAll(dto: SearchRestaurantDto) {
        const {
            name,
            location,
            cuisines = [],
            page = 1,
            limit = 10,
        } = dto || {};
        const skip = (page - 1) * limit;

        const filter: Prisma.RestaurantWhereInput = {
            ...(name && { name: { contains: name, mode: 'insensitive' } }),
            ...(location && {
                location: { contains: location, mode: 'insensitive' },
            }),
            ...(cuisines.length && {
                cuisines: {
                    some: {
                        name: { in: cuisines.map((c) => c.toLowerCase()) },
                    },
                },
            }),
        };

        const restaurants = await this.prisma.restaurant.findMany({
            where: filter,
            include: {
                cuisines: true,
            },
            skip,
            take: limit,
        });
        const totalCount = await this.prisma.restaurant.count({
            where: filter,
        });

        return {
            message: 'Restaurants retrieved successfully',
            restaurants,
            page,
            totalCount,
        };
    }

    async update(user: User, restaurantId: number, dto: UpdateRestaurantDto) {
        const { role, id: userId } = user;
        const { cuisines, name, location, capacity } = dto;
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

        const isOwner = restaurant.ownerId === userId;
        const isAdmin = role === 'ADMIN';

        if (!isAdmin && !(role === 'OWNER' && isOwner)) {
            throw new ForbiddenException(
                'Only ADMINs or the OWNER of this restaurant can update it',
            );
        }

        const hasActiveReservations = restaurant.reservations.some(
            (res) => res.end > new Date(),
        );

        if (hasActiveReservations) {
            throw new ConflictException(
                'Cannot update restaurant with active reservations',
            );
        }

        const updateData: any = {};

        if (name) updateData.name = name.toLowerCase();
        if (location) updateData.location = location.toLowerCase();
        if (capacity !== undefined) updateData.capacity = capacity;

        if (name || location) {
            const duplicate = await this.prisma.restaurant.findFirst({
                where: {
                    id: { not: restaurantId },
                    name: name
                        ? { equals: name, mode: 'insensitive' }
                        : { equals: restaurant.name, mode: 'insensitive' },
                    location: location
                        ? { equals: location, mode: 'insensitive' }
                        : {
                              equals: restaurant.location,
                              mode: 'insensitive',
                          },
                },
            });

            if (duplicate) {
                throw new ConflictException(
                    'Another restaurant with this name and location already exists',
                );
            }
        }

        if (cuisines) {
            const normalizedCuisines = cuisines.map((c) => c.toLowerCase());
            const foundCuisines = await this.prisma.cuisine.findMany({
                where: { name: { in: normalizedCuisines } },
            });

            const foundNames = foundCuisines.map((c) => c.name);
            const missing = normalizedCuisines.filter(
                (c) => !foundNames.includes(c),
            );

            if (missing.length) {
                throw new NotFoundException(
                    `The following cuisines do not exist: ${missing.join(', ')}`,
                );
            }

            updateData.cuisines = {
                set: [],
                connect: normalizedCuisines.map((name) => ({ name })),
            };
        }

        const updatedRestaurant = await this.prisma.restaurant.update({
            where: { id: restaurantId },
            data: updateData,
        });

        return {
            message: 'Restaurant updated successfully',
            updatedRestaurant,
        };
    }

    async remove(user: User, restaurantId: number) {
        const { role, id: userId } = user;

        const restaurant = await this.prisma.restaurant.findUnique({
            where: { id: restaurantId },
            include: { reservations: true },
        });

        if (!restaurant) {
            throw new NotFoundException('Restaurant not found');
        }

        const isOwner = restaurant.ownerId === userId;
        const isAdmin = role === 'ADMIN';

        if (!isAdmin && !(role === 'OWNER' && isOwner)) {
            throw new ForbiddenException(
                'Only ADMINs or the OWNER of this restaurant can delete it',
            );
        }

        const now = new Date();
        const hasActiveReservations = restaurant.reservations.some(
            (reservation) => reservation.end > now,
        );

        if (hasActiveReservations) {
            throw new ConflictException(
                'Cannot delete restaurant with active reservations',
            );
        }

        const deletedRestaurant = await this.prisma.restaurant.delete({
            where: { id: restaurantId },
        });

        return {
            message: 'Restaurant deleted successfully',
            deletedRestaurant,
        };
    }

    async findAvailability(restaurantId: number, query: AvailabilityDto) {
        const { date, time, seats = 1, duration = 60 } = query;
        const restaurant = await this.prisma.restaurant.findUnique({
            where: { id: restaurantId },
            include: {
                reservations: true,
            },
        });

        if (!restaurant) throw new NotFoundException('Restaurant not found');

        const { capacity, reservations } = restaurant;

        if (time) {
            const start = date ? new Date(date) : new Date();
            const end = new Date(start.getTime() + duration * 60000);

            const overlapping = reservations.filter(
                (r) =>
                    !(
                        r.status === 'CANCELLED' ||
                        r.status === 'COMPLETED' ||
                        r.start >= end ||
                        r.end <= start
                    ),
            );
            const totalGuests = overlapping.reduce(
                (acc, r) => acc + r.seats,
                0,
            );

            const availableSeats = capacity - totalGuests;
            const isAvailable = totalGuests + seats <= capacity;
            return {
                availableSeats,
                isAvailable,
                duration,
            };
        } else {
            const availableSlotsWithAvailableSeats: {
                slot: string;
                seats: number;
                isAvailable: boolean;
            }[] = [];

            for (let hour = 0; hour < 24; hour++) {
                const start = date ? new Date(date) : new Date();
                start.setHours(hour, 0, 0, 0);
                const end = new Date(start.getTime() + duration * 60000);

                const overlapping = reservations.filter(
                    (r) =>
                        !(
                            r.status === 'CANCELLED' ||
                            r.status === 'COMPLETED' ||
                            r.start >= end ||
                            r.end <= start
                        ),
                );
                const totalGuests = overlapping.reduce(
                    (acc, r) => acc + r.seats,
                    0,
                );
                availableSlotsWithAvailableSeats.push({
                    isAvailable: totalGuests + seats <= capacity,
                    slot: `${hour.toString().padStart(2, '0')}:00`,
                    seats: capacity - totalGuests,
                });
            }

            return {
                duration,
                availability: availableSlotsWithAvailableSeats,
            };
        }
    }

    async getReservations(user: User, restaurantId: number, query: any) {
        const { page = 1, limit = 10, status } = query || {};
        const skip = (page - 1) * limit;
        const { role, id } = user;
        const filter: any = {
            ...(status && {
                reservations: {
                    some: {
                        status: { equals: status },
                    },
                },
            }),
            skip,
            take: limit,
        };
        const restaurant = await this.prisma.restaurant.findUnique({
            where: { id: restaurantId },
            include: filter,
        });

        if (!restaurant) {
            throw new NotFoundException('Restaurant not found');
        }
        if (role !== 'ADMIN' && restaurant.ownerId !== id) {
            throw new ForbiddenException(
                'Only ADMIN or the restaurant owner can view reservations',
            );
        }
        return {
            message: 'Reservations retrieved successfully',
            restaurant,
            page,
            totalCount: restaurant.reservations.length,
        };
    }
}
