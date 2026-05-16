import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { code } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({
        success: false,
        error: "Missing API key",
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
You are BugLens AI, a senior software engineer.

Analyze this code/error:

${code}

Give:
1. Problem
2. Root cause
3. Fix
4. Best practices
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return Response.json({
      success: true,
      analysis: text,
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}