export class MouseControls {
    constructor(scene3D, camera, renderer) {
        this.scene3D = scene3D;
        this.camera = camera;
        this.renderer = renderer;

        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };

        this.setupEventListeners();
    }

    setupEventListeners() {
        const canvas = this.renderer.domElement;

        // Mouse down
        canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.previousMousePosition = {
                x: e.clientX,
                y: e.clientY
            };
            canvas.style.cursor = 'grabbing';
        });

        // Mouse up
        canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
            canvas.style.cursor = 'grab';
        });

        // Mouse leave
        canvas.addEventListener('mouseleave', () => {
            this.isDragging = false;
            canvas.style.cursor = 'grab';
        });

        // Mouse move - rotate object
        canvas.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;

            const deltaX = e.clientX - this.previousMousePosition.x;
            const deltaY = e.clientY - this.previousMousePosition.y;

            // Rotate the selected object
            this.scene3D.rotateObject(deltaX * 0.01, deltaY * 0.01);

            this.previousMousePosition = {
                x: e.clientX,
                y: e.clientY
            };
        });

        // Mouse wheel - zoom
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();

            const zoomSpeed = 0.001;
            const zoomFactor = 1 + (e.deltaY * zoomSpeed);

            this.scene3D.zoomObject(1 / zoomFactor);
        }, { passive: false });

        // Set initial cursor
        canvas.style.cursor = 'grab';

        // Double click to reset
        canvas.addEventListener('dblclick', () => {
            this.scene3D.resetView();
            this.playResetSound();
        });
    }

    playResetSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
            oscillator.frequency.linearRampToValueAtTime(500, audioContext.currentTime + 0.15);
            gainNode.gain.setValueAtTime(0.07, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.15);
        } catch (e) {
            console.log('Audio not supported');
        }
    }
}
