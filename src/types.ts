export interface Point {
  x: number;
  y: number;
}

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
