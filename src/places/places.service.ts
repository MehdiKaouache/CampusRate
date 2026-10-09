import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PlacesRepository, PlaceChanges } from './places.repository';
import { Place } from './entities/place.entity';
import { CreatePlaceDto } from './dto/create-place.dto';
import { generateId } from '../common/utils/id-generator';
import { PlaceStatus } from './entities/place-status.enum';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PagesResponse } from '../common/dto/pages-response.dto';
import { FindPlacesQueryDto } from './dto/find-places-query.dto';
import { toPlace } from './mappers/place.mapper';

@Injectable()
export class PlacesService {
    constructor(private readonly placesRepository: PlacesRepository){}

    async findAll(query: FindPlacesQueryDto): Promise<PagesResponse<Place>> {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;

        const records = await this.placesRepository.findPage(
            query.category,
            (page - 1) * limit,
            limit,
        );

        const totalItems = await this.placesRepository.count(query.category);
        const totalPages = Math.ceil(totalItems / limit);

        return {
            data: records.map(toPlace),
            pagination: {
                page,
                limit,
                totalItems,
                totalPages,
            },
        };
    }

    async create(dto: CreatePlaceDto): Promise<Place>{
        const record = await this.placesRepository.create({
            id: generateId('plc'),
            name: dto.name,
            description: dto.description,
            category: dto.category,
            address: dto.address,
            services: this.removeDuplicates(dto.services ?? []),
            status: dto.status ?? PlaceStatus.ACTIVE,
            averageRating: null,
            reviewCount: 0,
        });

        return toPlace(record);
    }

    async findOne(id: string): Promise<Place> {
        const record = await this.placesRepository.findById(id);

        if (!record) {
            throw new NotFoundException(`Aucun endroit ne possede l'identifiant ${id}.`);
        }

        return toPlace(record);
    }


    async update(id: string, dto: UpdatePlaceDto): Promise<Place> {
        const changes: PlaceChanges = {};

        if (dto.name !== undefined) changes.name = dto.name;
        if (dto.description !== undefined) changes.description = dto.description;
        if (dto.category !== undefined) changes.category = dto.category;
        if (dto.address !== undefined) changes.address = dto.address;
        if (dto.services !== undefined) changes.services = this.removeDuplicates(dto.services);
        if (dto.status !== undefined) changes.status = dto.status;

        const record = await this.placesRepository.update(id, changes);

        if (!record) {
            throw new NotFoundException(`Aucun endroit ne possede l'identifiant ${id}.`);
        }

        return toPlace(record);
    }


    async remove(id: string): Promise<void> {
        const record = await this.placesRepository.findById(id);

        if (!record) {
            throw new NotFoundException(`Aucun endroit ne possede l'identifiant ${id}.`);
        }

        const hasReviews = await this.placesRepository.hasReviews(id);

        if (hasReviews) {
            throw new ConflictException(
            `L'endroit ${id} possede des appreciations et ne peut pas etre supprime.`,
            );
        }

        await this.placesRepository.delete(id);
    }

    private removeDuplicates(services: string[]): string[]{
        return [...new Set(services)];
    }
}