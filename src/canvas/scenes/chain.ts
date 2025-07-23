import { constrainDistance, drawCircle } from "./../helpers.ts";

const length = 25;
const segments = [
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
];

export function draw() {
  drawCircle({
    x: segments[0].x,
    y: segments[0].y,
    radius: length,
    strokeColor: "#FFFFFF",
  });

  for (let i = 1; i < segments.length; i++) {
    const distance = Math.hypot(
      segments[i - 1].x - segments[i].x,
      segments[i - 1].y - segments[i].y
    );

    if (distance > length) {
      segments[i] = constrainDistance(segments[i], segments[i - 1], length);
    }

    drawCircle({
      x: segments[i].x,
      y: segments[i].y,
      radius: length,
      strokeColor: "#FFFFFF",
    });
  }
}

// TODO revisit mouse handler event
onmousemove = (event: MouseEvent) => {
  segments[0].x = event.clientX;
  segments[0].y = event.clientY;
};
