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
    const response = await openai.audio.speech.create({
      model: constants.openAI.models.genAudio,
      // @ts-expect-error ignore voice type error for now in the absence of a dedicated type
      voice: constants.openAI.models.genAudioVoice,
      input: finalPrompt.substring(0, Math.min(finalPrompt.length, 1000)),
    });
    console.log("api -> audio -> route -> POST -> response.body", response.body);

    // return new Response(response.body);
    // Return the response as a streaming audio file
    return new Response(response.body, {
      headers: {
        "Content-Type": "audio/mpeg", // or "audio/wav" depending on the response
        "Content-Disposition": "inline; filename=generated-audio.mp3",
      },
    });
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
