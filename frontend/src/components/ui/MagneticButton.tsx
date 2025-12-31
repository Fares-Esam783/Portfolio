"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  magneticStrength?: number;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export default function MagneticButton({
  children,
  className = "",
  magneticStrength = 0.3,
  onClick,
  href,
  variant = "primary",
  size = "md",
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 300 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const rotateX = useTransform(ySpring, [-20, 20], [5, -5]);
  const rotateY = useTransform(xSpring, [-20, 20], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * magneticStrength;
    const deltaY = (e.clientY - centerY) * magneticStrength;

    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const baseStyles = `
    relative overflow-hidden rounded-full font-medium
    transition-colors duration-300
    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-indigo-600 to-purple-600
      text-white
      hover:from-indigo-500 hover:to-purple-500
      shadow-lg shadow-indigo-500/25
    `,
    secondary: `
      bg-white/10 backdrop-blur-sm
      text-white
      border border-white/20
      hover:bg-white/20
    `,
    outline: `
      bg-transparent
      text-white
      border-2 border-indigo-500
      hover:bg-indigo-500/20
    `,
    ghost: `
      bg-transparent
      text-white
      hover:bg-white/10
    `,
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const Component = href ? motion.a : motion.button;
  const componentProps = href ? { href } : { onClick };

  return (
    <Component
      ref={buttonRef as React.Ref<HTMLButtonElement & HTMLAnchorElement>}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      style={{
        x: xSpring,
        y: ySpring,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
      data-cursor
      data-cursor-text="Click"
      {...componentProps}
    >
      {/* Ripple effect background */}
      <motion.span
        className="absolute inset-0 bg-white/20 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={
          isHovered ? { scale: 2, opacity: 0 } : { scale: 0, opacity: 0 }
        }
        transition={{ duration: 0.6 }}
      />

      {/* Gradient shine */}
      <motion.span
        className="absolute inset-0 opacity-0"
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)",
        }}
        animate={
          isHovered ? { opacity: 1, x: "100%" } : { opacity: 0, x: "-100%" }
        }
        transition={{ duration: 0.5 }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </Component>
  );
}

// Icon button variant
interface IconButtonProps {
  icon: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  label: string;
}

export function IconButton({
  icon,
  className = "",
  onClick,
  href,
  label,
}: IconButtonProps) {
  const Component = href ? motion.a : motion.button;
  const componentProps = href
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { onClick };

  return (
    <Component
      className={`
        relative p-3 rounded-full
        bg-white/5 backdrop-blur-sm
        border border-white/10
        text-white/70 hover:text-white
        hover:bg-white/10 hover:border-white/20
        transition-colors duration-300
        ${className}
      `}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
      data-cursor
      {...componentProps}
    >
      {icon}
    </Component>
  );
}
