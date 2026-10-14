import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PlacesModule } from './places/places.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envValidationSchema } from './config/env-validation.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentTypeMiddleware } from './common/middleware/content-type.middleware';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        serverSelectionTimeoutMS: 5000,
      }),
    }),
    PlacesModule, ReviewsModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware, ContentTypeMiddleware).forRoutes('{*path}')
  }
}