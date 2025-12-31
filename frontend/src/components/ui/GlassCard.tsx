"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  glowColor?: string;
}

export default function GlassCard({
  children,
  className = "",
  hover = true,
  glow = true,
  glowColor = "rgba(99, 102, 241, 0.3)",
}: GlassCardProps) {
  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl
        bg-white/5 backdrop-blur-xl
        border border-white/10
        ${className}
      `}
      whileHover={
        hover
          ? {
              scale: 1.02,
              borderColor: "rgba(255, 255, 255, 0.2)",
            }
          : undefined
      }
      transition={{ duration: 0.3 }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />

      {/* Glow effect */}
      {glow && (
        <motion.div
          className="absolute -inset-1 rounded-2xl opacity-0 blur-xl pointer-events-none"
          style={{ background: glowColor }}
          whileHover={{ opacity: 0.5 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Shine effect on hover */}
      {hover && (
        <motion.div
          className="absolute inset-0 opacity-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)",
          }}
          whileHover={{
            opacity: 1,
            x: ["0%", "100%"],
            transition: { duration: 0.6, ease: "easeInOut" },
          }}
        />
      )}
    </motion.div>
  );
}

// Neon glow variant
interface NeonCardProps extends GlassCardProps {
  neonColor?: string;
}

export function NeonCard({
  children,
  className = "",
  neonColor = "#6366f1",
}: NeonCardProps) {
  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl
        bg-black/40 backdrop-blur-xl
        ${className}
      `}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      style={{
        boxShadow: `0 0 20px ${neonColor}20, inset 0 0 20px ${neonColor}10`,
        border: `1px solid ${neonColor}30`,
      }}
    >
      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${neonColor}40, transparent)`,
          backgroundSize: "200% 100%",
        }}
        animate={{
          backgroundPosition: ["200% 0", "-200% 0"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
