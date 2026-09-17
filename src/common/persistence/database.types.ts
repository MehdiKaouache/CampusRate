import { Place } from '../../places/entities/place.entity';
import { Review } from '../../reviews/entities/review.entity';

export interface Database {
  places: Place[];
  reviews: Review[];
}