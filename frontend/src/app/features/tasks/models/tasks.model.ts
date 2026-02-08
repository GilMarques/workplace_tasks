export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  assignedToUserId: string;
  createdByUserId: string;
};

export enum TaskStatus {
  Done = 0,
  InProgress = 1,
  Pending = 2,
}
