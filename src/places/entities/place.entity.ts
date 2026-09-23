import { ApiProperty } from '@nestjs/swagger';
import { PlaceCategory } from './place-category.enum';
import { PlaceStatus } from './place-status.enum';

export class Place {
  @ApiProperty({
    description: 'Identifiant genere par le serveur',
    example: 'plc_01JABC123'
  })
  id: string;

  @ApiProperty({
    description: 'Nom de l\'endroit',
    example: 'Bibliotheque principale'
  })
  name: string;

  @ApiProperty({
    description: 'Description de l\'endroit',
    example: 'Espace calme avec prises.'
  })
  description: string;

  @ApiProperty({
    description: 'Categorie de l\'endroit',
    enum: PlaceCategory,
    example: PlaceCategory.STUDY_SPACE
  })
  category: PlaceCategory;

  @ApiProperty({
    description: 'Emplacement de l\'endroit',
    example: 'Pavillon A, local A-210'
  })
  address: string;

  @ApiProperty({
    description: 'Services disponibles a cet endroit',
    type: [String],
    example: ['WIFI', 'POWER_OUTLETS']
  })
  services: string[];

  @ApiProperty({
    description: 'Statut de l\'endroit',
    enum: PlaceStatus,
    example: PlaceStatus.ACTIVE
  })
  status: PlaceStatus;

  @ApiProperty({
    description: 'Note moyenne calculee a partir des appreciations',
    example: 4.25,
    type: Number,
    nullable: true
  })
  averageRating: number | null;

  @ApiProperty({
    description: 'Nombre d\'appreciations calcule par le serveur',
    example: 12
  })
  reviewCount: number;

  @ApiProperty({
    description: 'Date de creation, produite par le serveur',
    example: '2026-08-26T21:27:26.738Z'
  })
  createdAt: string;

  @ApiProperty({
    description: 'Date de derniere modification, produite par le serveur',
    example: '2026-08-27T21:29:26.738Z'
  })
  updatedAt: string;
}