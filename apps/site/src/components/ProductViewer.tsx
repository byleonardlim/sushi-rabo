"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Object3D } from "three";

gsap.registerPlugin(ScrollTrigger);

function Model() {
  const { scene, nodes } = useGLTF("/3d/product.glb");
  const { camera } = useThree();
  const modelRef = useRef<Object3D | null>(null);

  useLayoutEffect(() => {
    // Wait for scene to be ready
    if (!modelRef.current) return;

    // Example: Animate the entire group rotation on scroll
    // You can also target individual nodes like: nodes.YourNodeName.position
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#description-section", // Using body/document as trigger since canvas is fixed background
        start: "25% bottom", // give user time to see the top view before animating
        end: "bottom top",
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    // Animate camera from top-down to isometric view over scroll
    tl.fromTo(
      camera.position,
      { x: 0, y: 10, z: 2 }, // start more top-focused
      {
        x: 0,
        y: 5,
        z: 8, // end in isometric-style view (matches Canvas default)
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
          y: 2.1, // Move along Y axis
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
          y: 1.8, // Move along Y axis
          ease: "power1.inOut",
        },
        0 // Slightly after Sushi_Maki for staggered effect
      );
    }

    return () => {
      // Cleanup
      tl.kill();
    };
  }, [nodes, camera]);

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={1} 
      rotation={[0, Math.PI / 1.03, 0]}
    />
  );
}

export function ProductViewer() {
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
          <Model />
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
