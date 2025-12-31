"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// ============ ANIMATED PARTICLE BACKGROUND ============
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<
    Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
    }>
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Get current theme
    const getThemeColors = () => {
      const isDark =
        document.documentElement.getAttribute("data-theme") !== "light";
      return isDark
        ? ["#8b5cf6", "#6366f1", "#a78bfa", "#818cf8", "#c084fc"]
        : ["#7c3aed", "#4f46e5", "#6366f1", "#8b5cf6", "#a78bfa"];
    };

    // Initialize particles
    const colors = getThemeColors();
    particlesRef.current = [];
    for (let i = 0; i < 60; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.4 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      const newColors = getThemeColors();
      particlesRef.current.forEach((particle) => {
        particle.color =
          newColors[Math.floor(Math.random() * newColors.length)];
      });
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    let animationId: number;
    const animate = () => {
      const isDark =
        document.documentElement.getAttribute("data-theme") !== "light";
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = isDark
              ? `rgba(139, 92, 246, ${0.08 * (1 - dist / 120)})`
              : `rgba(124, 58, 237, ${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });

        // Mouse interaction
        const mdx = particle.x - mouseRef.current.x;
        const mdy = particle.y - mouseRef.current.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 150) {
          ctx.beginPath();
          ctx.strokeStyle = isDark
            ? `rgba(167, 139, 250, ${0.2 * (1 - mDist / 150)})`
            : `rgba(124, 58, 237, ${0.25 * (1 - mDist / 150)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.stroke();
        }
      });

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = isDark ? particle.opacity : particle.opacity * 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.6,
      }}
    />
  );
}

// ============ MOUSE GLOW ============
function MouseGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) =>
      setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <motion.div
      style={{
        position: "fixed",
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: "var(--gradient-glow)",
        pointerEvents: "none",
        zIndex: 0,
      }}
      animate={{ x: pos.x - 200, y: pos.y - 200 }}
      transition={{ type: "spring", damping: 30, stiffness: 100 }}
    />
  );
}

// ============ GRADIENT ORBS ============
function GradientOrbs() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          top: "10%",
          left: "20%",
          width: 400,
          height: 400,
          background: "var(--gradient-glow)",
          borderRadius: "50%",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        style={{
          position: "absolute",
          bottom: "15%",
          right: "20%",
          width: 350,
          height: 350,
          background: "var(--gradient-glow)",
          borderRadius: "50%",
        }}
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
    </div>
  );
}

// ============ MAIN EXPORT ============
export default function AnimatedBackground() {
  return (
    <>
      <ParticleCanvas />
      <MouseGlow />
      <GradientOrbs />
    </>
  );
}
