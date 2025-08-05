import type { Point } from '@/types.ts';
import { getCtx } from '../canvasContext.ts';
import { parametricCircle } from './math.util.ts';
import type { Segment } from '../draw.ts';

// Visualse = debug, takes params
// Draw = useful, takes options body

interface DrawCircleOptions {
  x: number;
  y: number;
  radius: number;
  strokeColor?: string;
  strokeWidth?: number;
  fillColor?: string;
}

// TODO improve optional arguments? strokeColor OR fillColor should be required
export function drawCircle({
  x,
  y,
  radius,
  strokeColor,
  strokeWidth = 2,
  fillColor,
}: DrawCircleOptions) {
  const ctx = getCtx();
  if (!ctx) return;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
  ctx.closePath();
}

interface DrawEllipseOptions {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  rotation?: number;
  startAngle?: number;
  endAngle?: number;
  strokeColor?: string;
  strokeWidth?: number;
  fillColor?: string;
}

export function drawEllipse({
  x,
  y,
  radiusX,
  radiusY,
  rotation = 0,
  startAngle = 0,
  endAngle = Math.PI * 2,
  strokeColor = '#FF0000',
  strokeWidth = 1,
  fillColor,
}: DrawEllipseOptions) {
  const ctx = getCtx();
  if (!ctx) return;
  ctx.beginPath();
  ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
  ctx.closePath();
}

interface DrawLineOptions {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  strokeColor?: string;
  strokeWidth?: number;
}

export function drawLine({
  x1,
  y1,
  x2,
  y2,
  strokeColor = '#000000',
  strokeWidth = 1,
}: DrawLineOptions) {
  const ctx = getCtx();
  if (!ctx) return;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.stroke();
  ctx.closePath();
}

interface DrawLineFromAngleOptions {
  anchor: { x: number; y: number };
  angle: number;
  length: number;
  strokeColor?: string;
  strokeWidth?: number;
}

export function drawLineFromAngle({
  anchor,
  angle,
  length,
  strokeColor = '#000000',
  strokeWidth = 1,
}: DrawLineFromAngleOptions) {
  const { x, y } = parametricCircle(anchor, length, angle);
  drawLine({
    x1: anchor.x,
    y1: anchor.y,
    x2: x,
    y2: y,
    strokeColor,
    strokeWidth,
  });
}

export function visualiseAngle(
  segment: { x: number; y: number },
  angle: number,
  length: number,
  color: string = '#FF0000'
) {
  const ctx = getCtx();
  if (!ctx) return;
  const endX = segment.x + length * Math.cos(angle);
  const endY = segment.y + length * Math.sin(angle);
  ctx.beginPath();
  ctx.moveTo(segment.x, segment.y);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.closePath();
}

export function visualiseDot(
  point: { x: number; y: number },
  color: string = '#FFFF00',
  radius: number = 5
) {
  const ctx = getCtx();
  if (!ctx) return;
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2, false);

  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

export function visualiseBodyRigid(
  bodyAnchors: Point[],
  strokeColor: string,
  strokeWidth: number
) {
  const ctx = getCtx();
  if (!ctx || bodyAnchors.length === 0) return;
  ctx.beginPath();
  ctx.moveTo(bodyAnchors[0].x, bodyAnchors[0].y);
  for (let i = 1; i < bodyAnchors.length; i++) {
    ctx.lineTo(bodyAnchors[i].x, bodyAnchors[i].y);
  }
  ctx.closePath();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.stroke();
}

interface DrawBodyCurveOptions {
  points: Point[];
  k: number;
  strokeColor: string;
  strokeWidth: number;
  fillColor?: string;
}

