import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'reviews', timestamps: true, versionKey: false })
export class ReviewRecord {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  placeId: string;

  @Prop({ required: true })
  authorName: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ReviewRecordSchema = SchemaFactory.createForClass(ReviewRecord);

ReviewRecordSchema.index({ placeId: 1, createdAt: 1 });