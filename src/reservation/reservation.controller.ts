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
@Controller('reservations')
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}

    @Get()
    findAll(@GetUser('id') userId: number, @Query() query: any) {
        const { page = 1, limit = 10 } = query;
        return this.reservationService.findAll(userId, page, limit);
    }

    @Get(':id')
    find(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) reservationId: number,
    ) {
        return this.reservationService.findOne(userId, reservationId);
    }

    @Post()
    create(@GetUser('id') userId: number, @Body() dto: ReservationDto) {
        return this.reservationService.create(userId, dto);
    }

    @Delete(':id')
    remove(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) reservationId: number,
    ) {
        return this.reservationService.remove(userId, reservationId);
    }
}
