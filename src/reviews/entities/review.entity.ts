import { ApiProperty } from '@nestjs/swagger';

export class Review {
  @ApiProperty({
    description: 'Identifiant genere par le serveur',
    example: 'rev_01JXYZ789'
  })
  id: string;

  @ApiProperty({
    description: 'Identifiant de l\'endroit concerne',
    example: 'plc_01JABC123'
  })
  placeId: string;

  @ApiProperty({
    description: 'Nom ou pseudonyme de la personne qui publie l\'appreciation',
    example: 'Mehdi'
  })
  authorName: string;

  @ApiProperty({
    description: 'Note attribuee, de 1 a 5',
    example: 4,
    minimum: 1,
    maximum: 5
  })
  rating: number;

  @ApiProperty({
    description: 'Commentaire decrivant l\'appreciation',
    example: 'Calme et Wi-Fi stable.'
  })
  comment: string;

  @ApiProperty({
    description: 'Date de creation, produite par le serveur',
    example: '2026-08-13T14:30:00.000Z'
  })
  createdAt: string;

  @ApiProperty({
    description: 'Date de derniere modification, produite par le serveur',
    example: '2026-08-13T14:35:00.000Z'
  })
  updatedAt: string;
}