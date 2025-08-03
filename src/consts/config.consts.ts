import type { ConfigState } from '@/types';

export const snakeConfig: ConfigState = {
  shape: {
    segmentAmount: 20,
    segmentDistance: 30,
    segmentSizes: [],
    segmentSizeCurvePoints: [
      { x: 0, y: 195, id: 1 },
      { x: 25, y: 195, id: 2 },
      { x: 35, y: 230, id: 3 },
      { x: 250, y: 245, id: 4 },
      { x: 300, y: 285, id: 5 },
    ],
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
      angle: 0.25,
      color: '#FFFFFF',
    },
    tongue: true,
    fins: false,
  },
  debug: {
    drawAnchors: false,
    drawSegments: false,
    drawAngles: false,
    drawRigidBody: false,
  },
};

export const fishConfig: ConfigState = {
  shape: {
    segmentAmount: 10,
    segmentDistance: 50,
    segmentSizes: [],
    segmentSizeCurvePoints: [
      { x: 0, y: 100, id: 0 },
      { x: 50, y: 120, id: 1 },
      { x: 100, y: 80, id: 2 },
      { x: 150, y: 90, id: 3 },
      { x: 200, y: 110, id: 4 },
    ],
  },
  style: {
    strokeWidth: 2,
    strokeColor: '#0000FF',
    fillBool: true,
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

export const presets = {
  snake: snakeConfig,
  fish: fishConfig,
};
