export class UIPanels {
    constructor() {
        this.panels = {
            status: document.getElementById('status-panel'),
            file: document.getElementById('file-panel'),
            info: document.getElementById('info-panel'),
            scanner: document.getElementById('scanner-panel')
        };

        this.voiceFeedback = document.getElementById('voice-feedback');
        this.voiceCommandText = document.getElementById('voice-command-text');
    }

    togglePanel(panelId, show) {
        const panel = document.getElementById(panelId);
        if (!panel) return;

        if (show) {
            panel.classList.remove('hidden');
        } else {
            panel.classList.add('hidden');
        }
    }

    updateGestureStatus(gesture) {
        const gestureStatus = document.getElementById('gesture-status');
        if (gestureStatus) {
            gestureStatus.textContent = gesture;

            // Color code based on gesture
            const colors = {
                'pinch': '#ff00ff',
                'open_palm': '#00ff00',
                'fist': '#ff0000',
                'pointing': '#ffff00',
                'peace': '#00ffff',
                'thumbs_up': '#00ff00',
                'unknown': '#888888'
            };

            gestureStatus.style.color = colors[gesture] || '#00ffff';
        }
    }

    updateObjectInfo(info) {
        const objectType = document.getElementById('object-type');
        const objectRotation = document.getElementById('object-rotation');
        const objectScale = document.getElementById('object-scale');

        if (objectType) {
            objectType.textContent = info.type;
        }

        if (objectRotation) {
            objectRotation.textContent = `${info.rotation.x}°, ${info.rotation.y}°, ${info.rotation.z}°`;
        }

        if (objectScale) {
            objectScale.textContent = `${info.scale}x`;
        }
    }

    showVoiceCommand(command) {
        this.voiceCommandText.textContent = command;
        this.voiceFeedback.classList.remove('hidden');

        // Hide after 2 seconds
        setTimeout(() => {
            this.voiceFeedback.classList.add('hidden');
        }, 2000);
    }

    showNotification(message, duration = 3000) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 212, 255, 0.2);
            border: 2px solid #00d4ff;
            border-radius: 10px;
            padding: 20px 40px;
            font-size: 18px;
            color: #00ffff;
            z-index: 10000;
            animation: fadeInOut ${duration}ms ease-in-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            document.body.removeChild(notification);
        }, duration);
    }
}
