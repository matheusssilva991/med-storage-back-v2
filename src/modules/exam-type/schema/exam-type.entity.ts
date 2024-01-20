import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ExamTypeDocument = HydratedDocument<ExamType>;

@Schema({ timestamps: true })
export class ExamType {
  @Prop({ required: true, unique: true })
  name: string;
}

export const ExamTypeSchema = SchemaFactory.createForClass(ExamType);
