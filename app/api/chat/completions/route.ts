import { NextRequest, NextResponse } from "next/server";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type ChatBody = {
  messages?: ChatMessage[];
};

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.NEXT_LLM_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "NEXT_LLM_API_KEY is missing",
        },
        { status: 500 }
      );
    }

    const body: ChatBody = await request.json();

    const messages = body.messages ?? [];

    const systemMessage = messages.find(
      (message) => message.role === "system"
    );

    const conversationMessages = messages.filter(
      (message) => message.role !== "system"
    );

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          systemInstruction: systemMessage
            ? {
                parts: [
                  {
                    text: systemMessage.content,
                  },
                ],
              }
            : undefined,

          contents: conversationMessages.map((message) => ({
            role:
              message.role === "assistant"
                ? "model"
                : "user",

            parts: [
              {
                text: message.content,
              },
            ],
          })),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);

      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            "Gemini API request failed",
        },
        {
          status: response.status,
        }
      );
    }

    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!answer) {
      return NextResponse.json(
        {
          error: "Gemini returned an empty response",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      id: `chatcmpl-${Date.now()}`,

      object: "chat.completion",

      created: Math.floor(Date.now() / 1000),

      model: "gemini-3.6-flash",

      choices: [
        {
          index: 0,

          message: {
            role: "assistant",
            content: answer,
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
      {
        status: 500,
      }
    );
  }
}