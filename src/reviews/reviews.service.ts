import { Injectable, NotFoundException } from '@nestjs/common';
import { JsonDatabaseService } from '../common/persistence/json-database.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './entities/review.entity';
import { generateId } from '../common/utils/id-generator';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
    constructor(private readonly database: JsonDatabaseService) {}

    async create(placeId: string, dto: CreateReviewDto): Promise<Review> {
        const data = await this.database.read();
        const place = data.places.find((p) => p.id === placeId);

        if (!place) {
            throw new NotFoundException(`Aucun endroit ne possede l'identifiant ${placeId}.`);
        }

        const now = new Date().toISOString();

        const newReview: Review = {
            id: generateId('rev'),
            placeId,
            authorName: dto.authorName,
            rating: dto.rating,
            comment: dto.comment,
            createdAt: now,
            updatedAt: now,
        };

        data.reviews.push(newReview);

        this.recalculatePlaceRating(place, data.reviews);

        await this.database.write(data);

        return newReview;
    }

    async findAllByPlace(placeId: string): Promise<Review[]> {
        const data = await this.database.read();
        const place = data.places.find((p) => p.id === placeId);

        if (!place) {
            throw new NotFoundException(`Aucun endroit ne possede l'identifiant ${placeId}.`);
        }

        return data.reviews.filter((r) => r.placeId === placeId);
        
    }

    async findOne(id: string): Promise<Review> {
        const data = await this.database.read();
        const review = data.reviews.find((r) => r.id === id);

        if (!review) {
            throw new NotFoundException(`Aucune appreciation ne possede l'identifiant ${id}.`);
        }

        return review;
    }

    async update(id: string, dto: UpdateReviewDto): Promise<Review> {
        const data = await this.database.read();
        const review = data.reviews.find((r) => r.id === id);

        if (!review) {
            throw new NotFoundException(`Aucune appreciation ne possede l'identifiant ${id}.`);
        }

        if (dto.authorName !== undefined) review.authorName = dto.authorName;
        if (dto.rating !== undefined) review.rating = dto.rating;
        if (dto.comment !== undefined) review.comment = dto.comment;

        review.updatedAt = new Date().toISOString();

        const place = data.places.find((p) => p.id === review.placeId);
        if (place) {
            this.recalculatePlaceRating(place, data.reviews);
        }

        await this.database.write(data);

        return review;
    }


    async remove(id: string): Promise<void> {
        const data = await this.database.read();
        const review = data.reviews.find((r) => r.id === id);

        if (!review) {
            throw new NotFoundException(`Aucune appreciation ne possede l'identifiant ${id}.`);
        }

        data.reviews = data.reviews.filter((r) => r.id !== id);

        const place = data.places.find((p) => p.id === review.placeId);
        if (place) {
            this.recalculatePlaceRating(place, data.reviews);
        }

        await this.database.write(data);
    }

    private recalculatePlaceRating(place: { id: string; averageRating: number | null; reviewCount: number }, allReviews: Review[]): void {
        const placeReviews = allReviews.filter((r) => r.placeId === place.id);

        place.reviewCount = placeReviews.length;

        if (placeReviews.length === 0) {
            place.averageRating = null;
        } else {
            const sum = placeReviews.reduce((total, r) => total + r.rating, 0);
            place.averageRating = sum / placeReviews.length;
        }
  }
}
