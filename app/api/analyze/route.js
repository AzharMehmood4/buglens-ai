import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const textInput = formData.get("code") || "";
    const imageFile = formData.get("image");

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ 
        success: false, 
        error: "Missing GEMINI_API_KEY in .env.local" 
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Model 
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash" 
    });

    let promptText = `
You are BugLens AI — a senior full-stack software engineer and expert debugger.

Analyze the error message or screenshot and respond using this exact structure:

**1. Problem**
Short and clear summary of the issue.

**2. Root Cause**
Explain why this error happened.

**3. Solution**
Step-by-step instructions to fix it.

**4. Fixed Code** (if applicable)
\`\`\`js
// Fixed code here
\`\`\`

**5. Prevention Tips**
How to avoid this bug in the future.
`;

    if (textInput) {
      promptText += `\n\nUser Input:\n${textInput}`;
    }

    const contents = [promptText];

    // Handle Image (Screenshot)
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      contents.push({
        inlineData: {
          data: Buffer.from(bytes).toString("base64"),
          mimeType: imageFile.type || "image/png",
        },
      });
    }

    const result = await model.generateContent(contents);
    const response = await result.response;
    const text = response.text();

    return Response.json({
      success: true,
      analysis: text,
    });

  } catch (error) {
    console.error("BugLens API Error:", error);
    return Response.json({
      success: false,
      error: error?.message || "Failed to analyze bug",
    });
  }
}