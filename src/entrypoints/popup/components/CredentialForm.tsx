
import { ComboboxAI } from "@/components/ui/combobox";
import PasswordInput from "@/components/ui/passwordinput";
import { aiModels } from "@/utils/constants";
import { KeyRoundIcon } from "lucide-react";
import { useApiKeyStore } from "@/store/store";

export default function CredentialForm () {
  const modelName = useApiKeyStore((state) => state.modelName)
  const apiKey = useApiKeyStore((state) => state.apiKey)
  const modelId = useApiKeyStore((state) => state.modelId)
  const setApiKey = useApiKeyStore((state) => state.setApiKey)
  const setModelData = useApiKeyStore((state) => state.setModelData);

  return (
    <div className="flex items-center justify-center p-4 font-sans relative overflow-hidden w-[400px] h-[600px]">
      <div className="p-8 rounded-xl border max-w-md w-full relative z-10 transform transition-all duration-300 hover:border-primary/50">
        <h1 className="text-foreground text-3xl md:text-4xl font-light mb-8 text-center tracking-tight">
          Setup Your api key
        </h1>

        <div className="mb-6 relative">
          <label
            htmlFor="email"
            className="block text-foreground text-sm font-medium"
          >
            Select your api key provider
          </label>
          <div className="text-sm mt-4 mb-4 leading-relaxed">
            <ComboboxAI 
              items={aiModels}
              onChange={(item) => {
                setModelData(item.value, item.label);
              }}
            />
          </div>
          <div className="relative">
            <PasswordInput 
              onChange={(value) => {
                setApiKey(value);
              }}
            />
            <KeyRoundIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold text-lg shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-75 transition-all duration-200 active:scale-95 transform hover:scale-105 cursor-pointer"
          aria-label="Set Api Key"
        >
          Set Api Key
        </button>
      </div>
    </div>
  );
};
