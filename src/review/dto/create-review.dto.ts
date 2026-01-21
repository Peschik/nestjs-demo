import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  name: string;
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsNumber()
  @Max(5)
  @Min(0, {
    message: 'Рейтинг не может быть менее 0',
  })
  rating: number;
  @IsString()
  productId: string;
}
