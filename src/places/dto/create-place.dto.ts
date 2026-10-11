import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray, Length, Matches, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PlaceCategory } from '../entities/place-category.enum';
import { PlaceStatus } from '../entities/place-status.enum';
import { MEANINGFUL_TEXT } from '../../common/validation/patterns';

export class CreatePlaceDto {
  @ApiProperty({
    description: 'Nom de l\'endroit',
    example: 'Bibliotheque principale',
    minLength: 2,
    maxLength: 100
  })
  @IsString({ 
    message: 'Le nom doit etre une chaine de caracteres' 
  })
  @IsNotEmpty({
    message: 'Le nom est obligatoire' 
  })
  @Length(2, 100, { 
    message: 'Le nom doit contenir entre 2 et 100 caracteres' 
  })
  @Matches(MEANINGFUL_TEXT, { 
    message: 'Le nom doit contenir au moins une lettre ou un chiffre' 
  })
  name: string;

  @ApiProperty({
    description: 'Description de l\'endroit',
    example: 'Espace calme avec prises.',
    minLength: 5,
    maxLength: 500
  })
  @IsString({ 
    message: 'La description doit etre une chaine de caracteres' 
  })
  @IsNotEmpty({ 
    message: 'La description est obligatoire' 
  })
  @Length(5, 500, { 
    message: 'La description doit contenir entre 5 et 500 caracteres' 
  })
  @Matches(MEANINGFUL_TEXT, { 
    message: 'La description doit contenir au moins une lettre ou un chiffre' 
  })
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
    example: 'Pavillon A, local A-210',
    minLength: 3,
    maxLength: 200
  })
  @IsString({ 
    message: 'L\'adresse doit etre une chaine de caracteres' 
  })
  @IsNotEmpty({ 
    message: 'L\'adresse est obligatoire' 
  })
  @Length(3, 200, { 
    message: 'L\'adresse doit contenir entre 3 et 200 caracteres' 
  })
  @Matches(MEANINGFUL_TEXT, { 
    message: 'L\'adresse doit contenir au moins une lettre ou un chiffre' 
  })
  address: string;

  @ApiPropertyOptional({
    description: 'Services disponibles a cet endroit',
    type: [String],
    example: ['WIFI', 'POWER_OUTLETS']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(50, { 
    each: true, 
    message: 'Chaque service doit contenir 50 caracteres au maximum' 
  })
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