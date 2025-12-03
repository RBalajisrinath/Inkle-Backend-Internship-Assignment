import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth';

const authService = new AuthService();

export class AuthController {
  async signup(req: AuthRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { username, email, password, bio } = req.body;
      const result = await authService.signup(username, email, password, bio);

      res.status(201).json({
        message: 'User registered successfully',
        user: result.user,
        token: result.token
      });
    } catch (error) {
      throw error;
    }
  }

  async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.status(200).json({
        message: 'Login successful',
        user: result.user,
        token: result.token
      });
    } catch (error) {
      throw error;
    }
  }

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      res.status(200).json({
        message: 'Profile retrieved successfully',
        userId: req.user?.userId,
        email: req.user?.email,
        role: req.user?.role
      });
    } catch (error) {
      throw error;
    }
  }
}
