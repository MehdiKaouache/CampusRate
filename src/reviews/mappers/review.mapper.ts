import { Review } from '../entities/review.entity';
import { ReviewRecord } from '../schemas/review.schema';

export function toReview(record: ReviewRecord): Review {
  return {
    id: record.id,
    placeId: record.placeId,
    authorName: record.authorName,
    rating: record.rating,
    comment: record.comment,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString()
  };
}