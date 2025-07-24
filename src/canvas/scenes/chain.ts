import type { Segment, Point } from '@/types.ts';
import { drawCircle, drawBody } from './../helpers/draw.util';
import {
  calculateSegmentAnchors,
  constrainDistance,
} from './../helpers/math.util.ts';
import { getConfig } from '@/store/utils';
import type { ConfigState } from '@/store/index.ts';

let segments: Segment[];

function makeSegments(
  config: ConfigState,
  prevSegments: Segment[] = []
): Segment[] {
  const { segmentLength, segmentSizes } = config;
  return Array.from({ length: segmentLength }, (_, i) => ({
    x: prevSegments[i]?.x || 0,
    y: prevSegments[i]?.y || 0,
    size: segmentSizes[i] || segmentSizes[segmentSizes.length - 1],
  }));
}

export function draw() {
  const config = getConfig();
  const leftAnchors: Point[] = [];
  const rightAnchors: Point[] = [];

  if (!segments || segments.length !== config.segmentLength) {
    segments = makeSegments(config, segments);
  }

  const { segmentDistance, strokeWidth, strokeColor, fillColor, fillBool } =
    config;

  drawCircle({
    x: segments[0].x,
    y: segments[0].y,
    radius: segments[0].size,
    strokeColor,
    fillColor: fillBool ? fillColor : undefined,
    strokeWidth,
  });

  for (let i = 1; i < segments.length; i++) {
    const dx = segments[i].x - segments[i - 1].x;
    const dy = segments[i].y - segments[i - 1].y;
    const angle = Math.atan2(dy, dx); // radians

    segments[i] = {
      ...segments[i],
      ...constrainDistance(segments[i], segments[i - 1], segmentDistance),
    };

    const { left, right } = calculateSegmentAnchors(segments[i], angle);
    leftAnchors.push(left);
    rightAnchors.push(right);

    drawCircle({
      x: segments[i].x,
      y: segments[i].y,
      radius: segments[i].size,
      strokeColor,
      strokeWidth,
      fillColor: fillBool ? fillColor : undefined,
    });
  }

  drawBody(
    [...leftAnchors, ...rightAnchors.reverse()],
    strokeColor,
    strokeWidth
  );
}

export function handleMouseMove(event: MouseEvent) {
  if (segments && segments[0]) {
    segments[0].x = event.clientX;
    segments[0].y = event.clientY;
  }
}
