// Import any necessary libraries here

import openai, {
  ChatCompletion,
} from "../../agents/LegalBillingBot/integrations/openaiClient";

// Knowledge (Upload data to teach LLMs in this tool about a topic)

// Define Inputs (Define what information the user should provide this tool)
interface ToolInputs {
  pdfFile: File; // The PDF file to be analyzed
  context: string; // What is the nature of this document? e.g. Privacy agreement between Relevance AI & users
}

// Tool outputs (Define what information the tool will return to the user)
interface ToolOutputs {
  analysisResult: string; // The result of the legal doc analysis
}

const pdfToText = async (pdfFile: File): Promise<string> => {
  // Extract the data from the PDF file
  const data = await pdfFile.text();

  // Return the parsed data
  return data;
};

const analyzeLegalDoc = async (
  text: string,
  context: string
): Promise<string> => {
  const systemMessage = `"""
${text}
"""

You are a world class legal expert, specialised at reviewing legal documents and spotting potential pitfalls;

Above is the a contract i want you to help me review;

CONTEXT OF THE CONTRACT:

"""
${context}
"""

Please help me review the legal doc and help me list the potential pitfall or abnormal areas that i need to think through as:`;

  try {
    const completion: ChatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
      ],
      model: "gpt-4-1106-preview",
    });
    let result = completion.choices[0]?.message.content;
    return result ?? "No result found";
  } catch (error) {
    console.error(error);
    throw new Error("Failed to analyze legal document");
  }
};

// Define the tool as a function that takes in the inputs and returns the outputs
const tool = async (inputs: ToolInputs): Promise<ToolOutputs> => {
  // Extract the data from the PDF file
  const text = await pdfToText(inputs.pdfFile);
  // Analyze the data
  const analysisResult = await analyzeLegalDoc(text, inputs.context);
  // Return the result

  return { analysisResult };
};

export default tool;
