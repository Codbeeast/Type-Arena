"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Environment, Text3D, Center } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

function FloatingKey({ position, char, color = "#00f3ff" }: { position: [number, number, number], char: string, color?: string }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.x += 0.01;
        meshRef.current.rotation.y += 0.01;
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh
                ref={meshRef}
                position={position}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <boxGeometry args={[1, 1, 0.5]} />
                <meshStandardMaterial
                    color={hovered ? "#ffffff" : color}
                    emissive={color}
                    emissiveIntensity={hovered ? 2 : 0.5}
                    roughness={0.1}
                    metalness={0.8}
                />
            </mesh>
        </Float>
    );
}

export function Scene3D() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#00f3ff" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#bc13fe" />

                <FloatingKey position={[-3, 2, 0]} char="W" color="#00f3ff" />
                <FloatingKey position={[3, -2, -2]} char="A" color="#bc13fe" />
                <FloatingKey position={[-2, -3, 1]} char="S" color="#0affc6" />
                <FloatingKey position={[4, 3, -1]} char="D" color="#00f3ff" />

                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
