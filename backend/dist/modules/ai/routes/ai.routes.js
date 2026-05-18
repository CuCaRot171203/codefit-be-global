/**
 * Routes cho module AI
 */
import { Router } from 'express';
import aiController from '../controllers/ai.controller';
import { verifyToken, requireLectureOrAdmin } from '../../../middleware/auth.middleware';
const router = Router();
// All routes require authentication
router.use(verifyToken);
// Conversation management
router.get('/conversations', aiController.getConversations);
router.get('/conversations/:id', aiController.getConversation);
router.post('/conversations', aiController.createConversation);
router.put('/conversations/:id', aiController.updateConversation);
router.delete('/conversations/:id', aiController.deleteConversation);
router.post('/conversations/:id/messages', aiController.sendMessage);
// Generate hints using AI (lecture only)
router.post('/generate-hints', requireLectureOrAdmin, aiController.generateHints);
// Chat with AI (legacy endpoint - creates temporary chat)
router.post('/chat', aiController.chat);
export default router;
//# sourceMappingURL=ai.routes.js.map