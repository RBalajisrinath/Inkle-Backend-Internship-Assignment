import { Router } from 'express';
import { PostController } from '../controllers/post.controller';
import { authenticate } from '../middleware/auth';
import { postValidation, uuidValidation } from '../middleware/validation';

const router = Router();
const postController = new PostController();

router.post('/', authenticate, postValidation, postController.createPost.bind(postController));
router.get('/', authenticate, postController.getAllPosts.bind(postController));
router.get('/:id', authenticate, uuidValidation, postController.getPostById.bind(postController));
router.delete('/:id', authenticate, uuidValidation, postController.deletePost.bind(postController));

router.post('/:id/like', authenticate, uuidValidation, postController.likePost.bind(postController));
router.delete('/:id/unlike', authenticate, uuidValidation, postController.unlikePost.bind(postController));

export default router;
