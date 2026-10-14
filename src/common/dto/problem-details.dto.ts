import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProblemDetailsDto {
  @ApiProperty({ 
    example: 'about:blank' 
  })
  type: string;

  @ApiProperty({ 
    example: 'Not Found' 
  })
  title: string;

  @ApiProperty({ 
    example: 404 
  })
  status: number;

  @ApiProperty({ 
    example: 'Aucun endroit ne possede l\'identifiant plc_inexistant.' 
  })
  detail: string;

  @ApiProperty({ 
    example: '/api/v1/places/plc_inexistant' 
  })
  instance: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['Le nom est obligatoire', 'L\'adresse est obligatoire']
  })
  errors?: string[];
}