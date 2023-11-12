import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { SolicitationModule } from './modules/solicitation/solicitation.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    UserModule,
    SolicitationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
