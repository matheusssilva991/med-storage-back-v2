import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { UserModule } from '../user/user.module';
import { ExamTypeController } from './exam-type.controller';
import { ExamTypeService } from './exam-type.service';
import { ExamTypeSchema } from './schema/exam-type.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'examType', schema: ExamTypeSchema }]),
    forwardRef(() => UserModule),
    forwardRef(() => DatabaseModule),
    AuthModule,
  ],
  controllers: [ExamTypeController],
  providers: [ExamTypeService],
  exports: [ExamTypeService],
})
export class ExamTypeModule {}
