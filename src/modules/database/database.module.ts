import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { ExamTypeModule } from '../exam-type/exam-type.module';
import { ImageTypeModule } from '../image-type/image-type.module';
import { UserModule } from '../user/user.module';
import { DatabaseController } from './database.controller';
import { DatabaseService } from './database.service';
import { DatabaseSchema } from './schema/database.entity';
import { SolicitationSchema } from '../solicitation/schema/solicitation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'database', schema: DatabaseSchema },
      { name: 'solicitation', schema: SolicitationSchema },
    ]),
    forwardRef(() => ExamTypeModule),
    forwardRef(() => ImageTypeModule),
    forwardRef(() => UserModule),
    AuthModule,
  ],
  controllers: [DatabaseController],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
