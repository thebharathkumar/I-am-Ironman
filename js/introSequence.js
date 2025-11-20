export class IntroSequence {
    constructor(onCompleteCallback) {
        this.onCompleteCallback = onCompleteCallback;
        this.currentStage = 0;

        this.introScreen = document.getElementById('intro-screen');
        this.bootStage = document.getElementById('boot-stage');
        this.systemCheckStage = document.getElementById('system-check-stage');
        this.activationStage = document.getElementById('activation-stage');
        this.startButton = document.getElementById('start-button');

        this.checkItems = [
            { id: 'check-1', name: 'Neural Network', duration: 800 },
            { id: 'check-2', name: 'Holographic Display', duration: 600 },
            { id: 'check-3', name: 'Hand Tracking', duration: 900 },
            { id: 'check-4', name: 'Voice Recognition', duration: 700 },
            { id: 'check-5', name: 'Gesture Analysis', duration: 650 },
            { id: 'check-6', name: '3D Rendering Engine', duration: 850 }
        ];
    }

    async start() {
        console.log('Starting intro sequence...');

        // Stage 1: Boot sequence with Arc Reactor
        await this.runBootSequence();

        // Stage 2: System checks
        await this.runSystemChecks();

        // Stage 3: Activation (wait for user to click)
        await this.showActivationStage();
    }

    async runBootSequence() {
        console.log('Stage 1: Boot sequence');

        // Show boot stage
        this.bootStage.classList.remove('hidden');

        // Wait for progress bar animation (3 seconds)
        await this.delay(3200);

        // Hide boot stage
        this.bootStage.classList.add('hidden');
    }

    async runSystemChecks() {
        console.log('Stage 2: System checks');

        // Show system check stage
        this.systemCheckStage.classList.remove('hidden');

        // Wait a bit for the stage to appear
        await this.delay(500);

        // Run checks sequentially
        for (let i = 0; i < this.checkItems.length; i++) {
            await this.runCheck(this.checkItems[i], i * 150);
        }

        // Wait a bit before moving to activation
        await this.delay(800);

        // Hide system check stage
        this.systemCheckStage.classList.add('hidden');
    }

    async runCheck(checkItem, delay) {
        // Wait for stagger delay
        await this.delay(delay);

        const element = document.getElementById(checkItem.id);
        const icon = element.querySelector('.check-icon');
        const status = element.querySelector('.check-status');

        // Show the check item
        element.classList.add('active');

        // Start checking
        icon.classList.add('spinning');
        status.textContent = 'CHECKING';
        status.classList.add('checking');

        // Wait for check duration
        await this.delay(checkItem.duration);

        // Complete check
        icon.classList.remove('spinning');
        icon.textContent = '✓';
        status.textContent = 'ONLINE';
        status.classList.remove('checking');
        status.classList.add('success');
    }

    async showActivationStage() {
        console.log('Stage 3: Activation');

        // Show activation stage
        this.activationStage.classList.remove('hidden');

        // Setup button click handler
        return new Promise((resolve) => {
            this.startButton.addEventListener('click', async () => {
                console.log('User activated the interface');

                // Hide intro screen
                this.introScreen.classList.add('hidden');

                // Wait for transition
                await this.delay(1000);

                // Call completion callback
                if (this.onCompleteCallback) {
                    this.onCompleteCallback();
                }

                resolve();
            });
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
