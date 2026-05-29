/**
 * AI Service - Gemini API integration for lesson content generation
 */
interface GenerateHintsRequest {
    lessonContent: string;
    lessonTitle: string;
    description?: string;
    numHints?: number;
}
interface GeneratedHint {
    content: string;
    order: number;
    penalty: number;
}
interface ChatRequest {
    message: string;
    context?: {
        lessonId?: string;
        lessonTitle?: string;
        lessonContent?: string;
        minitestId?: string;
        minitestTitle?: string;
    };
}
interface ChatWithHistoryRequest {
    message: string;
    history: Array<{
        role: 'user' | 'model';
        parts: string;
    }>;
}
declare class AIService {
    private readonly GEMINI_API_URL;
    private getApiKey;
    generateHints(request: GenerateHintsRequest): Promise<GeneratedHint[]>;
    chat(request: ChatRequest): Promise<{
        response: string;
        suggestions: string[];
    }>;
    chatWithHistory(request: ChatWithHistoryRequest): Promise<{
        response: string;
        suggestions: string[];
    }>;
    private buildChatPrompt;
    private parseChatResponse;
    private buildHintsPrompt;
    private callGemini;
    private parseHintsResponse;
}
declare const _default: AIService;
export default _default;
//# sourceMappingURL=ai.service.d.ts.map