let ctx: CanvasRenderingContext2D | null = null;
export function setCtx(context: CanvasRenderingContext2D) { ctx = context; }
export function getCtx() { return ctx; }
