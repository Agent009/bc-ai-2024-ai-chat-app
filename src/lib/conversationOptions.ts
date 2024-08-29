import { ConversationOptions } from "@nlux/react";

export const conversationOptions: ConversationOptions = {
  conversationStarters: [
    {
      label: "Random recipe",
      prompt: "Give me a random recipe for an Asian-themed dish.",
    },
    // {
    //   label: "Suggest dish for potatoes and tomatoes",
    //   prompt: "What can I cook with tomatoes, potatoes, onions, spices and oil?",
    // },
    {
      label: "Generate spicy biryani image",
      prompt: "Generate an image for a spicy biryani",
    },
    // {
    //   label: "Improve the following recipe for me...",
    //   prompt: "Recipe for an aloo paratha dish: Wheat flour, Potatoes (boiled and mashed), Green Chilli",
    // },
    {
      label: "Generate audio for recipe",
      prompt:
        "Generate audio for the following recipe: Recipe for an aloo paratha dish: Wheat flour, Potatoes (boiled and mashed), Green Chilli",
    },
  ],
};
