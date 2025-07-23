let ctx: CanvasRenderingContext2D | null = null;
let canvas: HTMLCanvasElement | null = null;
export function setCanvas(canvasElement: HTMLCanvasElement) {
  canvas = canvasElement;
}
export function getCanvas() {
  return canvas;
}
export function setCtx(context: CanvasRenderingContext2D) {
  ctx = context;
}
export function getCtx() {
  return ctx;
}
