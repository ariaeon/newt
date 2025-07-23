// Wrapper for clearing & recalling
export function drawFrameWrapper(drawfn: () => void, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    return function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawfn();
        requestAnimationFrame(draw);
    };
}