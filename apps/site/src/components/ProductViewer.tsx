"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Environment, useGLTF, useProgress } from "@react-three/drei";
import { Suspense, useLayoutEffect, useRef, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

interface DOMRefs {
  cleanRef: RefObject<HTMLDivElement | null>;
  goRef: RefObject<HTMLDivElement | null>;
}

interface ProductViewerProps {
  domRefs?: DOMRefs;
  triggerRef?: RefObject<HTMLElement | null>;
}

function LoadingEvents() {
  const { progress } = useProgress();
  const lastProgress = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const rounded = Math.round(progress);
    if (lastProgress.current === rounded) return;
    lastProgress.current = rounded;
    window.dispatchEvent(
      new CustomEvent("sushi-rabo-assets-progress", { detail: { progress: rounded } })
    );
  }, [progress]);

  return null;
}

function Model({ domRefs, triggerRef }: { domRefs?: DOMRefs; triggerRef?: RefObject<HTMLElement | null> }) {
  const { scene, nodes } = useGLTF("/3d/cardboard-packaging-v2.glb");
  const { camera } = useThree();
  const modelRef = useRef<THREE.Object3D | null>(null);
  const sushiMakiOriginalY = useRef<number | null>(null);
  const topCoverOriginalY = useRef<number | null>(null);
  const sauceGroupRef = useRef<THREE.Group>(null);
  const sauceOriginalY = useRef<number | null>(null);
  const hasDispatchedLoaded = useRef(false);

  useLayoutEffect(() => {
    // Wait for scene to be ready
    if (!modelRef.current) return;

    camera.up.set(0, 0, -1);
    camera.position.set(0, 10, 0.001);
    camera.lookAt(0, 0, 0);

    // Initial states for DOM elements
    if (domRefs?.cleanRef.current && domRefs?.goRef.current) {
      gsap.set(domRefs.goRef.current, { autoAlpha: 0, y: 24, filter: "blur(12px)" });
      gsap.set(domRefs.cleanRef.current, { autoAlpha: 1, y: 0, filter: "blur(0px)" });
    }

    if (nodes.Sushi_Maki && sushiMakiOriginalY.current === null) {
      sushiMakiOriginalY.current = nodes.Sushi_Maki.position.y;
    }

    if (nodes.Top_Cover && topCoverOriginalY.current === null) {
      topCoverOriginalY.current = nodes.Top_Cover.position.y;
    }

    // Create sauce group and reparent sauce nodes
    const sauceGroup = sauceGroupRef.current;
    const sauceNodes = [
      nodes.Bottom_Sauce_Cap,
      nodes.Sauce,
      nodes.Sauce_Tube,
      nodes.Top_Sauce_Cap,
    ];

    if (sauceGroup && !sauceGroup.children.length && sauceNodes.every(n => n)) {
      // Save original position if needed, though we assume 0,0,0 relative to parent for now
      // But we are reparenting. The nodes are children of scene currently.
      // Their transforms are local to scene.
      // We add them to sauceGroup. sauceGroup is added to scene (via JSX ref if we put it there, or we do it here).
      // Let's use a group in JSX.
      if (sauceOriginalY.current === null) {
        sauceOriginalY.current = sauceGroup.position.y;
      }
      
      // Make materials transparent for fading
      sauceNodes.forEach((node) => {
        if (node) {
          sauceGroup.add(node);
          node.traverse((child: THREE.Object3D) => {
            if (!(child instanceof THREE.Mesh)) return;
            const mesh = child as THREE.Mesh;
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((mat) => {
              if (!mat) return;
              mat.transparent = true;
            });
          });
        }
      });
    }

    const ctx = gsap.context(() => {
      const trigger = triggerRef?.current || "#description-section";

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger, 
          start: "top top",
          end: () => "+=" + window.innerHeight * 1.5, // Functional value to recalculate on refresh
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Animate camera from top-down to isometric view over scroll
      tl.fromTo(
        camera.position,
        { x: 0, y: 10, z: 0.001 },
        {
          x: 0,
          y: 5,
          z: 8, // end in isometric-style view (matches Canvas default)
          duration: 1,
          ease: "power1.inOut",
          onUpdate: () => {
            camera.lookAt(0, 0, 0);
          },
        },
        0
      );

      // 2. Animate Sushi_Maki object Y translation
      if (nodes.Sushi_Maki) {
        tl.to(
          nodes.Sushi_Maki.position,
          {
            y: 0.45, // Move along Y axis
            duration: 0.8,
            ease: "power1.inOut",
          },
          0.24 // Insert at start of timeline
        );
      }

      // 3. Staggered Top_Cover object Y translation
      if (nodes.Top_Cover) {
        tl.to(
          nodes.Top_Cover.position,
          {
            y: 0.8, // Move along Y axis
            duration: 0.8,
            ease: "power1.inOut",
          },
          0.15 // Slightly after Sushi_Maki for staggered effect
        );
      }

      if (nodes.Sushi_Maki && sushiMakiOriginalY.current !== null) {
        tl.to(
          nodes.Sushi_Maki.position,
          {
            y: sushiMakiOriginalY.current,
            duration: 0.8,
            ease: "power1.inOut",
          },
          1.2
        );
      }

      if (nodes.Top_Cover && topCoverOriginalY.current !== null) {
        tl.to(
          nodes.Top_Cover.position,
          {
            y: topCoverOriginalY.current,
            duration: 0.8,
            ease: "power1.inOut",
          },
          1.2
        );
      }

      // 4. Animate Sauce Group (Detach and Fade)
      if (sauceGroupRef.current) {
        const sauceMats: THREE.Material[] = [];
        sauceGroupRef.current.traverse((child: THREE.Object3D) => {
          if (!(child instanceof THREE.Mesh)) return;
          const mesh = child as THREE.Mesh;
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((mat) => {
            if (mat) sauceMats.push(mat);
          });
        });

        // Detach and fade out at start
        tl.to(
          sauceGroupRef.current.position,
          {
            y: 5, // Move away
            ease: "power1.inOut",
            duration: 1,
          },
          0
        );
        
        tl.to(
          sauceMats,
          {
            opacity: 0,
            duration: 0.5,
            ease: "power1.inOut",
          },
          0
        );

        // Bring back near the end
        tl.to(
          sauceGroupRef.current.position,
          {
            y: sauceOriginalY.current ?? 0,
            ease: "power1.inOut",
            duration: 1,
          },
          1.5 
        );
        
        tl.to(
          sauceMats,
          {
            opacity: 1,
            duration: 0.5,
            ease: "power1.inOut",
          },
          2.0
        );
      }

      // DOM Animations synced with the timeline
      if (domRefs?.cleanRef.current) {
        tl.to(
          domRefs.cleanRef.current,
          {
            autoAlpha: 0,
            y: -24,
            filter: "blur(12px)",
            ease: "power1.inOut",
            duration: 0.35,
          },
          1.2
        );
      }

      if (domRefs?.goRef.current) {
        tl.to(
          domRefs.goRef.current,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            ease: "power1.inOut",
            duration: 0.45,
          },
          1.2
        );
      }

      tl.to(
        camera.position,
        {
          x: 0,
          y: 0,
          z: 14,
          duration: 0.9,
          ease: "power1.inOut",
          onStart: () => {
            camera.up.set(0, 1, 0);
          },
          onUpdate: () => {
            camera.lookAt(0, 0, 0);
          },
        },
        1.2
      );
    });

    if (!hasDispatchedLoaded.current && typeof window !== "undefined") {
      hasDispatchedLoaded.current = true;
      (window as unknown as { sushiRaboAssetsLoaded?: boolean }).sushiRaboAssetsLoaded = true;
      window.dispatchEvent(new Event("sushi-rabo-assets-loaded"));
    }

    return () => {
      // Cleanup
      ctx.revert();
    };
  }, [nodes, camera, domRefs, triggerRef]);

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={1.2} 
      rotation={[0, Math.PI / 2.03, 0]}
    >
      <group ref={sauceGroupRef} />
    </primitive>
  );
}

export function ProductViewer({ domRefs, triggerRef }: ProductViewerProps) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none [&_canvas]:!pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 14], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        className="pointer-events-none" // Ensure canvas itself is passive
      >
        <LoadingEvents />
        <ambientLight intensity={1} />
        <pointLight position={[-10, 10, 10]} intensity={0.5} />
        <Environment preset="city" />
        
        <Suspense fallback={null}>
          <Model domRefs={domRefs} triggerRef={triggerRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/3d/cardboard-packaging-v2.glb");
