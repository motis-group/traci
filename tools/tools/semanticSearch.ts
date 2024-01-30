// Write a function to grab data from a vector database

import { ConversationalRetrievalQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import {
  PromptTemplate,
  SystemMessagePromptTemplate,
  AIMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "langchain/prompts";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { SupabaseHybridSearch } from "langchain/retrievers/supabase";
import supabase from "../../integrations/supabase/supabaseClient";
import { sanitizeInput } from "../../utils/sanitizeInput";

// Create a single supabase client for interacting with your database

// personality model

const PROMPT_TEMPLATE = `You are a helpful AI assistant. Your name is Tracy. Given the following conversation and a follow up question, return the conversation history excerpt that includes any relevant context to the question if it exists and rephrase the follow up question to be a standalone question.
Chat History:
{chat_history}
Follow Up Input: {question}
Your answer should follow the following format:
\`\`\`
Use the following pieces of context to answer the users question.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
----------------
<Relevant chat history excerpt as context here>
Standalone question: <Rephrased question here>
\`\`\`
Your answer (including related code snippets if available):`;

let embeddings, vectorStore, fasterModel, slowerModel, chain;

const initResources = async () => {
  if (!embeddings) {
    embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    vectorStore = await SupabaseVectorStore.fromExistingIndex(embeddings, {
      client: supabase,
      tableName: "embeddings",
      queryName: "match_documents",
    });

    fasterModel = new OpenAI({
      modelName: "gpt-3.5-turbo-1106",
      temperature: 0.7,
    });

    slowerModel = new OpenAI({
      modelName: "gpt-4",
      temperature: 0.1,
    });

    const vector = true;

    const retriever = vector
      ? vectorStore.asRetriever()
      : new SupabaseHybridSearch(embeddings, {
          client: supabase,
          similarityK: 2,
          keywordK: 2,
          tableName: "embeddings",
          similarityQueryName: "match_documents",
          keywordQueryName: "kw_match_documents",
        });

    chain = ConversationalRetrievalQAChain.fromLLM(slowerModel, retriever, {
      returnSourceDocuments: true,
      questionGeneratorChainOptions: {
        template: PROMPT_TEMPLATE,
        llm: fasterModel,
      },
    });
  }
};

export const semanticSearch = async (prompt: string) => {
  try {
    await initResources();

    const { sanitizedQuestion, sanitizedHistory } = sanitizeInput({
      question: prompt,
      chat_history: [],
    });

    const res = await chain.call({
      question: sanitizedQuestion,
      chat_history: sanitizedHistory,
    });
    return res.text;
  } catch (error) {
    console.error(error);
  }
};
