import { useEffect, useRef } from 'react';
import './App.css';
import { setup } from './canvas/setup.ts';
import { draw } from './canvas/scenes/chain.ts';

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
      <div className="absolute top-4 left-4 border rounded-md padding-6 ">
        Control panel{' '}
      </div>
      <canvas id="canvas" ref={canvasRef} className="canvas" />
    </>
  );
}

export default App;
