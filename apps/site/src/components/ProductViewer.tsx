"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useLayoutEffect, useRef, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Object3D } from "three";

gsap.registerPlugin(ScrollTrigger);

interface DOMRefs {
  cleanRef: RefObject<HTMLDivElement | null>;
  goRef: RefObject<HTMLDivElement | null>;
}

function Model({ domRefs }: { domRefs?: DOMRefs }) {
  const { scene, nodes } = useGLTF("/3d/product.glb");
  const { camera } = useThree();
  const modelRef = useRef<Object3D | null>(null);
  const sushiMakiOriginalY = useRef<number | null>(null);
  const tubeCoverOriginalY = useRef<number | null>(null);

  useLayoutEffect(() => {
    // Wait for scene to be ready
    if (!modelRef.current) return;

    camera.up.set(0, 0, -1);
    camera.position.set(0, 10, 0.001);
    camera.lookAt(0, 0, 0);

    // Initial states for DOM elements
    if (domRefs?.cleanRef.current && domRefs?.goRef.current) {
      gsap.set(domRefs.goRef.current, { autoAlpha: 0, y: 24 });
      gsap.set(domRefs.cleanRef.current, { autoAlpha: 1, y: 0 });
    }

    if (nodes.Sushi_Maki && sushiMakiOriginalY.current === null) {
      sushiMakiOriginalY.current = nodes.Sushi_Maki.position.y;
    }

    if (nodes.Tube_Cover && tubeCoverOriginalY.current === null) {
      tubeCoverOriginalY.current = nodes.Tube_Cover.position.y;
    }

    // Example: Animate the entire group rotation on scroll
    // You can also target individual nodes like: nodes.YourNodeName.position
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#description-section", // Using body/document as trigger since canvas is fixed background
        start: "top top",
        end: "+=100%",
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
          y: 0.8, // Move along Y axis
          duration: 0.8,
          ease: "power1.inOut",
        },
        0.15 // Insert at start of timeline
      );
    }

    // 3. Staggered Tube_Cover object Y translation
    if (nodes.Tube_Cover) {
      tl.to(
        nodes.Tube_Cover.position,
        {
          y: 1.5, // Move along Y axis
          duration: 0.8,
          ease: "power1.inOut",
        },
        0 // Slightly after Sushi_Maki for staggered effect
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

    if (nodes.Tube_Cover && tubeCoverOriginalY.current !== null) {
      tl.to(
        nodes.Tube_Cover.position,
        {
          y: tubeCoverOriginalY.current,
          duration: 0.8,
          ease: "power1.inOut",
        },
        1.2
      );
    }

    // DOM Animations synced with the timeline
    if (domRefs?.cleanRef.current) {
      tl.to(
        domRefs.cleanRef.current,
        {
          autoAlpha: 0,
          y: -24,
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

    return () => {
      // Cleanup
      tl.kill();
    };
  }, [nodes, camera, domRefs]);

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={1} 
      rotation={[0, Math.PI / 1.03, 0]}
    />
  );
}

export function ProductViewer({ domRefs }: { domRefs?: DOMRefs }) {
  return (
    <div className="absolute inset-0 h-full w-full pointer-events-none">
      <Canvas
        camera={{ position: [0, 5, 8], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        className="pointer-events-auto" // Enable events on canvas
      >
        <ambientLight intensity={1} />
        <pointLight position={[-10, 10, 10]} intensity={0.5} />
        <Environment preset="warehouse" />
        
        <Suspense fallback={null}>
          <Model domRefs={domRefs} />
        </Suspense>

        {/* Disabled autoRotate to let ScrollTrigger take control, but kept OrbitControls for user interaction */}
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/3d/product.glb");
