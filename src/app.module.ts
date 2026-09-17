import { Module } from '@nestjs/common';
import { PlacesModule } from './places/places.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [PlacesModule, ReviewsModule, CommonModule],
  controllers: [],
  providers: [],
})
export class AppModule {}