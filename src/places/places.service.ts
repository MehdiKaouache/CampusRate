import { Injectable } from '@nestjs/common';
import { JsonDatabaseService } from '../common/persistence/json-database.service';
import { Place } from './entities/place.entity';

@Injectable()
export class PlacesService {
    constructor(private readonly database: JsonDatabaseService){}

    async findAll(): Promise<Place[]> {
        const data = await this.database.read();
        return data.places;
    }
}
