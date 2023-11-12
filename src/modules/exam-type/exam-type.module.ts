import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamTypeController } from './exam-type.controller';
import { ExamTypeService } from './exam-type.service';
import { ExamTypeSchema } from './schema/exam-type.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'examType', schema: ExamTypeSchema }]),
  ],
  controllers: [ExamTypeController],
  providers: [ExamTypeService],
})
export class ExamTypeModule {}
