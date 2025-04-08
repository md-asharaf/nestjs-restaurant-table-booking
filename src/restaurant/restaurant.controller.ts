import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto, SearchRestaurantDto } from './dto';

@Controller('restaurants')
export class RestaurantController {
    constructor(private readonly restaurantService: RestaurantService) {}

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.restaurantService.findOne(+id);
    }

    @Get()
    findAll(@Query() query: any, @Body() dto: SearchRestaurantDto) {
        const { page = 1, limit = 10 } = query;
        return this.restaurantService.findAll(+page, +limit, dto);
    }

    @Post()
    create(@Body() dto: CreateRestaurantDto) {
        return this.restaurantService.create(dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.restaurantService.remove(+id);
    }
}
