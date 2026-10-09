import { Injectable, NotFoundException } from '@nestjs/common';
import { ReviewsRepository, ReviewChanges } from './reviews.repository';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { generateId } from '../common/utils/id-generator';
import { toReview } from './mappers/review.mapper';

@Injectable()
export class ReviewsService {
    constructor(private readonly reviewsRepository: ReviewsRepository){}

    async create(placeId: string, dto: CreateReviewDto): Promise<Review> {
        await this.ensurePlaceExists(placeId);

        const record = await this.reviewsRepository.create({
            id: generateId('rev'),
            placeId,
            authorName: dto.authorName,
            rating: dto.rating,
            comment: dto.comment,
        });

        await this.refreshPlaceRating(placeId);

        return toReview(record);
    }

    async findAllByPlace(placeId: string): Promise<Review[]> {
        await this.ensurePlaceExists(placeId);

        const records = await this.reviewsRepository.findByPlace(placeId);

        return records.map(toReview);
    }

    async findOne(id: string): Promise<Review> {
        const record = await this.reviewsRepository.findById(id);

        if (!record) {
            throw new NotFoundException(`Aucune appreciation ne possede l'identifiant ${id}.`);
        }

        return toReview(record);
    }

    async update(id: string, dto: UpdateReviewDto): Promise<Review> {
        const changes: ReviewChanges = {};

        if (dto.authorName !== undefined) changes.authorName = dto.authorName;
        if (dto.rating !== undefined) changes.rating = dto.rating;
        if (dto.comment !== undefined) changes.comment = dto.comment;

        const record = await this.reviewsRepository.update(id, changes);

        if (!record) {
            throw new NotFoundException(`Aucune appreciation ne possede l'identifiant ${id}.`);
        }

        await this.refreshPlaceRating(record.placeId);

        return toReview(record);
    }

    async remove(id: string): Promise<void> {
        const record = await this.reviewsRepository.findById(id);

        if (!record) {
            throw new NotFoundException(`Aucune appreciation ne possede l'identifiant ${id}.`);
        }

        await this.reviewsRepository.delete(id);

        await this.refreshPlaceRating(record.placeId);
    }

    private async ensurePlaceExists(placeId: string): Promise<void> {
        const exists = await this.reviewsRepository.placeExists(placeId);

        if (!exists) {
            throw new NotFoundException(`Aucun endroit ne possede l'identifiant ${placeId}.`);
        }
    }

    private async refreshPlaceRating(placeId: string): Promise<void> {
        const stats = await this.reviewsRepository.getRatingStats(placeId);

        await this.reviewsRepository.savePlaceRating(placeId, stats);
    }
}