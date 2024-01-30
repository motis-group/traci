import reviewLegalDocTool from "../utils/reviewLegalDoc";
import analyzeLegalDocTool from "../utils/analyzeDocType";

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

const reviewLegalDoc = async (
  prompt: string,
  file: File // Assuming File is a defined type
): Promise<ReviewResult> => {
  const { analysisResult: docType } = await analyzeLegalDocTool(file);
  const { analysisResult: text } = await reviewLegalDocTool(file, docType);

  return { success: true, text };
};

export { reviewLegalDoc, task, TaskInput };
