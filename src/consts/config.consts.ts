import type { ConfigState } from '@/types';

export const defaultConfig: ConfigState = {
  shape: {
    segmentAmount: 20,
    segmentDistance: 30,
    segmentSizes: [],
  },
  style: {
    strokeWidth: 2,
    strokeColor: '#00FF00',
    fillBool: true,
    fillColor: '#3f6e22',
  },
  parts: {
    eyes: {
      enabled: true,
      hasPupils: true,
      size: 5,
      segmentIndex: 0,
      segmentOffset: 0.9,
      angle: 0.25, // 90 degrees
      color: '#FFFFFF',
    },
    tongue: true,
    fins: true,
  },
  debug: {
    drawAnchors: false,
    drawSegments: false,
    drawAngles: false,
    drawRigidBody: false,
  },
};

export const ConfigOptions = {
  SEGMENT_AMOUNT_MIN: 5,
  SEGMENT_AMOUNT_MAX: 40,
  SEGMENT_DISTANCE_MIN: 10,
  SEGMENT_DISTANCE_MAX: 40,
};
