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
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('reservations')
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}

    @Get()
    findAll(@GetUser('role') role: string, @Query() query: any) {
        return this.reservationService.findAll(role, query);
    }

    @Get(':id')
    findOne(
        @GetUser() user: User,
        @Param('id', ParseIntPipe) reservationId: number,
    ) {
        return this.reservationService.findOne(user, reservationId);
    }

    @Post()
    create(@GetUser('id') userId: number, @Body() dto: ReservationDto) {
        return this.reservationService.create(userId, dto);
    }

    @Delete(':id')
    remove(
        @GetUser('id') user: User,
        @Param('id', ParseIntPipe) reservationId: number,
    ) {
        return this.reservationService.remove(user, reservationId);
    }
}
