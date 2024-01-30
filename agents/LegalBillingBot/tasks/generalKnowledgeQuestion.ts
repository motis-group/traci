import { generateAnswer } from "../../../tools/tools/generateAnswer";
import { BOT_PROMPT } from "../config";

interface Task {
  id: string;
  description: string;
  tools: Function[];
}

interface TaskInput {
  prompt: string;
  file: File;
}

const task: Task = {
  id: "review_legal_doc",
  description: "Review legal document",
  tools: [analyzeLegalDocTool, reviewLegalDocTool],
};

interface ReviewResult {
  success: boolean;
  text: string;
}

const generalKnowledgeQuestion = async (
  prompt: string,
  message_history: Array<Object>,
  file: File // Assuming File is a defined type
): Promise<ReviewResult> => {
  const { text } = await generateAnswer({
    system_prompt: BOT_PROMPT,
    user_prompt: prompt,
    context: {
      chatHistory: message_history,
      currentUser: { first_name: "John", last_name: "Doe" },
      companyDocs:
        "There are no relevant company documents included in this chat.",
    },
  });

  return { success: true, text };
};

export { generalKnowledgeQuestion, task, TaskInput };
