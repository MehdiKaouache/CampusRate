import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PlaceCategory } from '../entities/place-category.enum';
import { PlaceStatus } from '../entities/place-status.enum';

export class CreatePlaceDto {
  @ApiProperty({
    description: 'Nom de l\'endroit',
    example: 'Bibliotheque principale'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description de l\'endroit',
    example: 'Espace calme avec prises.'
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Categorie de l\'endroit',
    enum: PlaceCategory,
    example: PlaceCategory.STUDY_SPACE
  })
  @IsEnum(PlaceCategory)
  category: PlaceCategory;

  @ApiProperty({
    description: 'Emplacement de l\'endroit',
    example: 'Pavillon A, local A-210'
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({
    description: 'Services disponibles a cet endroit',
    type: [String],
    example: ['WIFI', 'POWER_OUTLETS']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string[];

  @ApiPropertyOptional({
    description: 'Statut de l\'endroit',
    enum: PlaceStatus,
    example: PlaceStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(PlaceStatus)
  status?: PlaceStatus;
}