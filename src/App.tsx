import { useEffect, useRef } from 'react';
import './App.css';
import { setup } from './canvas/setup.ts';
import { createScene } from './canvas/scenes/chain.ts';
import ControlPanel from './components/ControlPanel.tsx';
import { useConfigStore } from '@/store';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const drawFn = createScene();
    setup(drawFn);
    const unsub = useConfigStore.subscribe(() => {
      const drawFn = createScene();
      setup(drawFn);
    });
    window.addEventListener('resize', () => setup(drawFn));
    return () => {
      window.removeEventListener('resize', () => setup(drawFn));
      unsub();
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
