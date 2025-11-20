import { HandTracking } from './handTracking.js';
import { GestureRecognition } from './gestureRecognition.js';
import { Scene3D } from './scene3D.js';
import { ParticleSystem } from './particles.js';
import { VoiceControl } from './voiceControl.js';
import { UIPanels } from './uiPanels.js';
import { FileBrowser } from './fileBrowser.js';
import { ObjectScanner } from './objectScanner.js';
import { IntroSequence } from './introSequence.js';

class JARVISInterface {
    constructor() {
        this.initialized = false;
        this.handTracking = null;
        this.gestureRecognition = null;
        this.scene3D = null;
        this.particleSystem = null;
        this.voiceControl = null;
        this.uiPanels = null;
        this.fileBrowser = null;
        this.objectScanner = null;
        this.introSequence = null;

        this.currentGesture = null;
        this.selectedObject = null;
        this.interactionMode = 'manipulation'; // manipulation, browsing, scanning

        this.startIntroSequence();
    }

    startIntroSequence() {
        // Create and run intro sequence
        this.introSequence = new IntroSequence(() => {
            // When intro completes, initialize the main interface
            this.initialize();
        });

        // Start the intro sequence automatically
        this.introSequence.start();
    }

    async initialize() {
        console.log('Initializing JARVIS Interface...');

        try {
            // Initialize Particle System
            console.log('Loading particle system...');
            await this.delay(300);
            this.particleSystem = new ParticleSystem('particle-canvas');

            // Initialize 3D Scene
            console.log('Initializing holographic display...');
            await this.delay(300);
            this.scene3D = new Scene3D('scene-container');

            // Initialize UI Panels
            console.log('Loading interface panels...');
            await this.delay(300);
            this.uiPanels = new UIPanels();

            // Initialize File Browser
            console.log('Initializing file system...');
            await this.delay(300);
            this.fileBrowser = new FileBrowser();

            // Initialize Object Scanner
            console.log('Calibrating object scanner...');
            await this.delay(300);
            this.objectScanner = new ObjectScanner();

            // Initialize Gesture Recognition
            console.log('Loading gesture recognition...');
            await this.delay(300);
            this.gestureRecognition = new GestureRecognition();

            // Initialize Hand Tracking
            console.log('Activating hand tracking...');
            await this.delay(300);
            this.handTracking = new HandTracking(this.onHandsDetected.bind(this));
            await this.handTracking.initialize();

            // Initialize Voice Control
            console.log('Activating voice recognition...');
            await this.delay(300);
            this.voiceControl = new VoiceControl(this.onVoiceCommand.bind(this));
            this.voiceControl.start();

            // Setup event listeners
            this.setupEventListeners();

            this.initialized = true;
            console.log('JARVIS Interface initialized successfully - Welcome, Sir.');

            // Start animation loop
            this.animate();

        } catch (error) {
            console.error('Initialization error:', error);
            alert('Error initializing JARVIS: ' + error.message);
        }
    }

    setupEventListeners() {
        // Scan button
        const scanButton = document.getElementById('scan-button');
        scanButton.addEventListener('click', () => {
            this.objectScanner.scanObject((imageData) => {
                this.scene3D.addScannedObject(imageData);
                this.uiPanels.togglePanel('scanner-panel', false);
            });
        });
    }

    onHandsDetected(results) {
        if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
            this.currentGesture = null;
            this.uiPanels.updateGestureStatus('None');
            return;
        }

        // Get first hand
        const landmarks = results.multiHandLandmarks[0];

        // Recognize gesture
        const gesture = this.gestureRecognition.recognizeGesture(landmarks);

        if (gesture !== this.currentGesture) {
            this.currentGesture = gesture;
            this.onGestureChanged(gesture);
        }

        // Update UI
        this.uiPanels.updateGestureStatus(gesture.name);

