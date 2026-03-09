"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

export function HeroCanvas() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer;
        let particles: THREE.Points, geometryCopy: THREE.BufferGeometry, planeArea: THREE.Mesh;

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(-200, 200);
        const colorChange = new THREE.Color();
        let isMouseDown = false;
        let animationId: number;
        let typo: any = null;

        const data = {
            text: "PELREX",
            amount: 1500,
            particleSize: 1.5,
            particleColor: 0xffffff,
            textSize: window.innerWidth > 768 ? 32 : 14, // Much smaller on mobile to fit screen
            area: 250,
            ease: 0.05,
        };

        const initParams = {
            ease: 0.05,
        }

        const currentPosition = new THREE.Vector3();

        const manager = new THREE.LoadingManager();
        const loader = new FontLoader(manager);
        const textureLoader = new THREE.TextureLoader(manager);

        let particleTexture: THREE.Texture;

        let readyCount = 0;
        const checkReady = () => {
            readyCount++;
            if (readyCount === 2) init();
        };

        loader.load(
            "https://res.cloudinary.com/dydre7amr/raw/upload/v1612950355/font_zsd4dr.json",
            (font) => {
                typo = font;
                checkReady();
            }
        );
        particleTexture = textureLoader.load(
            "https://res.cloudinary.com/dfvtkoboz/image/upload/v1605013866/particle_a64uzf.png",
            () => {
                checkReady();
            }
        );

        function init() {
            if (!containerRef.current) return;
            scene = new THREE.Scene();

            camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 10000);
            camera.position.set(0, 0, 100);

            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            containerRef.current.appendChild(renderer.domElement);

            setupParticles();
            bindEvents();
            animate();
        }

        function setupParticles() {
            const vFOV = (camera.fov * Math.PI) / 180;
            const height = 2 * Math.tan(vFOV / 2) * Math.abs(100);
            const geometry = new THREE.PlaneGeometry(height * camera.aspect, height);
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true });
            planeArea = new THREE.Mesh(geometry, material);
            planeArea.visible = false;
            scene.add(planeArea);

            createText();
        }

        function createText() {
            let thePoints: THREE.Vector3[] = [];
            let shapes = typo.generateShapes(data.text, data.textSize);
            let geometry = new THREE.ShapeGeometry(shapes);
            geometry.computeBoundingBox();

            const xMid = -0.5 * (geometry.boundingBox!.max.x - geometry.boundingBox!.min.x);
            // Keep the baseline of PELREX directly centered so it stacks perfectly on top of the subtitle.
            const yMid = 0;
            geometry.center();

            let holeShapes: any[] = [];
            for (let q = 0; q < shapes.length; q++) {
                let shape = shapes[q];
                if (shape.holes && shape.holes.length > 0) {
                    for (let j = 0; j < shape.holes.length; j++) {
                        let hole = shape.holes[j];
                        holeShapes.push(hole);
                    }
                }
            }
            shapes.push.apply(shapes, holeShapes);

            let colors: number[] = [];
            let sizes: number[] = [];

            for (let x = 0; x < shapes.length; x++) {
                let shape = shapes[x];
                const amountPoints = shape.type === "Path" ? data.amount / 2 : data.amount;
                let points = shape.getSpacedPoints(amountPoints);
                points.forEach((element: THREE.Vector2) => {
                    const a = new THREE.Vector3(element.x, element.y, 0);
                    thePoints.push(a);
                    colors.push(1, 1, 1);
                    sizes.push(1);
                });
            }

            let geoParticles = new THREE.BufferGeometry().setFromPoints(thePoints);
            geoParticles.translate(xMid, yMid, 0);
            geoParticles.setAttribute("customColor", new THREE.Float32BufferAttribute(colors, 3));
            geoParticles.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));

            const vShader = `
        attribute float size;
        attribute vec3 customColor;
        varying vec3 vColor;
        void main() {
          vColor = customColor;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `;
            const fShader = `
        uniform vec3 color;
        uniform sampler2D pointTexture;
        varying vec3 vColor;
        void main() {
          gl_FragColor = vec4(color * vColor, 1.0);
          gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
        }
      `;

            const pMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    color: { value: new THREE.Color(0xffffff) },
                    pointTexture: { value: particleTexture },
                },
                vertexShader: vShader,
                fragmentShader: fShader,
                blending: THREE.AdditiveBlending,
                depthTest: false,
                transparent: true,
            });

            particles = new THREE.Points(geoParticles, pMaterial);
            scene.add(particles);

            geometryCopy = new THREE.BufferGeometry();
            geometryCopy.copy(particles.geometry);
        }

        function bindEvents() {
            window.addEventListener("resize", onWindowResize);
            document.addEventListener("mousedown", onMouseDown);
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function onMouseDown(event: MouseEvent) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
            vector.unproject(camera);
            const dir = vector.sub(camera.position).normalize();
            const distance = -camera.position.z / dir.z;
            currentPosition.copy(camera.position).add(dir.multiplyScalar(distance));
            isMouseDown = true;
            initParams.ease = 0.01;
        }

        function onMouseUp() {
            isMouseDown = false;
            initParams.ease = 0.05;
        }

        function onMouseMove(event: MouseEvent) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }

        function distance(x1: number, y1: number, x2: number, y2: number) {
            return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        }

        function animate() {
            animationId = requestAnimationFrame(animate);
            renderParticles();
            renderer.render(scene, camera);
        }

        function renderParticles() {
            if (!particles) return;
            const time = ((0.001 * performance.now()) % 12) / 12;
            const zigzagTime = (1 + Math.sin(time * 2 * Math.PI)) / 6;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(planeArea);

            if (intersects.length > 0) {
                const pos = particles.geometry.attributes.position as THREE.BufferAttribute;
                const copy = geometryCopy.attributes.position as THREE.BufferAttribute;
                const coulors = particles.geometry.attributes.customColor as THREE.BufferAttribute;
                const size = particles.geometry.attributes.size as THREE.BufferAttribute;

                const mx = intersects[0].point.x;
                const my = intersects[0].point.y;
                const mz = intersects[0].point.z;

                for (let i = 0, l = pos.count; i < l; i++) {
                    const initX = copy.getX(i);
                    const initY = copy.getY(i);
                    const initZ = copy.getZ(i);

                    let px = pos.getX(i);
                    let py = pos.getY(i);
                    let pz = pos.getZ(i);

                    // Vibrant Purple to Bright Blue Gradient across the text
                    const normalizedX = (initX + 150) / 300;
                    const mappedHue = 0.76 - (normalizedX * 0.18); // Deep Purple (0.76) to Bright Blue (0.58)

                    colorChange.setHSL(mappedHue, 1.0, 0.5); // 1.0 saturation and 0.5 lightness for max vibrancy
                    coulors.setXYZ(i, colorChange.r, colorChange.g, colorChange.b);
                    coulors.needsUpdate = true;

                    size.array[i] = data.particleSize;
                    size.needsUpdate = true;

                    let dx = mx - px;
                    let dy = my - py;

                    const mouseDistance = distance(mx, my, px, py);
                    let d = (dx = mx - px) * dx + (dy = my - py) * dy;
                    const f = -data.area / d;

                    if (isMouseDown) {
                        const t = Math.atan2(dy, dx);
                        px -= f * Math.cos(t);
                        py -= f * Math.sin(t);

                        colorChange.setHSL(mappedHue + zigzagTime, 1.0, 0.6);
                        coulors.setXYZ(i, colorChange.r, colorChange.g, colorChange.b);
                        coulors.needsUpdate = true;

                        if (px > initX + 70 || px < initX - 70 || py > initY + 70 || py < initY - 70) {
                            colorChange.setHSL(mappedHue, 1.0, 0.5);
                            coulors.setXYZ(i, colorChange.r, colorChange.g, colorChange.b);
                            coulors.needsUpdate = true;
                        }
                    } else {
                        if (mouseDistance < data.area) {
                            if (i % 5 === 0) {
                                const t = Math.atan2(dy, dx);
                                px -= 0.03 * Math.cos(t);
                                py -= 0.03 * Math.sin(t);

                                colorChange.setHSL(mappedHue, 1.0, 0.6);
                                coulors.setXYZ(i, colorChange.r, colorChange.g, colorChange.b);
                                coulors.needsUpdate = true;

                                size.array[i] = data.particleSize / 1.2;
                                size.needsUpdate = true;
                            } else {
                                const t = Math.atan2(dy, dx);
                                px += f * Math.cos(t);
                                py += f * Math.sin(t);

                                pos.setXYZ(i, px, py, pz);
                                pos.needsUpdate = true;

                                size.array[i] = data.particleSize * 1.5;
                                size.needsUpdate = true;
                            }

                            if (px > initX + 10 || px < initX - 10 || py > initY + 10 || py < initY - 10) {
                                colorChange.setHSL(mappedHue, 1.0, 0.5);
                                coulors.setXYZ(i, colorChange.r, colorChange.g, colorChange.b);
                                coulors.needsUpdate = true;

                                size.array[i] = data.particleSize / 1.8;
                                size.needsUpdate = true;
                            }
                        }
                    }

                    px += (initX - px) * initParams.ease;
                    py += (initY - py) * initParams.ease;
                    pz += (initZ - pz) * initParams.ease;

                    pos.setXYZ(i, px, py, pz);
                    pos.needsUpdate = true;
                }
            }
        }

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", onWindowResize);
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            if (containerRef.current && renderer) {
                containerRef.current.removeChild(renderer.domElement);
            }
            scene?.clear();
        };
    }, []);

    return <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0" />;
}
