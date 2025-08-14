import { create } from 'zustand';
import type { LeetCodeData, LeetCodeProblem, LeetCodeSolution } from '@/types/leetcodeTypes';

export interface ApiKeyState {
  apiKey: string;
  modelName: string;
  modelId: string;
  setApiKey: (apiKey: string) => void;
  setModelData: (modelId: string, modelName: string) => void;
  loadFromStorage: () => Promise<void>;
}

interface LeetCodeState {
  data: LeetCodeData | null;
  loading: boolean;
  error: string | null;
  setData: (data: LeetCodeData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
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

export const useLeetCodeStore = create<LeetCodeState>()((set) => ({
  data: null,
  loading: false,
  error: null,
  setData: (data: LeetCodeData) => set({ data }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  clear: () => set({ data: null, loading: false, error: null }),
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