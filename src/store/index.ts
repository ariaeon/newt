import { snakeConfig } from '@/consts/config.consts.ts';
import type { ConfigState } from '@/types';
import { create } from 'zustand';

interface ConfigStore {
  config: ConfigState;
  setConfig: (config: Partial<ConfigState>) => void;
  setBody: (body: Partial<ConfigState['body']>) => void;
  setParts: (parts: Partial<ConfigState['parts']>) => void;
  setDebug: (debug: Partial<ConfigState['debug']>) => void;
}

export const useConfigStore = create<ConfigStore>((set) => ({
  config: snakeConfig,

  setConfig: (config) =>
    set((state) => ({
      config: { ...state.config, ...config },
    })),

  setBody: (body) =>
    set((state) => ({
      config: { ...state.config, body: { ...state.config.body, ...body } },
    })),

  setParts: (parts) =>
    set((state) => ({
      config: { ...state.config, parts: { ...state.config.parts, ...parts } },
    })),

  setDebug: (debug) =>
    set((state) => ({
      config: { ...state.config, debug: { ...state.config.debug, ...debug } },
    })),
}));
