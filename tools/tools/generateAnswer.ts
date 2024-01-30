import openai from "../../integrations/openai/openaiClient";

export async function generateAnswer({ system_prompt, user_prompt, context }) {
    
  let chatHistory = context.chatHistory;
  const user = context.currentUser;
  chatHistory.push({ role: "user", content: user_prompt });

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: system_prompt,
      },
      {
        role: "user",
        content: `Username: ${user.first_name} ${user.last_name}`,
      },
      {
        role: "user",
        content: `Relevant company documentation: ${context.companyDocs}`,
      },
      ...context.chatHistory,
    ],
    model: "gpt-4-1106-preview",
  });

  let text = completion.choices[0].message.content;

  return { success: true, text };
}
