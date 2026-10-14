import { IsString, IsNotEmpty, IsInt, Min, Max, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MEANINGFUL_TEXT } from '../../common/validation/patterns';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Nom ou pseudonyme de la personne qui publie l\'appreciation',
    example: 'Mehdi',
    minLength: 2,
    maxLength: 50
  })
  @IsString({ 
    message: 'Le nom de l\'auteur doit etre une chaine de caracteres' })
  @IsNotEmpty({ 
    message: 'Le nom de l\'auteur est obligatoire' })
  @Length(2, 50, { 
    message: 'Le nom de l\'auteur doit contenir entre 2 et 50 caracteres' 
  })
  @Matches(MEANINGFUL_TEXT, { 
    message: 'Le nom de l\'auteur doit contenir au moins une lettre ou un chiffre' 
  })
  authorName: string;

  @ApiProperty({
    description: 'Note attribuee, de 1 a 5',
    example: 4,
    minimum: 1,
    maximum: 5
  })
  @IsInt({ 
    message: 'La note doit etre un entier' 
  })
  @Min(1, { 
    message: 'La note doit etre au moins 1' 
  })
  @Max(5, { 
    message: 'La note doit etre au plus 5' 
  })
  rating: number;

  @ApiProperty({
    description: 'Commentaire decrivant l\'appreciation',
    example: 'Calme et Wi-Fi stable.',
    minLength: 3,
    maxLength: 1000
  })
  @IsString({ 
    message: 'Le commentaire doit etre une chaine de caracteres' 
  })
  @IsNotEmpty({ 
    message: 'Le commentaire est obligatoire' 
  })
  @Length(3, 1000, { 
    message: 'Le commentaire doit contenir entre 3 et 1000 caracteres' 
  })
  @Matches(MEANINGFUL_TEXT, { 
    message: 'Le commentaire doit contenir au moins une lettre ou un chiffre' 
  })
  comment: string;
}