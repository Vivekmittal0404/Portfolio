"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { PerspectiveCamera, Line } from "@react-three/drei";

import ContactGlobe from "./ContactGlobe";

// /* =========================================================
//    STAR FIELD
// ========================================================= */

// function StarField() {
//   const ref = useRef<THREE.Points>(null);

//   const { positions, velocities } = useMemo(() => {
//     const count = 1200;

//     const positions = new Float32Array(count * 3);
//     const velocities = new Float32Array(count * 3);

//     for (let i = 0; i < count; i++) {
//       const i3 = i * 3;

//       // Large background space
//       positions[i3] = (Math.random() - 0.5) * 18;

//       positions[i3 + 1] = (Math.random() - 0.5) * 11;

//       positions[i3 + 2] = -8 + Math.random() * 7;

//       /*
//        * Each star gets its own velocity.
//        * This makes the movement visible rather
//        * than rotating the entire star field.
//        */
//       velocities[i3] = (Math.random() - 0.5) * 0.002;

//       velocities[i3 + 1] = (Math.random() - 0.5) * 0.0015;

//       velocities[i3 + 2] = 0.004 + Math.random() * 0.008;
//     }

//     return {
//       positions,
//       velocities,
//     };
//   }, []);

//   useFrame(() => {
//     if (!ref.current) return;

//     const positionAttribute = ref.current.geometry.attributes.position;

//     const array = positionAttribute.array as Float32Array;

//     for (let i = 0; i < array.length; i += 3) {
//       array[i] += velocities[i];
//       array[i + 1] += velocities[i + 1];
//       array[i + 2] += velocities[i + 2];

//       /*
//        * Recycle stars once they move too far
//        * toward the camera.
//        */
//       if (array[i + 2] > 0) {
//         array[i] = (Math.random() - 0.5) * 18;

//         array[i + 1] = (Math.random() - 0.5) * 11;

//         array[i + 2] = -8;
//       }
//     }

//     positionAttribute.needsUpdate = true;
//   });

//   return (
//     <points ref={ref} position={[0, 0, 0]}>
//       <bufferGeometry>
//         <bufferAttribute attach="attributes-position" args={[positions, 3]} />
//       </bufferGeometry>

//       <pointsMaterial
//         color="#ffffff"
//         size={0.022}
//         sizeAttenuation
//         transparent
//         opacity={0.8}
//         depthWrite={false}
//       />
//     </points>
//   );
// }

// function Earth() {
//   const earthRef = useRef<THREE.Mesh>(null);

//   const earthTexture = useLoader(THREE.TextureLoader, "/textures/earth.png");

//   const bumpTexture = useLoader(
//     THREE.TextureLoader,
//     "/textures/Clouds_baseColor.png",
//   );

//   useFrame((_, delta) => {
//     if (!earthRef.current) return;

//     earthRef.current.rotation.y += delta * 0.12;
//   });

//   return (
//     <mesh ref={earthRef} scale={1.4}>
//       <sphereGeometry args={[1, 96, 96]} />

//       <meshStandardMaterial
//         map={earthTexture}
//         normalMap={bumpTexture}
//         normalScale={new THREE.Vector2(0.35, 0.35)}
//         roughness={0.82}
//         metalness={0.02}
//       />
//     </mesh>
//   );
// }

// /* =========================================================
//    CREATE ORGANIC RIBBON GEOMETRY
// ========================================================= */

// /* =========================================================
//    ORGANIC RIBBON GEOMETRY
//    Ribbons hug the surface of the Earth.
// ========================================================= */

// type RibbonConfig = {
//   phase: number;
//   tilt: number;
//   amplitude: number;
//   arc: number;
//   width: number;
//   thickness: number;
//   twist: number;
//   color: string;
// };

// function createRibbonGeometry(config: RibbonConfig) {
//   const { phase, tilt, amplitude, arc, width, thickness, twist } = config;

//   const segments = 180;

//   /*
//    * Ribbons sit only slightly above it.
//    *
//    * This is the most important change.
//    */
//   const radius = 1.6;

//   const positions: number[] = [];
//   const uvs: number[] = [];
//   const indices: number[] = [];

//   const centers: THREE.Vector3[] = [];
//   const tangents: THREE.Vector3[] = [];
//   const sides: THREE.Vector3[] = [];
//   const normals: THREE.Vector3[] = [];

//   /* -----------------------------------------
//      CENTER LINE
//   ----------------------------------------- */

//   for (let i = 0; i <= segments; i++) {
//     const t = i / segments;

//     /*
//      * Don't make a complete 360° ring.
//      *
//      * Each ribbon covers an organic arc.
//      */
//     const angle = phase + (t - 0.5) * Math.PI * arc;

