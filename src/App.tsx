import { useEffect, useRef } from 'react';
import './App.css'
import { setup } from './canvas/setup.ts'
import { draw } from './canvas/scenes/constraint.ts'; 


function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    function handleResize() {
      setup(draw);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <canvas id="canvas" ref={canvasRef} />
    </>
  );
}

export default App
