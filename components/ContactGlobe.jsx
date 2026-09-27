"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Stars } from "@react-three/drei";
import * as THREE from "three";

function ReferenceEarth() {
  const earthRef = useRef(null);
  const { scene } = useGLTF("/planet/scene.gltf");

  useFrame((state, delta) => {
    if (!earthRef.current) return;

    earthRef.current.rotation.y += delta * 0.11;
    earthRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.3) * 0.018;
  });

  return (
    <primitive
      ref={earthRef}
      object={scene}
      scale={2.5}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

function MovingStars() {
  const starsRef = useRef(null);

  useFrame((_, delta) => {
    if (!starsRef.current) return;

    starsRef.current.rotation.y += delta * 0.008;
    starsRef.current.rotation.x += delta * 0.002;
  });

  return (
    <group ref={starsRef}>
      <Stars
        radius={60}
        depth={30}
        count={1800}
        factor={1.8}
        saturation={0}
        fade
        speed={0}
      />
    </group>
  );
}

function GlobeScene() {
  return (
    <>
      <MovingStars />

      <ambientLight intensity={0.45} />

      <directionalLight
        position={[4, 3, 5]}
        intensity={2.4}
      />

      <directionalLight
        position={[-4, -2, -3]}
        intensity={0.45}
      />

      <ReferenceEarth />
    </>
  );
}

function Loader() {
  return null;
}

export default function ContactGlobe() {
  return (
    <div className="h-full w-full">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [-4, 3, 6],
        }}
      >
        <Suspense fallback={<Loader />}>
          <GlobeScene />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/planet/scene.gltf");