//     /*
//      * Small organic vertical movement.
//      *
//      * This makes the ribbon feel hand-shaped
//      * instead of mathematically circular.
//      */
//     const wave = Math.sin(angle * 1.35 + phase) * amplitude;

//     const wave2 = Math.sin(angle * 2.1 + phase * 0.7) * 0.025;

//     const latitude = tilt + wave + wave2;

//     /*
//      * Very small distance variation.
//      *
//      * Keep this tiny so the ribbon remains
//      * attached to the Earth.
//      */
//     const radialOffset = Math.sin(angle * 1.8 + phase) * 0.012;

//     const r = radius + radialOffset;

//     const center = new THREE.Vector3(
//       r * Math.cos(latitude) * Math.cos(angle),

//       r * Math.sin(latitude),

//       r * Math.cos(latitude) * Math.sin(angle),
//     );

//     centers.push(center);
//   }

//   /* -----------------------------------------
//      TANGENTS
//   ----------------------------------------- */

//   for (let i = 0; i <= segments; i++) {
//     const prev = centers[Math.max(0, i - 1)];

//     const next = centers[Math.min(segments, i + 1)];

//     const tangent = next.clone().sub(prev).normalize();

//     tangents.push(tangent);
//   }

//   /* -----------------------------------------
//      SURFACE NORMAL + SIDE
//   ----------------------------------------- */

//   for (let i = 0; i <= segments; i++) {
//     const normal = centers[i].clone().normalize();

//     normals.push(normal);

//     const side = new THREE.Vector3()
//       .crossVectors(tangents[i], normal)
//       .normalize();

//     sides.push(side);
//   }

//   /* -----------------------------------------
//      RIBBON VERTICES
//   ----------------------------------------- */

//   for (let i = 0; i <= segments; i++) {
//     const t = i / segments;

//     /*
//      * Strong taper at both ends.
//      *
//      * This is what gives the reference
//      * its pointed/organic ribbon endings.
//      */
//     const taper = Math.pow(Math.sin(Math.PI * t), 0.48);

//     /*
//      * Width variation.
//      */
//     const widthVariation = 1 + Math.sin(t * Math.PI * 2.5 + phase) * 0.1;

//     const currentWidth = width * taper * widthVariation;

//     /*
//      * Subtle twist.
//      */
//     const twistAngle = Math.sin(t * Math.PI * 2 + phase) * twist;

//     const side = sides[i].clone().applyAxisAngle(tangents[i], twistAngle);

//     const normal = normals[i];

//     const center = centers[i];

//     /*
//      * Flat ribbon.
//      *
//      * IMPORTANT:
//      * width is much larger than thickness.
//      */
//     const topLeft = center
//       .clone()
//       .add(side.clone().multiplyScalar(currentWidth))
//       .add(normal.clone().multiplyScalar(thickness));

//     const topRight = center
//       .clone()
//       .sub(side.clone().multiplyScalar(currentWidth))
//       .add(normal.clone().multiplyScalar(thickness));

//     const bottomLeft = center
//       .clone()
//       .add(side.clone().multiplyScalar(currentWidth))
//       .sub(normal.clone().multiplyScalar(thickness));

//     const bottomRight = center
//       .clone()
//       .sub(side.clone().multiplyScalar(currentWidth))
//       .sub(normal.clone().multiplyScalar(thickness));

//     const vertices = [topLeft, topRight, bottomLeft, bottomRight];

//     for (const vertex of vertices) {
//       positions.push(vertex.x, vertex.y, vertex.z);
//     }

//     /*
//      * UVs
//      */
//     uvs.push(
//       t,
//       0,

//       t,
//       1,

//       t,
//       0,

//       t,
//       1,
//     );

//     if (i < segments) {
//       const current = i * 4;

//       const next = (i + 1) * 4;

//       /*
//        * TOP
//        */
//       indices.push(
//         current,
//         next,
//         current + 1,

//         current + 1,
//         next,
//         next + 1,
//       );

//       /*
//        * BOTTOM
//        */
//       indices.push(
//         current + 2,
//         current + 3,
//         next + 2,

//         current + 3,
//         next + 3,
//         next + 2,
//       );

//       /*
//        * LEFT SIDE
//        */
//       indices.push(
//         current,
//         current + 2,
//         next,

//         current + 2,
//         next + 2,
//         next,
//       );

//       /*
//        * RIGHT SIDE
//        */
//       indices.push(
//         current + 1,
//         next + 1,
//         current + 3,

//         current + 3,
//         next + 3,
//         next + 1,
//       );
//     }
//   }

