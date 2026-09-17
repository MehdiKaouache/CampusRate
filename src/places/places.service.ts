import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { JsonDatabaseService } from '../common/persistence/json-database.service';
import { Place } from './entities/place.entity';
import { CreatePlaceDto } from './dto/create-place.dto';
import { generateId } from '../common/utils/id-generator';
import { PlaceStatus } from './entities/place-status.enum';
import { UpdatePlaceDto } from './dto/update-place.dto';

@Injectable()
export class PlacesService {
    constructor(private readonly database: JsonDatabaseService){}

    async findAll(): Promise<Place[]> {
        const data = await this.database.read();
        return data.places;
    }

    async create(dto: CreatePlaceDto): Promise<Place>{
        const data = await this.database.read();

        const now = new Date().toISOString();

        const newPlace: Place = {
            id: generateId('plc'),
            name: dto.name,
            description: dto.description,
            category: dto.category,
            address: dto.address,
            services: this.removeDuplicates(dto.services ?? []),
            status: dto.status ?? PlaceStatus.ACTIVE,
            averageRating: null,
            reviewCount: 0,
            createdAt: now,
            updatedAt: now,
        };

        data.places.push(newPlace);
        await this.database.write(data);

        return newPlace;
    }

    async findOne(id: string): Promise<Place> {
        const data = await this.database.read();
        const place = data.places.find((p) => p.id === id);

        if (!place) {
            throw new NotFoundException(`Aucun endroit ne possede l'identifiant ${id}.`);
        }

        return place;
    }


    async update(id: string, dto: UpdatePlaceDto): Promise<Place> {
        const data = await this.database.read();
        const place = data.places.find((p) => p.id === id);

        if (!place) {
            throw new NotFoundException(`Aucun endroit ne possede l'identifiant ${id}.`);
        }

        if (dto.name !== undefined) place.name = dto.name;
        if (dto.description !== undefined) place.description = dto.description;
        if (dto.category !== undefined) place.category = dto.category;
        if (dto.address !== undefined) place.address = dto.address;
        if (dto.services !== undefined) place.services = this.removeDuplicates(dto.services);
        if (dto.status !== undefined) place.status = dto.status;

        place.updatedAt = new Date().toISOString();

        await this.database.write(data);

        return place;
    }


    async remove(id: string): Promise<void> {
        const data = await this.database.read();
        const place = data.places.find((p) => p.id === id);

        if (!place) {
            throw new NotFoundException(`Aucun endroit ne possede l'identifiant ${id}.`);
        }

        const hasReviews = data.reviews.some((review) => review.placeId === id);

        if (hasReviews) {
            throw new ConflictException(
            `L'endroit ${id} possede des appreciations et ne peut pas etre supprime.`,
            );
        }

        data.places = data.places.filter((p) => p.id !== id);
        await this.database.write(data);
    }

    private removeDuplicates(services: string[]): string[]{
        return [...new Set(services)];
    }
}
