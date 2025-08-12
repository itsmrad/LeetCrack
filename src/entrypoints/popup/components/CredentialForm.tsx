import React, { useEffect, useState } from "react";
import { ComboboxAI } from "@/components/ui/combobox";
import PasswordInput from "@/components/ui/passwordinput";
import { aiModels } from "@/utils/constants";
import { KeyRoundIcon } from "lucide-react";
import { useApiKeyStore } from "@/store/store";
import {
	saveApiFormData,
	getApiFormData,
	clearApiFormData,
} from "@/utils/apikeyStorage"; // Assuming this is the correct import path
import { Button } from "@/components/ui/button";

export default function CredentialForm() {
	const {
		modelName,
		apiKey,
		modelId,
		setApiKey,
		setModelData,
		loadFromStorage,
	} = useApiKeyStore();

	const [isLoaded, setIsLoaded] = useState(false);

	// Local state for form fields
	const [localApiKey, setLocalApiKey] = useState("");
	const [localModelName, setLocalModelName] = useState("");
	const [localModelId, setLocalModelId] = useState("");

	useEffect(() => {
		loadFromStorage().then(() => setIsLoaded(true));
	}, [loadFromStorage]);

	// If data is loaded and apiKey/modelName/modelId are present, skip setup
	if (isLoaded && apiKey && modelName && modelId) {
		return (
			<div className="flex items-center justify-center p-4 font-sans relative overflow-hidden w-[400px] h-[600px]">
				<Button
					variant="destructive"
          className="cursor-pointer"
					onClick={async () => {
						await clearApiFormData();
						setApiKey("");
						setModelData("", "");
						console.log("API Key reset.");
						window.location.reload(); // Optionally reload to show the form again
					}}>
					Reset API Key
				</Button>
			</div>
		);
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await saveApiFormData({
			apiKey: localApiKey,
			modelName: localModelName,
			modelId: localModelId,
		});
		// Now update the store
		setApiKey(localApiKey);
		setModelData(localModelId, localModelName);
		console.log("API Key and Model Data saved successfully.");
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="flex items-center justify-center p-4 font-sans relative overflow-hidden w-[400px] h-[600px]">
				<div className="p-8 rounded-xl border max-w-md w-full relative z-10 transform transition-all duration-300 hover:border-primary/50">
					<h1 className="text-foreground text-3xl md:text-4xl font-light mb-8 text-center tracking-tight">
						Setup Your api key
					</h1>
					<div className="mb-6 relative">
						<label
							htmlFor="email"
							className="block text-foreground text-sm font-medium">
							Select your api key provider
						</label>
						<div className="text-sm mt-4 mb-4 leading-relaxed">
							<ComboboxAI
								items={aiModels}
								onChange={(item) => {
									setLocalModelId(item.value);
									setLocalModelName(item.label);
								}}
							/>
						</div>
						<div className="relative">
							<PasswordInput
								onChange={(value) => {
									setLocalApiKey(value);
								}}
							/>
							<KeyRoundIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
						</div>
					</div>
					<button
						type="submit"
						className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold text-lg shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-75 transition-all duration-200 active:scale-95 transform hover:scale-105 cursor-pointer"
						aria-label="Set Api Key">
						Set Api Key
					</button>
				</div>
			</div>
		</form>
	);
}
