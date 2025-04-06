import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationDto } from './dto';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller()
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}
  @Get('reservations')
  getAllReservations(@GetUser('id') userId: number, @Query() query: any) {
    const { page = 1, limit = 10 } = query;
    return this.reservationService.getAllReservations(userId, page, limit);
  }
  @Post('reserve')
  reserveTable(@GetUser('id') userId: number, @Body() dto: ReservationDto) {
    return this.reservationService.reserveTable(userId, dto);
  }

  @Delete('reservations/:id')
  deleteReservation(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) reservationId: number,
  ) {
    return this.reservationService.deleteReservation(userId, reservationId);
  }
}
