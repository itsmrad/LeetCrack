import { storage } from "#imports";

export const API_FORM_KEY = "apiFormData";

export interface ApiFormData {
	apiKey: string;
	modelName: string;
	modelId: string;
}

export async function saveApiFormData(data: ApiFormData): Promise<void> {
	try {
		await storage.setItem(`local:${API_FORM_KEY}`, data);
		console.log("Saved apiFormData to local storage:", data);
	} catch (err) {
		console.error("Failed to save apiFormData:", err);
		throw err;
	}
}

export async function getApiFormData(): Promise<ApiFormData | null> {
	try {
		const data = await storage.getItem<ApiFormData>(`local:${API_FORM_KEY}`);
		console.log("Loaded apiFormData from local storage:", data);
		return data ?? null;
	} catch (err) {
		console.error("Failed to load apiFormData:", err);
		return null;
	}
}

export async function clearApiFormData(): Promise<void> {
	try {
		await storage.removeItem(`local:${API_FORM_KEY}`);
		console.log("Cleared apiFormData from local storage");
	} catch (err) {
		console.error("Failed to clear apiFormData:", err);
		throw err;
	}
}
