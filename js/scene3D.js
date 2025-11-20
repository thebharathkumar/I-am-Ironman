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

    addCylinder() {
        const geometry = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 32);
        const material = new THREE.MeshPhongMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0.7,
            wireframe: false,
            emissive: 0xffaa00,
            emissiveIntensity: 0.3
        });
        const cylinder = new THREE.Mesh(geometry, material);

        const wireframe = new THREE.LineSegments(
            new THREE.EdgesGeometry(geometry),
            new THREE.LineBasicMaterial({ color: 0xffaa00, linewidth: 2 })
        );
        cylinder.add(wireframe);

        cylinder.position.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            0
        );

        this.scene.add(cylinder);
        this.objects.push(cylinder);
        this.selectedObject = cylinder;

        return cylinder;
    }

    addCone() {
        const geometry = new THREE.ConeGeometry(0.6, 1.2, 32);
        const material = new THREE.MeshPhongMaterial({
            color: 0xff6600,
            transparent: true,
            opacity: 0.7,
            wireframe: false,
            emissive: 0xff6600,
            emissiveIntensity: 0.3
        });
        const cone = new THREE.Mesh(geometry, material);

        const wireframe = new THREE.LineSegments(
            new THREE.EdgesGeometry(geometry),
            new THREE.LineBasicMaterial({ color: 0xff6600, linewidth: 2 })
        );
        cone.add(wireframe);

        cone.position.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            0
        );

        this.scene.add(cone);
        this.objects.push(cone);
        this.selectedObject = cone;

        return cone;
    }

    addDodecahedron() {
        const geometry = new THREE.DodecahedronGeometry(0.6);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00ffaa,
            transparent: true,
            opacity: 0.7,
            wireframe: false,
            emissive: 0x00ffaa,
            emissiveIntensity: 0.3
        });
        const dodeca = new THREE.Mesh(geometry, material);

        const wireframe = new THREE.LineSegments(
            new THREE.EdgesGeometry(geometry),
            new THREE.LineBasicMaterial({ color: 0x00ffaa, linewidth: 2 })
        );
        dodeca.add(wireframe);

        dodeca.position.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            0
        );

        this.scene.add(dodeca);
        this.objects.push(dodeca);
        this.selectedObject = dodeca;

        return dodeca;
    }

    addOctahedron() {
        const geometry = new THREE.OctahedronGeometry(0.7);
        const material = new THREE.MeshPhongMaterial({
            color: 0xaa00ff,
            transparent: true,
            opacity: 0.7,
            wireframe: false,
            emissive: 0xaa00ff,
            emissiveIntensity: 0.3
        });
        const octa = new THREE.Mesh(geometry, material);

        const wireframe = new THREE.LineSegments(
            new THREE.EdgesGeometry(geometry),
            new THREE.LineBasicMaterial({ color: 0xaa00ff, linewidth: 2 })
        );
        octa.add(wireframe);

        octa.position.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            0
        );

        this.scene.add(octa);
        this.objects.push(octa);
        this.selectedObject = octa;

        return octa;
    }

    addTetrahedron() {
        const geometry = new THREE.TetrahedronGeometry(0.7);
        const material = new THREE.MeshPhongMaterial({
            color: 0xffff00,
            transparent: true,
            opacity: 0.7,
            wireframe: false,
            emissive: 0xffff00,
            emissiveIntensity: 0.3
        });
        const tetra = new THREE.Mesh(geometry, material);

        const wireframe = new THREE.LineSegments(
            new THREE.EdgesGeometry(geometry),
            new THREE.LineBasicMaterial({ color: 0xffff00, linewidth: 2 })
        );
        tetra.add(wireframe);

        tetra.position.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            0
        );

        this.scene.add(tetra);
        this.objects.push(tetra);
        this.selectedObject = tetra;

        return tetra;
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

        // Apply scale based on pinch distance - WITH CLAMPING to prevent disappearing
        if (scale !== undefined) {
            const targetScale = Math.max(0.5, Math.min(3.0, scale * 5)); // Clamp between 0.5 and 3.0
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
        const time = Date.now() * 0.001; // Time in seconds

        // Crazy animations for objects!
        this.objects.forEach((obj, index) => {
            // Auto-rotate with varying speeds
            obj.rotation.y += 0.002 + (index * 0.0005);
            obj.rotation.x += 0.001 + (index * 0.0003);

            // Pulsing scale effect (breathing)
            const pulseScale = 1 + Math.sin(time * 2 + index) * 0.05;
            const baseScale = obj.scale.x;
            obj.scale.set(baseScale * pulseScale, baseScale * pulseScale, baseScale * pulseScale);

            // Floating up and down
            obj.position.y += Math.sin(time * 1.5 + index) * 0.002;

            // Pulsing glow/emission
            if (obj.material && obj.material.emissiveIntensity !== undefined) {
                obj.material.emissiveIntensity = 0.3 + Math.sin(time * 3 + index) * 0.2;
            }

            // Pulsing wireframe opacity
            if (obj.children.length > 0) {
                const wireframe = obj.children[0];
                if (wireframe.material && wireframe.material.opacity !== undefined) {
                    wireframe.material.opacity = 0.7 + Math.sin(time * 2 + index) * 0.3;
                    wireframe.material.transparent = true;
                }
            }

            // Highlight selected object with extra effects
            if (obj === this.selectedObject) {
                // Extra glow for selected object
                if (obj.material) {
                    const glowIntensity = 0.5 + Math.sin(time * 5) * 0.3;
                    obj.material.emissiveIntensity = glowIntensity;
                }

                // Spin selected object faster
                obj.rotation.y += 0.01;
            }
        });

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    getCamera() {
        return this.camera;
    }

    getRenderer() {
        return this.renderer;
    }
}
