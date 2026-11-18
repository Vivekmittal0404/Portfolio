"use client";

import { useMemo, useRef, useState, useEffect } from "react";
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
  isMobile,
}) {
  const pointsRef = useRef(null);

  const { positions, angles, radii, zPositions } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const angles = new Float32Array(count);
    const radii = new Float32Array(count);
    const zPositions = new Float32Array(count);

    // On mobile, distribute stars in a tighter, denser radius so they fill the tall portrait screen
    const effectiveMinR = isMobile ? minRadius * 0.6 : minRadius;
    const effectiveMaxR = isMobile ? maxRadius * 0.48 : maxRadius;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Random circular starting angle
      const angle = Math.random() * Math.PI * 2;

      // Distance from center
      const radius = effectiveMinR + Math.random() * (effectiveMaxR - effectiveMinR);

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
  }, [count, minRadius, maxRadius, isMobile]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    // Cap delta to prevent animation jumping during frame drops or tab switching
    const safeDelta = Math.min(delta, 0.05);
    // On mobile, scale speed so angular velocity matches the visual speed on desktop
    const speed = isMobile ? rotationSpeed * 2.1 : rotationSpeed;
    pointsRef.current.rotation.z += speed * safeDelta;
    pointsRef.current.rotation.y += speed * 0.4 * safeDelta;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>

      <pointsMaterial
        color="#ffffff"
        size={isMobile ? minSize * 1.35 : minSize + Math.random() * (maxSize - minSize)}
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

function Stars({ isMobile }) {
  return (
    <>
      {/* =================================================
          TINY STARS
          ================================================= */}

      <StarLayer
        count={isMobile ? 450 : 700}
        minRadius={0.5}
        maxRadius={15}
        minSize={0.009}
        maxSize={0.016}
        rotationSpeed={0.075}
        isMobile={isMobile}
      />

      {/* =================================================
          MEDIUM STARS
          ================================================= */}

      <StarLayer
        count={isMobile ? 90 : 120}
        minRadius={0.5}
        maxRadius={15}
        minSize={0.018}
        maxSize={0.028}
        rotationSpeed={0.070}
        isMobile={isMobile}
      />

      {/* =================================================
          LARGE STARS
          ================================================= */}

      <StarLayer
        count={isMobile ? 25 : 30}
        minRadius={0.5}
        maxRadius={15}
        minSize={0.035}
        maxSize={0.055}
        rotationSpeed={0.065}
        isMobile={isMobile}
      />
    </>
  );
}

/* =========================================================
   CONTACT STARS CANVAS
   ========================================================= */

export default function ContactStars() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        typeof window !== "undefined" &&
          (window.innerWidth < 768 ||
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent
            ))
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <Canvas
        dpr={[1, isMobile ? 1.5 : 1.25]}
        camera={{
          position: [0, 0, isMobile ? 6 : 5],
          fov: isMobile ? 55 : 45,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Stars isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
