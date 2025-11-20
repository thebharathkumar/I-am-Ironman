export class FileBrowser {
    constructor() {
        this.fileList = document.getElementById('file-list');
        this.files = this.generateDemoFiles();
        this.selectedFile = null;
        this.highlightedFile = null;

        this.renderFiles();
    }

    generateDemoFiles() {
        // Generate demo files for demonstration
        return [
            { name: 'Project_Arc_Reactor.blueprint', type: 'blueprint', size: '2.4 MB' },
            { name: 'Mark_85_Schematics.cad', type: 'cad', size: '15.7 MB' },
            { name: 'JARVIS_Core.ai', type: 'ai', size: '342 MB' },
            { name: 'Holographic_Interface.ui', type: 'ui', size: '8.3 MB' },
            { name: 'Repulsor_Ray_Specs.pdf', type: 'document', size: '1.2 MB' },
            { name: 'Nanotech_Assembly.sim', type: 'simulation', size: '87.5 MB' },
            { name: 'Flight_Systems.log', type: 'log', size: '543 KB' },
            { name: 'Energy_Calculations.xls', type: 'spreadsheet', size: '890 KB' },
            { name: 'Suit_Diagnostics.dat', type: 'data', size: '12.1 MB' },
            { name: 'Weapon_Systems.cfg', type: 'config', size: '234 KB' }
        ];
    }

    renderFiles() {
        this.fileList.innerHTML = '';

        this.files.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.dataset.index = index;

            fileItem.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: bold; margin-bottom: 3px;">${file.name}</div>
                        <div style="font-size: 10px; color: #00d4ff;">${file.type.toUpperCase()} • ${file.size}</div>
                    </div>
                    <div style="color: #00ffff;">▶</div>
                </div>
            `;

            fileItem.addEventListener('click', () => {
                this.selectFile(index);
            });

            this.fileList.appendChild(fileItem);
        });
    }

    highlightAtPosition(x, y) {
        // Find file element at position
        const elements = document.elementsFromPoint(x, y);
        const fileItem = elements.find(el => el.classList.contains('file-item'));

        // Remove previous highlight
        if (this.highlightedFile) {
            this.highlightedFile.style.background = 'rgba(0, 100, 150, 0.3)';
        }

        if (fileItem) {
            fileItem.style.background = 'rgba(0, 150, 200, 0.5)';
            this.highlightedFile = fileItem;
        } else {
            this.highlightedFile = null;
        }
    }

    selectAtPosition(x, y) {
        const elements = document.elementsFromPoint(x, y);
        const fileItem = elements.find(el => el.classList.contains('file-item'));

        if (fileItem) {
            const index = parseInt(fileItem.dataset.index);
            this.selectFile(index);
        }
    }

    selectFile(index) {
        if (index < 0 || index >= this.files.length) return;

        this.selectedFile = this.files[index];
        console.log('Selected file:', this.selectedFile.name);

        // Visual feedback
        const fileItems = this.fileList.querySelectorAll('.file-item');
        fileItems.forEach((item, i) => {
            if (i === index) {
                item.style.borderColor = '#00ff00';
                item.style.background = 'rgba(0, 255, 0, 0.2)';
            } else {
                item.style.borderColor = '#00d4ff';
                item.style.background = 'rgba(0, 100, 150, 0.3)';
            }
        });

        // Show notification
        this.showFileNotification(this.selectedFile.name);
    }

    showFileNotification(fileName) {
        const notification = document.createElement('div');
        notification.textContent = `Opening: ${fileName}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 212, 255, 0.3);
            border: 2px solid #00d4ff;
            border-radius: 20px;
            padding: 10px 30px;
            font-size: 14px;
            color: #00ffff;
            z-index: 10000;
            animation: slideDown 2s ease-in-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 2000);
    }

    getSelectedFile() {
        return this.selectedFile;
    }
}