// TODO split the math to math utils
export function drawBodyCurve({
  points,
  k = 1,
  strokeColor = '#00FFF0',
  strokeWidth = 1,
  fillColor,
}: DrawBodyCurveOptions) {
  const ctx = getCtx();
  if (!ctx) return;
  if (!points || points.length < 2) return;

  const size = points.length;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  // For a closed curve, treat the points array as circular
  for (let i = 0; i < size; i++) {
    const p0 = points[(i - 1 + size) % size];
    const p1 = points[i];
    const p2 = points[(i + 1) % size];
    const p3 = points[(i + 2) % size];

    const cp1x = p1.x + ((p2.x - p0.x) / 6) * k;
    const cp1y = p1.y + ((p2.y - p0.y) / 6) * k;

    const cp2x = p2.x - ((p3.x - p1.x) / 6) * k;
    const cp2y = p2.y - ((p3.y - p1.y) / 6) * k;

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
  }
  ctx.closePath();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.stroke();

  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
}

interface BaseEyeOptions {
  anchors: Point[];
  radius?: number;
  fillColor?: string;
}

type DrawEyesOptions =
  | (BaseEyeOptions & { hasPupils?: false })
  | (BaseEyeOptions & {
      hasPupils: true;
      headAngle: number;
    });

export const drawEyes = (options: DrawEyesOptions) => {
  const { anchors, radius = 10, fillColor = '#FFFFFF', hasPupils } = options;
  anchors.forEach((anchor) => {
    drawCircle({
      x: anchor.x,
      y: anchor.y,
      radius,
      fillColor,
    });
  });

  if (hasPupils) {
    const pupilAngle = options.headAngle + Math.PI;
    const scaledTime = performance.now() * 0.005;
    anchors.forEach((anchor) => {
      const angleOffset = Math.sin(scaledTime) / 2; // /2 to make it -0.5 to 0.5

      const { x, y } = parametricCircle(
        anchor,
        radius * 0.5,
        pupilAngle + angleOffset
      );

      drawCircle({
        x,
        y,
        radius: radius * 0.5,
        fillColor: '#000000',
      });
    });
  }
};

interface DrawTongueOptions {
  anchor: Point;
  angle: number;
  length?: number;
  strokeColor?: string;
  strokeWidth?: number;
}

export const drawTongue = ({
  anchor,
  length = 15,
  angle,
  strokeColor = '#FF0000',
  strokeWidth = 2,
}: DrawTongueOptions) => {
  const ctx = getCtx();
  if (!ctx) return;

  drawLineFromAngle({
    anchor,
    angle,
    length,
    strokeColor,
    strokeWidth,
  });

  const forkAngles = [Math.PI * 0.15, -Math.PI * 0.15];
  const { x, y } = parametricCircle(anchor, length, angle);
  for (const fork of forkAngles) {
    drawLineFromAngle({
      anchor: { x, y },
      angle: angle + fork,
      length: length * 0.5,
      strokeColor,
      strokeWidth,
    });
  }
};

interface DrawFinsOptions {
  segment: Segment;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  radiusX?: number;
  radiusY?: number;
  offsetAngle?: number;
}

export const drawFins = ({
  segment,
  fillColor = '#FF0000',
  strokeColor = '#FF0000',
  strokeWidth = 2,
  radiusX = 50,
  radiusY = 20,
  offsetAngle = 0.2,
}: DrawFinsOptions) => {
  const ctx = getCtx();
  if (!ctx) return;

  const { left, right } = segment.sideAnchors!;

  drawEllipse({
    ...left,
    radiusX,
    radiusY,
    strokeColor,
    strokeWidth,
    rotation: segment.angle + offsetAngle,
    fillColor,
  });

  drawEllipse({
    ...right,
    radiusX,
    radiusY,
    strokeColor,
    strokeWidth,
    rotation: segment.angle - offsetAngle,
    fillColor,
  });
};

interface DrawLegsOptions {
  segment: Segment;
  radius?: number;
  strokeColor?: string;
  strokeWidth?: number;
}

export const drawLegs = ({
  segment,
  radius = 20,
  strokeColor = '#FF0000',
  strokeWidth = 2,
}: DrawLegsOptions) => {
  const ctx = getCtx();
  if (!ctx) return;

  const { left, right } = segment.sideAnchors!;

  drawCircle({
    x: left.x,
    y: left.y,
    radius,
    strokeColor,
    strokeWidth,
  });
  drawCircle({
    x: right.x,
    y: right.y,
    radius,
    strokeColor,
    strokeWidth,
  });
};
