import assert from "assert";
import { PrismaClient } from "../src/generated/prisma/index.js";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { SYSTEM_PROMPT } from "../trackbot/prompts.js";
import { CUSTOM_TOOLS } from "../trackbot/tools.js";

const prisma = new PrismaClient();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not set. Gemini functionality may not work.");
}

const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

function toGeminiMessage(msg) {
  if (!msg || !msg.role) return null;
  if (msg.role === "user") return { role: "user", parts: [{ text: msg.content }] };
  if (msg.role === "assistant") return { role: "model", parts: [{ text: msg.content }] };
  return null;
}

function extractText(response) {
  if (!response) return "";
  try {
    if (typeof response.text === "function") {
      return response.text().trim();
    }
    if (response.candidates?.[0]?.content?.parts) {
      return response.candidates[0].content.parts
        .map((p) => p.text || "")
        .join("")
        .trim();
    }
    if (typeof response === "string") {
      return response.trim();
    }
  } catch (err) {
    console.error("Error extracting Gemini text:", err);
  }
  return "";
}

function buildGeminiTools() {
  return [
    {
      functionDeclarations: Object.entries(CUSTOM_TOOLS).map(([name, tool]) => ({
        name,
        description: tool.description,
        parameters: tool.parameters,
      })),
    },
  ];
}

export async function chatService(chatId, userId, tenantId, userMessage) {
  assert(chatId != null, "Missing chatId");
  assert(userId != null, "Missing userId");
  assert(tenantId != null, "Missing tenantId");
  assert(userMessage != null, "Missing userMessage");

  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is not set. Cannot process chat.");
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_PROMPT,
  });

  const chatRecord = await prisma.chat.findUnique({
    where: {
      chat_id: parseInt(chatId, 10),
      user_id: parseInt(userId, 10),
      tenant_id: tenantId,
    },
    include: { messages: { orderBy: { created_at: "asc" } } },
  });
  if (!chatRecord) {
    throw new Error("Chat not found or unauthorized.");
  }

  const history = chatRecord.messages.map(toGeminiMessage).filter(Boolean);

  const chatSession = model.startChat({
    history,
    safetySettings: SAFETY_SETTINGS,
    tools: buildGeminiTools(),
  });

  // Send initial message
  let result = await chatSession.sendMessage(userMessage);
  let response = await result.response;

  console.log("Initial Gemini response:", JSON.stringify(response, null, 2));

  // Convert existing history into mutable array for iterative updates
  let conversation = [
    ...history,
    { role: "user", parts: [{ text: userMessage }] },
  ];

  let loopCount = 0;
  const MAX_TOOL_CALLS = 5; // safety limit to prevent infinite loops

  // Handle multiple tool calls in sequence
  while (loopCount < MAX_TOOL_CALLS) {
    loopCount++;
    const parts = response?.candidates?.[0]?.content?.parts || [];
    let executedTool = false;

    for (const part of parts) {
      if (part.functionCall) {
        const { name, args } = part.functionCall;
        const tool = CUSTOM_TOOLS[name];
        console.log(`Gemini requested function call [${name}] with args:`, args);

        if (tool) {
          try {
            const resultData = await tool.execute({
              ...args,
              userId: parseInt(userId, 10),
              tenantId,
            });
            console.log(`Result from tool ${name}:`, resultData);

            executedTool = true;

            const function_response_part = {
              name,
              response: { result: resultData },
            };

            // Append model functionCall and user functionResponse
            conversation.push(response.candidates[0].content);
            conversation.push({
              role: "user",
              parts: [{ functionResponse: function_response_part }],
            });

            // Get Gemini’s next response after tool execution
            const followUp = await model.generateContent({
              contents: conversation,
              safetySettings: SAFETY_SETTINGS,
              tools: buildGeminiTools(),
            });
            response = await followUp.response;

            console.log(
              "Follow-up Gemini response after tool execution:",
              JSON.stringify(response, null, 2)
            );
          } catch (err) {
            console.error(`Error executing tool ${name}:`, err);
          }
        }
      }
    }

    // Exit loop if no more tools to call
    if (!executedTool) break;
  }

  const geminiResponseContent = extractText(response);

  await prisma.message.createMany({
    data: [
      { chat_id: parseInt(chatId, 10), role: "user", content: userMessage },
      {
        chat_id: parseInt(chatId, 10),
        role: "assistant",
        content: geminiResponseContent || "(No response)",
      },
    ],
  });

  await prisma.chat.update({
    where: { chat_id: parseInt(chatId, 10) },
    data: { updated_at: new Date() },
  });

  return { content: geminiResponseContent };
}

export async function getChatsService(userId, tenantId) {
  assert(userId != null, "Missing userId");
  assert(tenantId != null, "Missing tenantId");
  return prisma.chat.findMany({
    where: { user_id: parseInt(userId, 10), tenant_id: tenantId },
    orderBy: { updated_at: "desc" },
    include: { messages: { orderBy: { created_at: "asc" } } },
  });
}

export async function createChatService(userId, tenantId, title) {
  assert(userId != null, "Missing userId");
  assert(tenantId != null, "Missing tenantId");
  assert(title != null, "Missing title");
  return prisma.chat.create({
    data: {
      user_id: parseInt(userId, 10),
      tenant_id: tenantId,
      title,
    },
  });
}

export async function deleteChatService(chatId, userId, tenantId) {
  assert(chatId != null, "Missing chatId");
  assert(userId != null, "Missing userId");
  assert(tenantId != null, "Missing tenantId");

  const chat = await prisma.chat.findFirst({
    where: {
      chat_id: parseInt(chatId, 10),
      user_id: parseInt(userId, 10),
      tenant_id: tenantId,
    },
  });
  if (!chat) throw new Error("Chat not found or unauthorized");

  await prisma.chat.delete({ where: { chat_id: parseInt(chatId, 10) } });
  return { success: true, message: "Chat deleted successfully" };
}
