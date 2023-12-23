import { Module, forwardRef } from '@nestjs/common';
import { ImageTypeService } from './image-type.service';
import { ImageTypeController } from './image-type.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageTypeSchema } from './schema/image-type.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'imageType', schema: ImageTypeSchema }]),
    forwardRef(() => UserModule),
  ],
  controllers: [ImageTypeController],
  providers: [ImageTypeService],
  exports: [ImageTypeService],
})
export class ImageTypeModule {}
