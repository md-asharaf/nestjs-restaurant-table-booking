import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { EmailModule } from 'src/email/email.module';

@Module({
    imports: [EmailModule],
    controllers: [ReservationController],
    providers: [ReservationService],
})
export class ReservationModule {}