        // Handle gesture interaction
        this.handleGestureInteraction(gesture, landmarks);
    }

    onGestureChanged(gesture) {
        console.log('Gesture changed:', gesture.name);

        // Create particle effect at hand position
        if (gesture.name !== 'unknown') {
            this.particleSystem.createBurst(
                window.innerWidth / 2,
                window.innerHeight / 2,
                30
            );
        }

        // Handle specific gesture actions
        switch (gesture.name) {
            case 'open_palm':
                this.uiPanels.togglePanel('file-panel', true);
                this.interactionMode = 'browsing';
                break;
            case 'fist':
                this.uiPanels.togglePanel('file-panel', false);
                this.interactionMode = 'manipulation';
                break;
            case 'peace':
                this.uiPanels.togglePanel('scanner-panel', true);
                this.interactionMode = 'scanning';
                break;
        }
    }

    handleGestureInteraction(gesture, landmarks) {
        // Get index finger tip position (landmark 8)
        const indexTip = landmarks[8];

        // Convert to screen coordinates
        const x = indexTip.x * window.innerWidth;
        const y = indexTip.y * window.innerHeight;

        switch (this.interactionMode) {
            case 'manipulation':
                if (gesture.name === 'pinch') {
                    // Manipulate 3D object
                    const rotation = this.calculateHandRotation(landmarks);
                    const distance = this.calculatePinchDistance(landmarks);
                    this.scene3D.manipulateObject(rotation, distance);
                }
                break;

            case 'browsing':
                if (gesture.name === 'pointing') {
                    // Highlight file under cursor
                    this.fileBrowser.highlightAtPosition(x, y);
                }
                if (gesture.name === 'pinch') {
                    // Select file
                    this.fileBrowser.selectAtPosition(x, y);
                }
                break;

            case 'scanning':
                // Scanner mode is button-driven
                break;
        }
    }

    calculateHandRotation(landmarks) {
        // Calculate rotation based on hand orientation
        const wrist = landmarks[0];
        const middleFinger = landmarks[9];

        const dx = middleFinger.x - wrist.x;
        const dy = middleFinger.y - wrist.y;
        const dz = middleFinger.z - wrist.z;

        return {
            x: Math.atan2(dy, Math.sqrt(dx * dx + dz * dz)),
            y: Math.atan2(dx, dz),
            z: 0
        };
    }

    calculatePinchDistance(landmarks) {
        // Distance between thumb and index finger
        const thumb = landmarks[4];
        const index = landmarks[8];

        const dx = thumb.x - index.x;
        const dy = thumb.y - index.y;
        const dz = thumb.z - index.z;

        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    onVoiceCommand(command) {
        console.log('Voice command:', command);

        // Show voice feedback
        this.uiPanels.showVoiceCommand(command);

        // Process command
        const lowerCommand = command.toLowerCase();

        if (lowerCommand.includes('show files') || lowerCommand.includes('file browser')) {
            this.uiPanels.togglePanel('file-panel', true);
            this.interactionMode = 'browsing';
        }
        else if (lowerCommand.includes('hide files')) {
            this.uiPanels.togglePanel('file-panel', false);
        }
        else if (lowerCommand.includes('scan object')) {
            this.uiPanels.togglePanel('scanner-panel', true);
            this.interactionMode = 'scanning';
        }
        else if (lowerCommand.includes('rotate left')) {
            this.scene3D.rotateObject(-0.5, 0);
        }
        else if (lowerCommand.includes('rotate right')) {
            this.scene3D.rotateObject(0.5, 0);
        }
        else if (lowerCommand.includes('rotate up')) {
            this.scene3D.rotateObject(0, 0.5);
        }
        else if (lowerCommand.includes('rotate down')) {
            this.scene3D.rotateObject(0, -0.5);
        }
        else if (lowerCommand.includes('zoom in')) {
            this.scene3D.zoomObject(1.2);
        }
        else if (lowerCommand.includes('zoom out')) {
            this.scene3D.zoomObject(0.8);
        }
        else if (lowerCommand.includes('reset view') || lowerCommand.includes('reset')) {
            this.scene3D.resetView();
        }
        else if (lowerCommand.includes('add cube')) {
            this.scene3D.addCube();
        }
        else if (lowerCommand.includes('add sphere')) {
            this.scene3D.addSphere();
        }
        else if (lowerCommand.includes('add torus')) {
            this.scene3D.addTorus();
        }
    }

    animate() {
        if (!this.initialized) return;

        requestAnimationFrame(this.animate.bind(this));

        // Update particle system
        this.particleSystem.update();

        // Render 3D scene
        this.scene3D.render();

        // Update object info
        const objectInfo = this.scene3D.getSelectedObjectInfo();
        if (objectInfo) {
            this.uiPanels.updateObjectInfo(objectInfo);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize JARVIS when page loads
window.addEventListener('DOMContentLoaded', () => {
    const jarvis = new JARVISInterface();
});
