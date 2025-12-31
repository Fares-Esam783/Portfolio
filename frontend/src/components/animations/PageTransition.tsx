"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const overlayVariants: Variants = {
  initial: {
    scaleY: 1,
    originY: 0,
  },
  animate: {
    scaleY: 0,
    transition: {
      duration: 0.8,
      ease: [0.76, 0, 0.24, 1] as const,
    },
  },
  exit: {
    scaleY: 1,
    originY: 1,
    transition: {
      duration: 0.6,
      ease: [0.76, 0, 0.24, 1] as const,
    },
  },
};

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname}>
        {/* Page transition overlay */}
        <motion.div
          className="fixed inset-0 z-50 bg-gradient-to-b from-indigo-600 via-purple-600 to-indigo-800 pointer-events-none"
          variants={overlayVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        />

        {/* Secondary overlay for depth */}
        <motion.div
          className="fixed inset-0 z-40 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{
            opacity: 0,
            transition: { delay: 0.3, duration: 0.5 },
          }}
          exit={{
            opacity: 1,
            transition: { duration: 0.3 },
          }}
        />

        {/* Page content */}
        <motion.main
          variants={pageVariants}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          {children}
        </motion.main>
      </motion.div>
    </AnimatePresence>
  );
}

// Stagger container for child animations
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

// Fade up animation for individual elements
export const fadeUp: Variants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

// Fade in animation
export const fadeIn: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

// Scale up animation
export const scaleUp: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

// Slide in from left
export const slideInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -60,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

// Slide in from right
export const slideInRight: Variants = {
  initial: {
    opacity: 0,
    x: 60,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};
