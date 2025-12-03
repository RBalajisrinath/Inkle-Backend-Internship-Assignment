import { Request } from 'express';
import { Role as PrismaRole, ActivityType as PrismaActivityType } from '@prisma/client';

export { PrismaRole as Role, PrismaActivityType as ActivityType };

export interface AuthPayload {
  userId: string;
  email: string;
  role: PrismaRole;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
  body: any;
  params: { [key: string]: string };
  query: { [key: string]: any };
  headers: { [key: string]: string | string[] | undefined };
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  role: PrismaRole;
  bio?: string;
  createdAt: Date;
}

export interface PostResponse {
  id: string;
  content: string;
  userId: string;
  user: {
    id: string;
    username: string;
  };
  likesCount: number;
  createdAt: Date;
}

export interface ActivityResponse {
  id: string;
  type: PrismaActivityType;
  actor: {
    id: string;
    username: string;
  };
  metadata?: any;
  createdAt: Date;
}
