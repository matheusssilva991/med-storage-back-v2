import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SolicitationStatus } from '../../../enum/solicitationStatus.enum';
import { SolicitationType } from '../../../enum/solicitationType.enum';

export type SolicitationDocument = HydratedDocument<Solicitation>;

@Schema()
export class Solicitation {
  @Prop({ required: true })
  type: SolicitationType;

  @Prop({ required: true })
  status: SolicitationStatus;

  @Prop({ required: true, default: Date.now() })
  solicitationDate: Date;

  @Prop({ required: true, type: Object })
  data: object;
}

export const SolicitationSchema = SchemaFactory.createForClass(Solicitation);
