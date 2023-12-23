import { UserRole } from './../enum/userRole.enum';

export type UserHeader = {
  _id: number;
  role: UserRole;
};
