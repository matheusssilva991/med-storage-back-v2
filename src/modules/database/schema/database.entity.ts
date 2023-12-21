import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DatabaseDocument = HydratedDocument<Database>;

@Schema()
export class Database {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  examType: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  imageQuality: Array<number>;

  @Prop({ required: true })
  imageType: string;

  @Prop({ required: false, default: '' })
  url: string;

  @Prop({ required: false, default: '' })
  path: string;

  @Prop({ required: false, default: [] })
  images: Array<object>;
}

export const DatabaseSchema = SchemaFactory.createForClass(Database);
