import { Inject, Injectable } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';

@Injectable()
export class AppService {
  constructor(@Inject('TEST') private test: number) {}

  save(dto: CreateDto) {
    console.log(this.test);
  }
}
