import type { LoggedUser } from './logged-user.entity';

export interface AdminUser extends LoggedUser {
  id?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}
