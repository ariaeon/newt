export const drawCircle = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.arc(240, 160, 20, 0, Math.PI * 2, false);
    ctx.fillStyle = "#00FF00";
    ctx.fill();
    ctx.closePath();
}
