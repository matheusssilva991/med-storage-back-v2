import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  _id?: string;

  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  @Exclude()
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

  /* constructor(user?: Partial<User>) {
    this.name = user?.name;
    this.email = user?.email;
    this.password = user?.password;
    this.institution = user?.institution;
    this.country = user?.country;
    this.city = user?.city;
    this.lattes = user?.lattes;
    this.role = user?.role;
  } */
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
