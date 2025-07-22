import { drawCircle } from './../helpers.ts';

let x = 0; // Track position outside the draw function
const velocity = 2;

export function draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    drawCircle(x + 25, 40 + 25, 25, "#FF0000");

    x += velocity;

    requestAnimationFrame(() => draw(canvas, ctx)); 
}