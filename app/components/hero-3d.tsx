import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Points, PointMaterial, Stars } from "@react-three/drei";
import * as THREE from "three";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";

// Hook to detect dark mode in shadcn (either class .dark on html or media query)
function useIsDarkMode() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const checkDark = () => {
      const isDarkClass = document.documentElement.classList.contains("dark");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setIsDark(isDarkClass || prefersDark);
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => checkDark();
    mediaQuery.addEventListener("change", handler);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", handler);
    };
  }, []);
  return isDark;
}

// Camera rig to create smooth mouse/touch parallax interaction
function CameraRig() {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      state.pointer.x * 1.2,
      0.05,
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      state.pointer.y * 1.2,
      0.05,
    );
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function Particles({ isDark }: { isDark: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const [positions, colors] = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();

    // Monochrome palette: whites/grays for dark mode, blacks/grays for light mode
    const themeColors = isDark
      ? ["#ffffff", "#e5e5e5", "#a3a3a3", "#525252"]
      : ["#000000", "#171717", "#525252", "#a3a3a3"];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

      color.set(themeColors[Math.floor(Math.random() * themeColors.length)]);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return [positions, colors];
  }, [isDark]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 30;
      ref.current.rotation.y -= delta / 40;
    }
  });

  return (
    <Points
      ref={ref}
      positions={positions}
      colors={colors}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        vertexColors
        size={0.035}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}

function CodeGeometry({ isDark }: { isDark: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const rotationX = useRef(0);
  const rotationY = useRef(0);

  useFrame((state, delta) => {
    if (meshRef.current) {
      rotationX.current += delta * 0.12;
      rotationY.current += delta * 0.16;
      // Add interactive rotation drift based on mouse/touch pointer
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        rotationX.current + state.pointer.y * 0.4,
        0.05,
      );
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        rotationY.current + state.pointer.x * 0.4,
        0.05,
      );
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.2} floatIntensity={1.2}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.8, 1]} />
        <meshBasicMaterial
          color={isDark ? "#ffffff" : "#000000"}
          wireframe
          transparent
          opacity={isDark ? 0.15 : 0.1}
        />
      </mesh>
    </Float>
  );
}

function ConnectingLines({ isDark }: { isDark: boolean }) {
  const color = isDark ? "#a3a3a3" : "#525252";
  const opacity = isDark ? 0.3 : 0.15;
  return (
    <group>
      <Float
        speed={1.5}
        rotationIntensity={0.5}
        floatIntensity={1}
        position={[-3.5, 1.5, -2]}
      >
        <mesh>
          <torusGeometry args={[0.6, 0.015, 16, 100]} />
          <meshBasicMaterial
            color={color}
            wireframe
            transparent
            opacity={opacity}
          />
        </mesh>
      </Float>
      <Float
        speed={2.5}
        rotationIntensity={2}
        floatIntensity={2}
        position={[3.5, -1.5, -3]}
      >
        <mesh>
          <octahedronGeometry args={[0.7, 0]} />
          <meshBasicMaterial
            color={color}
            wireframe
            transparent
            opacity={opacity}
          />
        </mesh>
      </Float>
      <Float
        speed={2}
        rotationIntensity={1}
        floatIntensity={1.5}
        position={[0, -2.5, -4]}
      >
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial
            color={color}
            wireframe
            transparent
            opacity={opacity}
          />
        </mesh>
      </Float>
    </group>
  );
}

export function Hero3D() {
  const isDark = useIsDarkMode();

  return (
    <div className="bg-background text-foreground relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">
      {/* 3D Canvas Background */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-80">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <CameraRig />
          <Particles isDark={isDark} />
          <CodeGeometry isDark={isDark} />
          <ConnectingLines isDark={isDark} />
          {isDark && (
            <Stars
              radius={100}
              depth={50}
              count={1500}
              factor={4}
              saturation={0}
              fade
              speed={0.5}
            />
          )}
        </Canvas>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
        <div className="border-border bg-muted text-muted-foreground mb-6 inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium backdrop-blur-xs">
          <span className="bg-foreground mr-2 flex h-2 w-2 animate-pulse rounded-full"></span>
          Available for new opportunities
        </div>

        <h1 className="text-foreground mb-6 max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
          <span className="mb-2 block">Building the Future of</span>
          <span className="from-foreground via-foreground to-muted-foreground block bg-linear-to-r bg-clip-text pb-2 text-transparent">
            Web Engineering
          </span>
        </h1>

        <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg leading-relaxed sm:text-xl">
          I craft robust, scalable, and premium digital experiences using modern
          tools and clean code. Let's write the next chapter together.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            size="lg"
            className="h-12 px-8 text-base font-semibold transition-all hover:scale-105"
            asChild
          >
            <Link to="/#">Start a Project</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 text-base font-semibold transition-all hover:scale-105"
            asChild
          >
            <Link to="/about">Explore My Work</Link>
          </Button>
        </div>
      </div>

      {/* Bottom Gradient for smooth transition */}
      <div className="from-background pointer-events-none absolute right-0 bottom-0 left-0 h-40 bg-linear-to-t to-transparent"></div>
    </div>
  );
}
