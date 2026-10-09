import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PlaceCategory } from '../entities/place-category.enum';
import { PlaceStatus } from '../entities/place-status.enum';

@Schema({ collection: 'places', timestamps: true, versionKey: false })
export class PlaceRecord {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: Object.values(PlaceCategory) })
  category: PlaceCategory;

  @Prop({ required: true })
  address: string;

  @Prop({ type: [String], default: [] })
  services: string[];

  @Prop({ required: true, enum: Object.values(PlaceStatus) })
  status: PlaceStatus;

  @Prop({ type: Number, default: null })
  averageRating: number | null;

  @Prop({ required: true, default: 0 })
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export const PlaceRecordSchema = SchemaFactory.createForClass(PlaceRecord);

PlaceRecordSchema.index({ category: 1, createdAt: 1 });