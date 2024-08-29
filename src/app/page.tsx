"use client";
import { AiChat, ChatAdapter, StreamingAdapterObserver } from "@nlux/react";
import "@nlux/themes/nova.css";
import { ChatResponseRenderer } from "@components/ui";
import {
  getApiUrl,
  constants,
  personaOptions,
  conversationOptions,
  getPromptType,
  getPromptEndpoint,
  handleAsStreaming,
} from "@lib/index";

export default function Chat() {
  const chatAdapter: ChatAdapter = {
    // batchText: async (prompt: string, extras: ChatAdapterExtras): Promise<string> => {
    //   const promptType = getPromptType(prompt);
    //   console.log("page -> batchText handler for prompt of type", promptType, "prompt", prompt);
    //
    //   if (!handleAsBatch(promptType)) {
    //     console.log("page -> skipping as prompt type should not be handled as batch");
    //     return "";
    //   }
    //
    //   const apiEndpoint = getPromptEndpoint(promptType);
    //
    //   return fetch(apiEndpoint, {
    //     method: "POST",
    //     body: JSON.stringify({ prompt }),
    //     headers: { "Content-Type": "application/json" },
    //   })
    //     .then((response) => response.json())
    //     .then((json) => json.message);
    // },
    streamText: async (prompt: string, observer: StreamingAdapterObserver) => {
      const promptType = getPromptType(prompt);
      console.log("page -> streamText handler for prompt of type", promptType, "prompt", prompt);

      // if (!handleAsStreaming(promptType)) {
      //   console.log("page -> skipping as prompt type should not be handled as streaming");
      //   observer.next("I can't generate images...");
      //   observer.complete();
      //   return;
      // }

      const apiEndpoint = getPromptEndpoint(promptType);
      const response = await fetch(getApiUrl(apiEndpoint), {
        method: "POST",
        body: JSON.stringify({ prompt: prompt }),
        headers: { "Content-Type": "application/json" },
      });

      if (!handleAsStreaming(promptType)) {
        console.log("page -> handling as BATCH -> response", response);

        if (promptType === constants.openAI.promptTypes.generateImage) {
          const message = await response.json();
          // console.log("page -> BATCH response -> image data", message);
          observer.next("data:image/jpeg;base64," + message + "");
        } else {
          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          // console.log("page -> BATCH response -> audioUrl", audioUrl);
          observer.next("audio:" + audioUrl);
        }

        observer.complete();
        return;
      }

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
          conversationOptions={conversationOptions}
          personaOptions={personaOptions}
          composerOptions={{
            hideStopButton: false,
          }}
          messageOptions={{
            responseRenderer: ChatResponseRenderer,
          }}
        />
      </div>
    </div>
  );
}
