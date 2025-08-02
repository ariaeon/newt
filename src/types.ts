export interface Point {
  x: number;
  y: number;
}

export interface ConfigState {
  shape: {
    segmentAmount: number;
    segmentDistance: number;
    segmentSizes: number[];
  };
  style: {
    strokeWidth: number;
    strokeColor: string;
    fillBool: boolean;
    fillColor: string;
  };
  parts: {
    eyes: boolean;
    tongue: boolean;
    fins: boolean;
  };
  debug: {
    drawAnchors: boolean;
    drawSegments: boolean;
    drawAngles: boolean;
    drawRigidBody: boolean;
  };
}
