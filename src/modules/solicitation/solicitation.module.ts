import { Module, forwardRef } from '@nestjs/common';
import { SolicitationService } from './solicitation.service';
import { SolicitationController } from './solicitation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SolicitationSchema } from './schema/solicitation.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'solicitation', schema: SolicitationSchema },
    ]),
    forwardRef(() => UserModule),
  ],
  providers: [SolicitationService],
  controllers: [SolicitationController],
  exports: [SolicitationService],
})
export class SolicitationModule {}
