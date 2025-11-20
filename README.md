# JARVIS Holographic Interface

A futuristic holographic interface inspired by Tony Stark's JARVIS, featuring hand gesture control, 3D object manipulation, and voice commands.

## Features

- **Hand Tracking**: Real-time hand tracking using MediaPipe
- **Gesture Recognition**: Intuitive gestures for controlling the interface
- **3D Object Manipulation**: Rotate, zoom, and manipulate 3D objects in mid-air
- **Object Scanning**: Capture real objects with your camera and display them as 3D holograms
- **Multi-layer UI Panels**: Transparent floating panels for information display
- **File Browsing**: Minority Report-style gesture-based file navigation
- **Voice Control**: Combined voice and gesture commands
- **Particle Effects**: Visual feedback with particle systems

## Technologies

- MediaPipe Hands for hand tracking
- Three.js for 3D rendering
- Web Speech API for voice recognition
- Custom gesture recognition system
- WebGL particle effects

## Usage

1. Open `index.html` in a modern web browser (Chrome recommended)
2. Allow camera and microphone permissions
3. Use hand gestures to interact:
   - **Pinch**: Select and grab objects
   - **Spread**: Zoom in/out
   - **Rotate**: Rotate hand to rotate objects
   - **Swipe**: Navigate panels
   - **Open Palm**: Show menu

## Voice Commands

- "JARVIS, show files"
- "JARVIS, scan object"
- "JARVIS, rotate left/right"
- "JARVIS, zoom in/out"
- "JARVIS, reset view"

## Running the Application

### Simple HTTP Server
```bash
npm start
# or
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Requirements

- Modern web browser with WebGL support
- Webcam
- Microphone (optional, for voice control)

## Cool Factor

Literally Tony Stark's workshop in your browser!
