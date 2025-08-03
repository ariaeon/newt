export interface Point {
  x: number;
  y: number;
}

export interface EyeConfig {
  enabled: boolean;
  hasPupils: boolean;
  size: number;
  segmentIndex: number;
  segmentOffset: number;
  angle: number;
  color: string;
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
    eyes: EyeConfig;
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
