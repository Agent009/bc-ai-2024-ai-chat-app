import { NextResponse } from "next/server";
import OpenAI from "openai";
import { constants } from "@lib/index";

// Allow streaming responses up to 30 seconds
export const maxDuration = 90;
// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

const openai = new OpenAI({
  apiKey: constants.openAI.apiKey,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    // const finalPrompt = `Generate an image that describes the following recipe: ${prompt}`;
    const finalPrompt = prompt;
    const response = await openai.images.generate({
      model: constants.openAI.models.genImage,
      prompt: finalPrompt.substring(0, Math.min(finalPrompt.length, 1000)),
      size: "1024x1024",
      quality: "standard",
      response_format: "b64_json",
      n: 1,
    });
    // console.log("api -> images -> route -> POST -> response", response);

    return new Response(JSON.stringify(response.data[0].b64_json));
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      {
        error: "An error occurred while processing your request.",
      },
      { status: 500 },
    );
  }
}
