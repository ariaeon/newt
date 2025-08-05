import type { Point } from '@/types';
import { getPointOnSegment } from './math.util';
import type { Segment } from '../draw';

// Possibly make this also return an array, but less clean typescripty
export const getSideAnchors = (
  segment: Segment,
  segmentSize: number
): { left: Point; right: Point } => {
  const left = getPointOnSegment({
    segment,
    distanceFromCenter: segmentSize,
    offsetAngle: Math.PI / 2,
  });
  const right = getPointOnSegment({
    segment,
    distanceFromCenter: segmentSize,
    offsetAngle: -Math.PI / 2,
  });
  return { left, right };
};

export const getCustomAnchors = (
  segment: Segment,
  segmentSize: number,
  offsets: number[]
): Point[] => {
  return offsets.map((offsetAngle) =>
    getPointOnSegment({
      segment,
      distanceFromCenter: segmentSize,
      offsetAngle,
    })
  );
};
