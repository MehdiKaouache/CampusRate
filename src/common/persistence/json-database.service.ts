import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { Database } from './database.types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JsonDatabaseService {
  private readonly filePath: string;

  constructor(private readonly configService: ConfigService) {
    this.filePath = this.configService.get<string>('DATA_FILE_PATH')!;
  }

  async read(): Promise<Database> {
    try {
      const content = await readFile(this.filePath, 'utf8');
      return JSON.parse(content) as Database;
    } catch (error) {
      if (this.isFileNotFoundError(error)) {
        const emptyDatabase: Database = { places: [], reviews: [] };
        await this.write(emptyDatabase);
        return emptyDatabase;
      }

      if (error instanceof SyntaxError) {
        throw new InternalServerErrorException(
          'Le fichier de donnees est corrompu ou contient un JSON invalide.',
        );
      }

      throw error;
    }
  }

  async write(data: Database): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  private isFileNotFoundError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'ENOENT'
    );
  }
}