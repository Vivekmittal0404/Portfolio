"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

/* =========================================================
   STAR LAYER
   ========================================================= */

function StarLayer({
  count,
  minRadius,
  maxRadius,
  minSize,
  maxSize,
  rotationSpeed,
  forwardSpeed,
}) {
  const pointsRef = useRef(null);

  const { positions, angles, radii, zPositions } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const angles = new Float32Array(count);
    const radii = new Float32Array(count);
    const zPositions = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Random circular starting angle
      const angle = Math.random() * Math.PI * 2;

      // Distance from center
      const radius = minRadius + Math.random() * (maxRadius - minRadius);

      const z = -18 + Math.random() * 18;

      angles[i] = angle;
      radii[i] = radius;
      zPositions[i] = z;

      positions[i3] = Math.cos(angle) * radius;

      positions[i3 + 1] = Math.sin(angle) * radius;

      positions[i3 + 2] = z;
    }

    return {
      positions,
      angles,
      radii,
      zPositions,
    };
  }, [count, minRadius, maxRadius]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    const positionAttribute = pointsRef.current.geometry.attributes.position;

    const array = positionAttribute.array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      /* =====================================================
         CIRCULAR ROTATION
         ===================================================== */

      angles[i] += rotationSpeed * delta;

      array[i3] = Math.cos(angles[i]) * radii[i];

      array[i3 + 1] = Math.sin(angles[i]) * radii[i];

      zPositions[i] += forwardSpeed * delta;
      array[i3 + 2] = zPositions[i];

      if (zPositions[i] > 8) {
        zPositions[i] = -18;
        array[i3 + 2] = -18;
      }
    }

    positionAttribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>

      <pointsMaterial
        color="#ffffff"
        size={minSize + Math.random() * (maxSize - minSize)}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}

/* =========================================================
   STAR FIELD
   ========================================================= */

function Stars() {
  return (
    <>
      {/* =================================================
          TINY STARS
          ================================================= */}

      <StarLayer
        count={1500}
        minRadius={0.5}
        maxRadius={15}
        minSize={0.008}
        maxSize={0.015}
        rotationSpeed={0.035}
        forwardSpeed={0.35}
      />

      {/* =================================================
          MEDIUM STARS
          ================================================= */}

      <StarLayer
        count={250}
        minRadius={0.5}
        maxRadius={15}
        minSize={0.018}
        maxSize={0.028}
        rotationSpeed={0.032}
        forwardSpeed={0.35}
      />

      {/* =================================================
          LARGE STARS
          ================================================= */}

      <StarLayer
        count={50}
        minRadius={0.5}
        maxRadius={15}
        minSize={0.035}
        maxSize={0.055}
        rotationSpeed={0.03}
        forwardSpeed={0.35}
      />
    </>
  );
}

/* =========================================================
   CONTACT STARS CANVAS
   ========================================================= */

export default function ContactStars() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <Canvas
        dpr={[1, 1.5]}
        camera={{
          position: [0, 0, 5],
          fov: 45,
        }}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <Stars />
      </Canvas>
    </div>
  );
}
