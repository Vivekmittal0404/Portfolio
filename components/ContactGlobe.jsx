"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* =========================================================
   MOVING STAR FIELD
========================================================= */

/* =========================================================
   REFERENCE EARTH MODEL
========================================================= */

function EarthModel() {
  const { scene } = useGLTF("/planet/scene.gltf");

  const modelRef = useRef(null);

  /*
   * =========================================================
   * EASY MODEL SETTINGS
   * =========================================================
   */

  // Overall Earth + clouds size
  const MODEL_SCALE = 1.7;

  // -------------------------
  // PLANET SETTINGS
  // -------------------------

  const PLANET_SCALE = {
    x: 1,
    y: 1,
    z: 1,
  };

  // Planet position relative to the clouds
  const PLANET_POSITION = {
    x: 0,
    y: 0,
    z: 0,
  };

  // Planet rotation
  const PLANET_ROTATION = {
    x: 0,
    y: 0,
    z: 0,
  };

  // Planet opacity
  const PLANET_OPACITY = 1;

  // Planet color
  const PLANET_COLOR = "#ffffff";

  // -------------------------
  // CLOUD / RIBBON SETTINGS
  // -------------------------

  /*
   * Overall size of the existing
   * cloud/ribbon mesh.
   */
  const CLOUD_SCALE = {
    x: 1,
    y: 1,
    z: 1,
  };

  // Move the cloud/ribbon mesh
  const CLOUD_POSITION = {
    x: 0,
    y: 0,
    z: 0,
  };

  // Rotate the cloud/ribbon mesh
  const CLOUD_ROTATION = {
    x: 0,
    y: 0,
    z: 0,
  };

  // Cloud/ribbon opacity
  const CLOUD_OPACITY = 1;

  // Cloud/ribbon color
  const CLOUD_COLOR = "#e5c7d6";

  /*
   * =========================================================
   * CLONE GLTF
   * =========================================================
   */

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      if (!child.isMesh) return;

      /*
       * =====================================================
       * PLANET
       * =====================================================
       */

      if (child.name === "Object_6") {
        child.position.set(
          PLANET_POSITION.x,
          PLANET_POSITION.y,
          PLANET_POSITION.z,
        );

        child.rotation.set(
          PLANET_ROTATION.x,
          PLANET_ROTATION.y,
          PLANET_ROTATION.z,
        );

        child.scale.set(PLANET_SCALE.x, PLANET_SCALE.y, PLANET_SCALE.z);

        /*
         * Clone material so changing the
         * planet doesn't affect the original GLTF.
         */
        child.material = child.material.clone();

        child.material.transparent = PLANET_OPACITY < 1;
        child.material.opacity = PLANET_OPACITY;

        child.material.color.set(PLANET_COLOR);
      }

      /*
       * =====================================================
       * CLOUDS / RIBBONS
       * =====================================================
       */

      if (child.name === "Object_4") {
        child.position.set(
          CLOUD_POSITION.x,
          CLOUD_POSITION.y,
          CLOUD_POSITION.z,
        );

        child.rotation.set(
          CLOUD_ROTATION.x,
          CLOUD_ROTATION.y,
          CLOUD_ROTATION.z,
        );

        child.scale.set(CLOUD_SCALE.x, CLOUD_SCALE.y, CLOUD_SCALE.z);

        /*
         * Clone material so we can safely
         * customize the clouds/ribbons.
         */
        child.material = child.material.clone();

        child.material.transparent = CLOUD_OPACITY < 1;
        child.material.opacity = CLOUD_OPACITY;

        child.material.color.set(CLOUD_COLOR);
      }
    });

    return clone;
  }, [scene]);

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <group ref={modelRef}>
      <primitive object={clonedScene} scale={MODEL_SCALE} />
    </group>
  );
}

/* =========================================================
   GLOBE
========================================================= */

function Globe() {
  const globeRef = useRef(null);

  useFrame((state) => {
    if (!globeRef.current) return;

    /* Subtle floating motion */
    globeRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.18) * 0.025;
  });

  return (
    <group ref={globeRef} position={[0, 0, 0]}>
      <EarthModel />
    </group>
  );
}

/* =========================================================
   SCENE
========================================================= */

function Scene() {
  return (
    <>
      {/* -----------------------------------------
          CAMERA
      ----------------------------------------- */}

      <perspectiveCamera makeDefault position={[0, 0, 7]} fov={42} />

      {/* -----------------------------------------
          LIGHTING
      ----------------------------------------- */}

      <ambientLight intensity={0.65} />

      <directionalLight position={[-4, 5, 5]} intensity={3} />

      <pointLight position={[3, 2, 4]} intensity={1.5} distance={10} />

      {/* -----------------------------------------
          EARTH
      ----------------------------------------- */}

      <Globe />

      {/* -----------------------------------------
          MOUSE ROTATION
      ----------------------------------------- */}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.7}
        minDistance={5}
        maxDistance={5}
        autoRotate
        autoRotateSpeed={0.65}
      />
    </>
  );
}

/* =========================================================
   CONTACT GLOBE
========================================================= */

export default function ContactGlobe() {
  return (
    <div
      className="
        absolute
        inset-0
        h-full
        w-full
      "
    >
      <Canvas
        dpr={[1, 2]}
        camera={{
          position: [0, 0, 7],
          fov: 42,
        }}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

/* =========================================================
   GLTF PRELOAD
========================================================= */

useGLTF.preload("/planet/scene.gltf");
