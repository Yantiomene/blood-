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

        const donor = makeHuman(-3);
        const recipient = makeHuman(3);
        scene.add(donor.group, recipient.group);

        // Curve from donor right hand to recipient left hand
        const start = donor.armR.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.4, -0.2, 0));
        const end = recipient.armL.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(-0.4, -0.2, 0));
        const mid1 = start.clone().add(new THREE.Vector3(1.8, 0.8, 0.4));
        const mid2 = end.clone().add(new THREE.Vector3(-1.8, 0.6, -0.4));
        const curve = new THREE.CatmullRomCurve3([start, mid1, mid2, end]);

        // Tube geometry
        const tubeGeo = new THREE.TubeGeometry(curve, 100, 0.06, 16, false);
        const tubeMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, emissive: 0x7f1d1d, emissiveIntensity: 0.3, roughness: 0.5 });
        const tube = new THREE.Mesh(tubeGeo, tubeMat);
        scene.add(tube);

        // Droplet
        const dropMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0x991b1b, emissiveIntensity: 0.5, roughness: 0.4 });
        const drop = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 24), dropMat);
        scene.add(drop);

        // Animate
        let t = 0;
        let raf = 0 as any;
        const tick = () => {
          t += 0.0045;
          if (t > 1) t = 0;
          const p = curve.getPointAt(t);
          const tAhead = curve.getPointAt(Math.min(1, t + 0.01));
          drop.position.copy(p);
          drop.lookAt(tAhead);
          donor.group.rotation.y = Math.sin(performance.now() * 0.001) * 0.1;
          recipient.group.rotation.y = -Math.sin(performance.now() * 0.001) * 0.1;
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