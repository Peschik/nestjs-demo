import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TopLevelCategory } from '../top-page.model/top-page.model';
import { Type } from 'class-transformer';

export class HhDataDto {
  @IsNumber()
  count: number;
  @IsNumber()
  juniorSalary: number;
  @IsNumber()
  middleSalary: number;
  @IsNumber()
  seniorSalary: number;
}

export class TopPageAdvantageDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
}

const json = `{
  "firstCategory": 1,
  "secondCategory": 0,
  "alias": "Палка",
  "title": "title",
"category": "category",
"hh": {
  "count": 10,
"juniorSalary": 20000,
"middleSalary": 100000,
"seniorSalary": 500000
},
"advantages": [{
"title": "Название преимущества",
"description": "Описание преимущества",
}],
"seoText":"Какое-то сео текст не знаю что это",
"tagsTitle": "Камешки",
"tags": ["Какой-то тех"]
}`;

export class TopPageDto {
  @IsEnum(TopLevelCategory)
  firstCategory: TopLevelCategory;

  @IsString()
  secondCategory: string;

  @IsString()
  alias: string;

  @IsString()
  title: string;

  @IsString()
  category: string;

  @ValidateNested()
  @Type(() => HhDataDto)
  @IsOptional()
  hh?: HhDataDto;

  @IsArray()
  @ValidateNested()
  @Type(() => TopPageAdvantageDto)
  advantages: TopPageAdvantageDto[];

  @IsString()
  seoText: string;

  @IsString()
  tagsTitle: string;

  @IsArray()
  @ValidateNested()
  @IsString()
  tags: string[];
}
