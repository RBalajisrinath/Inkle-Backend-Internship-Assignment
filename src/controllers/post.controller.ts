import { Response } from 'express';
import { validationResult } from 'express-validator';
import { PostService } from '../services/post.service';
import { AuthRequest } from '../middleware/auth';

const postService = new PostService();

export class PostController {
  async createPost(req: AuthRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const userId = req.user!.userId;
      const { content } = req.body;
      const post = await postService.createPost(userId, content);

      res.status(201).json({
        message: 'Post created successfully',
        post
      });
    } catch (error) {
      throw error;
    }
  }

  async getAllPosts(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await postService.getAllPosts(userId, page, limit);

      res.status(200).json({
        message: 'Posts retrieved successfully',
        ...result
      });
    } catch (error) {
      throw error;
    }
  }

  async getPostById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;
      const post = await postService.getPostById(id, userId);

      res.status(200).json({
        message: 'Post retrieved successfully',
        post
      });
    } catch (error) {
      throw error;
    }
  }

  async deletePost(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;
      const userRole = req.user!.role;
      const result = await postService.deletePost(id, userId, userRole);

      res.status(200).json(result);
    } catch (error) {
      throw error;
    }
  }

  async likePost(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const result = await postService.likePost(userId, id);

      res.status(200).json(result);
    } catch (error) {
      throw error;
    }
  }

  async unlikePost(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const result = await postService.unlikePost(userId, id);

      res.status(200).json(result);
    } catch (error) {
      throw error;
    }
  }
}
