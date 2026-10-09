import { Place } from '../entities/place.entity';
import { PlaceRecord } from '../schemas/place.schema';

export function toPlace(record: PlaceRecord): Place {
  return {
    id: record.id,
    name: record.name,
    description: record.description,
    category: record.category,
    address: record.address,
    services: record.services,
    status: record.status,
    averageRating: record.averageRating,
    reviewCount: record.reviewCount,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString()
  };
}