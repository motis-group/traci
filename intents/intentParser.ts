//  Intent parser is responsible for dynamically loading task names from each agent's task directory, simplifying the process of associating intents with specific agent capabilities.

import fs from "fs";
import path from "path";
import openai from "../integrations/openai/openaiClient";
import { getMessageHistory } from "../../core/utils/getMessageHistory";

class IntentAnalysis {
  static loadTasks(agentDirectory: string) {
    const taskDirectory = path.join(__dirname, agentDirectory);
    const tasks = fs.readdirSync(taskDirectory);
    return tasks;
  }

  static async getIntent(currentUser: Object, text: string) {
    const tasks = this.loadTasks("../agents/tasks");
    const systemMessage = `Your task is to accurately determine user intents for requests involving text, audio, or image content. Analyze the latest message only, using previous messages for context but not for intent analysis. You will receive two lists: 'main_intents' and 'background_intents'. 'Main_intents' outlines the type of response needed (text, image, audio, etc.), while 'background_intents' identifies additional tasks or contextual considerations.

MAIN INTENTS: ${tasks
      .map((i) => `${i.intent}: ${i.patterns.join(", ")}`)
      .join("; ")}.

Respond in JSON format: {"intent": ""}. Avoid including pattern identification details. The goal is to assess intent for an AI chatbot across various contexts, including different content moderation levels.`;

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

    const { main_intent } = JSON.parse(gptResponse.choices[0].message.content);

    return {
      main_intent,
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
