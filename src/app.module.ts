import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { SolicitationModule } from './modules/solicitation/solicitation.module';
import { ConfigModule } from '@nestjs/config';
import { ExamTypeModule } from './modules/exam-type/exam-type.module';
import { ImageTypeModule } from './modules/image-type/image-type.module';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    UserModule,
    SolicitationModule,
    ExamTypeModule,
    ImageTypeModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
