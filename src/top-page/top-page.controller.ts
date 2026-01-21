import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Injectable,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TopPageModel } from './top-page.model/top-page.model';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { ConfigService } from '@nestjs/config';
import { TopPageService } from './top-page.service';
import { ALIAS_EXISTS, TOP_PAGE_NOT_FOUND } from './top-page.constants';
import { TopPageDto } from './dto/top-page.dto';

@Controller('top-page')
@Injectable()
export class TopPageController {
  constructor(
    private readonly configService: ConfigService,
    private readonly topPageService: TopPageService,
  ) {}

  @Post('')
  async create(@Body() dto: TopPageDto) {
    const aliasExists = await this.topPageService.getByAlias(dto.alias);
    if (aliasExists) throw new BadRequestException(ALIAS_EXISTS);

    return this.topPageService.create(dto);
  }

  @Get(':alias')
  async get(@Param('alias') alias: string) {
    const page = await this.topPageService.getByAlias(alias);
    if (!page) throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    return page;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deleted = await this.topPageService.deleteById(id);
    if (!deleted) throw new NotFoundException(TOP_PAGE_NOT_FOUND);

    return deleted;
  }

  @Patch(':id')
  async patch(@Param('id') id: string, @Body() dto: TopPageModel) {
    const updated = await this.topPageService.update(id, dto);
    if (!updated) throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    return updated;
  }

  @HttpCode(200)
  @Post('by/top-category')
  async findByTopCategory(@Body() dto: FindTopPageDto) {
    return this.topPageService.findByTopCategory(dto);
  }

  @Get('/by/text/:text')
  async searchText(@Param('text') text: string) {
    return this.topPageService.searchByText(text);
  }
}
