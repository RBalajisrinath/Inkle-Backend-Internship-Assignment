import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { signupValidation, loginValidation } from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = Router();
const authController = new AuthController();

router.post('/signup', signupValidation, authController.signup.bind(authController));
router.post('/login', loginValidation, authController.login.bind(authController));
router.get('/me', authenticate, authController.getProfile.bind(authController));

export default router;
