import { useEffect, useRef } from 'react';
import './App.css';
import { setup } from './canvas/setup.ts';
import { draw } from './canvas/draw.ts';
import ControlPanel from './components/ControlPanel.tsx';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setup(draw);
    window.addEventListener('resize', () => setup(draw));
    return () => {
      window.removeEventListener('resize', () => setup(draw));
    };
  }, []);

  return (
    <>
      <ControlPanel />
      <canvas id="canvas" ref={canvasRef} className="canvas" />
    </>
  );
}

export default App;
