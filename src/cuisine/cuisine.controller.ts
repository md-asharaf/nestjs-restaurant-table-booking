import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiParam,
  } from '@nestjs/swagger';
  import { CuisineService } from './cuisine.service';
  import { CuisineDto } from './dto';
  
  @ApiTags('Cuisines')
  @Controller('cuisines')
  export class CuisineController {
    constructor(private readonly cuisineService: CuisineService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new cuisine' })
    @ApiBody({ type: CuisineDto })
    @ApiResponse({ status: 201, description: 'Cuisine created successfully' })
    create(@Body() dto: CuisineDto): Promise<{ message: string; cuisine: { id: number; name: string; }; }> {
      return this.cuisineService.create(dto);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all cuisines' })
    @ApiResponse({ status: 200, description: 'List of all cuisines' })
    findAll() {
      return this.cuisineService.findAll();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a specific cuisine by ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Cuisine found' })
    @ApiResponse({ status: 404, description: 'Cuisine not found' })
    findOne(@Param('id') id: string) {
      return this.cuisineService.findOne(+id);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update a cuisine by ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({ type: CuisineDto })
    @ApiResponse({ status: 200, description: 'Cuisine updated successfully' })
    @ApiResponse({ status: 404, description: 'Cuisine not found' })
    update(@Param('id') id: string, @Body() dto: CuisineDto) {
      return this.cuisineService.update(+id, dto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a cuisine by ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Cuisine deleted successfully' })
    @ApiResponse({ status: 404, description: 'Cuisine not found' })
    remove(@Param('id') id: string) {
      return this.cuisineService.remove(+id);
    }
  }
  
