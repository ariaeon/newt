import type { Segment } from '@/types.ts';
import { constrainDistance, drawCircle } from './../helpers.ts';
import { getConfig } from '@/store/utils';

const config = getConfig();
const { segmentDistance, segmentLength, segmentSizes, strokeColor } = config;

const segments: Segment[] = Array.from({ length: segmentLength }, (_, i) => ({
  x: 0,
  y: 0,
  size: segmentSizes[i] || segmentSizes[segmentSizes.length - 1],
}));

export function draw() {
  drawCircle({
    x: segments[0].x,
    y: segments[0].y,
    radius: segmentDistance,
    strokeColor,
  });

  for (let i = 1; i < segments.length; i++) {
    const distance = Math.hypot(
      segments[i - 1].x - segments[i].x,
      segments[i - 1].y - segments[i].y
    );

    if (distance > segmentDistance) {
      segments[i] = {
        ...segments[i],
        ...constrainDistance(
          segments[i],
          segments[i - 1],
          config.segmentDistance
        ),
      };
    }

    drawCircle({
      x: segments[i].x,
      y: segments[i].y,
      radius: segments[i].size,
      strokeColor,
    });
  }
}

// TODO revisit mouse handler event
onmousemove = (event: MouseEvent) => {
  segments[0].x = event.clientX;
  segments[0].y = event.clientY;
};
