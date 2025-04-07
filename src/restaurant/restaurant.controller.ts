import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto, SearchRestaurantDto } from './dto';

@Controller('restaurants')
export class RestaurantController {
    constructor(private readonly restaurantService: RestaurantService) {}

    @Get('search')
    getRestaurants(@Query() query: any, @Body() dto: SearchRestaurantDto) {
        const { page = 1, limit = 10 } = query;
        return this.restaurantService.getRestaurants(page, limit, dto);
    }

    @Get(':id')
    getRestaurantById(@Query('id') id: number) {
        return this.restaurantService.getRestaurantById(id);
    }

    @Post('create')
    createRestaurant(@Body() dto: CreateRestaurantDto) {
        return this.restaurantService.createRestaurant(dto);
    }

    @Delete(':id')
    deleteRestaurant(@Query('id') id: number) {
        return this.restaurantService.deleteRestaurant(id);
    }
}
