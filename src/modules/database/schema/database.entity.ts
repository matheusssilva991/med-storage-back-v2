import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DatabaseDocument = HydratedDocument<Database>;

@Schema({ timestamps: true })
export class Database {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'examType' })
  examType: any;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  imageQuality: Array<number>;

  @Prop({ required: true, type: Types.ObjectId, ref: 'imageType' })
  imageType: any;

  @Prop({ required: false, default: '' })
  url: string;

  @Prop({ required: false, default: '' })
  path: string;

  @Prop({ required: false, default: [] })
  images: Array<object>;
}

export const DatabaseSchema = SchemaFactory.createForClass(Database);
