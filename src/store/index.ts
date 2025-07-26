import { create } from 'zustand';

export interface ConfigState {
  segmentAmount: number;
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
    drawRigidBody: boolean;
  };
}

interface ConfigStore {
  config: ConfigState;
  setConfig: (config: Partial<ConfigState>) => void;
}

export const useConfigStore = create<ConfigStore>((set) => ({
  config: {
    segmentAmount: 20,
    segmentDistance: 30,
    segmentSizes: [],
    strokeWidth: 2,
    strokeColor: '#00FFFF',
    fillBool: false,
    fillColor: '#FFFFFF',
    debug: {
      drawAnchors: true,
      drawSegments: true,
      drawAngles: true,
      drawRigidBody: false,
    },
  },

  setConfig: (config) =>
    set((state) => ({
      config: { ...state.config, ...config },
    })),
}));
