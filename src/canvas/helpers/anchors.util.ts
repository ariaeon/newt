import type { Point } from '@/types';
import { getPointOnSegment } from './math.util';

// Possibly make this also return an array, but less clean typescripty
export const getSideAnchors = (
  segment: Point,
  segmentSize: number,
  angle: number
): { left: Point; right: Point } => {
  const left = getPointOnSegment({
    segment,
    distanceFromCenter: segmentSize,
    segmentAngle: angle,
    offsetAngle: Math.PI / 2,
  });
  const right = getPointOnSegment({
    segment,
    distanceFromCenter: segmentSize,
    segmentAngle: angle,
    offsetAngle: -Math.PI / 2,
  });
  return { left, right };
};

export const getCustomAnchors = (
  segment: Point,
  segmentSize: number,
  angle: number,
  offsets: number[]
): Point[] => {
  return offsets.map((offsetAngle) =>
    getPointOnSegment({
      segment,
      distanceFromCenter: segmentSize,
      segmentAngle: angle,
      offsetAngle,
    })
  );
};
