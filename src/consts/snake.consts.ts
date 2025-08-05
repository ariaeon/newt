import type { ConfigState } from '@/types';

export const snakeConfig: ConfigState = {
  body: {
    segmentAmount: 20,
    segmentDistance: 30,
    // TODO get rid of these, calculate from the curve points in the draw?
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
    fins: [],
    legs: [],
  },
  debug: {
    drawAnchors: false,
    drawSegments: false,
    drawAngles: false,
    drawRigidBody: false,
  },
};
