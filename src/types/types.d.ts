export interface User {
  ID: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  DeletedAt?: any;
  Fullname: string;
  Email: string;
  Password: string;
  Permissions: number;
}

export enum FetchType {
  GET,
  POST,
  PUT,
  DELETE,
}
