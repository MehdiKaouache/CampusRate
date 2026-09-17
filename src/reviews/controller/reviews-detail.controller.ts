import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common';
import { ReviewsService } from '../reviews.service';
import { Review } from '../entities/review.entity';
import { UpdateReviewDto } from '../dto/update-review.dto';

@Controller({ path: 'reviews', version: '1' })
export class ReviewsDetailController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Review> {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateReviewDto): Promise<Review> {
      return this.reviewsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string): Promise<void> {
      return this.reviewsService.remove(id);
  }
}