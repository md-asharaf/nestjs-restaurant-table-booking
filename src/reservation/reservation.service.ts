import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReservationDto } from './dto';

@Injectable()
export class ReservationService {
    constructor(private prisma: PrismaService) {}
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
    // TODO : implement booking and sending confirmation email to user
    async reserveTable(userId: number, dto: ReservationDto) {
        try {
            const reservation = await this.prisma.reservation.create({
                data: {
                    userId,
                    ...dto,
                },
            });
            if (!reservation) {
                throw new InternalServerErrorException(
                    'Reservation could not be created',
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
