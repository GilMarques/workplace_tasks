export type UserDetails = {
  id: string;
  email: string;
  role: UserRole;
};

export enum UserRole {
  Admin = 0,
  Manager = 1,
  Member = 2,
}
