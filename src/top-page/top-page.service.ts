import { Injectable } from '@nestjs/common';
import { TopPageDto } from './dto/top-page.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TopPageModel } from './top-page.model/top-page.model';
import { FindTopPageDto } from './dto/find-top-page.dto';

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel('TopPage') private readonly topPageModel: Model<TopPageModel>,
  ) {}

  create(dto: TopPageDto) {
    return this.topPageModel.create(dto);
  }

  getByAlias(alias: string) {
    return this.topPageModel.findOne({ alias }).exec();
  }

  deleteById(id: string) {
    return this.topPageModel.findByIdAndDelete(id).exec();
  }

  update(id: string, dto: TopPageDto) {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  findByTopCategory({ firstCategory }: FindTopPageDto) {
    return this.topPageModel
      .aggregate()
      .match({ firstCategory })
      .group({
        _id: {
          secondCategory: '$secondCategory',
        },
        pages: {
          $push: {
            alias: '$alias',
            title: '$title',
          },
        },
      })
      .exec();
  }

  searchByText(text: string) {
    return this.topPageModel
      .find({
        $text: {
          $search: text,
          $caseSensitive: false,
        },
      })
      .exec();
  }
}
