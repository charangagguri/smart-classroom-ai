import { NextRequest, NextResponse } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

type ChatBody = {
  messages?: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
};

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.NEXT_LLM_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "NEXT_LLM_API_KEY is missing" },
        { status: 500 }
      );
    }

    const body: ChatBody = await request.json();

    const openai = createOpenAI({
      apiKey: apiKey,
      baseURL:
        "https://generativelanguage.googleapis.com/v1beta/openai/",
    });

    const result = await generateText({
      model: openai("gemini-2.5-flash"),
      messages: body.messages ?? [],
    });

    return NextResponse.json({
      id: `chatcmpl-${Date.now()}`,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: "gemini-2.5-flash",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: result.text,
          },
          finish_reason: "stop",
        },
      ],
    });
  } catch (error) {
    console.error("GEMINI ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown server error",
      },
      { status: 500 }
    );
  }
}