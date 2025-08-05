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
  // drawLegs,
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
const legSegments: { left: Segment[]; right: Segment[] }[] = [];
const TONGUE_LENGTH = 15;
const strokeColor = '#F0F0F0';
const strokeWidth = 2;

function createSegment(x: number, y: number, angle: number): Segment {
  return {
    x,
    y,
    angle,
    sideAnchors: {
      left: { x: 0, y: 0 },
      right: { x: 0, y: 0 },
    },
  };
}

function makeSegmentsIfNeeded(
  config: ConfigState,
  prevSegments: Segment[] = []
) {
  if (!segments || segments.length !== config.body.segmentAmount) {
    segments = [];
    for (let i = 0; i < config.body.segmentAmount; i++) {
      segments.push(
        prevSegments[i] ||
          createSegment(window.innerWidth / 2, window.innerHeight / 2, 0)
      );
    }
  }
}

function makeLegsIfNeeded(config: ConfigState, segments: Segment[]) {
  config.parts.legs.forEach((leg, legIndex) => {
    if (segments[leg.segmentIndex]) {
      const { left: anchorLeft, right: anchorRight } =
        segments[leg.segmentIndex].sideAnchors;

      if (
        !legSegments[legIndex] ||
        legSegments[legIndex].left.length !== leg.length ||
        legSegments[legIndex].right.length !== leg.length
      ) {
        legSegments[legIndex] = {
          left: [],
          right: [],
        };

        for (let i = 0; i < leg.length; i++) {
          legSegments[legIndex].left[i] = createSegment(
            anchorLeft.x,
            anchorLeft.y,
            0
          );
        }

        for (let i = 0; i < leg.length; i++) {
          legSegments[legIndex].right[i] = createSegment(
            anchorRight.x,
            anchorRight.y,
            0
          );
        }
      }
    }
  });
}

function updateLegChain(legSegments: Segment[], segmentDistance: number) {
  for (let i = 1; i < legSegments.length; i++) {
    const prev = legSegments[i - 1];
    const current = legSegments[i];

    const dx = current.x - prev.x;
    const dy = current.y - prev.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > segmentDistance) {
      const ratio = segmentDistance / distance;
      current.x = prev.x + dx * ratio;
      current.y = prev.y + dy * ratio;
    }
  }
}

export function draw() {
  const config = getConfig();
  const { body, parts } = config;
  const { segmentSizes, segmentDistance, fillColor, maxBend } = body;
  const { eyes, tongue, fins } = parts;

  makeSegmentsIfNeeded(config, segments);
  makeLegsIfNeeded(config, segments);

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
  fins.forEach((fin) => {
    if (segments[fin.segmentIndex]) {
      drawFins({
        segment: segments[fin.segmentIndex],
        fillColor: fin.fillColor,
        strokeColor,
        strokeWidth,
        radiusX: fin.radiusX,
        radiusY: fin.radiusY,
        offsetAngle: fin.angle,
      });
    }
  });

  // Legs
  if (config.parts.legs.length > 0) {
    parts.legs.forEach((leg, legIndex) => {
      if (segments[leg.segmentIndex] && legSegments[legIndex]) {
        const currentLegPair = legSegments[legIndex];
        const anchorPoints = segments[leg.segmentIndex].sideAnchors;

        // Move first leg segments
        const { left, right } = anchorPoints;
        currentLegPair.left[0] = { ...currentLegPair.left[0], ...left };
        currentLegPair.right[0] = { ...currentLegPair.right[0], ...right };

        // Update chains for both left and right legs
        const segmentDistance = leg.thickness;
        updateLegChain(legSegments[legIndex].left, segmentDistance);
        updateLegChain(legSegments[legIndex].right, segmentDistance);

        // Draw left leg segments
        legSegments[legIndex].left.forEach((legSegment) => {
          drawCircle({
            x: legSegment.x,
            y: legSegment.y,
            radius: leg.thickness,
            strokeColor: '#FFFFFF',
            fillColor: leg.fillcolor,
          });
        });

        // Draw right leg segments
        legSegments[legIndex].right.forEach((legSegment) => {
          drawCircle({
            x: legSegment.x,
            y: legSegment.y,
            radius: leg.thickness,
            strokeColor: '#FFFFFF',
            fillColor: leg.fillcolor,
          });
        });
      }
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
