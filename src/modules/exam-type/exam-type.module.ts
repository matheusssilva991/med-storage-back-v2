import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamTypeController } from './exam-type.controller';
import { ExamTypeService } from './exam-type.service';
import { ExamTypeSchema } from './schema/exam-type.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'examType', schema: ExamTypeSchema }]),
    forwardRef(() => UserModule),
  ],
  controllers: [ExamTypeController],
  providers: [ExamTypeService],
  exports: [ExamTypeService],
})
export class ExamTypeModule {}
