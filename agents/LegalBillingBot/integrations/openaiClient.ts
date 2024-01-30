export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface Choice {
  message: Message;
}

export interface ChatCompletion {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: Choice[];
}

import OpenAI from "openai";

let openai: OpenAI | null = null;

try {
  openai = new OpenAI();
} catch (error) {
  console.error("Failed to create OpenAI instance:", error);
}

if (!openai) {
  throw new Error("OpenAI instance could not be created");
}

export default openai;
