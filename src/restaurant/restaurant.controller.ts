import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto, SearchRestaurantDto } from './dto';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}
  @Get()
  getRestaurants(@Query() query: any, @Body() dto: SearchRestaurantDto) {
    const { page = 1, limit = 10 } = query;
    return this.restaurantService.getRestaurants(page, limit,dto);
  }
  @Post('/list')
  createRestaurant(@Body() dto: CreateRestaurantDto) {
    return this.restaurantService.createRestaurant(dto);
  }
}
