import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlaceRecord } from '../places/schemas/place.schema';
import { ReviewRecord } from './schemas/review.schema';

export type NewReview = Omit<ReviewRecord, 'createdAt' | 'updatedAt'>;

export type ReviewChanges = Partial<Pick<ReviewRecord, 'authorName' | 'rating' | 'comment'>>;

export type RatingStats = {
    reviewCount: number;
    averageRating: number | null;
};

@Injectable()
export class ReviewsRepository {
    constructor(@InjectModel(ReviewRecord.name) private readonly reviewModel: Model<ReviewRecord>, @InjectModel(PlaceRecord.name) private readonly placeModel: Model<PlaceRecord>){}

    create(review: NewReview): Promise<ReviewRecord> {
        return this.reviewModel.create(review);
    }

    findByPlace(placeId: string): Promise<ReviewRecord[]> {
        return this.reviewModel.find({ placeId }).sort({ createdAt: 1 }).exec();
    }

    findById(id: string): Promise<ReviewRecord | null> {
        return this.reviewModel.findOne({ id }).exec();
    }

    update(id: string, changes: ReviewChanges): Promise<ReviewRecord | null> {
        return this.reviewModel.findOneAndUpdate({ id }, { $set: changes }, { new: true, runValidators: true }).exec();
    }

    async delete(id: string): Promise<void> {
        await this.reviewModel.deleteOne({ id }).exec();
    }

    async placeExists(placeId: string): Promise<boolean> {
        const total = await this.placeModel.countDocuments({ id: placeId }).exec();
        return total > 0;
    }

    async getRatingStats(placeId: string): Promise<RatingStats> {
        const reviews = await this.reviewModel.find({ placeId }).exec();

        if (reviews.length === 0) {
            return { reviewCount: 0, averageRating: null };
        }

        const sum = reviews.reduce((total, review) => total + review.rating, 0);
        return { reviewCount: reviews.length, averageRating: sum / reviews.length };
    }

    async savePlaceRating(placeId: string, stats: RatingStats): Promise<void> {
        await this.placeModel
            .updateOne(
                { id: placeId },
                { $set: { reviewCount: stats.reviewCount, averageRating: stats.averageRating } },
                { timestamps: false },
            )
            .exec();
    }
}