import { Module } from '@nestjs/common';
import { ReviewsController } from './controller/reviews.controller';
import { ReviewsService } from './reviews.service';
import { ReviewsDetailController } from './controller/reviews-detail.controller';

@Module({
  controllers: [ReviewsController, ReviewsDetailController],
  providers: [ReviewsService]
})
export class ReviewsModule {}
