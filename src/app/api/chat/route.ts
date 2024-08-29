import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import { constants } from "@lib/index";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const result = await streamText({
      model: openai(constants.openAI.models.chat),
      messages: [
        {
          role: "system",
          content:
            "You are a professional chef. You provide detailed cooking instructions, tips, and advice on selecting the best ingredients.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      // async onFinish({ text, toolCalls, toolResults, usage, finishReason }) {
      async onFinish() {
        // implement your own logic here, e.g. for storing messages or recording token usage
      },
    });

    return result.toTextStreamResponse();
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
