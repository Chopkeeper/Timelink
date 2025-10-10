import { User } from '../types';
import { apiGetMyLeaveRequests } from './api'; // Assuming you have an endpoint for user-specific timelogs

// The AI client instance. Typed as `any` to avoid static/type-only imports which are prohibited.
let ai: any = null;
let isInitialized = false;

// Lazily and dynamically initializes the AI client on first use.
const getAiClient = async (): Promise<any> => {
    // Return the cached instance if already initialized
    if (isInitialized) {
        return ai;
    }
    
    // Mark as initialized to prevent this from running again
    isInitialized = true; 

    try {
        // This code attempts to access a Node.js-style environment variable.
        // In a browser, this will throw a ReferenceError, which is caught below.
        const apiKey = process.env.API_KEY;

        if (apiKey) {
            // The @google/genai module is only imported when an API key is available.
            // This prevents the app from crashing on load if the library has top-level
            // code that assumes a Node.js environment.
            const { GoogleGenAI } = await import('@google/genai');
            ai = new GoogleGenAI({ apiKey });
        } else {
            console.warn("Gemini API key not found (process.env.API_KEY is not set). AI Assistant will be disabled.");
            ai = null;
        }
    } catch (error) {
        // This block will execute in browser environments where `process` is not defined.
        console.warn("Could not access 'process.env'. Assuming a browser environment. AI Assistant will be disabled.");
        ai = null;
    }

    return ai;
};


const model = 'gemini-2.5-flash';

const getUserContext = async (currentUser: User) => {
    // Fetch real-time data from the backend
    const userLeaveRequests = await apiGetMyLeaveRequests(); 
    // NOTE: You would also fetch recent time logs here if an endpoint is available.
    // For now, we will omit time logs from the context if they aren't easily fetchable per user.
    
    return {
        userInfo: {
            id: currentUser.id,
            name: currentUser.name,
            department: currentUser.department,
            role: currentUser.role,
        },
        leaveRequests: userLeaveRequests,
        // timeLogs: userTimeLogs.slice(-7), // Fetch last 7 logs for recent context
    };
};

export const runChatWithAi = async (currentUser: User, prompt: string): Promise<string> => {
    const aiClient = await getAiClient();
    
    if (!aiClient) {
        return "ขออภัยค่ะ ขณะนี้ระบบ AI ไม่พร้อมใช้งาน เนื่องจากไม่ได้ตั้งค่า API Key อย่างถูกต้อง";
    }

    const userContext = await getUserContext(currentUser);
    
    const systemInstruction = `You are an expert HR assistant for a company named TimeLink HR. Your name is 'Linky'. You are friendly, professional, and helpful. You must answer questions in Thai language only.
    Your answers must be based ONLY on the JSON context provided about the employee. Do not make up information.
    If the question is outside the scope of HR or the provided data, politely decline to answer by saying "ขออภัยค่ะ Linky ไม่สามารถให้ข้อมูลนอกเหนือจากเรื่องที่เกี่ยวข้องกับ HR ได้ค่ะ".
    When summarizing data, be concise and clear. For example, if asked about leave, list the types and dates. If asked about attendance, summarize check-in/out times.
    Today's date is ${new Date().toLocaleDateString('en-CA')}.
    
    Here is the employee's data in JSON format:
    ${JSON.stringify(userContext, null, 2)}
    `;

    try {
        const response = await aiClient.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        
        return response.text;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "ขออภัยค่ะ เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI กรุณาลองใหม่อีกครั้ง";
    }
};
