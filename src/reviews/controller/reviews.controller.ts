import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReviewsService } from '../reviews.service';
import { CreateReviewDto } from '../dto/create-review.dto';
import { Review } from '../entities/review.entity';
import { ProblemDetailsDto } from '../../common/dto/problem-details.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnsupportedMediaTypeResponse } from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller({ path: 'places/:placeId/reviews', version: '1' })
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @ApiOperation({
        summary: 'Creer une appreciation',
        description: 'Ajoute une appreciation pour un endroit precis.',
    })
    @ApiParam({ 
        name: 'placeId', 
        description: 'Identifiant de l\'endroit concerne' 
    })
    @ApiCreatedResponse({ 
        description: 'Appreciation creee.', 
        type: Review 
    })
    @ApiBadRequestResponse({ 
        description: 'Donnees invalides, propriete manquante ou interdite.', 
        type: ProblemDetailsDto 
    })
    @ApiNotFoundResponse({ 
        description: 'Aucun endroit ne possede cet identifiant.', 
        type: ProblemDetailsDto 
    })
    @ApiUnsupportedMediaTypeResponse({ 
        description: 'Le Content-Type doit etre application/json.', 
        type: ProblemDetailsDto 
    })
    @Post()
    create(@Param('placeId') placeId: string, @Body() dto: CreateReviewDto): Promise<Review> {
        return this.reviewsService.create(placeId, dto);
    }


    @ApiOperation({
        summary: 'Lister les appreciations d\'un endroit',
        description: 'Retourne toutes les appreciations associees a un endroit precis.'
    })
    @ApiParam({ 
        name: 'placeId', 
        description: 'Identifiant de l\'endroit concerne' 
    })
    @ApiOkResponse({ 
        description: 'Liste des appreciations.', 
        type: [Review] 
    })
    @ApiNotFoundResponse({ 
        description: 'Aucun endroit ne possede cet identifiant.', 
        type: ProblemDetailsDto 
    })
    @Get()
    findAllByPlace(@Param('placeId') placeId: string): Promise<Review[]> {
        return this.reviewsService.findAllByPlace(placeId);
    }
}