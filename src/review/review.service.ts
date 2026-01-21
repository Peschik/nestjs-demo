import { Injectable } from '@nestjs/common';
import { ReviewModel } from './review.model/review.model';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel('Review') private readonly reviewModel: Model<ReviewModel>,
  ) {}

  async get() {
    return this.reviewModel.find();
  }

  async create(dto: CreateReviewDto) {
    return this.reviewModel.create(dto);
  }

  async delete(id: string) {
    return this.reviewModel.findByIdAndDelete(id).exec();
  }

  async findByProductId(productId: string) {
    return this.reviewModel
      .find({
        productId: new Types.ObjectId(productId).toHexString(),
      })
      .exec();
  }

  async deleteByProductId(productId: string) {
    return this.reviewModel
      .deleteMany({
        productId,
      })
      .exec();
  }

  truncate() {
    return this.reviewModel.deleteMany();
  }
}
