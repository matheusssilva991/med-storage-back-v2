import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { ExamTypeModule } from '../exam-type/exam-type.module';
import { ImageTypeModule } from '../image-type/image-type.module';
import { UserModule } from '../user/user.module';
import { SolicitationSchema } from './schema/solicitation.schema';
import { SolicitationController } from './solicitation.controller';
import { SolicitationService } from './solicitation.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'solicitation', schema: SolicitationSchema },
    ]),
    forwardRef(() => UserModule),
    DatabaseModule,
    ImageTypeModule,
    ExamTypeModule,
    AuthModule,
  ],
  providers: [SolicitationService],
  controllers: [SolicitationController],
  exports: [SolicitationService],
})
export class SolicitationModule {}
