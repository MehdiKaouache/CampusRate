import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { PlacesService } from './places.service';
import { Place } from './entities/place.entity';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';

@Controller('places')
export class PlacesController {
    constructor (private readonly placeService: PlacesService){}

    @Get()
    findAll(): Promise<Place[]> {
        return this.placeService.findAll();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreatePlaceDto): Promise<Place> {
        return this.placeService.create(dto);
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Place> {
        return this.placeService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdatePlaceDto,): Promise<Place> {
        return this.placeService.update(id, dto);
    }


    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT) 
    remove(@Param('id') id: string): Promise<void> {
        return this.placeService.remove(id);
    }
}
