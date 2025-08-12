import { create } from 'zustand';

export interface ApiKeyState {
  apiKey: string;
  modelName: string;
  modelId: string;
  setApiKey: (apiKey: string) => void;
  setModelData: (modelId: string, modelName: string) => void;
  loadFromStorage: () => Promise<void>;
}

export const useApiKeyStore = create<ApiKeyState>()((set, get) => ({
  apiKey: '',
  modelName: '',
  modelId: '',

  setApiKey: (apiKey: string) => set({ apiKey }),
  setModelData: (modelId: string, modelName: string) => {
    set({ modelId, modelName });
  },
  loadFromStorage: async () => {
    const data = await getApiFormData();
    if (data) {
      set({
        apiKey: data.apiKey,
        modelName: data.modelName,
        modelId: data.modelId,
      });
    }
  }
}));

const getApiData = () => (
  useEffect(() => {
    chrome.storage.local.get(['apiFormData'], (result) => {
      if (result.apiFormData) {
        const { apiKey, modelName, modelId } = result.apiFormData;
        useApiKeyStore.setState({ apiKey, modelName, modelId });
      }
    })
  })
)