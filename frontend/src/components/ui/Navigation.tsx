"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "/education", label: "Education" },
  { href: "/contact", label: "Contact" },
];

// Theme Toggle Button
function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // Don't animate icons until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: "var(--bg-card)",
          border: "1px solid var(--border-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        background: "var(--bg-card)",
        border: "1px solid var(--border-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
      whileHover={{
        scale: 1.05,
        borderColor: "var(--accent-primary)",
        boxShadow: "0 0 20px rgba(139, 92, 246, 0.2)",
      }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <AnimatePresence mode="wait">
        {theme === "dark" ? (
          <motion.svg
            key="moon"
            style={{ width: 20, height: 20, color: "#fbbf24" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            initial={{ rotate: -90, opacity: 0, scale: 0 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </motion.svg>
        ) : (
          <motion.svg
            key="sun"
            style={{ width: 20, height: 20, color: "#6366f1" }}
            fill="currentColor"
            viewBox="0 0 24 24"
            initial={{ rotate: 90, opacity: 0, scale: 0 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
          >
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Navigation Link Component
function NavLink({
  href,
  children,
  isActive,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
}) {
  return (
    <Link href={href}>
      <motion.div
        style={{
          position: "relative",
          padding: "10px 20px",
          cursor: "pointer",
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.span
          style={{
            fontSize: 14,
            fontWeight: isActive ? 600 : 500,
            color: isActive ? "var(--accent-primary)" : "var(--text-secondary)",
            letterSpacing: "0.01em",
            transition: "color 0.2s ease",
          }}
        >
          {children}
        </motion.span>

        {/* Hover underline effect */}
        <motion.div
          style={{
            position: "absolute",
            bottom: 6,
            left: 20,
            right: 20,
            height: 2,
            borderRadius: 1,
            background: "var(--accent-primary)",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={
            isActive ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }
          }
          whileHover={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </Link>
  );
}

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Main Navigation */}
      <motion.nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: isScrolled ? "12px 0" : "20px 0",
          background: isScrolled ? "var(--nav-bg)" : "transparent",
          backdropFilter: isScrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: isScrolled ? "blur(20px)" : "none",
          borderBottom: isScrolled ? "1px solid var(--nav-border)" : "none",
          transition: "all 0.3s ease",
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Logo */}
            <Link href="/">
              <motion.div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Logo Icon */}
                <motion.div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "var(--gradient-accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 20px rgba(139, 92, 246, 0.3)",
                  }}
                  whileHover={{ rotate: 5, scale: 1.05 }}
                >
                  <span
                    style={{ color: "white", fontWeight: 700, fontSize: 18 }}
                  >
                    FE
                  </span>
                </motion.div>

                {/* Logo Text */}
                <div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      background: "var(--gradient-primary)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Fares Essam
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Developer
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div
              style={{
                display: "none",
                alignItems: "center",
                gap: 8,
                background: "var(--bg-card)",
                border: "1px solid var(--border-primary)",
                borderRadius: 16,
                padding: "6px 8px",
              }}
              className="desktop-nav"
            >
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  isActive={pathname === link.href}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Right Side Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Contact Button - Desktop */}
              <motion.div className="desktop-nav" style={{ display: "none" }}>
                <Link href="/contact">
                  <motion.button
                    style={{
                      padding: "12px 24px",
                      borderRadius: 12,
                      background: "var(--gradient-accent)",
                      color: "white",
                      fontSize: 14,
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 4px 20px rgba(139, 92, 246, 0.3)",
                    }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 8px 30px rgba(139, 92, 246, 0.4)",
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Let's Talk
                  </motion.button>
                </Link>
              </motion.div>

              {/* Mobile Menu Button */}
              <motion.button
                className="mobile-menu-btn"
                style={{
                  display: "none",
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-primary)",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  cursor: "pointer",
                }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
                whileHover={{ borderColor: "var(--accent-primary)" }}
              >
                <motion.span
                  style={{
                    width: 18,
                    height: 2,
                    borderRadius: 1,
                    background: "var(--text-primary)",
                    originX: 0.5,
                    originY: 0.5,
                  }}
                  animate={
                    isMobileMenuOpen
                      ? { rotate: 45, y: 7 }
                      : { rotate: 0, y: 0 }
                  }
                />
                <motion.span
                  style={{
                    width: 18,
                    height: 2,
                    borderRadius: 1,
                    background: "var(--text-primary)",
                  }}
                  animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                />
                <motion.span
                  style={{
                    width: 18,
                    height: 2,
                    borderRadius: 1,
                    background: "var(--text-primary)",
                    originX: 0.5,
                    originY: 0.5,
                  }}
                  animate={
                    isMobileMenuOpen
                      ? { rotate: -45, y: -7 }
                      : { rotate: 0, y: 0 }
                  }
                />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 90,
              background: "var(--bg-primary)",
              paddingTop: 100,
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div style={{ padding: "40px 32px" }}>
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link href={link.href}>
                    <motion.div
                      style={{
                        padding: "20px 0",
                        borderBottom: "1px solid var(--border-primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                      whileHover={{ x: 10 }}
                    >
                      <span
                        style={{
                          fontSize: 24,
                          fontWeight: pathname === link.href ? 700 : 400,
                          color:
                            pathname === link.href
                              ? "var(--accent-primary)"
                              : "var(--text-primary)",
                        }}
                      >
                        {link.label}
                      </span>
                      <svg
                        style={{
                          width: 20,
                          height: 20,
                          color: "var(--text-muted)",
                        }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for responsive navigation */}
      <style jsx global>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
