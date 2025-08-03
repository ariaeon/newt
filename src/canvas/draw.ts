import type { Point } from '@/types.ts';
import {
  drawCircle,
  drawBodyCurve,
  visualiseDot,
  visualiseAngle,
  visualiseBodyRigid,
  drawEyes,
  drawTongue,
  drawFins,
} from './helpers/draw.util';
import { getConfig } from '@/store/utils';
import type { ConfigState } from '@/types';
import { getCustomAnchors, getSideAnchors } from './helpers/anchors.util.ts';
import { angleDifference, parametricCircle } from './helpers/math.util.ts';

export interface Segment extends Point {
  angle: number;
  customAnchors?: Point[];
  sideAnchors: {
    left: Point;
    right: Point;
  };
}

let segments: Segment[];
const TONGUE_LENGTH = 15;
const strokeColor = '#F0F0F0';
const strokeWidth = 2;

function makeSegments(
  config: ConfigState,
  prevSegments: Segment[] = []
): Segment[] {
  return Array.from({ length: config.body.segmentAmount }, (_, i) => ({
    x: prevSegments[i]?.x || window.innerWidth / 2,
    y: prevSegments[i]?.y || window.innerHeight / 2,
    angle: prevSegments[i]?.angle || 0,
    sideAnchors: {
      left: { x: 0, y: 0 },
      right: { x: 0, y: 0 },
    },
  }));
}

export function draw() {
  const config = getConfig();
  const { body, parts } = config;
  const { segmentAmount, segmentSizes, segmentDistance, fillColor, maxBend } =
    body;
  const { eyes, tongue, fins } = parts;

  if (!segments || segments.length !== segmentAmount) {
    segments = makeSegments(config, segments);
  }

  // This locks the head to the 2nd segment, intially thought it was a bug but it looks better for a snake
  segments[0].angle = Math.atan2(
    segments[1].y - segments[0].y,
    segments[1].x - segments[0].x
  );
  // Head anchor calculations
  segments[0].customAnchors = getCustomAnchors(
    segments[0],
    segmentSizes[0],
    segments[0].angle,
    [Math.PI * 0.75, Math.PI, -Math.PI * 0.75]
  );
  segments[0].sideAnchors = getSideAnchors(
    segments[0],
    segmentSizes[0],
    segments[0].angle
  );

  drawDebugSegment(segments[0], segmentSizes[0], config);
  segments[0].customAnchors.forEach((anchor) => {
    drawDebugAnchors(anchor, config);
  });

  for (let i = 1; i < segments.length; i++) {
    const dx = segments[i].x - segments[i - 1].x;
    const dy = segments[i].y - segments[i - 1].y;
    let angle = Math.atan2(dy, dx); // radians

    const prevAngle = segments[i - 1].angle;
    const angleDiff = angleDifference(angle, prevAngle);
    angle = prevAngle + Math.max(-maxBend, Math.min(maxBend, angleDiff));

    const { x, y } = parametricCircle(segments[i - 1], segmentDistance, angle);
    segments[i] = { ...segments[i], x, y, angle };

    segments[i].sideAnchors = getSideAnchors(
      segments[i],
      segmentSizes[i],
      angle
    );

    // Tail anchors
    if (i === segments.length - 1) {
      const tailAnchors = getCustomAnchors(
        segments[i],
        segmentSizes[i],
        angle,
        [0]
      );
      segments[i].customAnchors = tailAnchors;
      drawDebugAnchors(tailAnchors[0], config);
    }

    drawDebugAnchors(segments[i].sideAnchors!.left, config);
    drawDebugAnchors(segments[i].sideAnchors!.right, config);

    drawDebugSegment(segments[i], segmentSizes[i], config);
    drawDebugAngles(segments[i], segmentSizes[i], angle, config);
  }

  // Fins
  if (fins.enabled) {
    drawFins({
      segment: segments[fins.segmentIndex],
      fillColor: fins.fillColor,
      strokeColor,
      strokeWidth,
      radiusX: fins.radiusX,
      radiusY: fins.radiusY,
      offsetAngle: fins.angle,
    });
  }

  // Tongue
  if (tongue) {
    drawTongue({
      anchor: segments[0].customAnchors[1],
      angle: segments[0].angle + Math.PI,
      length: TONGUE_LENGTH,
    });
  }

  // Body
  const points: Point[] = [
    ...segments[0].customAnchors.reverse(),
    ...segments.map((seg) => seg.sideAnchors!.left),
    ...(segments[segments.length - 1].customAnchors || []),
    ...segments
      .slice()
      .reverse()
      .map((seg) => seg.sideAnchors!.right),
  ];
  drawBodyCurve({
    points,
    k: 1,
    strokeColor,
    strokeWidth,
    fillColor,
  });
  drawDebugBody(points, config);

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
