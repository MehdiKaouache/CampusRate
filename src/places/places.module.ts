import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PlaceRecord, PlaceRecordSchema } from './schemas/place.schema';
import { ReviewRecord, ReviewRecordSchema } from '../reviews/schemas/review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: PlaceRecord.name, schema: PlaceRecordSchema},
      {name: ReviewRecord.name, schema: ReviewRecordSchema}
    ]),
  ],
  controllers: [PlacesController],
  providers: [PlacesService]
})
export class PlacesModule {}
