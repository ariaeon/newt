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

export const ConfigOptions = {
  SEGMENT_AMOUNT_MIN: 5,
  SEGMENT_AMOUNT_MAX: 50,
  SEGMENT_DISTANCE_MIN: 10,
  SEGMENT_DISTANCE_MAX: 50,
  SEGMENT_MAX_WIDTH: 'SEGMENT_MAX_WIDTH',
};
