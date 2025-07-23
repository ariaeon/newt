# Newt

A modern, interactive canvas playground built with React and TypeScript. Explore physics-based scenes, visual experiments, and creative coding in the browser.

## Features

- High-DPI canvas rendering
- Modular scene system (e.g., constraint, chain)
- Real-time mouse interaction
- Easily extensible for new visual demos

## Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm or yarn

### Install

```bash
npm install
```

### Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
  App.tsx           # Main React component
  canvas/
    setup.ts        # Canvas setup and animation loop
    scenes/         # Individual visual scenes (constraint, chain, etc.)
    helpers.ts      # Utility functions for drawing and math
public/
  index.html        # Entry point
  newtlogo.svg      # Project logo
```

## Development

- Add new scenes in `src/canvas/scenes/`
- Use `drawCircle` and other helpers for rendering
- Hot reload enabled for fast iteration

## License

MIT
