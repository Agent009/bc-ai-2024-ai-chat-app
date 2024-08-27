"use client";
import { AiChat, ChatAdapter, StreamingAdapterObserver } from "@nlux/react";
import "@nlux/themes/nova.css";
import { getApiUrl } from "@lib/api.ts";
import { constants } from "@lib/constants.ts";

export default function Chat() {
  const chatAdapter: ChatAdapter = {
    streamText: async (prompt: string, observer: StreamingAdapterObserver) => {
      const response = await fetch(getApiUrl(constants.routes.api.chat), {
        method: "POST",
        body: JSON.stringify({ prompt: prompt }),
        headers: { "Content-Type": "application/json" },
      });
      if (response.status !== 200) {
        observer.error(new Error("Failed to connect to the server"));
        return;
      }

      if (!response.body) {
        return;
      }

      // Read a stream of server-sent events
      // and feed them to the observer as they are being generated
      const reader = response.body.getReader();
      const textDecoder = new TextDecoder();

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }

        const content = textDecoder.decode(value);
        if (content) {
          observer.next(content);
        }
      }

      observer.complete();
    },
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-3xl items-center justify-between font-mono text-sm lg:flex">
        <AiChat
          adapter={chatAdapter}
          conversationOptions={{
            conversationStarters: [
              {
                label: "Random recipe",
                prompt: "Give me a random recipe for an Asian-themed dish.",
              },
              {
                label: "Suggest dish for potatoes and tomatoes",
                prompt: "What can I cook with tomatoes, potatoes, onions, spices and oil?",
              },
              {
                label: "Improve the following recipe for me...",
                prompt: "Recipe for an aloo paratha dish: Wheat flour, Potatoes (boiled and mashed), Green Chilli",
              },
            ],
          }}
          personaOptions={{
            assistant: {
              name: "Mr. Chef",
              avatar: "https://docs.nlkit.com/nlux/images/personas/harry-botter.png",
              tagline: "Helping you cook the next meme!",
            },
            user: {
              name: "Thingmablob",
              avatar: "https://docs.nlkit.com/nlux/images/personas/alex.png",
            },
          }}
        />
      </div>
    </div>
  );
}
