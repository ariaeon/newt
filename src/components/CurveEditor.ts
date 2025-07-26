//This curve editor is largely vibe coded, i take no credit for how good or bad it is

type Point = { x: number; y: number; id: number };

export class CurveEditor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private points: Point[] = [
    { x: 0, y: 20, id: 1 },
    { x: 300, y: 180, id: 2 },
  ];
  private dragId: number | null = null;
  private nextId: number = 3;
  private onPointsChange?: (points: Point[]) => void;

  constructor(
    canvas: HTMLCanvasElement,
    onPointsChange?: (points: Point[]) => void
  ) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No 2D context');
    this.ctx = ctx;
    this.onPointsChange = onPointsChange;
    this.draw();
    this.attachEvents();
  }

  public getPoints() {
    // Return points without id for external use
    return this.points.map(({ x, y, id }) => ({ x, y, id }));
  }

  public setPoints(points: { x: number; y: number }[]) {
    // Assign new ids to all points
    this.points = points.map((pt) => ({ ...pt, id: this.nextId++ }));
    this.points.sort((a, b) => a.x - b.x);
    // Enforce first and last x positions
    if (this.points.length > 1) {
      this.points[0].x = 0;
      this.points[this.points.length - 1].x = this.canvas.width;
    }
    this.draw();
    this.onPointsChange?.(this.getPoints());
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Draw smooth curve (Catmull-Rom spline)
    if (this.points.length > 1) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.points[0].x, this.points[0].y);
      for (let i = 0; i < this.points.length - 1; i++) {
        const p0 = this.points[i - 1] || this.points[i];
        const p1 = this.points[i];
        const p2 = this.points[i + 1];
        const p3 = this.points[i + 2] || p2;
        for (let t = 0; t < 1; t += 0.05) {
          const tt = t * t;
          const ttt = tt * t;
          const x =
            0.5 *
            (2 * p1.x +
              (-p0.x + p2.x) * t +
              (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * tt +
              (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * ttt);
          const y =
            0.5 *
            (2 * p1.y +
              (-p0.y + p2.y) * t +
              (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * tt +
              (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * ttt);
          this.ctx.lineTo(x, y);
        }
      }
      this.ctx.strokeStyle = '#0070f3';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }
    // Draw points
    this.ctx.fillStyle = '#FF0000';
    this.points.forEach((pt) => {
      this.ctx.beginPath();
      this.ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  private getCanvasCoords(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  private hitRadius = 12; // Increased hitbox radius

  private getPointAt(x: number, y: number) {
    return (
      this.points.find(
        (pt) =>
          (pt.x - x) ** 2 + (pt.y - y) ** 2 <= this.hitRadius * this.hitRadius
      )?.id ?? null
    );
  }

  private attachEvents() {
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mousemove', this.handleMouseHover);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  }
  // Change cursor when hovering over a point
  private handleMouseHover = (e: MouseEvent) => {
    const { x, y } = this.getCanvasCoords(e);
    const id = this.getPointAt(x, y);
    this.canvas.style.cursor = id !== null ? 'pointer' : 'default';
  };

  private handleMouseDown = (e: MouseEvent) => {
    const { x, y } = this.getCanvasCoords(e);
    const id = this.getPointAt(x, y);
    if (id !== null) {
      this.dragId = id;
    } else {
      this.points.push({ x, y, id: this.nextId++ });
      this.points.sort((a, b) => a.x - b.x);
      // After sorting, enforce first and last x positions
      if (this.points.length > 1) {
        this.points[0].x = 0;
        this.points[this.points.length - 1].x = this.canvas.width;
      }
      this.draw();
      this.onPointsChange?.(this.getPoints());
    }
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (this.dragId === null) return;
    const { x, y } = this.getCanvasCoords(e);
    const idx = this.points.findIndex((pt) => pt.id === this.dragId);
    if (idx === -1) return;
    // Determine if dragging first or last point
    if (idx === 0) {
      // First point: lock x to 0, allow y
      this.points[idx] = { ...this.points[idx], x: 0, y };
    } else if (idx === this.points.length - 1) {
      // Last point: lock x to canvas width, allow y
      this.points[idx] = { ...this.points[idx], x: this.canvas.width, y };
    } else {
      this.points[idx] = { ...this.points[idx], x, y };
    }
    this.points.sort((a, b) => a.x - b.x);
    // After sorting, enforce first and last x positions
    if (this.points.length > 1) {
      this.points[0].x = 0;
      this.points[this.points.length - 1].x = this.canvas.width;
    }
    this.draw();
    this.onPointsChange?.(this.getPoints());
  };

  private handleMouseUp = () => {
    this.dragId = null;
  };

  // Optionally, a method to clean up event listeners
  public destroy() {
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.removeEventListener('mousemove', this.handleMouseHover);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  /**
   * Returns the interpolated y value for a given x using Catmull-Rom spline.
   * Returns null if x is out of bounds or not enough points.
   */
  public getYfromX(x: number): number | null {
    if (this.points.length < 2) return null;
    // Ensure points are sorted by x
    const pts = this.points;
    if (x <= pts[0].x) return pts[0].y;
    if (x >= pts[pts.length - 1].x) return pts[pts.length - 1].y;

    // Find segment [p1, p2] where x is between p1.x and p2.x
    let i = 0;
    while (i < pts.length - 1 && !(x >= pts[i].x && x <= pts[i + 1].x)) {
      i++;
    }
    if (i >= pts.length - 1) return null;
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    // Normalize t in [0,1] between p1.x and p2.x
    const t = (x - p1.x) / (p2.x - p1.x);
    const tt = t * t;
    const ttt = tt * t;
    // Catmull-Rom spline interpolation for y
    const y =
      0.5 *
      (2 * p1.y +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * tt +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * ttt);
    return y;
  }
}
