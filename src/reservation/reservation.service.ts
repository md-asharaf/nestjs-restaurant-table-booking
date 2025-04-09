import {
    ConflictException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReservationDto } from './dto';
import { addMinutes } from 'date-fns';
import { User } from '@prisma/client';
@Injectable()
export class ReservationService {
    constructor(private prisma: PrismaService) {}

    async create(userId: number, dto: ReservationDto) {
        const { restaurantId, duration, date, time, seats } = dto;
        const restaurant = await this.prisma.restaurant.findUnique({
            where: {
                id: restaurantId,
            },
            include: {
                reservations: true,
            },
        });
        if (!restaurant) {
            throw new NotFoundException('Restaurant not found');
        }
        const [hour, minute] = time.split(':').map(Number);
        const reservationStart = new Date(date);
        reservationStart.setHours(hour, minute, 0, 0);
        const reservationEnd = addMinutes(reservationStart, duration);

        const reservedTables = restaurant.reservations.reduce(
            (acc, reservation) =>
                !(
                    reservation.status === 'CANCELLED' ||
                    reservation.status === 'COMPLETED' ||
                    reservationStart >= reservation.end ||
                    reservationEnd <= reservation.start
                )
                    ? acc + reservation.seats
                    : acc,
            0,
        );
        if (reservedTables + seats > restaurant.capacity) {
            throw new ConflictException(
                'Not enough tables available at this time',
            );
        }
        const reservation = await this.prisma.reservation.create({
            data: {
                restaurantId: restaurant.id,
                userId,
                start: reservationStart,
                end: reservationEnd,
                seats: seats,
            },
        });
        if (!reservation) {
            throw new InternalServerErrorException(
                'Failed to create reservation',
            );
        }
        return {
            message: 'reservation created successfully',
            reservation,
        };
    }

    async findAll(role: string, query: any) {
        if (role !== 'ADMIN') {
            throw new ForbiddenException(
                'You are not allowed to view all reservations',
            );
        }
        const { page = 1, limit = 10, status } = query;
        const skip = (page - 1) * limit;
        const filterQuery: any = {};
        if (status) {
            filterQuery.status = status;
        }
        const reservations = await this.prisma.reservation.findMany({
            where: filterQuery,
            include: {
                restaurant: true,
            },
            skip,
            take: limit,
        });
        return {
            message: 'retrieved reservation history successfully',
            reservations,
        };
    }

    async findOne(user: User, reservationId: number) {
        const { id: userId, role } = user;
        const reservation = await this.prisma.reservation.findUnique({
            where: {
                id: reservationId,
            },
            include: {
                restaurant: true,
            },
        });
        if (!reservation) {
            throw new NotFoundException('Reservation not found');
        }
        if (role !== 'ADMIN' && reservation.userId !== userId) {
            throw new ForbiddenException(
                'You are not allowed to view this reservation',
            );
        }
        return {
            message: 'retrieved reservation successfully',
            reservation,
        };
    }

    async remove(user: User, reservationId: number) {
        const { id: userId, role } = user;
        const reservation = await this.prisma.reservation.findUnique({
            where: {
                id: reservationId,
            },
        });
        if (!reservation) {
            throw new NotFoundException('Reservation not found');
        }
        if (role !== 'ADMIN' && reservation.userId !== userId) {
            throw new ForbiddenException(
                'You are not allowed to delete this reservation',
            );
        }
        if (reservation.status === 'ACTIVE') {
            throw new ConflictException(
                'You cannot delete active reservations',
            );
        }
        const deletedReservation = await this.prisma.reservation.delete({
            where: {
                id: reservation.id,
            },
        });
        return {
            message: 'reservation deleted successfully',
            deletedReservation,
        };
    }

    async cancel(userId: number, reservationId: number) {
        const reservation = await this.prisma.reservation.findUnique({
            where: {
                id: reservationId,
            },
        });
        if (!reservation) {
            throw new NotFoundException('Reservation not found');
        }
        if (reservation.userId !== userId) {
            throw new ForbiddenException(
                'You are not allowed to cancel this reservation',
            );
        }
        if (reservation.status !== 'ACTIVE') {
            throw new ConflictException(
                'You cannot cancel other than active reservations',
            );
        }
        const canceledReservation = await this.prisma.reservation.update({
            where: {
                id: reservation.id,
            },
            data: {
                status: 'CANCELLED',
            },
        });
        return {
            message: 'reservation cancelled successfully',
            canceledReservation,
        };
    }
}
