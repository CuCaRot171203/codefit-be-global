/**
 * Controller layer cho module AI
 */
import aiService from '../../../services/ai.service';
import prisma from '../../../prisma';
class AIController {
    // Generate hints using AI
    generateHints = async (req, res, next) => {
        try {
            const { lessonId, numHints } = req.body;
            if (!lessonId) {
                return res.status(400).json({ success: false, message: 'lessonId is required' });
            }
            // Fetch lesson content
            const lesson = await prisma.lesson.findUnique({
                where: { id: lessonId },
            });
            if (!lesson) {
                return res.status(404).json({ success: false, message: 'Lesson not found' });
            }
            const lessonContent = await prisma.lessonContent.findUnique({
                where: { lessonId },
            });
            const content = lessonContent?.content || '';
            const lessonRequests = await prisma.lessonRequest.findMany({
                where: { lessonId },
                select: { notes: true },
                take: 1,
                orderBy: { createdAt: 'desc' },
            });
            const description = lessonRequests[0]?.notes || undefined;
            if (!content || content.trim().length < 20) {
                return res.status(400).json({
                    success: false,
                    message: 'No lesson content available to generate hints from. Please write some lesson content first.',
                });
            }
            const hints = await aiService.generateHints({
                lessonContent: content,
                lessonTitle: lesson.title,
                description,
                numHints: Math.min(Math.max(parseInt(numHints) || 3, 1), 5),
            });
            // Log the AI request
            await prisma.aIRequest.create({
                data: {
                    userId: req.user?.userId || 'unknown',
                    prompt: `Generate ${numHints || 3} hints for lesson: ${lesson.title}`,
                    response: JSON.stringify(hints),
                },
            });
            return res.status(200).json({
                success: true,
                data: hints,
                message: `Generated ${hints.length} hints successfully`,
            });
        }
        catch (error) {
            console.error('AI generate hints error:', error.message);
            const statusCode = error.message.includes('not found') ? 404 : 400;
            return res.status(statusCode).json({
                success: false,
                message: error.message || 'Failed to generate hints',
            });
        }
    };
    // Chat with AI
    chat = async (req, res, next) => {
        try {
            const { message, context } = req.body;
            if (!message || typeof message !== 'string' || message.trim().length === 0) {
                return res.status(400).json({ success: false, message: 'message is required' });
            }
            // If context has lessonId, fetch lesson content
            let fullContext = context;
            if (context?.lessonId) {
                const lesson = await prisma.lesson.findUnique({
                    where: { id: context.lessonId },
                });
                if (lesson) {
                    const lessonContent = await prisma.lessonContent.findUnique({
                        where: { lessonId: context.lessonId },
                    });
                    fullContext = {
                        ...context,
                        lessonTitle: lesson.title,
                        lessonContent: lessonContent?.content || '',
                    };
                }
            }
            const result = await aiService.chat({ message, context: fullContext });
            // Log the AI request
            await prisma.aIRequest.create({
                data: {
                    userId: req.user?.userId || 'unknown',
                    prompt: message,
                    response: result.response,
                },
            });
            return res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            console.error('AI chat error:', error.message);
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to chat with AI',
            });
        }
    };
    // Get all conversations for current user
    getConversations = async (req, res) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const conversations = await prisma.conversation.findMany({
                where: { userId },
                include: {
                    messages: {
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                        select: { content: true },
                    },
                    _count: {
                        select: { messages: true },
                    },
                },
                orderBy: { updatedAt: 'desc' },
            });
            const formatted = conversations.map((conv) => ({
                id: conv.id,
                title: conv.title,
                createdAt: conv.createdAt,
                updatedAt: conv.updatedAt,
                messageCount: conv._count.messages,
                lastMessage: conv.messages[0]?.content?.substring(0, 50) || null,
            }));
            return res.status(200).json({ success: true, data: formatted });
        }
        catch (error) {
            console.error('Get conversations error:', error.message);
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to get conversations',
            });
        }
    };
    // Get single conversation with messages
    getConversation = async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            const conversation = await prisma.conversation.findFirst({
                where: { id, userId },
                include: {
                    messages: {
                        orderBy: { createdAt: 'asc' },
                    },
                },
            });
            if (!conversation) {
                return res.status(404).json({ success: false, message: 'Conversation not found' });
            }
            const messages = conversation.messages.map((msg) => ({
                id: msg.id,
                role: msg.role,
                content: msg.content,
                suggestions: msg.suggestions ? JSON.parse(msg.suggestions) : null,
                timestamp: msg.createdAt,
            }));
            return res.status(200).json({
                success: true,
                data: {
                    id: conversation.id,
                    title: conversation.title,
                    createdAt: conversation.createdAt,
                    updatedAt: conversation.updatedAt,
                    messages,
                },
            });
        }
        catch (error) {
            console.error('Get conversation error:', error.message);
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to get conversation',
            });
        }
    };
    // Create new conversation
    createConversation = async (req, res) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const conversation = await prisma.conversation.create({
                data: {
                    userId,
                    title: 'Cuộc trò chuyện mới',
                },
            });
            return res.status(201).json({
                success: true,
                data: {
                    id: conversation.id,
                    title: conversation.title,
                    createdAt: conversation.createdAt,
                    updatedAt: conversation.updatedAt,
                },
            });
        }
        catch (error) {
            console.error('Create conversation error:', error.message);
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to create conversation',
            });
        }
    };
    // Update conversation title
    updateConversation = async (req, res) => {
        try {
            const { id } = req.params;
            const { title } = req.body;
            const userId = req.user?.userId;
            if (!title || typeof title !== 'string') {
                return res.status(400).json({ success: false, message: 'title is required' });
            }
            const conversation = await prisma.conversation.findFirst({
                where: { id, userId },
            });
            if (!conversation) {
                return res.status(404).json({ success: false, message: 'Conversation not found' });
            }
            await prisma.conversation.update({
                where: { id },
                data: { title },
            });
            return res.status(200).json({ success: true, message: 'Conversation updated' });
        }
        catch (error) {
            console.error('Update conversation error:', error.message);
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to update conversation',
            });
        }
    };
    // Delete conversation
    deleteConversation = async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            const conversation = await prisma.conversation.findFirst({
                where: { id, userId },
            });
            if (!conversation) {
                return res.status(404).json({ success: false, message: 'Conversation not found' });
            }
            await prisma.conversation.delete({ where: { id } });
            return res.status(200).json({ success: true, message: 'Conversation deleted' });
        }
        catch (error) {
            console.error('Delete conversation error:', error.message);
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to delete conversation',
            });
        }
    };
    // Send message in conversation (with history context)
    sendMessage = async (req, res) => {
        try {
            const { id } = req.params;
            const { message } = req.body;
            const userId = req.user?.userId;
            if (!message || typeof message !== 'string' || message.trim().length === 0) {
                return res.status(400).json({ success: false, message: 'message is required' });
            }
            // Find conversation and verify ownership
            const conversation = await prisma.conversation.findFirst({
                where: { id, userId },
                include: {
                    messages: {
                        orderBy: { createdAt: 'desc' },
                        take: 20,
                    },
                },
            });
            if (!conversation) {
                return res.status(404).json({ success: false, message: 'Conversation not found' });
            }
            // Create user message
            const userMsg = await prisma.conversationMessage.create({
                data: {
                    conversationId: id,
                    role: 'user',
                    content: message,
                },
            });
            // Update conversation updatedAt
            await prisma.conversation.update({
                where: { id },
                data: { updatedAt: new Date() },
            });
            // Generate AI response with conversation history context
            const historyMessages = conversation.messages
                .reverse()
                .map((m) => ({
                role: m.role,
                parts: m.content,
            }));
            const result = await aiService.chatWithHistory({
                message,
                history: historyMessages,
            });
            // Save AI response
            const assistantMsg = await prisma.conversationMessage.create({
                data: {
                    conversationId: id,
                    role: 'assistant',
                    content: result.response,
                    suggestions: JSON.stringify(result.suggestions || []),
                },
            });
            // Update conversation title from first user message if still default
            if (conversation.title === 'Cuộc trò chuyện mới' && message.trim().length > 0) {
                const newTitle = message.trim().substring(0, 50) + (message.length > 50 ? '...' : '');
                await prisma.conversation.update({
                    where: { id },
                    data: { title: newTitle },
                });
            }
            // Log AI request
            await prisma.aIRequest.create({
                data: {
                    userId: userId || 'unknown',
                    prompt: message,
                    response: result.response,
                },
            });
            return res.status(200).json({
                success: true,
                data: {
                    message: {
                        id: assistantMsg.id,
                        role: 'assistant',
                        content: assistantMsg.content,
                        suggestions: result.suggestions || [],
                        timestamp: assistantMsg.createdAt,
                    },
                },
            });
        }
        catch (error) {
            console.error('Send message error:', error.message);
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to send message',
            });
        }
    };
}
export default new AIController();
//# sourceMappingURL=ai.controller.js.map