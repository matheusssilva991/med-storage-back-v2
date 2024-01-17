import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ImageTypeController } from './image-type.controller';
import { ImageTypeService } from './image-type.service';
import { ImageTypeSchema } from './schema/image-type.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'imageType', schema: ImageTypeSchema }]),
    forwardRef(() => UserModule),
    AuthModule,
  ],
  controllers: [ImageTypeController],
  providers: [ImageTypeService],
  exports: [ImageTypeService],
})
export class ImageTypeModule {}
