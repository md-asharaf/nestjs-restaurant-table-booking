import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiBody,
  } from '@nestjs/swagger';
  import { ReservationService } from './reservation.service';
  import { ReservationDto } from './dto';
  import { GetUser } from 'src/auth/decorator';
  import { JwtGuard } from 'src/auth/guard';
  import { User } from '@prisma/client';
  
  @ApiTags('Reservations')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Controller('reservations')
  export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}
  
    @Get()
    @ApiOperation({ summary: 'Get all reservations (admin or user filtered)' })
    @ApiQuery({ name: 'date', required: false })
    @ApiQuery({ name: 'status', required: false })
    @ApiResponse({ status: 200, description: 'Reservations retrieved successfully' })
    findAll(@GetUser('role') role: string, @Query() query: any) {
      return this.reservationService.findAll(role, query);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a single reservation by ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Reservation found' })
    @ApiResponse({ status: 404, description: 'Reservation not found' })
    findOne(
      @GetUser() user: User,
      @Param('id', ParseIntPipe) reservationId: number,
    ) {
      return this.reservationService.findOne(user, reservationId);
    }
  
    @Post()
    @ApiOperation({ summary: 'Create a new reservation' })
    @ApiBody({ type: ReservationDto })
    @ApiResponse({ status: 201, description: 'Reservation created successfully' })
    create(@GetUser('id') userId: number, @Body() dto: ReservationDto) {
      return this.reservationService.create(userId, dto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a reservation by ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Reservation deleted successfully' })
    @ApiResponse({ status: 404, description: 'Reservation not found' })
    remove(
      @GetUser() user: User,
      @Param('id', ParseIntPipe) reservationId: number,
    ) {
      return this.reservationService.remove(user, reservationId);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Cancel a reservation by ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Reservation cancelled successfully' })
    @ApiResponse({ status: 404, description: 'Reservation not found' })
    cancel(
      @GetUser('id') userId: number,
      @Param('id', ParseIntPipe) reservationId: number,
    ) {
      return this.reservationService.cancel(userId, reservationId);
    }
  }
  
