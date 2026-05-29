"use strict";
/**
 * Routes cho module AI
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_controller_1 = __importDefault(require("../controllers/ai.controller"));
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_1.verifyToken);
// Conversation management
router.get('/conversations', ai_controller_1.default.getConversations);
router.get('/conversations/:id', ai_controller_1.default.getConversation);
router.post('/conversations', ai_controller_1.default.createConversation);
router.put('/conversations/:id', ai_controller_1.default.updateConversation);
router.delete('/conversations/:id', ai_controller_1.default.deleteConversation);
router.post('/conversations/:id/messages', ai_controller_1.default.sendMessage);
// Generate hints using AI (lecture only)
router.post('/generate-hints', auth_middleware_1.requireLectureOrAdmin, ai_controller_1.default.generateHints);
// Chat with AI (legacy endpoint - creates temporary chat)
router.post('/chat', ai_controller_1.default.chat);
exports.default = router;
//# sourceMappingURL=ai.routes.js.map