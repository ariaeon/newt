import type { Point } from '@/types.ts';
import { getCtx } from '../canvasContext.ts';

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
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
  ctx.stroke();
}

export const drawEyes = (
  anchors: Point[],
  radius: number = 10,
  fillColor: string = '#FFFFFF'
) => {
  if (anchors.length === 0) return;
  anchors.forEach((anchor) => {
    drawCircle({
      x: anchor.x,
      y: anchor.y,
      radius,
      fillColor,
    });
  });
};
