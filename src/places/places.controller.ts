import { Controller, Get } from '@nestjs/common';
import { PlacesService } from './places.service';
import { Place } from './entities/place.entity';

@Controller('places')
export class PlacesController {
    constructor (private readonly placeService: PlacesService){}

    @Get()
    findAll(): Promise<Place[]> {
        return this.placeService.findAll();
    }
}
