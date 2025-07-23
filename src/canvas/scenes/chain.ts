import type { Segment } from '@/types.ts';
import { constrainDistance, drawCircle } from './../helpers.ts';

const length = 25;
const segments: Segment[] = [
  { x: 0, y: 0, size: 30 },
  { x: 0, y: 0, size: 40 },
  { x: 0, y: 0, size: 45 },
  { x: 0, y: 0, size: 50 },
  { x: 0, y: 0, size: 45 },
  { x: 0, y: 0, size: 40 },
  { x: 0, y: 0, size: 35 },
  { x: 0, y: 0, size: 30 },
  { x: 0, y: 0, size: 20 },
  { x: 0, y: 0, size: 15 },
  { x: 0, y: 0, size: 12.5 },
  { x: 0, y: 0, size: 10 },
];

export function draw() {
  drawCircle({
    x: segments[0].x,
    y: segments[0].y,
    radius: length,
    strokeColor: '#FFFFFF',
  });

  for (let i = 1; i < segments.length; i++) {
    const distance = Math.hypot(
      segments[i - 1].x - segments[i].x,
      segments[i - 1].y - segments[i].y
    );

    if (distance > length) {
      segments[i] = {
        ...constrainDistance(segments[i], segments[i - 1], length),
        size: segments[i].size || length,
      };
    }

    drawCircle({
      x: segments[i].x,
      y: segments[i].y,
      radius: segments[i].size || length,
      strokeColor: '#FFFFFF',
    });
  }
}

// TODO revisit mouse handler event
onmousemove = (event: MouseEvent) => {
  segments[0].x = event.clientX;
  segments[0].y = event.clientY;
};
