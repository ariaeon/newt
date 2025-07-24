import type { Segment } from '@/types.ts';
import { constrainDistance, drawCircle } from './../helpers.ts';
import { getConfig } from '@/store/utils';

export function createScene() {
  const config = getConfig();
  const {
    segmentDistance,
    segmentLength,
    segmentSizes,
    strokeWidth,
    strokeColor,
    fillColor,
    fillBool,
  } = config;

  const segments: Segment[] = Array.from({ length: segmentLength }, (_, i) => ({
    x: 0,
    y: 0,
    size: segmentSizes[i] || segmentSizes[segmentSizes.length - 1],
  }));

  // TODO revisit mouse handler event, surprised this works
  onmousemove = (event: MouseEvent) => {
    segments[0].x = event.clientX;
    segments[0].y = event.clientY;
  };

  return function draw() {
    drawCircle({
      x: segments[0].x,
      y: segments[0].y,
      radius: segments[0].size,
      strokeColor,
      fillColor: fillBool ? fillColor : undefined,
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
        strokeWidth,
        fillColor: fillBool ? fillColor : undefined,
      });
    }
  };
}
