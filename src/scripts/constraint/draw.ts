let x = 0; // Track position outside the draw function
const velocity = 2;

export function draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    ctx.beginPath();
    ctx.rect(x, 40, 50, 50);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();

    x += velocity;

    requestAnimationFrame(() => draw(canvas, ctx)); 
}