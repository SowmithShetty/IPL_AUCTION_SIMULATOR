import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    let renderer, scene, camera, particles, animationId;

    const initThree = () => {
      if (!containerRef.current) return;

      containerRef.current.innerHTML = '';
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      containerRef.current.appendChild(renderer.domElement);

      const geometry = new THREE.BufferGeometry();
      const count = 2200;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      const color1 = new THREE.Color(0x10b981); // Emerald
      const color2 = new THREE.Color(0xe11d48); // Rose
      const color3 = new THREE.Color(0x8b5cf6); // Violet
      const color4 = new THREE.Color(0xf59e0b); // Amber

      for (let i = 0; i < count * 3; i += 3) {
        const r = 12 + Math.random() * 8;
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i] = r * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = r * Math.cos(phi);

        const rand = Math.random();
        let mixedColor = color1.clone();
        if (rand > 0.75) mixedColor.lerp(color2, Math.random());
        else if (rand > 0.5) mixedColor.lerp(color3, Math.random());
        else if (rand > 0.25) mixedColor.lerp(color4, Math.random() * 0.5);

        colors[i] = mixedColor.r;
        colors[i + 1] = mixedColor.g;
        colors[i + 2] = mixedColor.b;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const context = canvas.getContext('2d');
      const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.4, 'rgba(255,255,255,0.6)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 32, 32);
      const texture = new THREE.CanvasTexture(canvas);

      const material = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.5,
        map: texture,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);
      camera.position.z = 8;

      let mouseX = 0;
      let mouseY = 0;
      const onDocumentMouseMove = (event) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.0005;
        mouseY = (event.clientY - window.innerHeight / 2) * 0.0005;
      };
      document.addEventListener('mousemove', onDocumentMouseMove);

      const animate = () => {
        animationId = requestAnimationFrame(animate);
        particles.rotation.x += 0.0002;
        particles.rotation.y += 0.0004;
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        document.removeEventListener('mousemove', onDocumentMouseMove);
        window.removeEventListener('resize', handleResize);
      };
    };

    const cleanup = initThree();

    return () => {
      if (cleanup) cleanup();
      if (animationId) cancelAnimationFrame(animationId);
      if (renderer) renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen" />;
};

export default ThreeBackground;
