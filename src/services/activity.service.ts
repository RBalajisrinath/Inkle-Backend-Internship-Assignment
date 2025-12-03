import prisma from '../config/database';

export class ActivityService {
  async getActivityFeed(userId: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const blockedUsers = await prisma.block.findMany({
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
    blockedUsers.forEach((block: { blockerId: string; blockedId: string }) => {
      if (block.blockerId === userId) {
        blockedUserIds.add(block.blockedId);
      } else {
        blockedUserIds.add(block.blockerId);
      }
    });

    const activities = await prisma.activity.findMany({
      where: {
        actorId: {
          notIn: Array.from(blockedUserIds)
        }
      },
      include: {
        actor: {
          select: {
            id: true,
            username: true
          }
        },
        post: {
          select: {
            id: true,
            content: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    const total = await prisma.activity.count({
      where: {
        actorId: {
          notIn: Array.from(blockedUserIds)
        }
      }
    });

    return {
      activities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}
