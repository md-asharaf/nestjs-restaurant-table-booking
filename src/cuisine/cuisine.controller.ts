import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { CuisineService } from './cuisine.service';
import { CuisineDto } from './dto';

@Controller('cuisines')
export class CuisineController {
    constructor(private readonly cuisineService: CuisineService) {}

    @Post()
    create(@Body() dto: CuisineDto) {
        return this.cuisineService.create(dto);
    }

    @Get()
    findAll() {
        return this.cuisineService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.cuisineService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: CuisineDto) {
        return this.cuisineService.update(+id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.cuisineService.remove(+id);
    }
}
