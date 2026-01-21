import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './product.model/product.model';
import { ProductService } from './product.service';

@Module({
  controllers: [ProductController],
  imports: [
    MongooseModule.forFeature([
      {
        schema: ProductSchema,
        name: 'Product',
      },
    ]),
  ],
  providers: [ProductService],
})
export class ProductModule {}
