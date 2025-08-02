import { defaultConfig } from '@/consts/config.consts.ts';
import type { ConfigState } from '@/types';
import { create } from 'zustand';

interface ConfigStore {
  config: ConfigState;
  setConfig: (config: Partial<ConfigState>) => void;
}

export const useConfigStore = create<ConfigStore>((set) => ({
  config: defaultConfig,

  setConfig: (config) =>
    set((state) => ({
      config: { ...state.config, ...config },
    })),
}));
