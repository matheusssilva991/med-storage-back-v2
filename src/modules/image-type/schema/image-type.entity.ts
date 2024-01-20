import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ExamTypeDocument = HydratedDocument<ImageType>;

@Schema({ timestamps: true })
export class ImageType {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: Array })
  requiredData: object;

  @Prop({ required: false, type: Array })
  optionalData: object;
}

export const ImageTypeSchema = SchemaFactory.createForClass(ImageType);
