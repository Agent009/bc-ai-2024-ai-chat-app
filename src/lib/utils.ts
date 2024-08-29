import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { constants } from "@lib/index";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the type of prompt being handled.
 * @param prompt
 */
export const getPromptType = (prompt: string): string => {
  const lc = prompt.toLowerCase();
  const generateImage = lc.includes("generate") && lc.includes("image");
  const generateAudio = lc.includes("audio") || lc.includes("speech");
  return generateImage
    ? constants.openAI.promptTypes.generateImage
    : generateAudio
      ? constants.openAI.promptTypes.generateAudio
      : constants.openAI.promptTypes.chat;
};

/**
 * Get the endpoint that will handle this type of prompt.
 * @param promptType
 */
export const getPromptEndpoint = (promptType: string): string => {
  return promptType === constants.openAI.promptTypes.generateImage
    ? constants.routes.api.generateImage
    : promptType === constants.openAI.promptTypes.generateAudio
      ? constants.routes.api.generateAudio
      : constants.routes.api.chat;
};

/**
 * Should this type of prompt be handled as a batch response instead of a streaming one?
 * @param promptType
 */
export const handleAsBatch = (promptType: string): boolean => {
  return promptType !== constants.openAI.promptTypes.chat;
};

/**
 * Should this type of prompt be handled as a streaming response instead of a batch one?
 * @param promptType
 */
export const handleAsStreaming = (promptType: string): boolean => {
  return !handleAsBatch(promptType);
};
