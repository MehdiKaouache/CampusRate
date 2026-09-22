import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PlaceCategory } from '../entities/place-category.enum';
import { PlaceStatus } from '../entities/place-status.enum';

export class CreatePlaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(PlaceCategory)
  category: PlaceCategory;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsArray()
  @IsOptional()
  services?: string[];

  @IsEnum(PlaceStatus)
  @IsOptional()
  status?: PlaceStatus;
}