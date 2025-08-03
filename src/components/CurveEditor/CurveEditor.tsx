import { useEffect, useRef } from 'react';
import { CurveEditorClass } from './CurveEditor.class';
import { useConfigStore } from '@/store';

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;
const SCALE_FACTOR = 0.25;

function CurveEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const curveEditorRef = useRef<CurveEditorClass | null>(null);
  const segmentAmount = useConfigStore(
    (state) => state.config.body.segmentAmount
  );
  const initialPoints = useConfigStore(
    (state) => state.config.body.segmentSizeCurvePoints
  );

  const calculateSegmentSizes = (segmentAmount: number): number[] => {
    const interval = CANVAS_WIDTH / (segmentAmount - 1);
    return Array.from({ length: segmentAmount }, (_, i) => {
      const x = i * interval;
      const y = curveEditorRef.current?.getYfromX(x);
      return Math.abs((y ?? CANVAS_HEIGHT) - CANVAS_HEIGHT) * SCALE_FACTOR;
    });
  };

  const updateSegmentSizes = (sizes: number[]) => {
    const prev = useConfigStore.getState().config;
    useConfigStore
      .getState()
      .setConfig({ body: { ...prev.body, segmentSizes: sizes } });
  };

  const pointsKey = JSON.stringify(initialPoints);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // When curve changes
    const onPointsChange = () => {
      // Keep, fixes stale value bug
      const { segmentAmount } = useConfigStore.getState().config.body;
      const sizes = calculateSegmentSizes(segmentAmount);
      updateSegmentSizes(sizes);
    };
    console.log('Initializing CurveEditor with points:', initialPoints);

    if (curveEditorRef.current) {
      curveEditorRef.current.destroy();
      curveEditorRef.current = null;
    }

    curveEditorRef.current = new CurveEditorClass(
      canvas,
      JSON.parse(JSON.stringify(initialPoints)),
      onPointsChange
    );
    onPointsChange(); // Initialize sizes
    return () => {
      curveEditorRef.current?.destroy();
      curveEditorRef.current = null;
    };
  }, [pointsKey, initialPoints]);

  // When config changes
  useEffect(() => {
    const sizes = calculateSegmentSizes(segmentAmount);
    updateSegmentSizes(sizes);
  }, [segmentAmount]);

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
