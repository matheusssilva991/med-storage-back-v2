import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamTypeModule } from '../exam-type/exam-type.module';
import { ImageTypeModule } from '../image-type/image-type.module';
import { DatabaseController } from './database.controller';
import { DatabaseService } from './database.service';
import { DatabaseSchema } from './schema/database.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'database', schema: DatabaseSchema }]),
    ExamTypeModule,
    ImageTypeModule,
    forwardRef(() => UserModule),
  ],
  controllers: [DatabaseController],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
