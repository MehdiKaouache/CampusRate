import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Nom ou pseudonyme de la personne qui publie l\'appreciation',
    example: 'Mehdi'
  })
  @IsString()
  @IsNotEmpty()
  authorName: string;

  @ApiProperty({
    description: 'Note attribuee, de 1 a 5',
    example: 4,
    minimum: 1,
    maximum: 5
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: 'Commentaire decrivant l\'appreciation',
    example: 'Calme et Wi-Fi stable.'
  })
  @IsString()
  @IsNotEmpty()
  comment: string;
}