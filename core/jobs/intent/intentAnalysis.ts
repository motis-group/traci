// Filename: src/core/backgroundJobs/IntentAnalysis/IntentAnalysis.ts

import openai from "../integrations/openai";
import { getMessageHistory } from "../../core/utils/getMessageHistory";

class IntentAnalysis {
  // ... other methods or properties as needed

  // The getIntent function acts as the core for intent analysis
  static async getIntent(
    currentUser: Object,
    main_intents: Array<Object>,
    background_intents: Array<Object>,
    text: string
  ) {
    const systemMessage = `Your task is to accurately determine user intents for requests involving text, audio, or image content. Analyze the latest message only, using previous messages for context but not for intent analysis. You will receive two lists: 'main_intents' and 'background_intents'. 'Main_intents' outlines the type of response needed (text, image, audio, etc.), while 'background_intents' identifies additional tasks or contextual considerations.

MAIN INTENTS: ${main_intents
      .map((i) => `${i.intent}: ${i.patterns.join(", ")}`)
      .join("; ")}.

BACKGROUND INTENTS: ${background_intents
      .map((i) => `${i.intent}: ${i.patterns.join(", ")}`)
      .join("; ")}.

In cases of explicit requests for adult content, classify the intent as 'explicit_' followed by the content type (text, audio, or image) and '_request'. There may be multiple background intents from a user.

Respond in JSON format: {"main_intent": "", "background_intent": [""]}. Avoid including pattern identification details. The goal is to assess intent for an AI chatbot across various contexts, including different content moderation levels.`;

    const messageHistory = await getMessageHistory(currentUser);

    let messages = [
      {
        role: "system",
        content: systemMessage,
      },
      ...messageHistory,
      {
        role: "user",
        content: "Latest message:\n\n" + text,
      },
    ];

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      response_format: { type: "json_object" },
      messages,
    });

    const { main_intent, background_intent } = JSON.parse(
      gptResponse.choices[0].message.content
    );

    return {
      main_intent,
      background_intent,
      originalText: text,
    };
  }

  // Method to dispatch the task based on the intent
  static async dispatchTask(
    intent: string,
    backgroundIntents: string[],
    data: any
  ) {
    // Logic to dispatch the task to the appropriate agent or background job
    // This can involve calling methods on agents or interacting with jobScheduler
    // ...
  }
}

export default IntentAnalysis;
