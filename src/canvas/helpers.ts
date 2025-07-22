import { getCtx } from "./canvasContext.ts";

export function drawCircle(x: number, y: number, radius: number, color: string = "#00FF00") {
    const ctx = getCtx();
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}
