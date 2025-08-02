//This curve editor is largely vibe coded, i take no credit for how good or bad it is
//Time constraint, might reimplement later

type Point = { x: number; y: number; id: number };

export class CurveEditorClass {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private points: Point[] = [
    { x: 0, y: 195, id: 1 },
    { x: 25, y: 195, id: 2 },
    { x: 35, y: 230, id: 3 },
    { x: 250, y: 245, id: 4 },
    { x: 300, y: 285, id: 5 },
  ];
  private dragId: number | null = null;
  private selectedId: number | null = null;
  private nextId: number = 6;
  private onPointsChange?: (points: Point[]) => void;

  private readonly hitRadius = 12;

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
    window.addEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Draws the curve and control points on the canvas.
   */
  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.points.length > 1) {
      this.drawCurve();
    }
    this.drawPoints();
  }

  /**
   * Draws the Catmull-Rom spline curve through the points.
   */
  private drawCurve() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 0; i < this.points.length - 1; i++) {
      const p0 = this.points[i - 1] || this.points[i];
      const p1 = this.points[i];
      const p2 = this.points[i + 1];
      const p3 = this.points[i + 2] || p2;
      for (let t = 0; t < 1; t += 0.05) {
        const { x, y } = this.catmullRomInterpolate(p0, p1, p2, p3, t);
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.strokeStyle = '#0070f3';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  /**
   * Draws the control points on the canvas.
   */
  private drawPoints() {
    for (const pt of this.points) {
      this.ctx.beginPath();
      this.ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
      if (pt.id === this.selectedId) {
        this.ctx.fillStyle = '#00C853'; // Highlight selected point (green)
        this.ctx.strokeStyle = '#222';
        this.ctx.lineWidth = 2;
        this.ctx.fill();
        this.ctx.stroke();
      } else {
        this.ctx.fillStyle = '#FF0000';
        this.ctx.fill();
      }
    }
  }

  /**
   * Catmull-Rom spline interpolation for a given t in [0,1].
   */
  private catmullRomInterpolate(
    p0: Point,
    p1: Point,
    p2: Point,
    p3: Point,
    t: number
  ) {
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
    return { x, y };
  }

  /**
   * Converts mouse event coordinates to canvas coordinates.
   */
  private getCanvasCoords(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  /**
   * Returns the id of the point at (x, y) within hitRadius, or null if none.
   */
  private getPointAt(x: number, y: number): number | null {
    const hit = this.points.find(
      (pt) =>
        (pt.x - x) ** 2 + (pt.y - y) ** 2 <= this.hitRadius * this.hitRadius
    );
    return hit ? hit.id : null;
  }

  /**
   * Attaches mouse event listeners for interaction.
   */
  private attachEvents() {
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mousemove', this.handleMouseHover);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  /**
   * Changes cursor when hovering over a point.
   */
  private handleMouseHover = (e: MouseEvent) => {
    const { x, y } = this.getCanvasCoords(e);
    const id = this.getPointAt(x, y);
    this.canvas.style.cursor = id !== null ? 'pointer' : 'default';
  };

  /**
   * Handles mouse down: start dragging or add a new point.
   */
  private handleMouseDown = (e: MouseEvent) => {
    const { x, y } = this.getCanvasCoords(e);
    const id = this.getPointAt(x, y);
    if (id !== null) {
      this.dragId = id;
      this.selectedId = id;
      this.draw();
    } else {
      this.selectedId = null;
      this.addPoint(x, y);
    }
  };
  /**
   * Handles keydown events for deleting selected point.
   */
  private handleKeyDown = (e: KeyboardEvent) => {
    if (
      (e.key === 'Delete' || e.key === 'Backspace') &&
      this.selectedId !== null &&
      this.points.length > 2
    ) {
      // Prevent deleting endpoints
      const idx = this.points.findIndex((pt) => pt.id === this.selectedId);
      if (idx > 0 && idx < this.points.length - 1) {
        this.points.splice(idx, 1);
        this.selectedId = null;
        this.draw();
        this.onPointsChange?.(this.points);
        e.preventDefault();
      }
    }
  };

  /**
   * Adds a new point and updates the curve.
   */
  private addPoint(x: number, y: number) {
    const newPoint = { x, y, id: this.nextId++ };
    this.points.push(newPoint);
    this.sortAndClampPoints();
    // After sorting, find the new point's id (it may have moved)
    const idx = this.points.findIndex((pt) => pt.id === newPoint.id);
    this.selectedId = idx !== -1 ? this.points[idx].id : null;
    this.draw();
    this.onPointsChange?.(this.points);
  }

  /**
   * Sorts points by x and clamps first/last x to canvas edges.
   */
  private sortAndClampPoints() {
    this.points.sort((a, b) => a.x - b.x);
    if (this.points.length > 1) {
      this.points[0].x = 0;
      this.points[this.points.length - 1].x = this.canvas.width;
    }
  }

  /**
   * Handles mouse move: drag a point if needed.
   */
  private handleMouseMove = (e: MouseEvent) => {
    if (this.dragId === null) return;
    const { x, y } = this.getCanvasCoords(e);
    const idx = this.points.findIndex((pt) => pt.id === this.dragId);
    if (idx === -1) return;
    if (idx === 0) {
      // First point: lock x to 0, allow y
      this.points[idx] = { ...this.points[idx], x: 0, y };
    } else if (idx === this.points.length - 1) {
      // Last point: lock x to canvas width, allow y
      this.points[idx] = { ...this.points[idx], x: this.canvas.width, y };
    } else {
      this.points[idx] = { ...this.points[idx], x, y };
    }
    this.sortAndClampPoints();
    this.draw();
    this.onPointsChange?.(this.points);
  };

  /**
   * Handles mouse up: stop dragging.
   */
  private handleMouseUp = () => {
    this.dragId = null;
  };

  /**
   * Cleans up event listeners.
   */
  public destroy() {
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.removeEventListener('mousemove', this.handleMouseHover);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Returns the interpolated y value for a given x using Catmull-Rom spline.
   * Returns null if x is out of bounds or not enough points.
   */
  public getYfromX(x: number): number | null {
    if (this.points.length < 2) return null;
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
    const { y } = this.catmullRomInterpolate(p0, p1, p2, p3, t);
    return y;
  }
}
