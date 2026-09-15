import { PlaceCategory } from '../entities/place-category.enum';
import { PlaceStatus } from '../entities/place-status.enum';

export class CreatePlaceDto {
  name: string;
  description: string;
  category: PlaceCategory;
  address: string;
  services?: string[];
  status?: PlaceStatus;
}