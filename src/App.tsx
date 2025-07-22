import { useEffect, useRef } from 'react';
import './App.css'
import { setup } from './canvas/setup.ts'
import { draw } from './canvas/scenes/constraint.ts'; 


function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    function resizeCanvas() {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    setup(draw);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <>
      <canvas id="canvas" ref={canvasRef} style={{ display: 'block', width: '100vw', height: '100vh' }} />
    </>
  );
}

export default App
