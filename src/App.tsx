import { useEffect } from 'react';
import './App.css'
import { setup } from './scripts/setup.ts'
import { draw } from './scripts/constraint/draw.ts'; 

function App() {

  useEffect(() => {
    setup(draw);
  }, []);

  return (
    <>
      <canvas id="canvas" width="800" height="600" >
      </canvas>
    </>
  )
}

export default App
