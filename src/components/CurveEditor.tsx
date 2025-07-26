import { useEffect, useRef } from 'react';
import { CurveEditorClass } from './CurveEditor.class';
import { useConfigStore } from '@/store';

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;
const SCALE_FACTOR = 0.2;

function CurveEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const curveEditorRef = useRef<CurveEditorClass | null>(null);

  // Utility function uses the ref directly
  const calculateSegmentSizes = (segmentAmount: number): number[] => {
    const interval = CANVAS_WIDTH / (segmentAmount - 1);
    return Array.from({ length: segmentAmount }, (_, i) => {
      const x = i * interval;
      const y = curveEditorRef.current?.getYfromX(x);
      return Math.abs((y ?? CANVAS_HEIGHT) - CANVAS_HEIGHT) * SCALE_FACTOR;
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onPointsChange = () => {
      const { segmentAmount } = useConfigStore.getState().config;
      const sizes = calculateSegmentSizes(segmentAmount);
      useConfigStore.getState().setConfig({ segmentSizes: sizes });
    };

    curveEditorRef.current = new CurveEditorClass(canvas, onPointsChange);
    onPointsChange(); // Initialize sizes
    return () => {
      curveEditorRef.current?.destroy();
      curveEditorRef.current = null;
    };
  }, []);

  return (
    <div className="p-0 border border-gray-300 w-fit ">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      ></canvas>
    </div>
  );
}

export default CurveEditor;
