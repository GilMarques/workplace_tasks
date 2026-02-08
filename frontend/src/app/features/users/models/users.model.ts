export type User = {
  id: string;
  email: string;
  role: UserRole;
};

export enum UserRole {
  Admin,
  Manager,
  Member,
}
