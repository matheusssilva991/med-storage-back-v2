import { Types } from 'mongoose';
import { UserRole } from './../enum/userRole.enum';

export type UserHeader = {
  _id: Types.ObjectId;
  role: UserRole;
};
