import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReviewRecord } from '../reviews/schemas/review.schema';
import { PlaceCategory } from './entities/place-category.enum';
import { PlaceRecord } from './schemas/place.schema';

export type NewPlace = Omit<PlaceRecord, 'createdAt' | 'updatedAt'>;

export type PlaceChanges = Partial<Pick<PlaceRecord, 'name' | 'description' | 'category' | 'address' | 'services' | 'status'>
>;

@Injectable()
export class PlacesRepository {
  constructor(@InjectModel(PlaceRecord.name) private readonly placeModel: Model<PlaceRecord>, @InjectModel(ReviewRecord.name) private readonly reviewModel: Model<ReviewRecord>) {}

  create(place: NewPlace): Promise<PlaceRecord> {
    return this.placeModel.create(place);
  }

  findPage(category: PlaceCategory | undefined, skip: number, limit: number): Promise<PlaceRecord[]> {
    return this.placeModel
      .find(this.buildFilter(category))
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  count(category: PlaceCategory | undefined): Promise<number> {
    return this.placeModel.countDocuments(this.buildFilter(category)).exec();
  }

  findById(id: string): Promise<PlaceRecord | null> {
    return this.placeModel.findOne({ id }).exec();
  }

  update(id: string, changes: PlaceChanges): Promise<PlaceRecord | null> {
    return this.placeModel.findOneAndUpdate({ id }, { $set: changes }, { new: true, runValidators: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.placeModel.deleteOne({ id }).exec();
  }

  async hasReviews(placeId: string): Promise<boolean> {
    const total = await this.reviewModel.countDocuments({ placeId }).exec();
    return total > 0;
  }

  private buildFilter(category: PlaceCategory | undefined): {
    category?: PlaceCategory;
  } {
    return category === undefined ? {} : { category };
  }
}