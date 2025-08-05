import type { ConfigState } from '@/types';

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
    fins: [
      {
        segmentIndex: 4,
        fillColor: '#87CEEB',
        radiusX: 50,
        radiusY: 20,
        angle: 0.8,
      },
      {
        segmentIndex: 11,
        fillColor: '#87CEEB',
        radiusX: 25,
        radiusY: 10,
        angle: 0.8,
      },
    ],
    legs: [],
  },
  debug: {
    drawAnchors: false,
    drawSegments: false,
    drawAngles: false,
    drawRigidBody: false,
  },
};
