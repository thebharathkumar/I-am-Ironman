export class ObjectScanner {
    constructor() {
        this.videoElement = document.getElementById('webcam');
        this.previewElement = document.getElementById('scanner-preview');
        this.scanCallback = null;
        this.isScanning = false;
    }

    scanObject(callback) {
        this.scanCallback = callback;
        this.performScan();
    }

    performScan() {
        if (this.isScanning) return;

        this.isScanning = true;

        // Show scanning animation
        this.showScanningAnimation();

        // Capture frame from video
        setTimeout(() => {
            const canvas = document.createElement('canvas');
            canvas.width = this.videoElement.videoWidth;
            canvas.height = this.videoElement.videoHeight;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(this.videoElement, 0, 0);

            // Get image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            // Process the image (apply holographic effect)
            this.applyHolographicEffect(imageData);

            // Put the processed image back
            ctx.putImageData(imageData, 0, 0);

            // Create image element for the scanned object
            const img = new Image();
            img.src = canvas.toDataURL();

            img.onload = () => {
                // Call callback with the image
                if (this.scanCallback) {
                    this.scanCallback(img);
                }

                this.isScanning = false;
                this.hideScanningAnimation();
            };

        }, 2000);
    }

    applyHolographicEffect(imageData) {
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            // Get RGB values
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Convert to grayscale
            const gray = (r + g + b) / 3;

            // Apply cyan/blue tint
            data[i] = gray * 0.3;         // R
            data[i + 1] = gray * 0.8;     // G
            data[i + 2] = gray * 1.0;     // B

            // Increase contrast
            const contrast = 1.5;
            data[i] = ((data[i] / 255 - 0.5) * contrast + 0.5) * 255;
            data[i + 1] = ((data[i + 1] / 255 - 0.5) * contrast + 0.5) * 255;
            data[i + 2] = ((data[i + 2] / 255 - 0.5) * contrast + 0.5) * 255;
        }
    }

    showScanningAnimation() {
        this.previewElement.innerHTML = `
            <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <div style="font-size: 48px; color: #00d4ff; animation: pulse 1s ease-in-out infinite;">⌖</div>
                <div style="margin-top: 10px; color: #00ffff; font-size: 14px;">SCANNING...</div>
                <div style="margin-top: 20px; width: 80%; height: 4px; background: rgba(0, 212, 255, 0.2); border-radius: 2px; overflow: hidden;">
                    <div style="width: 100%; height: 100%; background: #00d4ff; animation: scanProgress 2s ease-in-out;"></div>
                </div>
            </div>
        `;

        // Add scanning animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.7; }
            }
            @keyframes scanProgress {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(0); }
            }
        `;
        document.head.appendChild(style);
    }

    hideScanningAnimation() {
        this.previewElement.innerHTML = `
            <div style="color: #00ff00; font-size: 48px;">✓</div>
            <div style="margin-top: 10px; color: #00ffff; font-size: 14px;">SCAN COMPLETE</div>
        `;

        setTimeout(() => {
            this.previewElement.innerHTML = '';
        }, 1500);
    }
}
