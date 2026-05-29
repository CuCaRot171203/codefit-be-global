/**
 * Controller layer cho module AI
 */
import { Request, Response } from 'express';
declare class AIController {
    generateHints: (req: Request, res: Response, next: Function) => Promise<Response<any, Record<string, any>>>;
    chat: (req: Request, res: Response, next: Function) => Promise<Response<any, Record<string, any>>>;
    getConversations: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getConversation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    createConversation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    updateConversation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    deleteConversation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    sendMessage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
declare const _default: AIController;
export default _default;
//# sourceMappingURL=ai.controller.d.ts.map