import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto, SearchRestaurantDto } from './dto';

@Controller('restaurants')
export class RestaurantController {
    constructor(private readonly restaurantService: RestaurantService) {}

    @Get()
    findAll(@Query() query: any, @Body() dto: SearchRestaurantDto) {
        const { page = 1, limit = 10 } = query;
        return this.restaurantService.findAll(page, limit, dto);
    }

    @Get(':id')
    findOne(@Query('id') id: number) {
        return this.restaurantService.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateRestaurantDto) {
        return this.restaurantService.create(dto);
    }

    @Delete(':id')
    remove(@Query('id') id: number) {
        return this.restaurantService.remove(id);
    }
}
