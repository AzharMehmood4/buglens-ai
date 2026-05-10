export async function POST(req) {
  try {
    const body = await req.json();

    const { code } = body;

    return Response.json({
      success: true,
      message: "BugLens API working",
      receivedCode: code,
      analysis: "AI will be connected in next step"
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    });
  }
}