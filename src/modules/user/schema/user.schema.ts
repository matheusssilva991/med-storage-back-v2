import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  institution: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: false })
  lattes: string;

  @Prop({ required: true, default: 'user' })
  role: string;

  constructor(user?: Partial<User>) {
    this.name = user?.name;
    this.email = user?.email;
    this.password = user?.password;
    this.institution = user?.institution;
    this.country = user?.country;
    this.city = user?.city;
    this.lattes = user?.lattes;
    this.role = user?.role;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
