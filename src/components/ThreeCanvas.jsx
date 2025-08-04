import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import classes from '../styles/LandingPage.module.css';

const ThreeCanvas = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const currentMount = mountRef.current;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: currentMount,
            alpha: true
        });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Globe Geometry
        const globeGeometry = new THREE.SphereGeometry(1, 32, 32);

        // Wireframe material
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            // --- THIS IS THE CHANGE ---
            color: 0x3A506B, // Changed back to the theme's blue-gray color
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });
        const wireframe = new THREE.Mesh(globeGeometry, wireframeMaterial);
        scene.add(wireframe);

        // Scale and position the globe
        const scale = Math.min(Math.max(window.innerWidth / 700, 2.5), 4);
        wireframe.scale.set(scale, scale, scale);
        
        // Move the globe slightly down
        wireframe.position.y = -0.2;
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xF0F3F5, 0.8);
        scene.add(ambientLight);

        camera.position.z = 5;

        // Handle window resizing
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);

            const newScale = Math.min(Math.max(window.innerWidth / 700, 2.5), 4);
            wireframe.scale.set(newScale, newScale, newScale);
        };
        window.addEventListener('resize', handleResize);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            wireframe.rotation.y += 0.0005;
            renderer.render(scene, camera);
        };
        animate();

        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas ref={mountRef} className={classes.bgCanvas} />
    );
};

export default ThreeCanvas;