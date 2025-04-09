import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CronService {
    private readonly logger = new Logger(CronService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly emailService: EmailService,
    ) {}

    @Cron(CronExpression.EVERY_MINUTE)
    async markExpiredReservationAsCompleted() {
        try {
            const { count } = await this.prisma.reservation.updateMany({
                where: {
                    status: 'ACTIVE',
                    end: {
                        lte: new Date(),
                    },
                },
                data: {
                    status: 'COMPLETED',
                },
            });
            if (count > 0) {
                this.logger.log(`Marked ${count} reservation(s) as COMPLETED`);
            }
        } catch (error) {
            this.logger.error('Failed to mark expired reservations', error);
        }
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async sendReminders() {
        try {
            const now = new Date();
            const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

            const reservations = await this.prisma.reservation.findMany({
                where: {
                    status: 'ACTIVE',
                    start: {
                        gte: now,
                        lte: oneHourLater,
                    },
                },
                include: {
                    user: true,
                    restaurant: true,
                },
            });

            for (const { user, restaurant, start } of reservations) {
                await this.emailService.sendBookingReminderEmail({
                    to: user.email,
                    name: user.fullname,
                    restaurant: restaurant.name,
                    time: start.toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                });
                this.logger.log(
                    `Sent reminder to ${user.email} for reservation at ${restaurant.name}`,
                );
            }
        } catch (error) {
            this.logger.error('Failed to send reservation reminders', error);
        }
    }
}
