"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import {
  getPersonalInfo,
  getSocialLinks,
  getFeaturedSkills,
  getProjects,
  getEducation,
  getCertifications,
  getCV,
} from "@/lib/api";
import type {
  PersonalInfo,
  SocialLink,
  Skill,
  Project,
  Education,
  Certification,
  CV,
} from "@/types";
import { TypeWriter } from "@/components/animations";

// ============ ANIMATED PARTICLE BACKGROUND ============
function AnimatedBackground() {
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

    // Initialize particles
    const colors = ["#8b5cf6", "#6366f1", "#a78bfa", "#818cf8", "#c084fc"];
    for (let i = 0; i < 80; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * (1 - dist / 150)})`;
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
        if (mDist < 200) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(167, 139, 250, ${0.3 * (1 - mDist / 200)})`;
          ctx.lineWidth = 1;
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
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
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
        opacity: 0.7,
      }}
    />
  );
}

// ============ MOUSE FOLLOW GLOW ============
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
        width: 600,
        height: 600,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 1,
      }}
      animate={{ x: pos.x - 300, y: pos.y - 300 }}
      transition={{ type: "spring", damping: 30, stiffness: 100 }}
    />
  );
}

// ============ FLOATING ELEMENTS ============
function FloatingElements() {
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
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: 8 + i * 4,
            height: 8 + i * 4,
            borderRadius: "50%",
            background: `rgba(${139 + i * 10}, ${92 + i * 10}, 246, ${
              0.3 - i * 0.04
            })`,
            left: `${10 + i * 15}%`,
            top: `${20 + i * 10}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}

// ============ 3D TILT CARD ============
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), {
    stiffness: 400,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), {
    stiffness: 400,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) / rect.width);
    y.set((e.clientY - rect.top - rect.height / 2) / rect.height);
  };

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

// ============ ANIMATED TEXT ============
function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [text, started]);

  return (
    <span>
      {displayText}
      <motion.span
        style={{ color: "#8b5cf6" }}
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      >
        |
      </motion.span>
    </span>
  );
}

// ============ MAIN COMPONENT ============
export default function HomePage() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [cv, setCv] = useState<CV | null>(null);
  const [eduIndex, setEduIndex] = useState(0);
  const [certIndex, setCertIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          info,
          links,
          skillsData,
          projectsData,
          educationData,
          certsData,
          cvData,
        ] = await Promise.all([
          getPersonalInfo(),
          getSocialLinks(),
          getFeaturedSkills(),
          getProjects(true),
          getEducation(),
          getCertifications(),
          getCV(),
        ]);
        setPersonalInfo(info);
        setSocialLinks(links);
        setSkills(skillsData);
        setProjects(projectsData);
        setEducation(educationData);
        setCertifications(certsData);
        setCv(cvData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050510",
        }}
      >
        <motion.div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: "4px solid rgba(139, 92, 246, 0.2)",
            borderTopColor: "#8b5cf6",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        position: "relative",
      }}
    >
      {/* Premium Animated Background */}
      <AnimatedBackground />
      <MouseGlow />
      <FloatingElements />

      {/* Gradient Orbs */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            top: "10%",
            left: "20%",
            width: 500,
            height: 500,
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          style={{
            position: "absolute",
            bottom: "20%",
            right: "20%",
            width: 400,
            height: 400,
            background:
              "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 600,
            background:
              "radial-gradient(circle, rgba(167, 139, 250, 0.1) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      {/* ==================== HERO SECTION ==================== */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 2,
          padding: "100px 32px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 900,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          {/* Profile Photo with Animated Ring */}
          {personalInfo?.profile_photo_url && (
            <motion.div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 56,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div style={{ position: "relative" }}>
                {/* Animated Rings */}
                <motion.div
                  style={{
                    position: "absolute",
                    inset: -20,
                    border: "2px solid rgba(139, 92, 246, 0.3)",
                    borderRadius: "50%",
                  }}
                  animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                  transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity },
                  }}
                />
                <motion.div
                  style={{
                    position: "absolute",
                    inset: -40,
                    border: "1px solid rgba(99, 102, 241, 0.2)",
                    borderRadius: "50%",
                  }}
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                {/* Glow */}
                <div
                  style={{
                    position: "absolute",
                    inset: -24,
                    background:
                      "linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(99, 102, 241, 0.4))",
                    borderRadius: "50%",
                    filter: "blur(40px)",
                  }}
                />

                {/* Floating Photo */}
                <motion.img
                  src={personalInfo.profile_photo_url}
                  alt={personalInfo.name}
                  style={{
                    position: "relative",
                    width: 180,
                    height: 180,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "4px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
                  }}
                  animate={{ y: [0, -12, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Orbiting Dots */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    style={{
                      position: "absolute",
                      width: 6 + i * 2,
                      height: 6 + i * 2,
                      borderRadius: "50%",
                      background: i % 2 === 0 ? "#8b5cf6" : "#6366f1",
                      boxShadow: `0 0 10px ${
                        i % 2 === 0 ? "#8b5cf6" : "#6366f1"
                      }`,
                      top: "50%",
                      left: "50%",
                      transformOrigin: `${-60 - i * 15}px 0`,
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 6 + i * 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Status Badge */}
          <motion.div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 40,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 24px",
                borderRadius: 9999,
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                color: "#34d399",
                fontSize: 14,
                fontWeight: 500,
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(16, 185, 129, 0.3)",
              }}
            >
              <motion.span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#34d399",
                }}
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              Available for opportunities
            </motion.span>
          </motion.div>

          {/* Name with Typewriter Effect */}
          <motion.h1
            style={{
              fontSize: "clamp(48px, 12vw, 96px)",
              fontWeight: 800,
              marginBottom: 24,
              background:
                "linear-gradient(135deg, #c4b5fd, #a78bfa, #8b5cf6, #7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <TypewriterText
              text={personalInfo?.name || "Fares Essam"}
              delay={500}
            />
          </motion.h1>

          {/* Title with TypeWriter Animation */}
          <motion.h2
            style={{
              fontSize: "clamp(20px, 4vw, 36px)",
              fontWeight: 400,
              color: "var(--text-secondary)",
              marginBottom: 40,
              minHeight: "1.5em",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <TypeWriter
              texts={[
                "Full Stack React & Django Developer",
                "Full Stack PHP & Laravel Developer",
                "Frontend React & Next.js Developer",
                "Backend Django & Python Developer",
                "Backend PHP & REST API Developer",
              ]}
              typingSpeed={70}
              deletingSpeed={40}
              pauseDuration={2500}
            />
          </motion.h2>

          {/* Bio */}
          <motion.p
            style={{
              fontSize: 20,
              color: "rgba(255,255,255,0.4)",
              maxWidth: 650,
              margin: "0 auto 56px auto",
              lineHeight: 1.8,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {personalInfo?.bio ||
              "Passionate developer crafting elegant, scalable web solutions."}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 24,
              marginBottom: 56,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link href="/projects">
              <motion.button
                style={{
                  position: "relative",
                  padding: "18px 48px",
                  background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: 17,
                  borderRadius: 16,
                  border: "none",
                  cursor: "pointer",
                  overflow: "hidden",
                }}
                whileHover={{
                  scale: 1.05,
                  y: -3,
                  boxShadow: "0 20px 50px rgba(139, 92, 246, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
                  }}
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span style={{ position: "relative", zIndex: 1 }}>
                  View My Work →
                </span>
              </motion.button>
            </Link>
            <Link href="/contact">
              <motion.button
                style={{
                  padding: "18px 48px",
                  background: "transparent",
                  color: "white",
                  fontWeight: 600,
                  fontSize: 17,
                  borderRadius: 16,
                  border: "2px solid rgba(255,255,255,0.2)",
                  cursor: "pointer",
                }}
                whileHover={{
                  scale: 1.05,
                  y: -3,
                  borderColor: "rgba(139, 92, 246, 0.5)",
                  background: "rgba(139, 92, 246, 0.1)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                Get In Touch
              </motion.button>
            </Link>
            {cv?.file_url && (
              <a
                href={cv.file_url}
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button
                  style={{
                    padding: "18px 48px",
                    background: "rgba(139, 92, 246, 0.1)",
                    color: "#a78bfa",
                    fontWeight: 600,
                    fontSize: 17,
                    borderRadius: 16,
                    border: "2px solid rgba(139, 92, 246, 0.3)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -3,
                    borderColor: "rgba(139, 92, 246, 0.6)",
                    background: "rgba(139, 92, 246, 0.2)",
                    boxShadow: "0 15px 40px rgba(139, 92, 246, 0.25)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg
                    style={{ width: 20, height: 20 }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download CV
                </motion.button>
              </a>
            )}
          </motion.div>

          {/* Social Links with Glow Effect */}
          <motion.div
            style={{ display: "flex", justifyContent: "center", gap: 20 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {socialLinks.map((link, i) => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255,255,255,0.5)",
                }}
                whileHover={{
                  scale: 1.15,
                  y: -5,
                  background: "rgba(139, 92, 246, 0.2)",
                  borderColor: "rgba(139, 92, 246, 0.5)",
                  color: "white",
                  boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
              >
                {link.platform === "github" ? (
                  <svg
                    style={{ width: 24, height: 24 }}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                ) : link.platform === "linkedin" ? (
                  <svg
                    style={{ width: 24, height: 24 }}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                ) : (
                  <span style={{ fontSize: 16, fontWeight: 700 }}>
                    {link.platform[0].toUpperCase()}
                  </span>
                )}
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== SKILLS SECTION ==================== */}
      <section
        style={{ padding: "200px 32px", position: "relative", zIndex: 2 }}
      >
        <div style={{ width: "100%", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 100 }}>
            <motion.h2
              style={{
                fontSize: "clamp(40px, 8vw, 64px)",
                fontWeight: 700,
                marginBottom: 24,
                background:
                  "linear-gradient(135deg, #c4b5fd, #a78bfa, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Skills & Technologies
            </motion.h2>
            <motion.p
              style={{ fontSize: 22, color: "rgba(255,255,255,0.4)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Technologies I use to bring ideas to life
            </motion.p>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 28,
            }}
          >
            {skills.slice(0, 10).map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.08,
                  type: "spring",
                  stiffness: 100,
                }}
                style={{ width: 180 }}
              >
                <TiltCard>
                  <motion.div
                    style={{
                      padding: 28,
                      borderRadius: 24,
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                    whileHover={{
                      y: -12,
                      borderColor: `${skill.color}50`,
                      boxShadow: `0 25px 50px ${skill.color}20, 0 0 40px ${skill.color}10`,
                    }}
                  >
                    <motion.div
                      style={{
                        width: 64,
                        height: 64,
                        margin: "0 auto 20px auto",
                        borderRadius: 18,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 28,
                        fontWeight: 700,
                        backgroundColor: `${skill.color}15`,
                        color: skill.color,
                      }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {skill.name[0]}
                    </motion.div>
                    <h3
                      style={{
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.85)",
                        fontSize: 15,
                        marginBottom: 16,
                      }}
                    >
                      {skill.name}
                    </h3>
                    <div
                      style={{
                        height: 8,
                        background: "rgba(255,255,255,0.08)",
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        style={{
                          height: "100%",
                          borderRadius: 4,
                          background: `linear-gradient(90deg, ${skill.color}, ${skill.color}aa)`,
                        }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.3 }}
                      />
                    </div>
                    <span
                      style={{
                        display: "block",
                        marginTop: 10,
                        fontSize: 12,
                        color: skill.color,
                      }}
                    >
                      {skill.proficiency}%
                    </span>
                  </motion.div>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 64 }}>
            <Link href="/skills">
              <motion.span
                style={{ color: "#a78bfa", fontSize: 18, cursor: "pointer" }}
                whileHover={{ color: "#c4b5fd" }}
              >
                View all skills →
              </motion.span>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== PROJECTS SECTION ==================== */}
      <section
        style={{ padding: "200px 32px", position: "relative", zIndex: 2 }}
      >
        <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 100 }}>
            <motion.h2
              style={{
                fontSize: "clamp(40px, 8vw, 64px)",
                fontWeight: 700,
                marginBottom: 24,
                background:
                  "linear-gradient(135deg, #c4b5fd, #a78bfa, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Featured Projects
            </motion.h2>
            <motion.p
              style={{ fontSize: 22, color: "rgba(255,255,255,0.4)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              A showcase of my recent work
            </motion.p>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 36,
            }}
          >
            {projects.slice(0, 3).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 80,
                }}
                style={{ width: 380 }}
              >
                <TiltCard>
                  <Link href={`/projects/${project.slug}`}>
                    <motion.div
                      style={{
                        borderRadius: 24,
                        overflow: "hidden",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        cursor: "pointer",
                      }}
                      whileHover={{
                        y: -15,
                        borderColor: "rgba(139, 92, 246, 0.4)",
                        boxShadow: "0 30px 60px rgba(139, 92, 246, 0.2)",
                      }}
                    >
                      <div
                        style={{
                          aspectRatio: "16/9",
                          background:
                            "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.2))",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        {project.image_url ? (
                          <motion.img
                            src={project.image_url}
                            alt={project.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                          />
                        ) : (
                          <span
                            style={{
                              fontSize: 56,
                              fontWeight: 700,
                              color: "rgba(255,255,255,0.1)",
                            }}
                          >
                            {project.title[0]}
                          </span>
                        )}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(to top, rgba(5, 5, 16, 0.8) 0%, transparent 50%)",
                          }}
                        />
                      </div>
                      <div style={{ padding: 28 }}>
                        <h3
                          style={{
                            fontSize: 22,
                            fontWeight: 600,
                            color: "white",
                            marginBottom: 14,
                          }}
                        >
                          {project.title}
                        </h3>
                        <p
                          style={{
                            fontSize: 15,
                            color: "rgba(255,255,255,0.4)",
                            marginBottom: 20,
                            lineHeight: 1.7,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {project.short_description}
                        </p>
                        <div
                          style={{ display: "flex", flexWrap: "wrap", gap: 10 }}
                        >
                          {project.tech_list.slice(0, 3).map((tech) => (
                            <motion.span
                              key={tech}
                              style={{
                                padding: "8px 14px",
                                fontSize: 13,
                                borderRadius: 10,
                                background: "rgba(139, 92, 246, 0.1)",
                                color: "#a78bfa",
                                border: "1px solid rgba(139, 92, 246, 0.2)",
                              }}
                              whileHover={{
                                scale: 1.05,
                                background: "rgba(139, 92, 246, 0.2)",
                              }}
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 80 }}>
            <Link href="/projects">
              <motion.button
                style={{
                  padding: "20px 48px",
                  background: "transparent",
                  color: "white",
                  fontWeight: 600,
                  fontSize: 17,
                  borderRadius: 16,
                  border: "2px solid rgba(255,255,255,0.15)",
                  cursor: "pointer",
                }}
                whileHover={{
                  scale: 1.05,
                  borderColor: "rgba(139, 92, 246, 0.5)",
                  background: "rgba(139, 92, 246, 0.1)",
                  boxShadow: "0 15px 40px rgba(139, 92, 246, 0.2)",
                }}
              >
                View All Projects
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== EDUCATION SLIDER SECTION ==================== */}
      <section
        style={{ padding: "120px 32px", position: "relative", zIndex: 2 }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Section Header */}
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <motion.span
              style={{
                display: "inline-block",
                padding: "10px 24px",
                background: "rgba(139, 92, 246, 0.1)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
                borderRadius: 50,
                fontSize: 14,
                fontWeight: 500,
                color: "#a78bfa",
                marginBottom: 24,
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              📚 Education
            </motion.span>
            <motion.h2
              style={{
                fontSize: "clamp(32px, 5vw, 48px)",
                fontWeight: 700,
                marginBottom: 20,
                background:
                  "linear-gradient(135deg, #c4b5fd, #a78bfa, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Academic Journey
            </motion.h2>
          </div>

          {/* Education Slider */}
          {education.length > 0 && (
            <motion.div
              style={{ position: "relative" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {/* Slider Container */}
              <div
                style={{
                  overflow: "hidden",
                  borderRadius: 24,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-primary)",
                  padding: "48px 40px",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={eduIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    {/* Institution Logo */}
                    {education[eduIndex]?.logo_url && (
                      <div
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 20,
                          background: "rgba(255,255,255,0.05)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: 28,
                          overflow: "hidden",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        <img
                          src={education[eduIndex].logo_url || ""}
                          alt={education[eduIndex].institution}
                          style={{
                            width: "80%",
                            height: "80%",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    )}

                    {/* Degree */}
                    <h3
                      style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        marginBottom: 12,
                      }}
                    >
                      {education[eduIndex]?.degree}
                    </h3>

                    {/* Institution */}
                    <p
                      style={{
                        fontSize: 20,
                        color: "#a78bfa",
                        marginBottom: 16,
                        fontWeight: 500,
                      }}
                    >
                      {education[eduIndex]?.institution}
                    </p>

                    {/* Duration */}
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 20px",
                        background: "rgba(139, 92, 246, 0.1)",
                        borderRadius: 50,
                        marginBottom: 24,
                      }}
                    >
                      <span
                        style={{ fontSize: 14, color: "var(--text-secondary)" }}
                      >
                        {education[eduIndex]?.start_date} -{" "}
                        {education[eduIndex]?.is_current
                          ? "Present"
                          : education[eduIndex]?.end_date}
                      </span>
                    </div>

                    {/* Description */}
                    {education[eduIndex]?.description && (
                      <p
                        style={{
                          fontSize: 16,
                          color: "var(--text-secondary)",
                          maxWidth: 600,
                          lineHeight: 1.7,
                        }}
                      >
                        {education[eduIndex].description}
                      </p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Arrows */}
              {education.length > 1 && (
                <>
                  <motion.button
                    onClick={() =>
                      setEduIndex((prev) =>
                        prev === 0 ? education.length - 1 : prev - 1
                      )
                    }
                    style={{
                      position: "absolute",
                      left: -24,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: "var(--gradient-accent)",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 25px rgba(139, 92, 246, 0.3)",
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      style={{ width: 24, height: 24, color: "white" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </motion.button>
                  <motion.button
                    onClick={() =>
                      setEduIndex((prev) =>
                        prev === education.length - 1 ? 0 : prev + 1
                      )
                    }
                    style={{
                      position: "absolute",
                      right: -24,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: "var(--gradient-accent)",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 25px rgba(139, 92, 246, 0.3)",
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      style={{ width: 24, height: 24, color: "white" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </motion.button>
                </>
              )}

              {/* Dots Indicator */}
              {education.length > 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 10,
                    marginTop: 32,
                  }}
                >
                  {education.map((_, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setEduIndex(i)}
                      style={{
                        width: eduIndex === i ? 32 : 10,
                        height: 10,
                        borderRadius: 5,
                        background:
                          eduIndex === i
                            ? "#8b5cf6"
                            : "rgba(139, 92, 246, 0.3)",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      whileHover={{ scale: 1.2 }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* View All Link */}
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Link href="/education">
              <motion.button
                style={{
                  padding: "18px 40px",
                  background: "transparent",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  borderRadius: 16,
                  color: "#a78bfa",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                whileHover={{
                  scale: 1.05,
                  borderColor: "rgba(139, 92, 246, 0.5)",
                  background: "rgba(139, 92, 246, 0.1)",
                  boxShadow: "0 15px 40px rgba(139, 92, 246, 0.2)",
                }}
              >
                View Full Education
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== CERTIFICATIONS SLIDER SECTION ==================== */}
      <section
        style={{ padding: "120px 32px", position: "relative", zIndex: 2 }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Section Header */}
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <motion.span
              style={{
                display: "inline-block",
                padding: "10px 24px",
                background: "rgba(139, 92, 246, 0.1)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
                borderRadius: 50,
                fontSize: 14,
                fontWeight: 500,
                color: "#a78bfa",
                marginBottom: 24,
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              🏆 Certifications
            </motion.span>
            <motion.h2
              style={{
                fontSize: "clamp(32px, 5vw, 48px)",
                fontWeight: 700,
                marginBottom: 20,
                background:
                  "linear-gradient(135deg, #c4b5fd, #a78bfa, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Professional Credentials
            </motion.h2>
          </div>

          {/* Certifications Slider */}
          {certifications.length > 0 && (
            <motion.div
              style={{ position: "relative" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {/* Slider Container */}
              <div
                style={{
                  overflow: "hidden",
                  borderRadius: 24,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-primary)",
                  padding: "48px 40px",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={certIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    {/* Certificate Image */}
                    {certifications[certIndex]?.image_url && (
                      <div
                        style={{
                          width: 120,
                          height: 120,
                          borderRadius: 20,
                          background: "rgba(255,255,255,0.05)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: 28,
                          overflow: "hidden",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        <img
                          src={certifications[certIndex].image_url || ""}
                          alt={certifications[certIndex].name}
                          style={{
                            width: "85%",
                            height: "85%",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    )}

                    {/* Certificate Name */}
                    <h3
                      style={{
                        fontSize: 26,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        marginBottom: 12,
                      }}
                    >
                      {certifications[certIndex]?.name}
                    </h3>

                    {/* Issuer */}
                    <p
                      style={{
                        fontSize: 18,
                        color: "#a78bfa",
                        marginBottom: 16,
                        fontWeight: 500,
                      }}
                    >
                      {certifications[certIndex]?.issuer}
                    </p>

                    {/* Issue Date */}
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 20px",
                        background: "rgba(139, 92, 246, 0.1)",
                        borderRadius: 50,
                        marginBottom: 24,
                      }}
                    >
                      <span
                        style={{ fontSize: 14, color: "var(--text-secondary)" }}
                      >
                        Issued: {certifications[certIndex]?.issue_date}
                        {certifications[certIndex]?.expiry_date &&
                          ` • Expires: ${certifications[certIndex]?.expiry_date}`}
                      </span>
                    </div>

                    {/* Credential Link */}
                    {certifications[certIndex]?.credential_url && (
                      <a
                        href={certifications[certIndex].credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <motion.button
                          style={{
                            padding: "12px 28px",
                            background: "var(--gradient-accent)",
                            border: "none",
                            borderRadius: 12,
                            color: "white",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View Credential
                          <svg
                            style={{ width: 16, height: 16 }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </motion.button>
                      </a>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Arrows */}
              {certifications.length > 1 && (
                <>
                  <motion.button
                    onClick={() =>
                      setCertIndex((prev) =>
                        prev === 0 ? certifications.length - 1 : prev - 1
                      )
                    }
                    style={{
                      position: "absolute",
                      left: -24,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: "var(--gradient-accent)",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 25px rgba(139, 92, 246, 0.3)",
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      style={{ width: 24, height: 24, color: "white" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </motion.button>
                  <motion.button
                    onClick={() =>
                      setCertIndex((prev) =>
                        prev === certifications.length - 1 ? 0 : prev + 1
                      )
                    }
                    style={{
                      position: "absolute",
                      right: -24,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: "var(--gradient-accent)",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 25px rgba(139, 92, 246, 0.3)",
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      style={{ width: 24, height: 24, color: "white" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </motion.button>
                </>
              )}

              {/* Dots Indicator */}
              {certifications.length > 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 10,
                    marginTop: 32,
                  }}
                >
                  {certifications.map((_, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setCertIndex(i)}
                      style={{
                        width: certIndex === i ? 32 : 10,
                        height: 10,
                        borderRadius: 5,
                        background:
                          certIndex === i
                            ? "#8b5cf6"
                            : "rgba(139, 92, 246, 0.3)",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      whileHover={{ scale: 1.2 }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section
        style={{ padding: "200px 32px", position: "relative", zIndex: 2 }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 900,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <motion.div
            style={{ position: "relative" }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div
              style={{
                position: "absolute",
                inset: -40,
                background:
                  "linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(99, 102, 241, 0.1))",
                borderRadius: 40,
                filter: "blur(60px)",
              }}
            />
            <div
              style={{
                position: "relative",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 40,
                padding: "100px 60px",
              }}
            >
              <motion.h2
                style={{
                  fontSize: "clamp(40px, 8vw, 64px)",
                  fontWeight: 700,
                  marginBottom: 32,
                  background:
                    "linear-gradient(135deg, #c4b5fd, #a78bfa, #8b5cf6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Let's Work Together
              </motion.h2>
              <motion.p
                style={{
                  fontSize: 22,
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: 56,
                  maxWidth: 550,
                  margin: "0 auto 56px auto",
                  lineHeight: 1.7,
                }}
              >
                Have a project in mind? I'd love to help bring your vision to
                life.
              </motion.p>
              <Link href="/contact">
                <motion.button
                  style={{
                    padding: "22px 56px",
                    background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                    color: "white",
                    fontWeight: 600,
                    fontSize: 19,
                    borderRadius: 18,
                    border: "none",
                    cursor: "pointer",
                  }}
                  whileHover={{
                    scale: 1.08,
                    y: -4,
                    boxShadow: "0 25px 60px rgba(139, 92, 246, 0.5)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start a Conversation ✨
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div style={{ height: 120 }} />
    </div>
  );
}
