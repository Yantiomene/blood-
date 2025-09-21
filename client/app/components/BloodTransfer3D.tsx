"use client";

import React, { useEffect, useRef } from "react";

// 3D blood transfer animation using Three.js via CDN (no npm deps needed)
// Renders a simple donor and recipient with a tube and an animated droplet moving from left to right.

const loadScript = (src: string) => {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
    if (existing) {
      if (existing.getAttribute("data-loaded") === "true") return resolve();
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)));
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.addEventListener("load", () => {
      script.setAttribute("data-loaded", "true");
      resolve();
    });
    script.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)));
    document.body.appendChild(script);
  });
};

declare global {
  interface Window { [key: string]: any }
}

const BloodTransfer3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cleanupRef = useRef<() => void>(() => {});

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        if (typeof window === "undefined") return;
        // Load three.js from CDN
        await loadScript("https://unpkg.com/three@0.158.0/build/three.min.js");
        if (!mounted) return;
        const THREE = (window as any).THREE;
        if (!THREE) return;

        // Init renderer
        const container = containerRef.current!;
        const width = container.clientWidth || 600;
        const height = Math.min(300, Math.max(200, Math.round(width * 0.4)));
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setClearColor(0xf8fafc, 1);
        container.innerHTML = "";
        container.appendChild(renderer.domElement);

        // Scene and camera
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
        camera.position.set(0, 1.2, 6);

        // Lights
        const ambient = new THREE.AmbientLight(0xffffff, 0.7);
        const dir1 = new THREE.DirectionalLight(0xffffff, 0.8);
        dir1.position.set(3, 4, 3);
        const dir2 = new THREE.DirectionalLight(0xffffff, 0.4);
        dir2.position.set(-2, 2, 1);
        scene.add(ambient, dir1, dir2);

        // Subtle ground with gradient effect
        const planeGeo = new THREE.PlaneGeometry(20, 8);
        const planeMat = new THREE.MeshStandardMaterial({ 
          color: 0xf1f5f9, 
          roughness: 0.9, 
          metalness: 0.05 
        });
        const ground = new THREE.Mesh(planeGeo, planeMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1.6;
        scene.add(ground);

        // Enhanced human builder with better proportions and materials
        const makeHuman = (x: number, isDonor: boolean = false) => {
          const group = new THREE.Group();
          
          // Different materials for donor vs recipient
          const skinColor = isDonor ? 0xfdbcb4 : 0xe2e8f0; // Healthy vs pale
          const clothingColor = isDonor ? 0x3b82f6 : 0x64748b; // Vibrant vs muted
          
          const skinMat = new THREE.MeshStandardMaterial({ 
            color: skinColor, 
            roughness: 0.8, 
            metalness: 0.1 
          });
          // Store original colors for transformation
          skinMat.userData = { 
            originalColor: new THREE.Color(skinColor),
            targetColor: isDonor ? new THREE.Color(skinColor) : new THREE.Color(0xfdbcb4) // Recipients target healthy color
          };
          const clothingMat = new THREE.MeshStandardMaterial({ 
            color: clothingColor, 
            roughness: 0.7, 
            metalness: 0.05 
          });

          // Head with better proportions
          const head = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), skinMat);
          head.position.set(0, 1.4, 0);
          
          // Body with slight taper
          const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 1.4, 24), clothingMat);
          torso.position.set(0, 0.5, 0);
          
          // Arms with better positioning
          const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 1.0, 16), skinMat);
          armL.position.set(-0.5, 0.8, 0);
          armL.rotation.z = Math.PI / 5;
          
          const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 1.0, 16), skinMat);
          armR.position.set(0.5, 0.8, 0);
          armR.rotation.z = -Math.PI / 5;
          
          // Legs with better proportions
          const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 1.1, 20), clothingMat);
          legL.position.set(-0.2, -0.8, 0);
          
          const legR = legL.clone();
          legR.position.x = 0.2;
          
          group.add(head, torso, legL, legR, armL, armR);
          group.position.x = x;
          
          return { group, armR, armL, head, torso };
        };

        const donor = makeHuman(-3.5, true);
        const recipient = makeHuman(3.5, false);
        scene.add(donor.group, recipient.group);

        // Enhanced tube connection
        const donorHandPos = new THREE.Vector3(-2.8, 0.4, 0);
        const recipientHandPos = new THREE.Vector3(2.8, 0.4, 0);
        const mid1 = new THREE.Vector3(-1, 1.2, 0.5);
        const mid2 = new THREE.Vector3(1, 1.2, -0.5);

        const curve = new THREE.CatmullRomCurve3([donorHandPos, mid1, mid2, recipientHandPos]);

        // Enhanced tube with transparency
        const tubeGeo = new THREE.TubeGeometry(curve, 120, 0.08, 20, false);
        const tubeMat = new THREE.MeshStandardMaterial({ 
          color: 0xb91c1c, 
          emissive: 0x7f1d1d, 
          emissiveIntensity: 0.2,
          roughness: 0.3,
          metalness: 0.1,
          transparent: true,
          opacity: 0.9
        });
        const tube = new THREE.Mesh(tubeGeo, tubeMat);
        scene.add(tube);

        // Particle system for blood flow
        const particleCount = 50;
        const particles = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        const particleColors = new Float32Array(particleCount * 3);
        const particleSizes = new Float32Array(particleCount);

        // Initialize particles along the curve
        for (let i = 0; i < particleCount; i++) {
          const t = i / particleCount;
          const pos = curve.getPointAt(t);
          
          particlePositions[i * 3] = pos.x;
          particlePositions[i * 3 + 1] = pos.y;
          particlePositions[i * 3 + 2] = pos.z;
          
          // Red color with slight variation
          particleColors[i * 3] = 0.9 + Math.random() * 0.1;     // R
          particleColors[i * 3 + 1] = 0.1 + Math.random() * 0.2; // G  
          particleColors[i * 3 + 2] = 0.1 + Math.random() * 0.2; // B
          
          particleSizes[i] = 0.5 + Math.random() * 1.0;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
        particles.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

        const particleMaterial = new THREE.PointsMaterial({
          size: 0.7,  // Much larger so particles are visible
          vertexColors: true,
          transparent: true,
          opacity: 0.7,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true  // Makes particles smaller when far away
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);

        
        // Enhanced droplet
        const dropMat = new THREE.MeshStandardMaterial({ 
          color: 0xef4444, 
          emissive: 0x991b1b, 
          emissiveIntensity: 0.4,
          roughness: 0.3,
          metalness: 0.2
        });
        const drop = new THREE.Mesh(new THREE.SphereGeometry(0.15, 32, 32), dropMat);
        scene.add(drop);

        // Animation loop
        let t = 0;
        let raf = 0 as any;
        const tick = () => {
          t += 0.005;
          if (t > 1) t = 0;
          
          const p = curve.getPointAt(t);
          const tAhead = curve.getPointAt(Math.min(1, t + 0.01));
          drop.position.copy(p);
          drop.lookAt(tAhead);

          // Animate particles
          const time = performance.now() * 0.001;
          const positions = particleSystem.geometry.attributes.position.array;

          for (let i = 0; i < particleCount; i++) {
            // Each particle moves along the curve with staggered timing
            let particleT = ((time * 0.2) + (i * 0.04)) % 1;  // Slower, more spread out
            const pos = curve.getPointAt(particleT);
            
            positions[i * 3] = pos.x + (Math.sin(time * 3 + i * 0.5) * 0.015);     
            positions[i * 3 + 1] = pos.y + (Math.cos(time * 2 + i * 0.3) * 0.015); 
            positions[i * 3 + 2] = pos.z;                                      
          }

          particleSystem.geometry.attributes.position.needsUpdate = true;

          // Pulse the particle opacity
          particleMaterial.opacity = 0.6 + Math.sin(time * 3) * 0.2;

          // Recipient transformation based on blood flow progress
          const transformProgress = Math.min(t * 2, 1); // Transform faster than droplet movement
          const recipientSkinMat = recipient.head.material;

          if (transformProgress > 0.5) { // Start transformation when droplet is 30% through
            const healthProgress = Math.min((transformProgress - 0.3) / 0.7, 1); // Scale from 30% to 100%
            
            // Gradually warm the recipient's skin color
            recipientSkinMat.color.lerpColors(
              recipientSkinMat.userData.originalColor,
              recipientSkinMat.userData.targetColor,
              healthProgress * 0.6 // Only 60% transformation for subtle effect
            );
            
            // Add subtle glow effect
            recipientSkinMat.emissive.setHex(0x332211);
            recipientSkinMat.emissiveIntensity = healthProgress * 0.15;
          }

          // Create glowing aura around recipient
          const auraGeometry = new THREE.RingGeometry(1.1, 1.2, 10);
          const auraMaterial = new THREE.MeshBasicMaterial({
            color: 0x44ff88,
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide
          });
          const aura = new THREE.Mesh(auraGeometry, auraMaterial);
          aura.rotation.x = -Math.PI / 2;
          aura.position.set(2.1, -1.2, 0); // Position under recipient
          scene.add(aura);

          // Create energy particles around recipient
          const energyCount = 10;
          const energyGeometry = new THREE.BufferGeometry();
          const energyPositions = new Float32Array(energyCount * 3);
          const energyColors = new Float32Array(energyCount * 3);

          for (let i = 0; i < energyCount; i++) {
            const angle = (i / energyCount) * Math.PI * 2;
            const radius = 1.5 + Math.random() * 0.5;
            
            energyPositions[i * 3] = 3.5 + Math.cos(angle) * radius;     // X around recipient
            energyPositions[i * 3 + 1] = 0.5 + Math.random() * 1.5;     // Y at body level
            energyPositions[i * 3 + 2] = Math.sin(angle) * radius;      // Z for 3D circle
            
            // Green/golden energy colors
            energyColors[i * 3] = 0.3 + Math.random() * 0.4;     // R
            energyColors[i * 3 + 1] = 0.8 + Math.random() * 0.2; // G
            energyColors[i * 3 + 2] = 0.2 + Math.random() * 0.3; // B
          }

          energyGeometry.setAttribute('position', new THREE.BufferAttribute(energyPositions, 3));
          energyGeometry.setAttribute('color', new THREE.BufferAttribute(energyColors, 3));

          const energyMaterial = new THREE.PointsMaterial({
            size: 3.0,
            vertexColors: true,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
          });

          const energyParticles = new THREE.Points(energyGeometry, energyMaterial);
          scene.add(energyParticles);

          // Animate healing aura and energy particles
          if (transformProgress > 0.4) { // Show effects after 40% progress
            const auraIntensity = Math.min((transformProgress - 0.4) / 0.6, 1);
            
            // Pulsing aura
            aura.material.opacity = auraIntensity * 0.3 * (0.7 + Math.sin(time * 4) * 0.3);
            aura.rotation.z += 0.01; // Slow rotation
            
            // Floating energy particles
            energyMaterial.opacity = auraIntensity * 0.6;
            const energyPos = energyParticles.geometry.attributes.position.array;
            
            for (let i = 0; i < energyCount; i++) {
              const baseY = 0.5 + (i / energyCount) * 1.5;
              energyPos[i * 3 + 1] = baseY + Math.sin(time * 2 + i) * 0.2; // Floating up and down
            }
            energyParticles.geometry.attributes.position.needsUpdate = true;
          }
          
          // Subtle breathing animation
          const breathe = Math.sin(performance.now() * 0.002) * 0.03 + 1;
          donor.torso.scale.y = breathe;
          recipient.torso.scale.y = breathe * 0.95; // Weaker breathing for recipient
          
          // Gentle head movement
          donor.head.rotation.y = Math.sin(performance.now() * 0.001) * 0.1;
          recipient.head.rotation.y = -Math.sin(performance.now() * 0.001) * 0.08;
          
          renderer.render(scene, camera);
          raf = requestAnimationFrame(tick);
        };
        tick();

        const onResize = () => {
          if (!container) return;
          const w = container.clientWidth || width;
          const h = Math.min(260, Math.max(180, Math.round(w * 0.35)));
          renderer.setSize(w, h);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        window.addEventListener("resize", onResize);

        cleanupRef.current = () => {
          cancelAnimationFrame(raf);
          window.removeEventListener("resize", onResize);
          renderer.dispose();
          tubeGeo.dispose();
          (planeGeo as any)?.dispose?.();
          drop.geometry.dispose();
          // Remove canvas
          if (renderer.domElement && renderer.domElement.parentElement) {
            renderer.domElement.parentElement.removeChild(renderer.domElement);
          }
        };
      } catch (e) {
        // If CDN fails, leave container empty; Banner will still render surrounding content.
        console.warn("3D load failed:", e);
      }
    };

    init();
    return () => {
      mounted = false;
      cleanupRef.current?.();
    };
  }, []);

  return <div ref={containerRef} className="w-full" style={{ minHeight: 180 }} />;
};

export default BloodTransfer3D;