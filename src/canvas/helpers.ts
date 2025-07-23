import { getCtx } from './canvasContext.ts';

interface DrawCircleOptions {
  x: number;
  y: number;
  radius: number;
  strokeColor?: string;
  fillColor?: string;
}

// TODO improve optional arguments? stroekColor OR fillColor should be required
export function drawCircle({
  x,
  y,
  radius,
  strokeColor,
  fillColor,
}: DrawCircleOptions) {
  const ctx = getCtx();
  if (!ctx) return;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
  }
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
  ctx.closePath();
}

export function constrainDistance(
  point: { x: number; y: number },
  anchor: { x: number; y: number },
  distance: number
): { x: number; y: number } {
  const dx = point.x - anchor.x;
  const dy = point.y - anchor.y;
  const len = Math.hypot(dx, dy);
  if (len === 0) return { x: anchor.x, y: anchor.y };
  const scale = distance / len;
  return {
    x: anchor.x + dx * scale,
    y: anchor.y + dy * scale,
  };
}
