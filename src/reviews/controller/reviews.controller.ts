import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReviewsService } from '../reviews.service';
import { CreateReviewDto } from '../dto/create-review.dto';
import { Review } from '../entities/review.entity';

@Controller({ path: 'places/:placeId/reviews', version: '1' })
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Post()
    create(@Param('placeId') placeId: string, @Body() dto: CreateReviewDto): Promise<Review> {
        return this.reviewsService.create(placeId, dto);
    }

    @Get()
    findAllByPlace(@Param('placeId') placeId: string): Promise<Review[]> {
        return this.reviewsService.findAllByPlace(placeId);
    }
}
