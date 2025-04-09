import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { CuisineDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CuisineService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CuisineDto) {
        const { name } = dto;
        const loweredName = name.toLowerCase();
        const existingCuisine = await this.prisma.cuisine.findUnique({
            where: {
                name: loweredName,
            },
        });
        if (existingCuisine) {
            throw new ConflictException('Cuisine already exists');
        }
        const cuisine = await this.prisma.cuisine.create({
            data: {
                name: loweredName,
            },
        });
        if (!cuisine) {
            throw new InternalServerErrorException('Failed to create cuisine');
        }
        return {
            message: 'Cuisine created successfully',
            cuisine,
        };
    }

    async findAll() {
        const cuisines = await this.prisma.cuisine.findMany();
        if (!cuisines || cuisines.length === 0) {
            throw new NotFoundException('No cuisines found');
        }
        return {
            message: 'Cuisines fetched successfully',
            cuisines,
        };
    }

    async findOne(id: number) {
        const cuisine = await this.prisma.cuisine.findUnique({
            where: {
                id,
            },
        });
        if (!cuisine) {
            throw new NotFoundException(`Cuisine with id ${id} not found`);
        }
        return {
            message: 'Cuisine fetched successfully',
            cuisine,
        };
    }

    async update(id: number, dto: CuisineDto) {
        const { name } = dto;
        const loweredName = name.toLowerCase();
        const existingCuisine = await this.prisma.cuisine.findUnique({
            where: {
                id,
            },
        });
        if (!existingCuisine) {
            throw new NotFoundException(`Cuisine with id ${id} not found`);
        }
        const updatedCuisine = await this.prisma.cuisine.update({
            where: {
                id,
            },
            data: {
                name: loweredName,
            },
        });
        if (!updatedCuisine) {
            throw new InternalServerErrorException('Failed to update cuisine');
        }
        return {
            message: 'Cuisine updated successfully',
            cuisine: updatedCuisine,
        };
    }

    async remove(id: number) {
        const cuisine = await this.prisma.cuisine.findUnique({
            where: {
                id,
            },
        });
        if (!cuisine) {
            throw new NotFoundException(`Cuisine with id ${id} not found`);
        }
        const deletedCuisine = await this.prisma.cuisine.delete({
            where: {
                id,
            },
        });
        return {
            message: 'Cuisine deleted successfully',
            cuisine: deletedCuisine,
        };
    }
}
