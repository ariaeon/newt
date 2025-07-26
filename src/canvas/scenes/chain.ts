import type { Point } from '@/types.ts';
import {
  drawCircle,
  drawBodyCurve,
  visualiseDot,
  visualiseAngle,
  visualiseBodyRigid,
} from './../helpers/draw.util';
import {
  calculateSegmentAnchors,
  constrainDistance,
} from './../helpers/math.util.ts';
import { getConfig } from '@/store/utils';
import type { ConfigState } from '@/store/index.ts';

let segments: Point[];

function makeSegments(
  config: ConfigState,
  prevSegments: Point[] = []
): Point[] {
  const { segmentAmount } = config;
  return Array.from({ length: segmentAmount }, (_, i) => ({
    x: prevSegments[i]?.x || 0,
    y: prevSegments[i]?.y || 0,
  }));
}

export function draw() {
  const config = getConfig();
  const leftAnchors: Point[] = [];
  const rightAnchors: Point[] = [];

  if (!segments || segments.length !== config.segmentAmount) {
    segments = makeSegments(config, segments);
  }
  const { segmentDistance, strokeWidth, strokeColor, fillColor, fillBool } =
    config;

  // Stuff for head, to revisit later
  const headAngle = Math.atan2(
    segments[1].y - segments[0].y,
    segments[1].x - segments[0].x
  );
  const { left, right } = calculateSegmentAnchors(
    segments[0],
    config.segmentSizes[0],
    headAngle
  );
  leftAnchors.push(left);
  rightAnchors.push(right);

  drawDebugSegment(segments[0], config.segmentSizes[0], config);
  drawDebugAnchors(left, right, config);

  for (let i = 1; i < segments.length; i++) {
    const dx = segments[i].x - segments[i - 1].x;
    const dy = segments[i].y - segments[i - 1].y;
    const angle = Math.atan2(dy, dx); // radians

    segments[i] = {
      ...segments[i],
      ...constrainDistance(segments[i], segments[i - 1], segmentDistance),
    };

    const { left, right } = calculateSegmentAnchors(
      segments[i],
      config.segmentSizes[i],
      angle
    );
    leftAnchors.push(left);
    rightAnchors.push(right);

    drawDebugAnchors(left, right, config);
    drawDebugSegment(segments[i], config.segmentSizes[i], config);
    drawDebugAngles(segments[i], config.segmentSizes[i], angle, config);
  }

  //DRAW BODY
  const rightReversed = [...rightAnchors].reverse();
  drawBodyCurve({
    points: [...leftAnchors, ...rightReversed],
    k: 1,
    strokeColor,
    strokeWidth,
    fillColor: fillBool ? fillColor : undefined,
  });
  drawDebugBody([...leftAnchors, ...rightReversed], config);
}

export function handleMouseMove(event: MouseEvent) {
  if (segments && segments[0]) {
    segments[0].x = event.clientX;
    segments[0].y = event.clientY;
  }
}

function drawDebugAnchors(left: Point, right: Point, config: ConfigState) {
  if (config.debug.drawAnchors) {
    visualiseDot(left, '#FFFF00', 3);
    visualiseDot(right, '#FFFF00', 3);
  }
}

function drawDebugSegment(segment: Point, size: number, config: ConfigState) {
  if (config.debug.drawSegments) {
    drawCircle({
      x: segment.x,
      y: segment.y,
      radius: size,
      strokeColor: '#FF0000',
      strokeWidth: 1,
    });
  }
}

function drawDebugAngles(
  segment: Point,
  size: number,
  angle: number,
  config: ConfigState
) {
  if (config.debug.drawAngles) {
    visualiseAngle(segment, angle, size, '#00FF00');
  }
}

function drawDebugBody(bodyAnchors: Point[], config: ConfigState) {
  if (config.debug.drawRigidBody) {
    visualiseBodyRigid(bodyAnchors, '#FF0000', 1);
  }
}
