import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductModel } from './product.model/product.model';
import { Model } from 'mongoose';
import { ProductDto } from './dto/product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { ReviewModel } from 'src/review/review.model/review.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductModel>,
  ) {}

  create(dto: ProductDto) {
    return this.productModel.create(dto);
  }

  findById(id: string) {
    return this.productModel.findById(id).exec();
  }

  delete(id: string) {
    return this.productModel.findByIdAndDelete(id);
  }

  update(id: string, dto: ProductDto) {
    return this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async findWithReviews(dto: FindProductDto) {
    return this.productModel
      .aggregate([
        {
          $match: {
            categories: dto.category,
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
        {
          $limit: dto.limit,
        },
        {
          $lookup: {
            from: 'Review',
            localField: '_id',
            foreignField: 'productId',
            as: 'reviews',
          },
        },
        {
          $addFields: {
            reviewCount: { $size: '$reviews' },
            reviewAvg: { $avg: '$reviews.rating' },
          },
        },
      ])
      .exec() as Promise<
      ProductModel &
        { review: ReviewModel[]; reviewCount: number; reviewAvg: number }[]
    >;
  }
}
