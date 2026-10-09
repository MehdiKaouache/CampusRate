import { Module } from '@nestjs/common';
import { ReviewsController } from './controller/reviews.controller';
import { ReviewsService } from './reviews.service';
import { ReviewsDetailController } from './controller/reviews-detail.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewRecord, ReviewRecordSchema } from './schemas/review.schema';
import { PlaceRecord, PlaceRecordSchema } from '../places/schemas/place.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: ReviewRecord.name, schema: ReviewRecordSchema},
      {name: PlaceRecord.name, schema: PlaceRecordSchema},
    ]),
  ],
  controllers: [ReviewsController, ReviewsDetailController],
  providers: [ReviewsService]
})
export class ReviewsModule {}