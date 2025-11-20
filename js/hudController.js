export class HUDController {
    constructor() {
        this.hudOverlay = document.getElementById('hud-overlay');
        this.powerBar = document.getElementById('power-bar');
        this.trackingAccuracy = document.getElementById('tracking-accuracy');
        this.fpsCounter = document.getElementById('fps-counter');
        this.hudTime = document.getElementById('hud-time');
        this.hudDate = document.getElementById('hud-date');

        this.gridEnabled = true;
        this.particlesEnabled = true;

        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = performance.now();

        // Set default mode to object (safe mode)
        window.currentMode = 'object';

        this.setupButtons();
        this.startClock();
        this.startFPSCounter();
        this.playSound('activate');

        // Hide camera by default (object mode)
        document.getElementById('webcam').style.opacity = '0';
        document.getElementById('hand-canvas').style.opacity = '0';
    }

    setupButtons() {
        // Grid toggle
        document.getElementById('toggle-grid').addEventListener('click', () => {
            this.gridEnabled = !this.gridEnabled;
            this.toggleGrid(this.gridEnabled);
            this.playSound('click');
        });

        // Particles toggle
        document.getElementById('toggle-particles').addEventListener('click', () => {
            this.particlesEnabled = !this.particlesEnabled;
            this.playSound('click');
        });

        // Reset all
        document.getElementById('reset-all').addEventListener('click', () => {
            this.resetAll();
            this.playSound('reset');
        });

        // Add random object
        document.getElementById('add-random-object').addEventListener('click', () => {
            this.addRandomObject();
            this.playSound('create');
        });

        // Clear objects
        document.getElementById('clear-objects').addEventListener('click', () => {
            this.clearAllObjects();
            this.playSound('clear');
        });

        // Screenshot
        document.getElementById('screenshot').addEventListener('click', () => {
            this.takeScreenshot();
            this.playSound('scan');
        });

        // Object gallery
        document.getElementById('object-gallery').addEventListener('click', () => {
            this.openGallery();
            this.playSound('click');
        });

        // Mode toggle buttons
        document.getElementById('mode-object').addEventListener('click', () => {
            this.switchMode('object');
        });

        document.getElementById('mode-camera').addEventListener('click', () => {
            this.switchMode('camera');
        });

        // Gallery items
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                this.selectGalleryItem(item);
            });
        });

        // Close gallery button
        document.getElementById('close-gallery').addEventListener('click', () => {
            this.closeGallery();
        });
    }

    toggleGrid(enabled) {
        const grid = document.querySelector('body::before');
        if (enabled) {
            document.body.style.setProperty('--grid-opacity', '0.1');
        } else {
            document.body.style.setProperty('--grid-opacity', '0');
        }
    }

    resetAll() {
        if (window.jarvisInstance && window.jarvisInstance.scene3D) {
            window.jarvisInstance.scene3D.resetView();
        }
    }

    addRandomObject() {
        if (window.jarvisInstance && window.jarvisInstance.scene3D) {
            const objectTypes = ['cube', 'sphere', 'torus'];
            const randomType = objectTypes[Math.floor(Math.random() * objectTypes.length)];

            switch (randomType) {
                case 'cube':
                    window.jarvisInstance.scene3D.addCube();
                    break;
                case 'sphere':
                    window.jarvisInstance.scene3D.addSphere();
                    break;
                case 'torus':
                    window.jarvisInstance.scene3D.addTorus();
                    break;
            }
        }
    }

    clearAllObjects() {
        if (window.jarvisInstance && window.jarvisInstance.scene3D) {
            window.jarvisInstance.scene3D.clearObjects();
        }
    }

    takeScreenshot() {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.download = `jarvis-screenshot-${Date.now()}.png`;
            link.href = canvas.toDataURL();
            link.click();

            // Show notification
            this.showNotification('Screenshot saved!');
        }
    }

    startClock() {
        const updateTime = () => {
            const now = new Date();

            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            this.hudTime.textContent = `${hours}:${minutes}:${seconds}`;

            const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

            const dayName = days[now.getDay()];
            const monthName = months[now.getMonth()];
            const date = now.getDate();
            const year = now.getFullYear();

            this.hudDate.textContent = `${dayName}, ${monthName} ${date}, ${year}`;

            requestAnimationFrame(updateTime);
        };

        updateTime();
    }

    startFPSCounter() {
        const updateFPS = () => {
            this.frameCount++;
            const now = performance.now();
            const delta = now - this.lastTime;

            if (delta >= 1000) {
                this.fps = Math.round((this.frameCount * 1000) / delta);
                this.fpsCounter.textContent = this.fps;
                this.frameCount = 0;
                this.lastTime = now;
            }

            requestAnimationFrame(updateFPS);
        };

        updateFPS();
    }

    updateTracking(accuracy) {
        this.trackingAccuracy.textContent = `${Math.round(accuracy)}%`;
    }

    updatePower(percentage) {
        this.powerBar.style.width = `${percentage}%`;

        // Change color based on power level
        if (percentage < 30) {
            this.powerBar.style.background = 'linear-gradient(90deg, #ff0000, #ff6600)';
        } else if (percentage < 60) {
            this.powerBar.style.background = 'linear-gradient(90deg, #ffff00, #ff9900)';
        } else {
            this.powerBar.style.background = 'linear-gradient(90deg, #00d4ff, #00ffff)';
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'hud-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 212, 255, 0.3);
            border: 2px solid #00d4ff;
            border-radius: 10px;
            padding: 20px 40px;
            font-size: 18px;
            color: #00ffff;
            z-index: 10000;
            animation: fadeInOut 2s ease-in-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 2000);
    }

    playSound(type) {
        // Create simple sound effects using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Different sounds for different actions
            switch (type) {
                case 'activate':
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.2);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.2);
                    break;

                case 'click':
                    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.05);
                    break;

                case 'scan':
                    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);
                    gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.3);
                    break;

                case 'create':
                    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                    oscillator.frequency.linearRampToValueAtTime(600, audioContext.currentTime + 0.1);
                    gainNode.gain.setValueAtTime(0.07, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.1);
                    break;

                case 'clear':
                    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
                    gainNode.gain.setValueAtTime(0.06, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.2);
                    break;

                case 'reset':
                    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
                    oscillator.frequency.linearRampToValueAtTime(500, audioContext.currentTime + 0.15);
                    gainNode.gain.setValueAtTime(0.07, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.15);
                    break;
            }
        } catch (e) {
            console.log('Audio not supported:', e);
        }
    }

    getParticlesEnabled() {
        return this.particlesEnabled;
    }

    switchMode(mode) {
        const objectBtn = document.getElementById('mode-object');
        const cameraBtn = document.getElementById('mode-camera');

        if (mode === 'object') {
            objectBtn.classList.add('active');
            cameraBtn.classList.remove('active');

            // Disable hand tracking in object mode
            if (window.jarvisInstance && window.jarvisInstance.handTracking) {
                document.getElementById('webcam').style.opacity = '0';
                document.getElementById('hand-canvas').style.opacity = '0';
            }

            this.showNotification('Object Mode: Safe viewing - no hand tracking');
            this.playSound('activate');

        } else if (mode === 'camera') {
            objectBtn.classList.remove('active');
            cameraBtn.classList.add('active');

            // Enable hand tracking in camera mode
            if (window.jarvisInstance && window.jarvisInstance.handTracking) {
                document.getElementById('webcam').style.opacity = '0.3';
                document.getElementById('hand-canvas').style.opacity = '1';
            }

            this.showNotification('Camera Mode: Hand tracking active');
            this.playSound('activate');
        }

        // Store current mode
        window.currentMode = mode;
    }

    openGallery() {
        const galleryPanel = document.getElementById('gallery-panel');
        galleryPanel.classList.remove('hidden');
    }

    closeGallery() {
        const galleryPanel = document.getElementById('gallery-panel');
        galleryPanel.classList.add('hidden');
        this.playSound('click');
    }

    selectGalleryItem(item) {
        // Remove previous selection
        document.querySelectorAll('.gallery-item').forEach(i => {
            i.classList.remove('selected');
        });

        // Select clicked item
        item.classList.add('selected');

        const objectType = item.dataset.type;
        this.playSound('create');

        // Add the selected object to the scene
        if (window.jarvisInstance && window.jarvisInstance.scene3D) {
            const scene = window.jarvisInstance.scene3D;

            switch (objectType) {
                case 'cube':
                    scene.addCube();
                    break;
                case 'sphere':
                    scene.addSphere();
                    break;
                case 'torus':
                    scene.addTorus();
                    break;
                case 'cylinder':
                    scene.addCylinder();
                    break;
                case 'cone':
                    scene.addCone();
                    break;
                case 'dodecahedron':
                    scene.addDodecahedron();
                    break;
                case 'octahedron':
                    scene.addOctahedron();
                    break;
                case 'tetrahedron':
                    scene.addTetrahedron();
                    break;
            }

            this.showNotification(`${objectType.toUpperCase()} added!`);
        }
    }
}
