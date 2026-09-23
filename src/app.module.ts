import { Module } from '@nestjs/common';
import { PlacesModule } from './places/places.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/env-validation.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    PlacesModule, ReviewsModule, CommonModule],
  controllers: [],
  providers: [],
})
export class AppModule {}