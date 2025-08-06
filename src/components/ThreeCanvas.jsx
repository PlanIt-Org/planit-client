import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import classes from '../styles/LandingPage.module.css';

const ThreeCanvas = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: currentMount,
            alpha: true,
            antialias: true,
        });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Geometry Logic
        const points = [];
        const radius = 1;
        const latLines = 16;
        const lonLines = 16;
        const segments = 64;

        // Create Latitude Lines (horizontal)
        for (let i = 1; i < latLines; i++) {
            const y = radius * (1 - (2 * i / latLines));
            const r = Math.sqrt(radius * radius - y * y);
            for (let j = 0; j < segments; j++) {
                const angle1 = (j / segments) * Math.PI * 2;
                const angle2 = ((j + 1) / segments) * Math.PI * 2;
                points.push(new THREE.Vector3(r * Math.cos(angle1), y, r * Math.sin(angle1)));
                points.push(new THREE.Vector3(r * Math.cos(angle2), y, r * Math.sin(angle2)));
            }
        }

        // Create Longitude Lines (vertical)
        for (let i = 0; i < lonLines; i++) {
            const angle = (i / lonLines) * Math.PI * 2;
            for (let j = 0; j < segments; j++) {
                const theta1 = -Math.PI / 2 + (j / segments) * Math.PI;
                const theta2 = -Math.PI / 2 + ((j + 1) / segments) * Math.PI;
                const p1 = new THREE.Vector3(Math.cos(theta1) * Math.cos(angle), Math.sin(theta1), Math.cos(theta1) * Math.sin(angle));
                const p2 = new THREE.Vector3(Math.cos(theta2) * Math.cos(angle), Math.sin(theta2), Math.cos(theta2) * Math.sin(angle));
                points.push(p1, p2);
            }
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0x3A506B,
            transparent: true,
            opacity: 0.4,
        });
        
        const lineSphere = new THREE.LineSegments(geometry, material);
        scene.add(lineSphere);

        // Scale and position the new globe
        const scale = Math.min(Math.max(window.innerWidth / 700, 2.5), 4);
        lineSphere.scale.set(scale, scale, scale);
        lineSphere.position.y = -0.2;
        
        camera.position.z = 5;

        // Handle window resizing
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            const newScale = Math.min(Math.max(window.innerWidth / 700, 2.5), 4);
            lineSphere.scale.set(newScale, newScale, newScale);
        };
        window.addEventListener('resize', handleResize);

        let animationFrameId;
        // Animation loop
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            lineSphere.rotation.y += 0.0005;
            renderer.render(scene, camera);
        };
        animate();

        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            // Properly dispose of three.js objects to prevent memory leaks
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <canvas ref={mountRef} className={classes.bgCanvas} />
    );
};

export default ThreeCanvas;