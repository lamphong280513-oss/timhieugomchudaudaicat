import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const DEFAULT_MODELS = ['gemini-3-flash-preview', 'gemini-3-pro-preview', 'gemini-2.5-flash'];

const EDUCATION_SKILLS_CONTEXT = `
Dưới đây là các kỹ năng giáo dục hỗ trợ (Skills) bạn có thể gợi ý cho giáo viên/học sinh sau khi phân tích hiện vật:
1. moodle-external-api-development: Tạo bài kiểm tra/quán lý khóa học trên Moodle.
2. pptx-official: Tạo bài giảng PowerPoint tự động từ nội dung giải mã.
3. docx-official: Tạo đề thi, giáo án, phiếu bài tập Word.
4. game-development: Tạo trò chơi 2D/Web/Mobile về di sản này.
5. app-builder: Xây dựng ứng dụng full-stack quản lý di sản.
6. frontend-design: Thiết kế giao diện học tập đẹp mắt.
7. firebase: Lưu trữ dữ liệu học tập thời gian thực.
8. d3-visualization: Trực quan hóa dữ liệu thống kê di sản.
9. browser-extension-builder: Tiện ích trình duyệt hỗ trợ học tập.
10. ai-agents-architect: Chatbot trả lời câu hỏi chuyên sâu.
11. langgraph: Quy trình học tập đa bước phức tạp.
12. clerk-auth / nextjs-supabase-auth: Hệ thống đăng nhập cho lớp học.
14. algorithmic-art: Sáng tạo nghệ thuật thuật toán từ hoa văn di sản.
`;

export async function analyzePattern(imageData: string, modelIndex: number = 0): Promise<string> {
  const apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) throw new Error("Vui lòng cấu hình API Key trong cài đặt.");

  const storedModels = localStorage.getItem('gemini_models');
  const MODELS = storedModels ? JSON.parse(storedModels) : DEFAULT_MODELS;

  const currentModel = MODELS[modelIndex] || MODELS[0];

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: currentModel,
      contents: [
        {
          parts: [
            {
              text: `Bạn là một chuyên gia về gốm Chu Đậu và giáo dục di sản. 
            Hãy thực hiện các bước sau:
            1. Nhận diện hoa văn trong hình ảnh này.
            2. Giải mã chi tiết ý nghĩa biểu tượng, các điển tích lịch sử và thông điệp văn hóa.
            3. Đề xuất ít nhất 3 hoạt động giáo dục sáng tạo sử dụng các Skills sau đây để giúp học sinh hiểu sâu hơn về hiện vật này:
            ${EDUCATION_SKILLS_CONTEXT}
            
            Trả về kết quả bằng tiếng Việt, định dạng Markdown đẹp mắt, chuyên nghiệp.` },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageData.split(',')[1]
              }
            }
          ]
        }
      ],
      config: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      }
    });

    if (!response.text) throw new Error("API returned empty response");
    return response.text;
  } catch (error: any) {
    console.error(`Error with model ${currentModel}:`, error);

    // Fallback logic as requested (retry with next model)
    if (modelIndex < MODELS.length - 1) {
      console.log(`Switching to fallback model: ${MODELS[modelIndex + 1]}`);
      return analyzePattern(imageData, modelIndex + 1);
    }

    // Custom error display as requested
    const apiError = error.message || "Unknown API Error";
    throw new Error(`Đã dừng do lỗi: ${apiError}`);
  }
}

export async function getAudioGuide(text: string): Promise<string> {
  const apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) throw new Error("Vui lòng cấu hình API Key.");

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ parts: [{ text: `Hãy thuyết minh đoạn văn sau một cách truyền cảm, như một hướng dẫn viên bảo tàng chuyên nghiệp: ${text}` }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio ? `data:audio/mp3;base64,${base64Audio}` : "";
  } catch (error) {
    console.error("TTS Error:", error);
    return "";
  }
}
