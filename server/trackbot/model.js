import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SYSTEM_PROMPT } from "./prompts.js";
import fs from 'fs'; // Import Node.js file system module

export function buildChatModel(modelProvider = 'gemini') {
  const { GEMINI_API_KEY, OPENROUTER_API_KEY, SITE_URL, SITE_NAME } = process.env;

  if (modelProvider === 'openrouter') {
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not set in environment variables.");
    }

    return new ChatOpenAI({
      apiKey: OPENROUTER_API_KEY,
      model: "deepseek/deepseek-chat-v3.1:free",
      temperature: 0.8,
      streaming: true,
      configuration: {
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
          "HTTP-Referer": SITE_URL || "http://localhost:3000",
          "X-Title": SITE_NAME || "TrackBot",
        },
      },
    }).bind({ system: SYSTEM_PROMPT });
  }

  if (modelProvider === 'gemini') {
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in environment variables.");
    }

    const modelConfig = {
      apiKey: GEMINI_API_KEY,
      model: "gemini-2.0-flash",
      temperature: 0.2,
      streaming: false,
    };

    const result = new ChatGoogleGenerativeAI(modelConfig).bind({ system: SYSTEM_PROMPT });

    // Log the creation and configuration of the Gemini model to log.log
    // This function builds the model instance, it does not generate a chat response.
    // Therefore, "response of the gemini" is interpreted as the configuration
    // used to create the Gemini model instance.
    const logEntry = `[${result}]`;
    fs.appendFileSync('log.log', logEntry);

    // The original console.log("result", result); is replaced by the file write.
    return result;
  }

  throw new Error(`Unsupported model provider: ${modelProvider}. Please choose 'gemini' or 'openrouter'.`);
}
