import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common';
import { ReviewsService } from '../reviews.service';
import { Review } from '../entities/review.entity';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { ProblemDetailsDto } from '../../common/dto/problem-details.dto';
import { ApiBadRequestResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnsupportedMediaTypeResponse } from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller({ path: 'reviews', version: '1' })
export class ReviewsDetailController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({
    summary: 'Consulter une appreciation',
    description: 'Retourne une appreciation precise par son identifiant.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Identifiant de l\'appreciation' 
  })
  @ApiOkResponse({ 
    description: 'Appreciation trouvee.', 
    type: Review 
  })
  @ApiNotFoundResponse({ 
    description: 'Aucune appreciation ne possede cet identifiant.', 
    type: ProblemDetailsDto 
  })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Review> {
    return this.reviewsService.findOne(id);
  }


  @ApiOperation({
    summary: 'Modifier une appreciation',
    description: 'Modifie partiellement une appreciation existante.',
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Identifiant de l\'appreciation' 
  })
  @ApiOkResponse({ 
    description: 'Appreciation modifiee.', 
    type: Review 
  })
  @ApiBadRequestResponse({ 
    description: 'Donnees invalides, propriete inconnue ou controlee par le serveur.', 
    type: ProblemDetailsDto 
  })
  @ApiNotFoundResponse({ 
    description: 'Aucune appreciation ne possede cet identifiant.', 
    type: ProblemDetailsDto 
  })
  @ApiUnsupportedMediaTypeResponse({ 
    description: 'Le Content-Type doit etre application/json.', 
    type: ProblemDetailsDto 
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReviewDto): Promise<Review> {
    return this.reviewsService.update(id, dto);
  }


  @ApiOperation({
    summary: 'Supprimer une appreciation',
    description: 'Supprime une appreciation existante.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Identifiant de l\'appreciation' 
  })
  @ApiNoContentResponse({ 
    description: 'Appreciation supprimee.' 
  })
  @ApiNotFoundResponse({ 
    description: 'Aucune appreciation ne possede cet identifiant.', 
    type: ProblemDetailsDto 
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.reviewsService.remove(id);
  }
}