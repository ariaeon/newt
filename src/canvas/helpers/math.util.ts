import type { Point, Segment } from '@/types';

export function constrainDistance(
  point: { x: number; y: number },
  anchor: { x: number; y: number },
  distance: number
): { x: number; y: number } {
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
  { x, y }: { x: number; y: number },
  radius: number,
  angle: number
): { x: number; y: number } => {
  return {
    x: x + radius * Math.cos(angle),
    y: y + radius * Math.sin(angle),
  };
};

export function calculateSegmentAnchors(
  segment: Segment,
  angle: number
): { left: Point; right: Point } {
  const rx = parametricCircle(segment, segment.size, angle - Math.PI / 2).x;
  const ry = parametricCircle(segment, segment.size, angle - Math.PI / 2).y;
  const lx = parametricCircle(segment, segment.size, angle + Math.PI / 2).x;
  const ly = parametricCircle(segment, segment.size, angle + Math.PI / 2).y;

  const left = { x: lx, y: ly };
  const right = { x: rx, y: ry };
  return { left, right };
}

// export function calculateHeadAnchors(
//   segment: Segment,
//   angle: number
// ): { left: Point; right: Point } {
//   const rx = parametricCircle(segment, segment.size, angle - Math.PI / 2).x;
//   const ry = parametricCircle(segment, segment.size, angle - Math.PI / 2).y;
//   const lx = parametricCircle(segment, segment.size, angle + Math.PI / 2).x;
//   const ly = parametricCircle(segment, segment.size, angle + Math.PI / 2).y;

//   const left = { x: lx, y: ly };
//   const right = { x: rx, y: ry };
//   return { left, right };

// );
