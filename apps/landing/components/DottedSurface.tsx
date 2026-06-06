"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type DottedSurfaceProps = {
  /** cor dos pontos em RGB 0–1 */
  color?: [number, number, number];
  opacity?: number;
  size?: number;
  /** cor da névoa (hex) — pontos distantes desvanecem para ela */
  fog?: string;
  className?: string;
};

function hexToRGB(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

/**
 * Fundo animado de "onda de pontos" em Three.js, escopado ao container.
 * Pausa quando fora da viewport e respeita prefers-reduced-motion.
 */
export function DottedSurface({
  color = [0, 0, 0],
  opacity = 0.8,
  size = 8,
  fog = "#ffffff",
  className = "dotted-bg",
}: DottedSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const SEPARATION = 150;
    const AMOUNTX = 40;
    const AMOUNTY = 60;
    const fogRGB = hexToRGB(fog);

    const W = () => container.clientWidth || window.innerWidth;
    const H = () => container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const fogColor = new THREE.Color(fogRGB[0] / 255, fogRGB[1] / 255, fogRGB[2] / 255);
    scene.fog = new THREE.Fog(fogColor, 2000, 10000);

    const camera = new THREE.PerspectiveCamera(60, W() / H(), 1, 10000);
    camera.position.set(0, 355, 1220);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W(), H());
    renderer.setClearColor(fogColor, 0);
    renderer.domElement.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;display:block;";
    container.appendChild(renderer.domElement);

    const positions: number[] = [];
    const colors: number[] = [];
    const geometry = new THREE.BufferGeometry();
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
        positions.push(x, 0, z);
        colors.push(color[0], color[1], color[2]);
      }
    }
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size,
      vertexColors: true,
      transparent: true,
      opacity,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let count = 0;
    let animationId: number | null = null;
    let running = false;

    function frame(animateWave: boolean) {
      const posAttr = geometry.attributes.position;
      const pos = posAttr.array as Float32Array;
      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const index = i * 3;
          pos[index + 1] =
            Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50;
          i++;
        }
      }
      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
      if (animateWave) count += 0.1;
    }

    function loop() {
      animationId = requestAnimationFrame(loop);
      frame(true);
    }
    function start() {
      if (running || reduce) return;
      running = true;
      loop();
    }
    function stop() {
      running = false;
      if (animationId) cancelAnimationFrame(animationId);
      animationId = null;
    }

    function handleResize() {
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
      renderer.setSize(W(), H());
      frame(false);
    }
    window.addEventListener("resize", handleResize);

    // render estático inicial (também serve para reduced-motion)
    frame(false);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? start() : stop()));
      },
      { threshold: 0 },
    );
    io.observe(container);

    return () => {
      io.disconnect();
      window.removeEventListener("resize", handleResize);
      stop();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [color, opacity, size, fog]);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}
