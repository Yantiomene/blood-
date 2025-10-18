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
  interface Window {
    THREE?: any;
  }
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

        // Point light attached to droplet for glow effect
        const dropLight = new THREE.PointLight(0xff3333, 0.8, 2);
        drop.add(dropLight); // Attach light to droplet so it moves together

        // Create droplet trail effect
        const trailCount = 10;
        const trailGeometry = new THREE.BufferGeometry();
        const trailPositions = new Float32Array(trailCount * 3);
        const trailOpacities = new Float32Array(trailCount);

        for (let i = 0; i < trailCount; i++) {
          trailPositions[i * 3] = 0;
          trailPositions[i * 3 + 1] = 0;
          trailPositions[i * 3 + 2] = 0;
          trailOpacities[i] = 1.0 - (i / trailCount); // Fade out along trail
        }

        trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
        trailGeometry.setAttribute('alpha', new THREE.BufferAttribute(trailOpacities, 1));

        const trailMaterial = new THREE.PointsMaterial({
          size: 2.5,
          color: 0xff6666,
          transparent: true,
          opacity: 0.6,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true
        });

        const trail = new THREE.Points(trailGeometry, trailMaterial);
        scene.add(trail);

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

          // Update droplet glow intensity
          const time = performance.now() * 0.001;
          dropLight.intensity = 0.8 + Math.sin(time * 8) * 0.3; // Pulsing glow

          // Update trail positions
          const trailPos = trail.geometry.attributes.position.array;
          for (let i = trailCount - 1; i > 0; i--) {
            // Shift positions back
            trailPos[i * 3] = trailPos[(i - 1) * 3];
            trailPos[i * 3 + 1] = trailPos[(i - 1) * 3 + 1];
            trailPos[i * 3 + 2] = trailPos[(i - 1) * 3 + 2];
          }
          // Set newest position to droplet location
          trailPos[0] = p.x;
          trailPos[1] = p.y;
          trailPos[2] = p.z;
          trail.geometry.attributes.position.needsUpdate = true;

          // Animate particles
          const positions = particleSystem.geometry.attributes.position.array;

          for (let i = 0; i < particleCount; i++) {
            // Each particle moves along the curve with staggered timing
            let particleT = ((time * 0.2) + (i * 0.04)) % 1;  // Slower, more spread out
            const pos = curve.getPointAt(particleT);
            
            positions[i * 3] = pos.x + (Math.sin(time * 3 + i * 0.4) * 0.015);     
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
          aura.position.set(1.1, -1.2, 0); // Position under recipient
          scene.add(aura);

          // Create energy particles around recipient
          const energyCount = 4;
          const energyGeometry = new THREE.BufferGeometry();
          const energyPositions = new Float32Array(energyCount * 3);
          const energyColors = new Float32Array(energyCount * 3);

          for (let i = 0; i < energyCount; i++) {
            const angle = (i / energyCount) * Math.PI * 2;
            const radius = 1.5 + Math.random() * 0.5;
            
            energyPositions[i * 3] = 4.5 + Math.cos(angle) * radius;     // X around recipient
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

          // Create floating text sprites
          const createTextSprite = (message: string, color: string = '#ffffff') => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 512;
            canvas.height = 128;
            
            if (context) {
              context.font = 'Bold 60px Arial, sans-serif';
              context.fillStyle = color;
              context.textAlign = 'center';
              context.textBaseline = 'middle';
              context.fillText(message, 256, 64);
            } 
            
            const texture = new THREE.CanvasTexture(canvas);
            const spriteMaterial = new THREE.SpriteMaterial({ 
              map: texture,
              transparent: true,
              opacity: 0
            });
            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(2, 0.5, 1);
            
            return sprite;
          };

          // Create text elements
          const hopeText = createTextSprite('Hope', '#60a5fa');
          hopeText.position.set(-1.5, 2.2, 0);
          scene.add(hopeText);

          const lifeText = createTextSprite('Life', '#ef4444');
          lifeText.position.set(0, 2.5, 0);
          scene.add(lifeText);

          const chanceText = createTextSprite('Second Chance', '#22c55e');
          chanceText.position.set(1.8, 2.2, 0);
          scene.add(chanceText);

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
            // Create heartbeat visualization
            const heartbeatCurve = new THREE.Shape();
            // Simple heart shape using curves
            heartbeatCurve.moveTo(0, 0.3);
            heartbeatCurve.bezierCurveTo(0, 0.5, -0.3, 0.5, -0.3, 0.3);
            heartbeatCurve.bezierCurveTo(-0.3, 0, 0, -0.3, 0, -0.6);
            heartbeatCurve.bezierCurveTo(0, -0.3, 0.3, 0, 0.3, 0.3);
            heartbeatCurve.bezierCurveTo(0.3, 0.5, 0, 0.5, 0, 0.3);

            const heartGeometry = new THREE.ShapeGeometry(heartbeatCurve);
            const donorHeartMat = new THREE.MeshBasicMaterial({ 
              color: 0xff4444,
              transparent: true,
              opacity: 0.8,
              side: THREE.DoubleSide
            });
            const recipientHeartMat = new THREE.MeshBasicMaterial({ 
              color: 0x888888,
              transparent: true,
              opacity: 0.6,
              side: THREE.DoubleSide
            });

            // Donor heartbeat indicator
            const donorHeart = new THREE.Mesh(heartGeometry, donorHeartMat);
            donorHeart.position.set(-3.5, 0.8, 0.5);
            donorHeart.scale.set(0.4, 0.4, 0.4);
            scene.add(donorHeart);

            // Recipient heartbeat indicator
            const recipientHeart = new THREE.Mesh(heartGeometry, recipientHeartMat);
            recipientHeart.position.set(3.5, 0.8, 0.5);
            recipientHeart.scale.set(0.4, 0.4, 0.4);
            scene.add(recipientHeart);

            // Heartbeat pulse rings
            const createPulseRing = () => {
              const ringGeo = new THREE.RingGeometry(0.3, 0.35, 32);
              const ringMat = new THREE.MeshBasicMaterial({
                color: 0xff4444,
                transparent: true,
                opacity: 0,
                side: THREE.DoubleSide
              });
              return new THREE.Mesh(ringGeo, ringMat);
            };

            const donorPulse = createPulseRing();
            donorPulse.position.copy(donorHeart.position);
            scene.add(donorPulse);

            const recipientPulse = createPulseRing();
            recipientPulse.position.copy(recipientHeart.position);
            scene.add(recipientPulse);

            // Create EKG-style heartbeat line visualization
            const ekgPoints = [];
            const ekgSegments = 100;
            for (let i = 0; i < ekgSegments; i++) {
              ekgPoints.push(new THREE.Vector3(
                -4 + (i / ekgSegments) * 8, // Spans from left to right
                -1.3,
                0.8
              ));
            }

            const ekgCurve = new THREE.CatmullRomCurve3(ekgPoints);
            const ekgGeometry = new THREE.TubeGeometry(ekgCurve, ekgSegments, 0.015, 8, false);
            const ekgMaterial = new THREE.MeshBasicMaterial({
              color: 0x22c55e,
              transparent: true,
              opacity: 0.7
            });
            const ekgLine = new THREE.Mesh(ekgGeometry, ekgMaterial);
            scene.add(ekgLine);

            // Heartbeat spike indicators
            const spikeGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
            const spikeMaterial = new THREE.MeshBasicMaterial({
              color: 0x22c55e,
              transparent: true,
              opacity: 0
            });

            const leftSpike = new THREE.Mesh(spikeGeometry, spikeMaterial.clone());
            leftSpike.position.set(-3.5, -1.3, 0.8);
            scene.add(leftSpike);

            const rightSpike = new THREE.Mesh(spikeGeometry, spikeMaterial.clone());
            rightSpike.position.set(3.5, -1.3, 0.8);
            scene.add(rightSpike);
          

            // Animate floating text based on blood flow progress
            if (t > 0.15 && t < 0.85) {
              // Hope appears first (15-40% progress)
              const hopeProgress = Math.min(Math.max((t - 0.15) / 0.25, 0), 1);
              hopeText.material.opacity = hopeProgress * 0.5;
              hopeText.position.y = 2.2 + Math.sin(time * 2) * 0.1;
              
              // Life appears in middle (35-60% progress)
              const lifeProgress = Math.min(Math.max((t - 0.35) / 0.25, 0), 1);
              lifeText.material.opacity = lifeProgress * 0.5;
              lifeText.position.y = 2.5 + Math.sin(time * 2.5 + 1) * 0.15;
              
              // Second Chance appears last (55-80% progress)
              const chanceProgress = Math.min(Math.max((t - 0.55) / 0.25, 0), 1);
              chanceText.material.opacity = chanceProgress * 0.5;
              chanceText.position.y = 2.2 + Math.sin(time * 2 + 2) * 0.1;
            } else {
              // Fade out when droplet resets
              hopeText.material.opacity *= 0.95;
              lifeText.material.opacity *= 0.95;
              chanceText.material.opacity *= 0.95;
            }

            // Heartbeat animation
            const heartbeatSpeed = 2.5; // Beats per second
            const beat = Math.sin(time * heartbeatSpeed * Math.PI * 2);
            const beatTrigger = beat > 0.7; // Pulse when sine wave peaks

            // EKG line pulse effect
            ekgMaterial.opacity = 0.5 + Math.sin(time * heartbeatSpeed * Math.PI * 2) * 0.3;
            ekgMaterial.emissive = new THREE.Color(0x22c55e);
            ekgMaterial.emissiveIntensity = beat > 0.7 ? 0.5 : 0;

            // Heartbeat spikes at donor and recipient positions
            if (beatTrigger) {
              // Donor spike
              leftSpike.material.opacity = 0.9;
              // Declare recipientHealthFactor before its first use
              const recipientHealthFactor = Math.min(transformProgress * 1.5, 1);
              leftSpike.scale.y = 1 + recipientHealthFactor * 0.5;
              
              // Recipient spike - grows stronger with health
              rightSpike.material.opacity = 0.5 + (recipientHealthFactor * 0.4);
              rightSpike.scale.y = 0.6 + (recipientHealthFactor * 0.7);
            }

            // Fade out spikes
            leftSpike.material.opacity = Math.max(0, leftSpike.material.opacity - 0.05);
            rightSpike.material.opacity = Math.max(0, rightSpike.material.opacity - 0.04);

            // Subtle vertical position pulse
            leftSpike.position.y = -1.3 + (leftSpike.material.opacity * 0.2);
            rightSpike.position.y = -1.3 + (rightSpike.material.opacity * 0.15);

            // Donor heartbeat - strong and steady
            const donorBeatScale = 1 + (beat > 0.5 ? (beat - 0.5) * 0.3 : 0);
            donorHeart.scale.set(0.4 * donorBeatScale, 0.4 * donorBeatScale, 0.4);
            donorHeartMat.opacity = 0.7 + (beat > 0.5 ? (beat - 0.5) * 0.4 : 0);

            // Donor pulse ring expansion
            if (beatTrigger && donorPulse.scale.x < 1.2) {
              donorPulse.scale.set(0.4, 0.4, 1);
              donorPulse.material.opacity = 0.8;
            }
            donorPulse.scale.x += 0.03;
            donorPulse.scale.y += 0.03;
            donorPulse.material.opacity = Math.max(0, donorPulse.material.opacity - 0.02);
            if (donorPulse.scale.x > 2.5) {
              donorPulse.scale.set(0.4, 0.4, 1);
            }

            // Recipient heartbeat - starts weak, gets stronger with blood transfer
            const recipientHealthFactor = Math.min(transformProgress * 1.5, 1);
            const recipientBeatStrength = 0.5 + (recipientHealthFactor * 0.5); // Starts at 50%, reaches 100%
            const recipientBeat = Math.sin(time * heartbeatSpeed * Math.PI * 2 * recipientBeatStrength);
            const recipientBeatScale = 1 + (recipientBeat > 0.5 ? (recipientBeat - 0.5) * 0.2 * recipientHealthFactor : 0);

            recipientHeart.scale.set(0.4 * recipientBeatScale, 0.4 * recipientBeatScale, 0.4);
            recipientHeartMat.opacity = 0.4 + (recipientHealthFactor * 0.3) + (recipientBeat > 0.5 ? (recipientBeat - 0.5) * 0.3 : 0);

            // Recipient heart color transitions from gray to red
            recipientHeartMat.color.setRGB(
              0.5 + (recipientHealthFactor * 0.5), // R: 0.5 to 1.0
              0.3 * (1 - recipientHealthFactor * 0.7), // G: fades down
              0.3 * (1 - recipientHealthFactor * 0.7)  // B: fades down
            );

            // Recipient pulse ring - gets stronger with health
            if (beatTrigger && recipientPulse.scale.x < 1.2) {
              recipientPulse.scale.set(0.4, 0.4, 1);
              recipientPulse.material.opacity = 0.4 + (recipientHealthFactor * 0.4);
            }
            recipientPulse.scale.x += 0.02 + (recipientHealthFactor * 0.01);
            recipientPulse.scale.y += 0.02 + (recipientHealthFactor * 0.01);
            recipientPulse.material.opacity = Math.max(0, recipientPulse.material.opacity - 0.015);
            if (recipientPulse.scale.x > 2.5) {
              recipientPulse.scale.set(0.4, 0.4, 1);
            }

            // Subtle scale pulsing
            const textScale = 1 + Math.sin(time * 3) * 0.05;
            hopeText.scale.set(2 * textScale, 1 * textScale, 0.5);
            lifeText.scale.set(2 * textScale, 1 * textScale, 0.5);
            chanceText.scale.set(2 * textScale, 1 * textScale, 0.5);
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