import { Response } from 'express';
import { validationResult } from 'express-validator';
import { UserService } from '../services/user.service';
import { AuthRequest } from '../middleware/auth';

const userService = new UserService();

export class UserController {
  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const user = await userService.getUserById(userId, userId);

      res.status(200).json({
        message: 'Profile retrieved successfully',
        user
      });
    } catch (error) {
      throw error;
    }
  }

  async getUserById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const requestingUserId = req.user!.userId;
      const user = await userService.getUserById(id, requestingUserId);

      res.status(200).json({
        message: 'User retrieved successfully',
        user
      });
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const userId = req.user!.userId;
      const { username, bio } = req.body;
      const user = await userService.updateProfile(userId, username, bio);

      res.status(200).json({
        message: 'Profile updated successfully',
        user
      });
    } catch (error) {
      throw error;
    }
  }

  async followUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const followerId = req.user!.userId;
      const { id: followingId } = req.params;
      const result = await userService.followUser(followerId, followingId);

      res.status(200).json(result);
    } catch (error) {
      throw error;
    }
  }

  async unfollowUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const followerId = req.user!.userId;
      const { id: followingId } = req.params;
      const result = await userService.unfollowUser(followerId, followingId);

      res.status(200).json(result);
    } catch (error) {
      throw error;
    }
  }

  async blockUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const blockerId = req.user!.userId;
      const { id: blockedId } = req.params;
      const result = await userService.blockUser(blockerId, blockedId);

      res.status(200).json(result);
    } catch (error) {
      throw error;
    }
  }

  async unblockUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const blockerId = req.user!.userId;
      const { id: blockedId } = req.params;
      const result = await userService.unblockUser(blockerId, blockedId);

      res.status(200).json(result);
    } catch (error) {
      throw error;
    }
  }
}