//   const geometry = new THREE.BufferGeometry();

//   geometry.setAttribute(
//     "position",
//     new THREE.Float32BufferAttribute(positions, 3),
//   );

//   geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

//   geometry.setIndex(indices);

//   geometry.computeVertexNormals();

//   return geometry;
// }

// /* =========================================================
//    RIBBON COMPONENT
// ========================================================= */

// function Ribbon({ config }: { config: RibbonConfig }) {
//   const geometry = useMemo(() => createRibbonGeometry(config), [config]);

//   return (
//     <mesh geometry={geometry} castShadow receiveShadow>
//       <meshStandardMaterial
//         color={config.color}
//         roughness={0.32}
//         metalness={0.02}
//         side={THREE.DoubleSide}
//       />
//     </mesh>
//   );
// }

// function Globe() {
//   const groupRef = useRef<THREE.Group>(null);

//   useFrame((state, delta) => {
//     if (!groupRef.current) return;

//     /*
//      * Rotate the complete Earth + ribbons
//      * as one object.
//      */
//     groupRef.current.rotation.y += delta * 0.11;

//     /*
//      * Very subtle floating motion.
//      */
//     groupRef.current.rotation.x =
//       Math.sin(state.clock.elapsedTime * 0.3) * 0.035;
//   });

//   return (
//     <group
//       ref={groupRef}
//       position={[2.0, 0, 0]}
//       rotation={[0.05, -0.3, 0.1]}
//       scale={0.92}
//     >
//       {/* =========================================
//           EARTH
//       ========================================= */}

//       <Earth />

//       {/* =========================================
//           PINK / WHITE RIBBONS
//       ========================================= */}

//       {/* =========================================
//     ORGANIC EARTH-HUGGING RIBBONS
// ========================================= */}

//       <Ribbon
//         config={{
//           phase: 0.15,
//           tilt: 0.34,
//           amplitude: 0.055,
//           arc: 1.72,
//           width: 0.105,
//           thickness: 0.026,
//           twist: 0.08,
//           color: "red",
//         }}
//       />

//       <Ribbon
//         config={{
//           phase: 0.78,
//           tilt: 0.19,
//           amplitude: 0.075,
//           arc: 1.82,
//           width: 0.125,
//           thickness: 0.028,
//           twist: 0.1,
//           color: "#eacbd9",
//         }}
//       />

//       <Ribbon
//         config={{
//           phase: 1.35,
//           tilt: 0.08,
//           amplitude: 0.065,
//           arc: 1.9,
//           width: 0.145,
//           thickness: 0.03,
//           twist: 0.12,
//           color: "#f4dce5",
//         }}
//       />

//       <Ribbon
//         config={{
//           phase: 1.92,
//           tilt: -0.04,
//           amplitude: 0.085,
//           arc: 1.78,
//           width: 0.115,
//           thickness: 0.027,
//           twist: 0.14,
//           color: "#e5c7d6",
//         }}
//       />

//       <Ribbon
//         config={{
//           phase: 2.58,
//           tilt: -0.15,
//           amplitude: 0.07,
//           arc: 1.88,
//           width: 0.135,
//           thickness: 0.029,
//           twist: 0.11,
//           color: "#f1d8e2",
//         }}
//       />

//       <Ribbon
//         config={{
//           phase: 3.18,
//           tilt: -0.28,
//           amplitude: 0.06,
//           arc: 1.7,
//           width: 0.11,
//           thickness: 0.026,
//           twist: 0.09,
//           color: "#e7cad8",
//         }}
//       />

//       <Ribbon
//         config={{
//           phase: 3.82,
//           tilt: -0.39,
//           amplitude: 0.075,
//           arc: 1.84,
//           width: 0.125,
//           thickness: 0.028,
//           twist: 0.13,
//           color: "#f3dfe6",
//         }}
//       />

//       <Ribbon
//         config={{
//           phase: 4.5,
//           tilt: -0.5,
//           amplitude: 0.055,
//           arc: 1.74,
//           width: 0.105,
//           thickness: 0.026,
//           twist: 0.1,
//           color: "#dfc3d3",
//         }}
//       />

//       <Ribbon
//         config={{
//           phase: 5.15,
//           tilt: -0.61,
//           amplitude: 0.07,
//           arc: 1.82,
//           width: 0.118,
//           thickness: 0.027,
//           twist: 0.12,
//           color: "#edd4df",
//         }}
//       />
//     </group>
//   );
// }

// function Scene() {
//   return (
//     <>
//       <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={42} />

//       {/* Background stars */}
//       <StarField />

//       {/* Earth lighting */}
//       <ambientLight intensity={0.55} />

