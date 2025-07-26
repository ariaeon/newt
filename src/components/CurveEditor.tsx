import { useEffect, useRef } from 'react';
import { CurveEditor as CurveEditorClass } from './CurveEditor';

function CurveEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editorRef = useRef<CurveEditorClass | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Callback to log y at x=150 on any change
    const onPointsChange = () => {
      if (editorRef.current) {
        const y = editorRef.current.getYfromX(150);
        console.log('y at x=150:', y);
      }
    };
    editorRef.current = new CurveEditorClass(canvas, onPointsChange);
    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, []);

  return (
    <div className="p-0 border border-gray-300 w-fit ">
      <canvas ref={canvasRef} width={300} height={300}></canvas>
    </div>
  );
}

export default CurveEditor;
