import { useEffect } from 'react';
import './App.css'
import { setup } from './canvas/setup.ts'
import { draw } from './canvas/scenes/constraint.ts'; 

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
