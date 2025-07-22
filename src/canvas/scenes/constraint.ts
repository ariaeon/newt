import { drawFrameWrapper } from '../drawFrameWrapper.ts';
import { constrainDistance, drawCircle } from './../helpers.ts';

const mousePos = { x: 0, y: 0 }; 
let dotPos = { x: 0, y: 0 }; 
const length = 25; 

export function drawContent() {
    drawCircle({
        x: mousePos.x,
        y: mousePos.y, 
        radius: length,
        strokeColor: "#FFFFFF",
    });

    const distance = Math.hypot(mousePos.x - dotPos.x, mousePos.y - dotPos.y);

    if( distance > length) {
        dotPos = constrainDistance(dotPos, mousePos, length);
    }
    
    drawCircle({
        x: dotPos.x,
        y: dotPos.y, 
        radius: 5,
        fillColor: "#FFFFFF",
    });
}

export const draw = drawFrameWrapper(drawContent);

// TODO revisit mouse handler event
onmousemove = (event: MouseEvent) => {
    mousePos.x = event.clientX;
    mousePos.y = event.clientY;
}
