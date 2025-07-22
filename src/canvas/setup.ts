import { setCtx } from "./canvasContext";


export function setup(drawfn: (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => void) {
    const canvas: HTMLCanvasElement  = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) {
        console.error("Failed to get canvas context");
        return;
    }
    setCtx(ctx);
    drawfn(canvas, ctx);
}