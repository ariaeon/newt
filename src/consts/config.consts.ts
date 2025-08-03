import type { ConfigState } from '@/types';

export const snakeConfig: ConfigState = {
  body: {
    segmentAmount: 20,
    segmentDistance: 30,
    segmentSizes: [],
    maxBend: Math.PI / 6, // 30 degrees
    segmentSizeCurvePoints: [
      { x: 0, y: 195, id: 1 },
      { x: 25, y: 195, id: 2 },
      { x: 35, y: 230, id: 3 },
      { x: 250, y: 245, id: 4 },
      { x: 300, y: 285, id: 5 },
    ],
    fillColor: '#3f6e22',
  },
  parts: {
    eyes: {
      enabled: true,
      hasPupils: true,
      size: 5,
      segmentIndex: 0,
      segmentOffset: 0.9,
      angle: 0.25,
      color: '#FFFFFF',
    },
    tongue: true,
    fins: {
      enabled: false,
      segmentIndex: 4,
      fillColor: '#3f6e22',
      radiusX: 50,
      radiusY: 20,
      angle: 0.8,
    },
  },
  debug: {
    drawAnchors: false,
    drawSegments: false,
    drawAngles: false,
    drawRigidBody: false,
  },
};

export const fishConfig: ConfigState = {
  body: {
    segmentAmount: 15,
    segmentDistance: 20,
    segmentSizes: [],
    maxBend: Math.PI / 12,
    segmentSizeCurvePoints: [
      { x: 0, y: 200, id: 0 },
      { x: 40, y: 160, id: 1 },
      { x: 100, y: 145, id: 2 },
      { x: 180, y: 190, id: 3 },
      { x: 300, y: 270, id: 4 },
    ],
    fillColor: '#1e90ff',
  },
  parts: {
    eyes: {
      enabled: true,
      hasPupils: false,
      size: 5,
      segmentIndex: 0,
      segmentOffset: 0.9,
      angle: 0.25,
      color: '#FFFFFF',
    },
    tongue: false,
    fins: {
      enabled: true,
      segmentIndex: 4,
      fillColor: '#87CEEB',
      radiusX: 50,
      radiusY: 20,
      angle: 0.8,
    },
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
  SEGMENT_DISTANCE_MIN: 15,
  SEGMENT_DISTANCE_MAX: 40,
  MAX_BEND_MIN: Math.PI / 12, // 15 degrees
  MAX_BEND_MAX: Math.PI / 4, // 45 degrees
};

export const presets = {
  snake: snakeConfig,
  fish: fishConfig,
};
