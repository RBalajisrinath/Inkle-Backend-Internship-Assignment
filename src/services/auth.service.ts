import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { config } from '../config';
import { AppError } from '../middleware/errorHandler';
import { Role, AuthPayload } from '../types';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants';

export class AuthService {
  async signup(username: string, email: string, password: string, bio?: string): Promise<{ user: any, token: string }> {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      throw new AppError(ERROR_MESSAGES.USER_ALREADY_EXISTS, HTTP_STATUS.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        bio,
        role: 'USER'
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        bio: true,
        createdAt: true
      }
    });

    const token = this.generateToken(user.id, user.email, user.role);

    return { user, token };
  }

  async login(email: string, password: string): Promise<{ user: any, token: string }> {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        bio: user.bio,
        createdAt: user.createdAt
      },
      token
    };
  }

  private generateToken(userId: string, email: string, role: any): string {
    const payload: AuthPayload = {
      userId,
      email,
      role
    };

    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpire
    } as any);
  }
}
