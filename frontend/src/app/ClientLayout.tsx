"use client";

import { ReactNode } from "react";
import {
  CustomCursor,
  AnimatedBackground,
  PageTransition,
} from "@/components/animations";
import { Navigation, ScrollToTop } from "@/components/ui";
import { ThemeProvider } from "@/context/ThemeContext";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ThemeProvider>
      {/* Custom cursor - hidden on mobile */}
      <div className="hidden md:block">
        <CustomCursor />
      </div>

      {/* Premium animated background with particles, mouse glow, and gradient orbs */}
      <AnimatedBackground />

      {/* Navigation */}
      <Navigation />

      {/* Page content with transitions */}
      <PageTransition>
        <div className="min-h-screen pt-20">{children}</div>
      </PageTransition>

      {/* Scroll to top button */}
      <ScrollToTop />
    </ThemeProvider>
  );
}
