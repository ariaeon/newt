import type { ConfigState } from '@/types';

export const defaultConfig: ConfigState = {
  segmentAmount: 20,
  segmentDistance: 30,
  segmentSizes: [],
  strokeWidth: 2,
  strokeColor: '#00FF00',
  fillBool: true,
  fillColor: '#3f6e22',
  debug: {
    drawAnchors: false,
    drawSegments: false,
    drawAngles: false,
    drawRigidBody: false,
  },
};
