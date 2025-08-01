import { setCanvas, setCtx } from './canvasContext';
import { drawFrameWrapper } from './drawFrameWrapper';
import { handleMouseMove } from './draw';

export function setup(drawfn: () => void) {
  const canvas: HTMLCanvasElement = document.getElementById(
    'canvas'
  ) as HTMLCanvasElement;
  if (!canvas) {
    console.error('Failed to get canvas element');
    return;
  }
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  canvas.draggable = false;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  if (!ctx) {
    console.error('Failed to get canvas context');
    return;
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  setCtx(ctx);
  setCanvas(canvas);

  canvas.addEventListener('mousedown', (e) => {
    e.preventDefault();
    canvas.addEventListener('mousemove', handleMouseMove);
  });
  canvas.addEventListener('mouseup', (e) => {
    e.preventDefault();
    canvas.removeEventListener('mousemove', handleMouseMove);
  });

  // Starts loop
  drawFrameWrapper(drawfn, canvas, ctx)();
}
