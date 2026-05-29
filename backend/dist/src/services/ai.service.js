"use strict";
/**
 * AI Service - Gemini API integration for lesson content generation
 */
Object.defineProperty(exports, "__esModule", { value: true });
class AIService {
    GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
    getApiKey() {
        const key = process.env.GEMINI_API_KEY;
        if (!key) {
            throw new Error('GEMINI_API_KEY is not configured');
        }
        return key;
    }
    async generateHints(request) {
        const { lessonContent, lessonTitle, description, numHints = 3 } = request;
        const prompt = this.buildHintsPrompt(lessonContent, lessonTitle, description, numHints);
        const response = await this.callGemini(prompt);
        return this.parseHintsResponse(response, numHints);
    }
    async chat(request) {
        const { message, context } = request;
        const prompt = this.buildChatPrompt(message, context);
        const response = await this.callGemini(prompt);
        return this.parseChatResponse(response);
    }
    async chatWithHistory(request) {
        const { message, history } = request;
        // Build conversation context from history
        const historySection = history.length > 0
            ? '\nLich su cuoc tro chuyen:\n' + history
                .map((m) => `${m.role === 'user' ? 'Nguoi dung' : 'Tro ly'}: ${m.parts}`)
                .join('\n')
            : '';
        const prompt = `Ban la mot tro ly AI thong minh cua nen tang hoc lap trinh Codefit.
Ho ten: Codey - tro ly AI cua Codefit

Khi nguoi dung hoi ve bai hoc hoac bai tap, hay:
1. Giai thich kha chi tiet, dua ra vi du minh hoa
2. Danh ra cac buoc giai quyet (neu la bai tap)
3. Go y cac goi y huong dan (neu can)

Neu nguoi dung hoi ve chu de chung:
1. Tra loi ngan gon, de hieu
2. Neu can, goi y cac bai hoc lien quan tren Codefit

${historySection}

Tin nhan cua nguoi dung: "${message}"

Dinh dang tra loi (chi tra ve JSON, khong giai thich gi them):
\`\`\`json
{
  "response": "Noi dung tra loi cua ban, co the co nhieu dong neu can. Su dung tieng Viet co dau.",
  "suggestions": ["Goi y 1", "Goi y 2", "Goi y 3"]
}
\`\`\`

Luu y:
- suggestions la 3 cau hoi hoac hanh dong nguoi dung co the chon tiep theo
- Neu cau hoi khong lien quan den lap trinh, van tra loi binh thuong nhung giu tin nhan ngan hon
- Phong cach thân thiện, gần gũi, như một người bạn đồng hành
- Su dung lich su de hieu ngon ngu va phong cach cua nguoi dung
`;
        const response = await this.callGemini(prompt);
        return this.parseChatResponse(response);
    }
    buildChatPrompt(message, context) {
        let contextSection = '';
        if (context?.lessonTitle) {
            contextSection += `\n- Bai hoc hien tai: ${context.lessonTitle}`;
        }
        if (context?.lessonContent) {
            contextSection += `\n- Noi dung bai hoc:\n${context.lessonContent}`;
        }
        if (context?.minitestTitle) {
            contextSection += `\n- Minitest hien tai: ${context.minitestTitle}`;
        }
        return `Ban la mot tro ly AI thong minh cua nen tang hoc lap trinh Codefit.
Ho ten: Codey - tro ly AI cua Codefit

Khi nguoi dung hoi ve bai hoc hoac bai tap, hay:
1. Giai thich kha chi tiet, dua ra vi du minh hoa
2. Danh ra cac buoc giai quyet (neu la bai tap)
3. Go y cac goi y huong dan (neu can)

Neu nguoi dung hoi ve chu de chung:
1. Tra loi ngan gon, de hieu
2. Neu can, goi y cac bai hoc lien quan tren Codefit

${contextSection ? `\nNguyen cuong tro giup (neu co):${contextSection}` : ''}

Tin nhan cua nguoi dung: "${message}"

Dinh dang tra loi (chi tra ve JSON, khong giai thich gi them):
\`\`\`json
{
  "response": "Noi dung tra loi cua ban, co the co nhieu dong neu can. Su dung tieng Viet co dau.",
  "suggestions": ["Goi y 1", "Goi y 2", "Goi y 3"]
}
\`\`\`

Luu y:
- suggestions la 3 cau hoi hoac hanh dong nguoi dung co the chon tiep theo
- Neu cau hoi khong lien quan den lap trinh, van tra loi binh thuong nhung giu tin nhan ngan hon
- Phong cach thân thiện, gần gũi, như một người bạn đồng hành
`;
    }
    parseChatResponse(responseText) {
        const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, responseText.trim()];
        const jsonStr = jsonMatch[1] || responseText.trim();
        try {
            const parsed = JSON.parse(jsonStr);
            return {
                response: parsed.response || 'Xin lỗi, mình chưa hiểu ý bạn. Bạn có thể hỏi lại được không?',
                suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 3) : [],
            };
        }
        catch {
            // If parsing fails, return the raw response as a simple message
            return {
                response: jsonStr.replace(/```json|```/g, '').trim(),
                suggestions: [],
            };
        }
    }
    buildHintsPrompt(content, title, description, numHints) {
        const descSection = description ? `\nMo ta bai hoc: ${description}` : '';
        return `Ban la mot chuyen gia giao duc lap trinh. Hanh dong nhu mot truong pho giao duc (Head of Education).

Nhiem vu: Tao ${numHints} goi y (hints) cho bai hoc lap trinh.

Thong tin bai hoc:
- Tieu de: ${title}
${descSection}
- Noi dung bai hoc:
---
${content}
---

Yeu cau:
1. Tao dung ${numHints} goi y, moi goi y la mot giai thich, goi y hoac dia chi chi tiet de giup hoc sinh giai quyet bai tap.
2. Cac goi y phai xoay quanh noi dung bai hoc va ham tao ra loi giai (khong phai giai phap hoan chinh).
3. Cac goi y phai duoc sap xep theo thu tu tu de den chi tiet (hint 1 la goi y chung nhat, hint cuoi cung la chi tiet nhat).
4. Moi goi y chi nen ngan gon, 1-3 cau.
5. Khong tra loi truc tiep bai tap ma chi danh hoac goi y huong dan.

Dinh dang tra loi (chi tra ve JSON, khong giai thich gi them):
\`\`\`json
{
  "hints": [
    { "content": "Noi dung goi y 1", "order": 1 },
    { "content": "Noi dung goi y 2", "order": 2 },
    { "content": "Noi dung goi y 3", "order": 3 }
  ]
}
\`\`\`
`;
    }
    async callGemini(prompt) {
        const apiKey = this.getApiKey();
        const url = `${this.GEMINI_API_URL}?key=${apiKey}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }],
                    },
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048,
                },
            }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            // Try to parse Gemini error format for cleaner messages
            try {
                const errorData = JSON.parse(errorText);
                const errorMsg = errorData?.error?.message
                    || errorData?.error?.details?.[0]?.description
                    || errorData?.error?.status
                    || `Gemini API error: ${response.status}`;
                throw new Error(errorMsg);
            }
            catch (parseErr) {
                if (parseErr.message.includes('Gemini API')) {
                    throw parseErr;
                }
                throw new Error(`Gemini API error: ${response.status} - ${errorText.substring(0, 200)}`);
            }
        }
        const data = (await response.json());
        if (data.promptFeedback?.blockReason) {
            throw new Error(`Prompt blocked: ${data.promptFeedback.blockReason}`);
        }
        const candidate = data.candidates?.[0];
        if (!candidate || !candidate.content?.parts?.[0]?.text) {
            throw new Error('No response from Gemini API');
        }
        return candidate.content.parts[0].text;
    }
    parseHintsResponse(responseText, expectedCount) {
        // Extract JSON from the response (may be wrapped in markdown)
        const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, responseText.trim()];
        const jsonStr = jsonMatch[1] || responseText.trim();
        let parsed;
        try {
            parsed = JSON.parse(jsonStr);
        }
        catch {
            // Fallback: try to find JSON object in the text
            const objMatch = jsonStr.match(/\{[\s\S]*\}/);
            if (objMatch) {
                try {
                    parsed = JSON.parse(objMatch[0]);
                }
                catch {
                    throw new Error('Failed to parse AI response as JSON');
                }
            }
            else {
                throw new Error('Failed to parse AI response as JSON');
            }
        }
        const hints = parsed.hints || parsed.hint || [];
        if (!Array.isArray(hints) || hints.length === 0) {
            throw new Error('AI response does not contain valid hints');
        }
        return hints.slice(0, expectedCount).map((h, index) => ({
            content: String(h.content || h.text || h.hint || '').trim(),
            order: index + 1,
            // Penalty is intentionally left as 0 here — lecture must manually enter it
            penalty: 0,
        }));
    }
}
exports.default = new AIService();
//# sourceMappingURL=ai.service.js.map