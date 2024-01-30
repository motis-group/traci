import { semanticSearch } from "../../../tools/tools/semanticSearch";

interface Task {
  id: string;
  description: string;
  tools: Function[];
}

interface TaskInput {
  prompt: string;
}

const task: Task = {
  id: "answer_specific_question",
  description: "Answer a specific question",
  tools: [],
};

interface ReviewResult {
  success: boolean;
  text: string;
}

const vectorKnowledgeQuestion = async (prompt: string): Promise<ReviewResult> => {
  // Convert the prompt to a vector using LangChain
  const text = await semanticSearch(prompt);
  return { success: true, text };
};

export { vectorKnowledgeQuestion, task, TaskInput };
