import { Global, Module } from '@nestjs/common';
import { JsonDatabaseService } from './persistence/json-database.service';

@Global()
@Module({
  providers: [JsonDatabaseService],
  exports: [JsonDatabaseService],
})
export class CommonModule {}