import { create } from 'zustand';

export interface ConfigState {
  segmentLength: number;
  segmentDistance: number;
  segmentSizes: number[];
  strokeWidth: number;
  strokeColor: string;
  fillBool: boolean;
  fillColor: string;
  debug: {
    drawAnchors: boolean;
    drawSegments: boolean;
    drawAngles: boolean;
  };
}

interface ConfigStore {
  config: ConfigState;
  setConfig: (config: Partial<ConfigState>) => void;
}

export const useConfigStore = create<ConfigStore>((set) => ({
  config: {
    segmentLength: 15,
    segmentDistance: 25,
    segmentSizes: [30, 40, 45, 50, 45, 40, 35, 30, 20, 15, 12.5, 10],
    strokeWidth: 2,
    strokeColor: '#FF0000',
    fillBool: false,
    fillColor: '#FFFFFF',
    debug: {
      drawAnchors: true,
      drawSegments: true,
      drawAngles: false,
    },
  },

  setConfig: (config) =>
    set((state) => ({
      config: { ...state.config, ...config },
    })),
}));
