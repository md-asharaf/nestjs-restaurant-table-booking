import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
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
  import { RestaurantService } from './restaurant.service';
  import {
    AvailabilityDto,
    CreateRestaurantDto,
    SearchRestaurantDto,
    UpdateRestaurantDto,
  } from './dto';
  import { JwtGuard } from 'src/auth/guard';
  import { GetUser } from 'src/auth/decorator';
  import { User } from '@prisma/client';
  
  @ApiTags('Restaurants')
  @Controller('restaurants')
  export class RestaurantController {
    constructor(private readonly restaurantService: RestaurantService) {}
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a single restaurant by ID' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'Restaurant found' })
    @ApiResponse({ status: 404, description: 'Restaurant not found' })
    findOne(@Param('id') id: string) {
      return this.restaurantService.findOne(+id);
    }
  
    @UseGuards(JwtGuard)
    @Get(':id/reservations')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get reservations for a restaurant' })
    @ApiParam({ name: 'id', type: String })
    @ApiQuery({ name: 'date', required: false, type: String })
    @ApiQuery({ name: 'status', required: false, type: String })
    @ApiResponse({ status: 200, description: 'Reservations retrieved' })
    getReservations(
      @GetUser() user: User,
      @Param('id') restaurantId: string,
      @Query() query: any,
    ) {
      return this.restaurantService.getReservations(user, +restaurantId, query);
    }
  
    @Get(':id/availability')
    @ApiOperation({ summary: 'Check restaurant availability' })
    @ApiParam({ name: 'id', type: String })
    @ApiQuery({ name: 'date', required: true, type: String })
    @ApiQuery({ name: 'seats', required: true, type: Number })
    @ApiQuery({ name: 'time', required: true, type: String })
    @ApiQuery({ name: 'duration', required: true, type: Number })
    @ApiResponse({ status: 200, description: 'Availability data' })
    findAvailability(
      @Param('id') id: string,
      @Query() query: AvailabilityDto,
    ) {
      return this.restaurantService.findAvailability(+id, query);
    }
  
    @Get()
    @ApiOperation({ summary: 'Search or list all restaurants' })
    @ApiQuery({ name: 'cuisines', required: false, type: Array<String> })
    @ApiQuery({ name: 'location', required: false, type: String })
    @ApiQuery({ name: 'name', required: false, type: String })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Restaurants list' })
    findAll(@Query() query: SearchRestaurantDto) {
      return this.restaurantService.findAll(query);
    }
  
    @UseGuards(JwtGuard)
    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new restaurant' })
    @ApiBody({ type: CreateRestaurantDto })
    @ApiResponse({ status: 201, description: 'Restaurant created' })
    create(@GetUser() user: User, @Body() dto: CreateRestaurantDto) {
      return this.restaurantService.create(user, dto);
    }
  
    @UseGuards(JwtGuard)
    @Patch(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update an existing restaurant' })
    @ApiParam({ name: 'id', type: String })
    @ApiBody({ type: UpdateRestaurantDto })
    @ApiResponse({ status: 200, description: 'Restaurant updated' })
    update(
      @GetUser() user: User,
      @Param('id') id: string,
      @Body() dto: UpdateRestaurantDto,
    ) {
      return this.restaurantService.update(user, +id, dto);
    }
  
    @UseGuards(JwtGuard)
    @Delete(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a restaurant by ID' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'Restaurant deleted' })
    remove(@GetUser() user: User, @Param('id') id: string) {
      return this.restaurantService.remove(user, +id);
    }
  }
  