export class Scene3D {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.selectedObject = null;
        this.objects = [];

        this.initialize();
    }

    initialize() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = null; // Transparent

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0); // Transparent
        this.container.appendChild(this.renderer.domElement);

        // Add lights
        const ambientLight = new THREE.AmbientLight(0x00d4ff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0x00ffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0x00d4ff, 1, 100);
        pointLight.position.set(0, 0, 5);
        this.scene.add(pointLight);

        // Add default objects
        this.addDefaultObjects();

        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    addDefaultObjects() {
        // Add a default cube
        this.addCube();
    }

    addCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.7,
            wireframe: false,
            emissive: 0x00d4ff,
            emissiveIntensity: 0.3
        });
        const cube = new THREE.Mesh(geometry, material);

        // Add wireframe overlay
        const wireframe = new THREE.LineSegments(
            new THREE.EdgesGeometry(geometry),
            new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 2 })
        );
        cube.add(wireframe);

        cube.position.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            0
        );

        this.scene.add(cube);
        this.objects.push(cube);
        this.selectedObject = cube;

        return cube;
    }

    addSphere() {
        const geometry = new THREE.SphereGeometry(0.6, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: 0xff00ff,
            transparent: true,
            opacity: 0.7,
            wireframe: false,
            emissive: 0xff00ff,
            emissiveIntensity: 0.3
        });
        const sphere = new THREE.Mesh(geometry, material);

        const wireframe = new THREE.LineSegments(
            new THREE.EdgesGeometry(geometry),
            new THREE.LineBasicMaterial({ color: 0xff00ff, linewidth: 2 })
        );
        sphere.add(wireframe);

        sphere.position.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            0
        );

        this.scene.add(sphere);
        this.objects.push(sphere);
        this.selectedObject = sphere;

        return sphere;
    }

    addTorus() {
        const geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.7,
            wireframe: false,
            emissive: 0x00ff00,
            emissiveIntensity: 0.3
        });
        const torus = new THREE.Mesh(geometry, material);

        const wireframe = new THREE.LineSegments(
            new THREE.EdgesGeometry(geometry),
            new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 })
        );
        torus.add(wireframe);

        torus.position.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            0
        );

        this.scene.add(torus);
        this.objects.push(torus);
        this.selectedObject = torus;

        return torus;
    }

    addScannedObject(imageData) {
        // Create a plane with the scanned image as texture
        const texture = new THREE.Texture(imageData);
        texture.needsUpdate = true;

        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });

        const plane = new THREE.Mesh(geometry, material);
        plane.position.set(0, 0, 0);

        this.scene.add(plane);
        this.objects.push(plane);
        this.selectedObject = plane;

        return plane;
    }

    manipulateObject(rotation, scale) {
        if (!this.selectedObject) return;

        // Apply rotation
        if (rotation) {
            this.selectedObject.rotation.x += rotation.x * 0.1;
            this.selectedObject.rotation.y += rotation.y * 0.1;
            this.selectedObject.rotation.z += rotation.z * 0.1;
        }

        // Apply scale based on pinch distance
        if (scale !== undefined) {
            const targetScale = scale * 5; // Amplify the scale effect
            this.selectedObject.scale.setScalar(targetScale);
        }
    }

    rotateObject(deltaX, deltaY) {
        if (!this.selectedObject) return;

        this.selectedObject.rotation.y += deltaX;
        this.selectedObject.rotation.x += deltaY;
    }

    zoomObject(factor) {
        if (!this.selectedObject) return;

        this.selectedObject.scale.multiplyScalar(factor);
    }

    resetView() {
        if (!this.selectedObject) return;

        this.selectedObject.rotation.set(0, 0, 0);
        this.selectedObject.scale.set(1, 1, 1);
        this.selectedObject.position.set(0, 0, 0);
    }

    clearObjects() {
        // Remove all objects except keep at least one
        while (this.objects.length > 1) {
            const obj = this.objects.pop();
            this.scene.remove(obj);
        }

        // Reset the remaining object
        if (this.objects.length > 0) {
            this.selectedObject = this.objects[0];
            this.resetView();
        }
    }

    getSelectedObjectInfo() {
        if (!this.selectedObject) {
            return {
                type: 'None',
                rotation: { x: 0, y: 0, z: 0 },
                scale: 1.0
            };
        }

        const rotation = this.selectedObject.rotation;
        const scale = this.selectedObject.scale.x;

        return {
            type: this.selectedObject.geometry.type.replace('Geometry', ''),
            rotation: {
                x: Math.round(rotation.x * 180 / Math.PI),
                y: Math.round(rotation.y * 180 / Math.PI),
                z: Math.round(rotation.z * 180 / Math.PI)
            },
            scale: scale.toFixed(2)
        };
    }

    render() {
        // Auto-rotate objects slightly for effect
        this.objects.forEach(obj => {
            obj.rotation.y += 0.001;
            obj.rotation.x += 0.0005;
        });

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
