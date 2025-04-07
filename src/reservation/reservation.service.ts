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
@Injectable()
export class ReservationService {
    constructor(private prisma: PrismaService) {}

    async createReservation(userId: number, dto: ReservationDto) {
        try {
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

            const overlappingReservations = restaurant.reservations.filter(
                (res) =>
                    !(
                        res.end <= reservationStart ||
                        res.start >= reservationEnd
                    ),
            );
            if (overlappingReservations.length + seats > restaurant.capacity) {
                throw new ConflictException('No tables available at this time');
            }
            const reservation = await this.prisma.reservation.create({
                data: {
                    restaurantId: restaurant.id,
                    userId,
                    start: reservationStart,
                    end: reservationEnd,
                    seat: seats,
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
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Failed to reserve a table');
        }
    }

    async getAllReservations(userId: number, page: number, limit: number) {
        try {
            const skip = (page - 1) * limit;
            const reservations = await this.prisma.reservation.findMany({
                where: {
                    userId,
                },
                skip,
                take: limit,
            });
            if (!reservations || reservations.length == 0) {
                throw new NotFoundException('No reservations found');
            }
            return {
                message: 'retrieved reservation history successfully',
                reservations,
            };
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(
                'Failed to retrieve reservation history',
            );
        }
    }

    async getReservationById(userId: number, reservationId: number) {
        try {
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
            if (reservation.userId !== userId) {
                throw new ForbiddenException(
                    'You are not allowed to view this reservation',
                );
            }
            return {
                message: 'retrieved reservation successfully',
                reservation,
            };
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(
                'Failed to retrieve reservation',
            );
        }
    }

    async deleteReservation(userId: number, reservationId: number) {
        try {
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
                    'You are not allowed to delete this reservation',
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
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(
                'Failed to delete reservation',
            );
        }
    }
}
