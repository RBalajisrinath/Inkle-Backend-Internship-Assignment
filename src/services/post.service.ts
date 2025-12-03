import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { ActivityType, Role } from '../types';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, HTTP_STATUS, PAGINATION } from '../constants';

export class PostService {
  async createPost(userId: string, content: string): Promise<any> {
    const post = await prisma.post.create({
      data: {
        content,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    await prisma.activity.create({
      data: {
        type: ActivityType.POST_CREATED,
        actorId: userId,
        postId: post.id
      }
    });

    return post;
  }

  async getAllPosts(userId: string, page: number = PAGINATION.DEFAULT_PAGE, limit: number = PAGINATION.DEFAULT_POST_LIMIT): Promise<{ posts: any[], pagination: any }> {
    const skip = (page - 1) * limit;

    const blockedUsers: Array<{ blockerId: string; blockedId: string }> = await prisma.block.findMany({
      where: {
        OR: [
          { blockerId: userId },
          { blockedId: userId }
        ]
      },
      select: {
        blockerId: true,
        blockedId: true
      }
    });

    const blockedUserIds = new Set<string>();
    blockedUsers.forEach((block) => {
      if (block.blockerId === userId) {
        blockedUserIds.add(block.blockedId);
      } else {
        blockedUserIds.add(block.blockerId);
      }
    });

    const posts = await prisma.post.findMany({
      where: {
        userId: {
          notIn: Array.from(blockedUserIds)
        }
      },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    const total = await prisma.post.count({
      where: {
        userId: {
          notIn: Array.from(blockedUserIds)
        }
      }
    });

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getPostById(postId: string, userId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      }
    });

    if (!post) {
      throw new AppError(ERROR_MESSAGES.POST_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const isBlocked = await this.isUserBlocked(userId, post.userId);
    if (isBlocked) {
      throw new AppError(ERROR_MESSAGES.POST_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    return post;
  }

  async deletePost(postId: string, userId: string, userRole: Role): Promise<{ message: string }> {
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    const isAdminOrOwner = userRole === Role.ADMIN || userRole === Role.OWNER;

    if (!isAdminOrOwner) {
      throw new AppError('Only admins can delete posts', 403);
    }

    const postDetails = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            username: true
          }
        }
      }
    });

    await prisma.post.delete({
      where: { id: postId }
    });

    await prisma.activity.create({
      data: {
        type: ActivityType.POST_DELETED,
        actorId: userId,
        metadata: {
          postContent: postDetails?.content.substring(0, 50),
          originalAuthor: postDetails?.user.username,
          deletedBy: userRole
        }
      }
    });

    return { message: 'Post deleted successfully' };
  }

  async likePost(userId: string, postId: string): Promise<{ message: string }> {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: true
      }
    });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    const isBlocked = await this.isUserBlocked(userId, post.userId);
    if (isBlocked) {
      throw new AppError('Cannot like this post', 403);
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    });

    if (existingLike) {
      throw new AppError('Post already liked', 400);
    }

    const like = await prisma.like.create({
      data: {
        userId,
        postId
      }
    });

    await prisma.activity.create({
      data: {
        type: ActivityType.POST_LIKED,
        actorId: userId,
        likeId: like.id,
        postId: postId,
        metadata: {
          postAuthor: post.user.username
        }
      }
    });

    return { message: 'Post liked successfully' };
  }

  async unlikePost(userId: string, postId: string): Promise<{ message: string }> {
    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    });

    if (!like) {
      throw new AppError('Post not liked yet', 400);
    }

    await prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    });

    return { message: 'Post unliked successfully' };
  }

  private async isUserBlocked(userId1: string, userId2: string): Promise<boolean> {
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
