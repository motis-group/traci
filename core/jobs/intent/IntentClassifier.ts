// Filename: src/core/backgroundJobs/IntentAnalysis/IntentAnalysis.ts

import openai from "../integrations/openai";
import { getMessageHistory } from "../../core/utils/getMessageHistory";

class IntentAnalysis {
  // ... other methods or properties as needed

  // The getIntent function acts as the core for intent analysis
  static async getIntent(currentUser: Object, text: string) {
    const main_intents = [
      {
        intent: "general_text_request",
        patterns: [
          "Anything not met by images or audio",
          "Write me something",
          "Tell me a story",
        ],
      },

      {
        intent: "image_request",
        patterns: [
          "can you send me a picture of you",
          "Send me a picture",
          "Send me a photo",
          "Send me a selfie",
          "Send me a picture of you",
          "Send me a picture of us",
          "Show me your tits",
          "Can you show me a picture?",
          "I want to see a photo",
        ],
      },
      {
        intent: "audio_request",
        patterns: [
          "Send me a voice message",
          "Send me a voice note",
          "Send me a voice memo",
          "Send me a voice clip",
          "Send me a voice recording",
          "Send me a voice",
          "Tell me...",
          "Can you send me an audio?",
          "I want to hear a voice message",
        ],
      },
      {
        intent: "video_request",
        patterns: [
          "Send me a video",
          "Can you show me a video?",
          "I want to see a video",
          "Could you send a video?",
          "I'd like a video",
          "Show me a video clip",
          "Play a video for me",
          "Can I get a video?",
          "I need a video",
          "Let's see a video",
          "Can you play a video?",
        ],
      },
      {
        intent: "explicit_image_request",
        patterns: [
          "Show me your...{insert_explicit_word_here}",
          "Send me a picture of your...",
          "Can you show me a naughty picture?",
          "can you send me a picture of you...",
        ],
      },
      {
        intent: "explicit_audio_request",
        patterns: [
          "Anything asking for sexual or XXX audio",
          "Anything saying Tell me...followed by sexual content",
          "Can you send me a naughty audio?",
        ],
      },
      {
        intent: "explicit_text_request",
        patterns: [
          "Anything to do with describing sexual acts",
          "Write me something naughty",
        ],
      },
      {
        intent: "explicit_video_request",
        patterns: [
          "Anything asking for sexual or XXX video",
          "Can you show me a naughty video?",
        ],
      },
    ];

    const background_intents = [
      {
        intent: "add_context_request",
        patterns: [
          "User gives information about themselves, either hobbies, interests, or other information like family values, favorite foods, etc.",
        ],
      },
      {
        intent: "change_name_request",
        patterns: [
          "User specifically says they want to change their name",
          "Change name",
          "Call me ... from now on",
          "I want to be called ...",
          "My name is...",
          "Anytime a user mentions their name",
          "Be careful that you don't misconstrue a user talking about names in another context. If they're mentioning a friends name or a celebrity name, that's NOT a name change request.",
        ],
      },
      {
        intent: "language_change_request",
        patterns: [
          "Change language",
          "Switch language",
          "Use another language",
        ],
      },
    ];

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
