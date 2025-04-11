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
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto, SearchRestaurantDto, UpdateRestaurantDto } from './dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
@Controller('restaurants')
export class RestaurantController {
    constructor(private readonly restaurantService: RestaurantService) {}

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.restaurantService.findOne(+id);
    }

    @Get(':id/reservations')
    getReservations(
        @GetUser() user:User,
        @Param('id') restaurantId: string,
        @Query() query: any,
    ) {
        return this.restaurantService.getReservations(
            user,
            +restaurantId,
            query,
        );
    }

    @Get(':id/availability')
    findAvailability(@Param('id') id: string, @Query() query: any) {
        return this.restaurantService.findAvailability(+id, query);
    }
    @Get()
    findAll(@Query() query: SearchRestaurantDto) {
        return this.restaurantService.findAll(query);
    }

    @UseGuards(JwtGuard)
    @Post()
    create(@GetUser() user: User, @Body() dto: CreateRestaurantDto) {
        return this.restaurantService.create(user, dto);
    }

    @UseGuards(JwtGuard)
    @Patch(':id')
    update(
        @GetUser() user: User,
        @Param('id') id: string,
        @Body() dto: UpdateRestaurantDto,
    ) {
        return this.restaurantService.update(user, +id, dto);
    }

    @UseGuards(JwtGuard)
    @Delete(':id')
    remove(@GetUser() user: User, @Param('id') id: string) {
        return this.restaurantService.remove(user, +id);
    }
}
