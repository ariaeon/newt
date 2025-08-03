import type { Point } from '@/types.ts';
import {
  drawCircle,
  drawBodyCurve,
  visualiseDot,
  visualiseAngle,
  visualiseBodyRigid,
  drawEyes,
  drawTongue,
} from './helpers/draw.util';
import { getConfig } from '@/store/utils';
import type { ConfigState } from '@/types';
import { getCustomAnchors, getSideAnchors } from './helpers/anchors.util.ts';
import { angleDifference, parametricCircle } from './helpers/math.util.ts';

interface Segment extends Point {
  angle: number;
}

let segments: Segment[];
const MAX_BEND = Math.PI / 6; // 30 degrees, adjust as needed
const TONGUE_LENGTH = 15;

function makeSegments(
  config: ConfigState,
  prevSegments: Segment[] = []
): Segment[] {
  return Array.from({ length: config.shape.segmentAmount }, (_, i) => ({
    x: prevSegments[i]?.x || window.innerWidth / 2,
    y: prevSegments[i]?.y || window.innerHeight / 2,
    angle: prevSegments[i]?.angle || 0,
  }));
}

export function draw() {
  const config = getConfig();
  const leftAnchors: Point[] = [];
  const rightAnchors: Point[] = [];
  const { shape, style, parts } = config;
  const { segmentAmount, segmentSizes, segmentDistance } = shape;
  const { strokeColor, strokeWidth, fillBool, fillColor } = style;
  const { eyes, tongue } = parts;

  if (!segments || segments.length !== segmentAmount) {
    segments = makeSegments(config, segments);
  }

  // This locks the head to the 2nd segment, intially thought it was a bug but it looks better for a snake
  segments[0].angle = Math.atan2(
    segments[1].y - segments[0].y,
    segments[1].x - segments[0].x
  );
  const headAnchors = getCustomAnchors(
    segments[0],
    segmentSizes[0],
    segments[0].angle,
    [Math.PI / 2, Math.PI * 0.75, Math.PI, -Math.PI * 0.75, -Math.PI / 2]
  );
  leftAnchors.push(...headAnchors.reverse());

  drawDebugSegment(segments[0], segmentSizes[0], config);
  headAnchors.forEach((anchor) => {
    drawDebugAnchors(anchor, config);
  });

  for (let i = 1; i < segments.length; i++) {
    const dx = segments[i].x - segments[i - 1].x;
    const dy = segments[i].y - segments[i - 1].y;
    let angle = Math.atan2(dy, dx); // radians

    const prevAngle = segments[i - 1].angle;
    const angleDiff = angleDifference(angle, prevAngle);
    angle = prevAngle + Math.max(-MAX_BEND, Math.min(MAX_BEND, angleDiff));

    const { x, y } = parametricCircle(segments[i - 1], segmentDistance, angle);
    segments[i] = { ...segments[i], x, y, angle };

    // Use the generic one here maybe? less readable
    const { left, right } = getSideAnchors(segments[i], segmentSizes[i], angle);

    leftAnchors.push(left);
    rightAnchors.push(right);

    // Tail anchors
    if (i === segments.length - 1) {
      const tailAnchors = getCustomAnchors(
        segments[i],
        segmentSizes[i],
        angle,
        [0]
      );
      leftAnchors.push(...tailAnchors.reverse());
      drawDebugAnchors(tailAnchors[0], config);
    }

    drawDebugAnchors(left, config);
    drawDebugAnchors(right, config);

    drawDebugSegment(segments[i], segmentSizes[i], config);
    drawDebugAngles(segments[i], segmentSizes[i], angle, config);
  }

  // Tongue
  if (tongue) {
    drawTongue({
      anchor: headAnchors[2],
      angle: segments[0].angle + Math.PI,
      length: TONGUE_LENGTH,
    });
  }

  // Body
  const rightReversed = [...rightAnchors].reverse();
  drawBodyCurve({
    points: [...leftAnchors, ...rightReversed],
    k: 1,
    strokeColor,
    strokeWidth,
    fillColor: fillBool ? fillColor : undefined,
  });
  drawDebugBody([...leftAnchors, ...rightReversed], config);

  // Eyes
  if (eyes && eyes.enabled) {
    const {
      segmentIndex: i,
      segmentOffset: offset,
      angle,
      size,
      hasPupils,
    } = eyes;
    const eyeAnchors = getCustomAnchors(
      segments[i],
      segmentSizes[i] * offset,
      segments[i].angle,
      [Math.PI * angle, -Math.PI * angle]
    );
    drawEyes({
      anchors: eyeAnchors,
      radius: size,
      fillColor: '#FFFFFF',
      hasPupils: hasPupils,
      headAngle: segments[i].angle,
    });
    drawDebugAnchors(eyeAnchors[0], config);
    drawDebugAnchors(eyeAnchors[1], config);
  }
}

export function handleMouseMove(event: MouseEvent) {
  if (segments && segments[0]) {
    const smoothing = 0.1;
    segments[0].x += (event.clientX - segments[0].x) * smoothing;
    segments[0].y += (event.clientY - segments[0].y) * smoothing;
  }
}

function drawDebugAnchors(anchor: Point, config: ConfigState) {
  if (config.debug.drawAnchors) {
    visualiseDot(anchor, '#FFFF00', 3);
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
