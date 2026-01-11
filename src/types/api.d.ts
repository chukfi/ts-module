import { FetchType } from "./types";

export interface LoginResponse {
  authToken: string;
  expiresAt: number;
  success: boolean;
  user: ApiUser;
}

export interface ApiUser {
  id: string;
  fullname: string;
  email: string;
  permissions: string[];
}

export interface SchemaConfig {
  AdminOnly: boolean;
}

export interface Schemas {
  schemas: Record<string, SchemaConfig>;
}

export interface SchemaField {
  Name: string;
  Type: string;
  GormTag: string;
  JSONTag: string;
  Required: boolean;
  PrimaryKey: boolean;
}

export interface TableSchema {
  TableName: string;
  AdminOnly: boolean;
  Fields: SchemaField[];
}

export type _apiRequestType = <T>(
  endpoint: string,
  fetchType?: FetchType,
  requiresAuth?: boolean,
  body?: any,
) => Promise<T | Error>;

export interface AuthState {
  accessToken: string;
  loggedInAsUser: ApiUser | null;
}
