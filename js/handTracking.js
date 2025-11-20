export class HandTracking {
    constructor(onResultsCallback) {
        this.onResultsCallback = onResultsCallback;
        this.hands = null;
        this.camera = null;
        this.videoElement = document.getElementById('webcam');
        this.canvasElement = document.getElementById('hand-canvas');
        this.canvasCtx = this.canvasElement.getContext('2d');
    }

    async initialize() {
        console.log('Initializing hand tracking...');

        // Set canvas size
        this.canvasElement.width = window.innerWidth;
        this.canvasElement.height = window.innerHeight;

        // Initialize MediaPipe Hands
        this.hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });

        this.hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7
        });

        this.hands.onResults(this.onResults.bind(this));

        // Initialize camera
        this.camera = new Camera(this.videoElement, {
            onFrame: async () => {
                await this.hands.send({ image: this.videoElement });
            },
            width: 1280,
            height: 720
        });

        await this.camera.start();

        // Update status
        document.getElementById('hand-status').textContent = 'Active';
        document.getElementById('hand-status').style.color = '#00ff00';

        console.log('Hand tracking initialized');
    }

    onResults(results) {
        // Clear canvas
        this.canvasCtx.save();
        this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

        // Draw hand landmarks
        if (results.multiHandLandmarks) {
            for (const landmarks of results.multiHandLandmarks) {
                this.drawHand(landmarks);
            }
        }

        this.canvasCtx.restore();

        // Call callback
        if (this.onResultsCallback) {
            this.onResultsCallback(results);
        }
    }

    drawHand(landmarks) {
        // Draw connections
        const connections = [
            // Thumb
            [0, 1], [1, 2], [2, 3], [3, 4],
            // Index finger
            [0, 5], [5, 6], [6, 7], [7, 8],
            // Middle finger
            [0, 9], [9, 10], [10, 11], [11, 12],
            // Ring finger
            [0, 13], [13, 14], [14, 15], [15, 16],
            // Pinky
            [0, 17], [17, 18], [18, 19], [19, 20],
            // Palm
            [5, 9], [9, 13], [13, 17]
        ];

        this.canvasCtx.strokeStyle = '#00d4ff';
        this.canvasCtx.lineWidth = 3;
        this.canvasCtx.shadowBlur = 10;
        this.canvasCtx.shadowColor = '#00d4ff';

        for (const [start, end] of connections) {
            const startPoint = landmarks[start];
            const endPoint = landmarks[end];

            this.canvasCtx.beginPath();
            this.canvasCtx.moveTo(
                startPoint.x * this.canvasElement.width,
                startPoint.y * this.canvasElement.height
            );
            this.canvasCtx.lineTo(
                endPoint.x * this.canvasElement.width,
                endPoint.y * this.canvasElement.height
            );
            this.canvasCtx.stroke();
        }

        // Draw landmarks
        this.canvasCtx.fillStyle = '#00ffff';
        this.canvasCtx.shadowBlur = 15;
        this.canvasCtx.shadowColor = '#00ffff';

        for (const landmark of landmarks) {
            this.canvasCtx.beginPath();
            this.canvasCtx.arc(
                landmark.x * this.canvasElement.width,
                landmark.y * this.canvasElement.height,
                5,
                0,
                2 * Math.PI
            );
            this.canvasCtx.fill();
        }
    }
}
