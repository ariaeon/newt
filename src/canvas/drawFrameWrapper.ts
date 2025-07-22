// Wrapper for clearing & recalling
export function drawFrameWrapper(drawfn: (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => void) {
    return function draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawfn(canvas, ctx);
        requestAnimationFrame(() => draw(canvas, ctx));
    };
}