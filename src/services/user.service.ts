import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { ActivityType } from '../types';

export class UserService {
  async getUserById(userId: string, requestingUserId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true
          }
        }
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isBlocked = await this.isBlocked(requestingUserId, userId);
    if (isBlocked) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async updateProfile(userId: string, username?: string, bio?: string) {
    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username,
          NOT: { id: userId }
        }
      });

      if (existingUser) {
        throw new AppError('Username already taken', 400);
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(username && { username }),
        ...(bio !== undefined && { bio })
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

    return user;
  }

  async followUser(followerId: string, followingId: string): Promise<{ message: string }> {
    if (followerId === followingId) {
      throw new AppError('Cannot follow yourself', 400);
    }

    const userToFollow = await prisma.user.findUnique({
      where: { id: followingId }
    });

    if (!userToFollow) {
      throw new AppError('User not found', 404);
    }

    const isBlocked = await this.isBlocked(followerId, followingId);
    if (isBlocked) {
      throw new AppError('Cannot follow this user', 403);
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });

    if (existingFollow) {
      throw new AppError('Already following this user', 400);
    }

    const follow = await prisma.follow.create({
      data: {
        followerId,
        followingId
      }
    });

    await prisma.activity.create({
      data: {
        type: ActivityType.USER_FOLLOWED,
        actorId: followerId,
        followId: follow.id,
        metadata: {
          followingUsername: userToFollow.username
        }
      }
    });

    return { message: 'Successfully followed user' };
  }

  async unfollowUser(followerId: string, followingId: string): Promise<{ message: string }> {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });

    if (!follow) {
      throw new AppError('Not following this user', 400);
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });

    return { message: 'Successfully unfollowed user' };
  }

  async blockUser(blockerId: string, blockedId: string): Promise<{ message: string }> {
    if (blockerId === blockedId) {
      throw new AppError('Cannot block yourself', 400);
    }

    const existingBlock = await prisma.block.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId,
          blockedId
        }
      }
    });

    if (existingBlock) {
      throw new AppError('User already blocked', 400);
    }

    await prisma.block.create({
      data: {
        blockerId,
        blockedId
      }
    });

    await prisma.follow.deleteMany({
      where: {
        OR: [
          { followerId: blockerId, followingId: blockedId },
          { followerId: blockedId, followingId: blockerId }
        ]
      }
    });

    return { message: 'Successfully blocked user' };
  }

  async unblockUser(blockerId: string, blockedId: string): Promise<{ message: string }> {
    const block = await prisma.block.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId,
          blockedId
        }
      }
    });

    if (!block) {
      throw new AppError('User is not blocked', 400);
    }

    await prisma.block.delete({
      where: {
        blockerId_blockedId: {
          blockerId,
          blockedId
        }
      }
    });

    return { message: 'Successfully unblocked user' };
  }

  private async isBlocked(userId1: string, userId2: string): Promise<boolean> {
    const block = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: userId1, blockedId: userId2 },
          { blockerId: userId2, blockedId: userId1 }
        ]
      }
    });

    return !!block;
  }
}
