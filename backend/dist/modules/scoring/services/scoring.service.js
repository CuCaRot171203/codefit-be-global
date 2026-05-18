/**
 * Service layer cho module Scoring
 * Xử lý logic tính điểm cho bài nộp
 */
import prisma from '../../../prisma';
class ScoringService {
    /**
     * Chạy code để preview (không lưu)
     */
    async runCode(lessonId, code, language) {
        // Get lesson content with test cases
        const lessonContent = await prisma.lessonContent.findUnique({
            where: { lessonId },
        });
        if (!lessonContent) {
            throw new Error('Lesson content not found');
        }
        // Parse test cases
        let testCases = [];
        try {
            testCases = JSON.parse(lessonContent.testCases || '[]');
        }
        catch {
            testCases = [];
        }
        // Run code against test cases
        const testResults = await this.runCodeAgainstTestCases(code, language, testCases);
        const passedTests = testResults.filter(r => r.passed).length;
        const publicResults = testResults.filter(r => r.isPublic !== false);
        const hiddenResults = testResults.filter(r => r.isPublic === false);
        const publicPassed = publicResults.filter(r => r.passed).length;
        const hiddenPassed = hiddenResults.filter(r => r.passed).length;
        return {
            passedTests,
            totalTests: testResults.length,
            publicPassedTests: publicPassed,
            publicTotalTests: publicResults.length,
            hiddenPassedTests: hiddenPassed,
            hiddenTotalTests: hiddenResults.length,
            allPassed: passedTests === testResults.length && testResults.length > 0,
            results: testResults.map(r => ({
                testId: r.testId,
                passed: r.passed,
                actualOutput: r.actualOutput,
                input: r.input,
                expectedOutput: r.expectedOutput,
                isPublic: r.isPublic !== false,
            })),
        };
    }
    /**
     * Tính điểm cho một bài nộp
     */
    async calculateScore(lessonId, code, language, hintsUsed = 0, timeUsed = null) {
        // Get lesson content with test cases
        const lessonContent = await prisma.lessonContent.findUnique({
            where: { lessonId },
        });
        if (!lessonContent) {
            throw new Error('Lesson content not found');
        }
        // Get scoring config
        const scoringConfig = await prisma.scoringConfig.findUnique({
            where: { lessonId },
        });
        const config = {
            baseScore: scoringConfig?.baseScore ?? 100,
            penaltyPerHint: scoringConfig?.penaltyPerHint ?? 10,
            timeBonusEnabled: scoringConfig?.timeBonusEnabled ?? false,
            timeBonusThreshold: scoringConfig?.timeBonusThreshold ?? null,
            timeBonusValue: scoringConfig?.timeBonusValue ?? null,
        };
        // Parse test cases
        let testCases = [];
        try {
            testCases = JSON.parse(lessonContent.testCases || '[]');
        }
        catch {
            testCases = [];
        }
        // If no test cases, automatically pass with full score
        if (testCases.length === 0) {
            const noTestResult = {
                baseScore: config.baseScore,
                hintPenalty: config.penaltyPerHint * hintsUsed,
                testCasePenalty: 0,
                timeBonus: 0,
                finalScore: Math.max(0, config.baseScore - (config.penaltyPerHint * hintsUsed)),
                passedTests: 0,
                totalTests: 0,
                hintsUsed,
                timeUsed,
                details: {
                    testResults: [],
                    hintDetails: [],
                },
                isNoTestCase: true,
            };
            return {
                score: noTestResult.finalScore,
                passedTests: 0,
                totalTests: 0,
                publicPassedTests: 0,
                publicTotalTests: 0,
                hiddenPassedTests: 0,
                hiddenTotalTests: 0,
                allPassed: false,
                result: noTestResult,
            };
        }
        // Parse hints
        let hints = [];
        try {
            hints = JSON.parse(lessonContent.hints || '[]');
        }
        catch {
            hints = [];
        }
        // Run code against test cases (simulate)
        const testResults = await this.runCodeAgainstTestCases(code, language, testCases);
        // Calculate score
        const result = this.computeScore(testResults, hints, config, hintsUsed, timeUsed);
        // Calculate public/hidden stats
        const publicResults = testResults.filter(r => r.isPublic);
        const hiddenResults = testResults.filter(r => !r.isPublic);
        const publicPassed = publicResults.filter(r => r.passed).length;
        const hiddenPassed = hiddenResults.filter(r => r.passed).length;
        return {
            score: result.finalScore,
            passedTests: result.passedTests,
            totalTests: result.totalTests,
            publicPassedTests: publicPassed,
            publicTotalTests: publicResults.length,
            hiddenPassedTests: hiddenPassed,
            hiddenTotalTests: hiddenResults.length,
            allPassed: result.passedTests === result.totalTests,
            result,
        };
    }
    /**
     * Chạy code against test cases
     * Hiện tại là simulation - cần tích hợp với Judge0/Code executor thực tế
     */
    async runCodeAgainstTestCases(code, language, testCases) {
        const results = [];
        for (const testCase of testCases) {
            // TODO: Tích hợp với Judge0 hoặc code executor
            // Hiện tại giả lập kết quả
            const simulatedOutput = this.simulateExecution(code, language, testCase.input);
            const passed = simulatedOutput.trim() === testCase.expectedOutput.trim();
            results.push({
                testId: testCase.id || `test-${results.length}`,
                passed,
                actualOutput: simulatedOutput,
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                points: testCase.points || 10,
                earnedPoints: passed ? (testCase.points || 10) : 0,
                isPublic: testCase.isPublic !== false, // Default to public if not specified
            });
        }
        return results;
    }
    /**
     * Simulate code execution
     * Sử dụng Function constructor để execute JavaScript
     * Tự động detect function name và call với input
     */
    simulateExecution(code, language, input) {
        if (language !== 'javascript') {
            // Non-JS languages - return input as placeholder
            return input;
        }
        try {
            // Remove comments from code for parsing
            const cleanCode = code
                .replace(/\/\*[\s\S]*?\*\//g, '') // Remove /* */ comments
                .replace(/\/\/.*$/gm, ''); // Remove // comments
            // Detect all function declarations and expressions in the user code
            // Match: function name(), const name = function(), const name = () =>, const name = function name()
            const functionPatterns = [
                /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, // function name(
                /const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s*)?\(/g, // const name = ( or const name = async (
                /let\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s*)?\(/g, // let name = ( or let name = async (
                /var\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s*)?\(/g, // var name = ( or var name = async (
            ];
            const functionNames = [];
            for (const pattern of functionPatterns) {
                const regex = new RegExp(pattern.source, pattern.flags);
                let match;
                while ((match = regex.exec(cleanCode)) !== null) {
                    functionNames.push(match[1]);
                }
            }
            // Parse input to extract function call or arguments
            // Format: "functionName(arg1, arg2, ...)" OR "arg1, arg2, ..."
            const functionCallMatch = input.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(([\s\S]*)\)$/);
            let calledFuncName;
            let argsStr;
            if (functionCallMatch) {
                // Input format: "functionName(arg1, arg2)"
                [, calledFuncName, argsStr] = functionCallMatch;
            }
            else {
                // Input format: "arg1, arg2, ..." - auto-detect function from user code
                calledFuncName = functionNames[0];
                if (!calledFuncName) {
                    // Try to find any function definition in the code
                    const anyFuncMatch = cleanCode.match(/(?:function|const\s+|let\s+|var\s+)\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*[=(]/);
                    if (anyFuncMatch) {
                        calledFuncName = anyFuncMatch[1];
                    }
                    else {
                        return `ERROR: No function detected in code. Available functions: ${functionNames.join(', ') || 'none'}`;
                    }
                }
                argsStr = input;
            }
            // Check if the called function exists in user code
            const hasFunction = functionNames.includes(calledFuncName);
            if (!hasFunction) {
                return `ERROR: Function '${calledFuncName}' not found. Available functions: ${functionNames.join(', ') || 'none'}`;
            }
            // Parse arguments (handle nested parentheses, strings, etc.)
            const args = this.parseArguments(argsStr);
            // Build execution code
            // Properly serialize arguments for the function call
            const serializedArgs = args.map(a => {
                if (typeof a === 'string') {
                    return JSON.stringify(a);
                }
                else if (typeof a === 'number' || typeof a === 'boolean' || a === null) {
                    return String(a);
                }
                else if (typeof a === 'undefined') {
                    return 'undefined';
                }
                else {
                    return JSON.stringify(a);
                }
            }).join(', ');
            const wrappedCode = `
        ${code}
        return ${calledFuncName}(${serializedArgs});
      `;
            // Create and execute the function
            const fn = new Function(wrappedCode);
            return this.formatResult(fn());
        }
        catch (error) {
            // Return error message for debugging
            return `ERROR: ${error.message}`;
        }
    }
    /**
     * Parse function arguments handling nested parentheses, strings, arrays, objects
     */
    parseArguments(argsStr) {
        const args = [];
        let current = '';
        let depth = 0;
        let inString = false;
        let stringChar = '';
        let inArray = false;
        let arrayDepth = 0;
        let inObject = false;
        let objectDepth = 0;
        for (let i = 0; i < argsStr.length; i++) {
            const char = argsStr[i];
            // Handle string delimiters
            if ((char === '"' || char === "'" || char === '`') && (i === 0 || argsStr[i - 1] !== '\\')) {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                }
                else if (char === stringChar) {
                    inString = false;
                    stringChar = '';
                }
            }
            // Handle brackets
            if (!inString) {
                if (char === '[') {
                    if (inArray)
                        arrayDepth++;
                    inArray = true;
                }
                if (char === ']') {
                    if (arrayDepth > 0)
                        arrayDepth--;
                    else
                        inArray = false;
                }
                if (char === '{') {
                    if (inObject)
                        objectDepth++;
                    inObject = true;
                }
                if (char === '}') {
                    if (objectDepth > 0)
                        objectDepth--;
                    else
                        inObject = false;
                }
                if (char === '(')
                    depth++;
                if (char === ')')
                    depth--;
            }
            // Comma at top level separates arguments
            if (char === ',' && depth === 0 && !inString && !inArray && !inObject) {
                args.push(this.parseValue(current.trim()));
                current = '';
            }
            else {
                current += char;
            }
        }
        // Don't forget the last argument
        if (current.trim()) {
            args.push(this.parseValue(current.trim()));
        }
        return args;
    }
    /**
     * Parse a single argument value
     */
    parseValue(value) {
        if (!value)
            return undefined;
        // Try to parse as JSON first (arrays, objects, strings, numbers, booleans, null)
        try {
            return JSON.parse(value);
        }
        catch {
            // Not valid JSON, check for special values
        }
        // Handle undefined
        if (value === 'undefined')
            return undefined;
        // Handle null
        if (value === 'null')
            return null;
        // Handle booleans
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        // Handle numbers
        const num = Number(value);
        if (!isNaN(num))
            return num;
        // Return as string if nothing else worked
        return value;
    }
    /**
     * Format result for comparison
     */
    formatResult(result) {
        if (result === undefined)
            return 'undefined';
        if (result === null)
            return 'null';
        if (typeof result === 'object')
            return JSON.stringify(result);
        return String(result);
    }
    /**
     * Tính điểm cuối cùng
     */
    computeScore(testResults, hints, config, hintsUsed, timeUsed) {
        const totalTests = testResults.length;
        const passedTests = testResults.filter((r) => r.passed).length;
        // Calculate base score from test results
        const totalPoints = testResults.reduce((sum, r) => sum + r.points, 0);
        const earnedPoints = testResults.reduce((sum, r) => sum + r.earnedPoints, 0);
        const testCaseRatio = totalPoints > 0 ? earnedPoints / totalPoints : 0;
        // Calculate test case penalty (50% weight for failed tests)
        const testCasePenalty = (1 - testCaseRatio) * 0.5;
        const testCaseScore = config.baseScore * (1 - testCasePenalty);
        // Calculate hint penalty
        const hintPenalty = config.penaltyPerHint * hintsUsed;
        const afterHintScore = Math.max(0, testCaseScore - hintPenalty);
        // Calculate time bonus
        let timeBonus = 0;
        if (config.timeBonusEnabled && timeUsed !== null && timeUsed < (config.timeBonusThreshold || Infinity)) {
            timeBonus = config.timeBonusValue || 0;
        }
        // Final score
        const finalScore = Math.max(0, Math.round(afterHintScore + timeBonus));
        return {
            baseScore: config.baseScore,
            hintPenalty,
            testCasePenalty: Math.round(testCasePenalty * 100),
            timeBonus,
            finalScore,
            passedTests,
            totalTests,
            hintsUsed,
            timeUsed,
            details: {
                testResults: testResults.map((r) => ({
                    testId: r.testId,
                    passed: r.passed,
                    input: r.input,
                    expectedOutput: r.expectedOutput,
                    actualOutput: r.actualOutput,
                    points: r.points,
                    earnedPoints: r.earnedPoints,
                })),
                hintDetails: hints.map((h, idx) => ({
                    hintId: h.id || `hint-${idx}`,
                    content: h.content,
                    penalty: h.penalty,
                    used: idx < hintsUsed,
                })),
            },
        };
    }
    /**
     * Lưu kết quả submission
     */
    async saveSubmission(lessonId, userId, code, language, hintsUsed, timeUsed) {
        const { score, passedTests, totalTests, result } = await this.calculateScore(lessonId, code, language, hintsUsed, timeUsed);
        const submission = await prisma.lessonSubmission.create({
            data: {
                lessonId,
                userId,
                code,
                language,
                score,
                passedTests,
                totalTests,
                hintsUsed,
                timeUsed,
                status: 'COMPILED',
                result: JSON.stringify(result),
            },
        });
        return submission;
    }
    /**
     * Lấy lịch sử submissions của user cho một lesson
     */
    async getUserSubmissions(lessonId, userId) {
        return prisma.lessonSubmission.findMany({
            where: { lessonId, userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    /**
     * Lấy chi tiết một submission
     */
    async getSubmissionById(submissionId) {
        const submission = await prisma.lessonSubmission.findUnique({
            where: { id: submissionId },
            include: {
                lesson: {
                    include: {
                        lessonContent: true,
                    },
                },
            },
        });
        if (submission && submission.result) {
            return {
                ...submission,
                parsedResult: JSON.parse(submission.result),
            };
        }
        return submission;
    }
}
export default new ScoringService();
//# sourceMappingURL=scoring.service.js.map