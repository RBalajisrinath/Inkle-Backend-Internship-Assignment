import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { Role, ActivityType } from '../types';

export class AdminService {
  async deleteUser(adminId: string, targetUserId: string): Promise<{ message: string }> {
    if (adminId === targetUserId) {
      throw new AppError('Cannot delete your own account', 400);
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        role: true,
        username: true
      }
    });

    if (!targetUser) {
      throw new AppError('User not found', 404);
    }

    if (targetUser.role === Role.OWNER) {
      throw new AppError('Cannot delete owner account', 403);
    }

    await prisma.activity.create({
      data: {
        type: ActivityType.USER_DELETED,
        actorId: adminId,
        metadata: {
          deletedUsername: targetUser.username,
          deletedUserId: targetUserId
        }
      }
    });

    await prisma.user.delete({
      where: { id: targetUserId }
    });

    return { message: 'User deleted successfully' };
  }

  async deleteLike(likeId: string): Promise<{ message: string }> {
    const like = await prisma.like.findUnique({
      where: { id: likeId }
    });

    if (!like) {
      throw new AppError('Like not found', 404);
    }

    await prisma.like.delete({
      where: { id: likeId }
    });

    return { message: 'Like deleted successfully' };
  }

  async promoteToAdmin(ownerId: string, targetUserId: string): Promise<{ message: string }> {
    if (ownerId === targetUserId) {
      throw new AppError('You are already an owner', 400);
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId }
    });

    if (!targetUser) {
      throw new AppError('User not found', 404);
    }

    if (targetUser.role === Role.OWNER) {
      throw new AppError('User is already an owner', 400);
    }

    if (targetUser.role === Role.ADMIN) {
      throw new AppError('User is already an admin', 400);
    }

    await prisma.user.update({
      where: { id: targetUserId },
      data: { role: Role.ADMIN }
    });

    return { message: 'User promoted to admin successfully' };
  }

  async demoteAdmin(ownerId: string, targetUserId: string): Promise<{ message: string }> {
    if (ownerId === targetUserId) {
      throw new AppError('Cannot demote yourself', 400);
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId }
    });

    if (!targetUser) {
      throw new AppError('User not found', 404);
    }

    if (targetUser.role !== Role.ADMIN) {
      throw new AppError('User is not an admin', 400);
    }

    await prisma.user.update({
      where: { id: targetUserId },
      data: { role: Role.USER }
    });

    return { message: 'Admin demoted to user successfully' };
  }
}
