import type { ConfigState } from '@/types';

export const newtConfig: ConfigState = {
  body: {
    segmentAmount: 25,
    segmentDistance: 20,
    segmentSizes: [],
    maxBend: Math.PI / 12, // 30 degrees
    segmentSizeCurvePoints: [
      { x: 0, y: 220, id: 1 },
      { x: 19, y: 178, id: 2 },
      { x: 41, y: 165, id: 3 },
      { x: 64, y: 213, id: 4 },
      { x: 102, y: 157, id: 5 },
      { x: 160, y: 170, id: 6 },
      { x: 200, y: 247, id: 7 },
      { x: 300, y: 280, id: 8 },
    ],
    fillColor: '#87b690',
  },
  parts: {
    eyes: {
      enabled: true,
      hasPupils: true,
      size: 5,
      segmentIndex: 1,
      segmentOffset: 0.9,
      angle: 0.25,
      color: '#FFFFFF',
    },
    tongue: false,
    fins: [],
    legs: [
      {
        segmentIndex: 8,
        length: 3,
        thickness: 15,
      },

      {
        segmentIndex: 13,
        length: 3,
        thickness: 15,
      },
    ],
  },
  debug: {
    drawAnchors: false,
    drawSegments: false,
    drawAngles: false,
    drawRigidBody: false,
  },
};
