// src/services/OpenAIManager.ts

import { OpenAIApi, CreateCompletionRequest } from "openai";

const openai = new OpenAIApi({ apiKey: process.env.OPENAI_API_KEY });

class OpenAIManager {
  static async getOpenAIResponse(systemMessage: string, prompt: string) {
    const request: CreateCompletionRequest = {
      model: "gpt-4-1106-preview",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt },
      ],
    };

    const response = await openai.createCompletion(request);
    return response.data.choices[0].text;
  }

  // ... any other OpenAI related methods
}

export default OpenAIManager;
