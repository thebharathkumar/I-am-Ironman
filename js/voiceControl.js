export class VoiceControl {
    constructor(onCommandCallback) {
        this.onCommandCallback = onCommandCallback;
        this.recognition = null;
        this.isListening = false;
        this.initializeRecognition();
    }

    initializeRecognition() {
        // Check for browser support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.warn('Speech recognition not supported in this browser');
            document.getElementById('voice-status').textContent = 'Not Supported';
            document.getElementById('voice-status').style.color = '#ff0000';
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            this.isListening = true;
            document.getElementById('voice-status').textContent = 'Listening';
            document.getElementById('voice-status').style.color = '#00ff00';
            console.log('Voice recognition started');
        };

        this.recognition.onend = () => {
            // Restart recognition if it stops
            if (this.isListening) {
                setTimeout(() => {
                    try {
                        this.recognition.start();
                    } catch (e) {
                        console.log('Recognition restart delayed');
                    }
                }, 100);
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);

            if (event.error === 'not-allowed') {
                document.getElementById('voice-status').textContent = 'Permission Denied';
                document.getElementById('voice-status').style.color = '#ff0000';
                this.isListening = false;
            }
        };

        this.recognition.onresult = (event) => {
            const last = event.results.length - 1;
            const command = event.results[last][0].transcript;

            console.log('Voice command received:', command);

            // Check if command starts with "JARVIS" or "Jarvis"
            if (command.toLowerCase().includes('jarvis')) {
                this.onCommandCallback(command);
            }
        };
    }

    start() {
        if (!this.recognition) {
            console.warn('Speech recognition not available');
            return;
        }

        try {
            this.recognition.start();
        } catch (e) {
            console.log('Recognition already started or error:', e);
        }
    }

    stop() {
        if (!this.recognition) return;

        this.isListening = false;
        this.recognition.stop();
        document.getElementById('voice-status').textContent = 'Inactive';
        document.getElementById('voice-status').style.color = '#ffff00';
    }
}
