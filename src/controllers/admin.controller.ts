import { Response } from 'express';
import { AdminService } from '../services/admin.service';
import { AuthRequest } from '../types';

const adminService = new AdminService();

export class AdminController {
  async deleteUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const adminId = req.user!.userId;
      const { id: targetUserId } = req.params;
      const result = await adminService.deleteUser(adminId, targetUserId);

      res.status(200).json(result);
    } catch (error) {
      throw error;
    }
  }

  async deleteLike(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id: likeId } = req.params;
      const result = await adminService.deleteLike(likeId);

      res.status(200).json(result);
    } catch (error) {
      throw error;
    }
  }

  async promoteToAdmin(req: AuthRequest, res: Response): Promise<void> {
    try {
      const ownerId = req.user!.userId;
      const { id: targetUserId } = req.params;
      const result = await adminService.promoteToAdmin(ownerId, targetUserId);

      res.status(200).json(result);
    } catch (error) {
      throw error;
    }
  }

  async demoteAdmin(req: AuthRequest, res: Response): Promise<void> {
    try {
      const ownerId = req.user!.userId;
      const { id: targetUserId } = req.params;
      const result = await adminService.demoteAdmin(ownerId, targetUserId);

      res.status(200).json(result);
    } catch (error) {
      throw error;
    }
  }
}
