export enum Role {
  admin = "admin",
  student = "student",
  teacher = "teacher",
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  profile?: IStudent;
  createdAt: string;
  updatedAt: string;
}

export interface IStudent {
  id: string;
  name: string;
  age: number;
  classId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
