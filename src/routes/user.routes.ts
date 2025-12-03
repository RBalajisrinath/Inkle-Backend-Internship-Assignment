import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { updateProfileValidation, uuidValidation } from '../middleware/validation';

const router = Router();
const userController = new UserController();

router.get('/profile', authenticate, userController.getProfile.bind(userController));
router.get('/:id', authenticate, uuidValidation, userController.getUserById.bind(userController));
router.put('/profile', authenticate, updateProfileValidation, userController.updateProfile.bind(userController));

router.post('/follow/:id', authenticate, uuidValidation, userController.followUser.bind(userController));
router.delete('/unfollow/:id', authenticate, uuidValidation, userController.unfollowUser.bind(userController));

router.post('/block/:id', authenticate, uuidValidation, userController.blockUser.bind(userController));
router.delete('/unblock/:id', authenticate, uuidValidation, userController.unblockUser.bind(userController));

export default router;
