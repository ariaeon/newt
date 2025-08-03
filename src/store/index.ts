import { defaultConfig } from '@/consts/config.consts.ts';
import type { ConfigState } from '@/types';
import { create } from 'zustand';

interface ConfigStore {
  config: ConfigState;
  setConfig: (config: Partial<ConfigState>) => void;
  setShape: (shape: Partial<ConfigState['shape']>) => void;
  setStyle: (style: Partial<ConfigState['style']>) => void;
  setParts: (parts: Partial<ConfigState['parts']>) => void;
  setDebug: (debug: Partial<ConfigState['debug']>) => void;
}

export const useConfigStore = create<ConfigStore>((set) => ({
  config: defaultConfig,

  setConfig: (config) =>
    set((state) => ({
      config: { ...state.config, ...config },
    })),

  setShape: (shape) =>
    set((state) => ({
      config: { ...state.config, shape: { ...state.config.shape, ...shape } },
    })),

  setStyle: (style) =>
    set((state) => ({
      config: { ...state.config, style: { ...state.config.style, ...style } },
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
