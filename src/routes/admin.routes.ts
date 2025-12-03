import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth';
import { uuidValidation } from '../middleware/validation';
import { Role } from '../types';

const router = Router();
const adminController = new AdminController();

// Admin and Owner routes
router.delete('/users/:id', authenticate, authorize(Role.ADMIN, Role.OWNER), uuidValidation, adminController.deleteUser.bind(adminController));
router.delete('/likes/:id', authenticate, authorize(Role.ADMIN, Role.OWNER), uuidValidation, adminController.deleteLike.bind(adminController));

// Owner only routes
router.post('/promote/:id', authenticate, authorize(Role.OWNER), uuidValidation, adminController.promoteToAdmin.bind(adminController));
router.delete('/demote/:id', authenticate, authorize(Role.OWNER), uuidValidation, adminController.demoteAdmin.bind(adminController));

export default router;
