import type { Point } from '@/types';

export function constrainDistance(
  point: Point,
  anchor: Point,
  distance: number
): Point {
  const dx = point.x - anchor.x;
  const dy = point.y - anchor.y;
  const len = Math.hypot(dx, dy);
  if (len === 0) return { x: anchor.x, y: anchor.y };
  const scale = distance / len;
  return {
    x: anchor.x + dx * scale,
    y: anchor.y + dy * scale,
  };
}

export const parametricCircle = (
  { x, y }: Point,
  radius: number,
  angle: number
): Point => {
  return {
    x: x + radius * Math.cos(angle),
    y: y + radius * Math.sin(angle),
  };
};

interface GetPointOnSegmentOptions {
  segment: Point;
  distanceFromCenter: number;
  segmentAngle: number;
  offsetAngle: number;
}

// Just a wrapper to make the parametricCircle params more intuitive
export const getPointOnSegment = ({
  segment,
  distanceFromCenter,
  segmentAngle,
  offsetAngle,
}: GetPointOnSegmentOptions): Point => {
  return parametricCircle(
    segment,
    distanceFromCenter,
    segmentAngle + offsetAngle
  );
};

export const angleDifference = (a: number, b: number): number => {
  let diff = a - b;
  while (diff < -Math.PI) diff += Math.PI * 2;
  while (diff > Math.PI) diff -= Math.PI * 2;
  return diff;
};
