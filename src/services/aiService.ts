import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";

export async function sendToAIAPI(payload: any) {
	const model = new ChatGoogleGenerativeAI({
		model: "gemini-2.5-flash",
		apiKey: process.env.GEMINI_API_KEY,
	});

	// Compose the prompt using the payload
	const prompt = `Hello, can you give me hints on how to solve the following problem?\n\n${JSON.stringify(
		payload,
		null,
		2
	)}`;

	const messages = [new HumanMessage(prompt)];

	// Send to Gemini and return the response
	const response = await model.invoke(messages);
	return response;
}
