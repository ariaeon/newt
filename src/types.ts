export interface Point {
  x: number;
  y: number;
}

export interface EyesConfig {
  enabled: boolean;
  hasPupils: boolean;
  size: number;
  segmentIndex: number;
  segmentOffset: number;
  angle: number;
  color: string;
}

export interface FinsConfig {
  enabled: boolean;
  radiusX: number;
  radiusY: number;
  segmentIndex: number;
  angle: number;
  fillColor: string;
}

export interface CurveEditorPoint {
  x: number;
  y: number;
  id: number;
}
export interface ConfigState {
  body: {
    segmentAmount: number;
    segmentDistance: number;
    fillColor: string;
    segmentSizes: number[];
    maxBend: number;
    segmentSizeCurvePoints: CurveEditorPoint[];
  };
  parts: {
    eyes: EyesConfig;
    tongue: boolean;
    fins: FinsConfig;
  };
  debug: {
    drawAnchors: boolean;
    drawSegments: boolean;
    drawAngles: boolean;
    drawRigidBody: boolean;
  };
}