//       <directionalLight position={[-4, 5, 5]} intensity={3} />

//       <pointLight position={[3, 2, 4]} intensity={1.5} distance={10} />

//       <Globe />
//     </>
//   );
// }
/* =========================================================
   CONTACT
========================================================= */

export default function Contact() {
  return (
    <section
      id="contact"
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-black
        text-white
      "
    >
      {/* =====================================
          3D BACKGROUND
      ===================================== */}

      {/* <div
        className="
          pointer-events-none
          absolute
          inset-0
        "
      >
        <Canvas
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
          }}
        >
          <Scene />
        </Canvas>
      </div> */}

      {/* =====================================
    CONTENT
===================================== */}

      <div
        className="
    relative
    z-10
    mx-auto
    flex
    min-h-screen
    w-full
    max-w-7xl
    items-center
    px-6
    py-20
    lg:px-10
  "
      >
        <div
          className="
      grid
      w-full
      items-center
      gap-10
      lg:grid-cols-[0.9fr_1.1fr]
    "
        >
          {/* =================================
        LEFT SIDE
        TEXT + FORM
    ================================= */}

          <div
            className="
        relative
        z-30
        flex
        w-full
        max-w-xl
        flex-col
        justify-center
      "
          >
            {/* ===============================
          EXISTING DESIGN TEXT
      =============================== */}

            <div>
              <p
                className="
            mb-5
            text-xs
            font-medium
            uppercase
            tracking-[0.4em]
            text-cyan-300
          "
              >
                Get in touch
              </p>

              <h2
                className="
            text-5xl
            font-semibold
            leading-[1.05]
            sm:text-6xl
          "
              >
                Let&apos;s build
                <br />
                something
                <br />
                <span className="text-cyan-300">meaningful.</span>
              </h2>

              <p
                className="
            mt-6
            max-w-lg
            text-sm
            leading-7
            text-white/50
            sm:text-base
          "
              >
                Have an idea, project, opportunity, or just want to say hello?
                <br />
                Send me a message and I&apos;ll get back to you.
              </p>
            </div>

            {/* ===============================
          CONTACT FORM
          NOW BELOW THE TEXT
      =============================== */}

            <form
              onSubmit={(e) => e.preventDefault()}
              className="
          mt-10
          w-full
          rounded-3xl
          border
          border-white/[0.10]
          bg-black/75
          p-6
          shadow-2xl
          backdrop-blur-xl
          sm:p-7
        "
            >
              {/* Name + Email */}

              <div
                className="
            grid
            gap-5
            sm:grid-cols-2
          "
              >
                {/* Name */}

                <label>
                  <span
                    className="
                mb-2
                block
                text-xs
                text-white/60
              "
                  >
                    Name
                  </span>

                  <input
                    type="text"
                    placeholder="Your name"
                    className="
                h-11
                w-full
                rounded-xl
                border
                border-white/10
                bg-white/[0.035]
                px-4
                text-sm
                text-white
                outline-none
                transition
                placeholder:text-white/25
                focus:border-cyan-300/50
              "
                  />
                </label>

                {/* Email */}

                <label>
                  <span
                    className="
                mb-2
                block
                text-xs
                text-white/60
              "
                  >
                    Email
                  </span>

                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="
                h-11
                w-full
                rounded-xl
                border
                border-white/10
                bg-white/[0.035]
                px-4
                text-sm
                text-white
                outline-none
                transition
                placeholder:text-white/25
                focus:border-cyan-300/50
              "
                  />
                </label>
              </div>

              {/* Message */}

              <label className="mt-5 block">
                <span
                  className="
              mb-2
              block
              text-xs
              text-white/60
            "
                >
                  Message
                </span>

                <textarea
                  rows={5}
                  placeholder="Tell me about your project..."
                  className="
              w-full
              resize-none
              rounded-xl
              border
              border-white/10
              bg-white/[0.035]
              px-4
              py-3
              text-sm
              text-white
              outline-none
              transition
              placeholder:text-white/25
              focus:border-cyan-300/50
            "
                />
              </label>

              {/* Send */}

              <button
                type="submit"
                className="
            mt-5
            h-11
            w-full
            rounded-xl
            bg-white
            text-sm
            font-medium
            text-black
            transition
            hover:bg-cyan-100
          "
              >
                Send message
              </button>
            </form>
          </div>

          {/* =================================
        RIGHT SIDE
        EARTH + RIBBONS
    ================================= */}

          <div
  className="pointer-events-none relative hidden w-full lg:block"
  style={{ height: "620px" }}
>
  <ContactGlobe />
</div>
        </div>
      </div>
    </section>
  );
}
