import { Response } from 'express';
import { ActivityService } from '../services/activity.service';
import { AuthRequest } from '../middleware/auth';

const activityService = new ActivityService();

export class ActivityController {
  async getActivityFeed(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const result = await activityService.getActivityFeed(userId, page, limit);

      res.status(200).json({
        message: 'Activity feed retrieved successfully',
        ...result
      });
    } catch (error) {
      throw error;
    }
  }
}
