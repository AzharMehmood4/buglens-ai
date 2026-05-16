import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { code } = await req.json();

    // 🔒 Check API key
    if (!process.env.GEMINI_API_KEY) {
      return Response.json({
        success: false,
        error: "Missing GEMINI_API_KEY in .env.local",
      });
    }

    // 🤖 Init Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // ⚠️ FIXED MODEL NAME (important)
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    // 🧠 Prompt
    const prompt = `
You are BugLens AI, a senior software engineer.

Analyze this code/error:

${code}

Return in this format:
1. Problem
2. Root cause
3. Fix
4. Best practices
`;

    // 🚀 Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return Response.json({
      success: true,
      analysis: text,
    });

  } catch (error) {
    console.error("Gemini API Error:", error);

    return Response.json({
      success: false,
      error: error?.message || "Something went wrong",
    });
  }
}