import type { Point } from '@/types.ts';
import { getCtx } from '../canvasContext.ts';

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
  ctx.strokeStyle = color; // Example color for angle line
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.closePath();
}

export function visualiseDot(
  point: { x: number; y: number },
  color: string = '#FF0000'
) {
  const ctx = getCtx();
  if (!ctx) return;
  ctx.beginPath();
  ctx.arc(point.x, point.y, 5, 0, Math.PI * 2, false);

  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

export function drawBody(
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
