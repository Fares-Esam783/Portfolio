"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { getProjects } from "@/lib/api";
import type { Project } from "@/types";

// 3D Tilt Card
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 400,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
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
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<"all" | "featured">("all");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    }
    fetchData();
  }, []);

  const filteredProjects =
    filter === "featured" ? projects.filter((p) => p.is_featured) : projects;

  return (
    <div
      style={{
        minHeight: "100vh",
        color: "var(--text-primary)",
        position: "relative",
      }}
    >
      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "120px 32px 100px 32px",
        }}
      >
        <div style={{ maxWidth: 1300, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <motion.span
              style={{
                display: "inline-block",
                padding: "10px 24px",
                borderRadius: 9999,
                background: "rgba(139, 92, 246, 0.1)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
                color: "#a78bfa",
                fontSize: 14,
                marginBottom: 24,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              My Work
            </motion.span>
            <motion.h1
              style={{
                fontSize: "clamp(40px, 8vw, 64px)",
                fontWeight: 700,
                background:
                  "linear-gradient(135deg, #c4b5fd, #a78bfa, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: 20,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Featured Projects
            </motion.h1>
            <motion.p
              style={{
                fontSize: 20,
                color: "rgba(255,255,255,0.4)",
                maxWidth: 600,
                margin: "0 auto",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              A collection of my recent work and side projects
            </motion.p>
          </div>

          {/* Filters */}
          <motion.div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
              marginBottom: 64,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {["all", "featured"].map((f) => (
              <motion.button
                key={f}
                onClick={() => setFilter(f as "all" | "featured")}
                style={{
                  padding: "12px 32px",
                  borderRadius: 12,
                  border: "1px solid",
                  borderColor:
                    filter === f ? "#8b5cf6" : "rgba(255,255,255,0.1)",
                  background:
                    filter === f
                      ? "rgba(139, 92, 246, 0.2)"
                      : "rgba(255,255,255,0.02)",
                  color: filter === f ? "#a78bfa" : "rgba(255,255,255,0.6)",
                  fontSize: 15,
                  fontWeight: 500,
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
                whileHover={{ scale: 1.05 }}
              >
                {f === "all" ? "All Projects" : "Featured Only"}
              </motion.button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 32,
            }}
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 80,
                }}
                style={{ width: 400 }}
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
                        y: -12,
                        borderColor: "rgba(139, 92, 246, 0.4)",
                        boxShadow: "0 30px 60px rgba(139, 92, 246, 0.2)",
                      }}
                    >
                      {/* Image */}
                      <div
                        style={{
                          position: "relative",
                          aspectRatio: "16/9",
                          background:
                            "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.2))",
                          overflow: "hidden",
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
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 64,
                                fontWeight: 700,
                                color: "rgba(255,255,255,0.1)",
                              }}
                            >
                              {project.title[0]}
                            </span>
                          </div>
                        )}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(to top, rgba(5, 5, 16, 0.9) 0%, transparent 50%)",
                          }}
                        />

                        {/* Featured Badge */}
                        {project.is_featured && (
                          <div
                            style={{
                              position: "absolute",
                              top: 16,
                              right: 16,
                              padding: "6px 14px",
                              borderRadius: 8,
                              background: "rgba(139, 92, 246, 0.9)",
                              color: "white",
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            Featured
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div style={{ padding: 28 }}>
                        <h3
                          style={{
                            fontSize: 22,
                            fontWeight: 600,
                            color: "white",
                            marginBottom: 12,
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

                        {/* Tech Stack */}
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 8,
                            marginBottom: 20,
                          }}
                        >
                          {project.tech_list.slice(0, 4).map((tech) => (
                            <motion.span
                              key={tech}
                              style={{
                                padding: "6px 14px",
                                fontSize: 13,
                                borderRadius: 8,
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

                        {/* Links */}
                        <div style={{ display: "flex", gap: 12 }}>
                          {project.live_url && (
                            <motion.a
                              href={project.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "10px 18px",
                                borderRadius: 10,
                                background:
                                  "linear-gradient(135deg, #8b5cf6, #6366f1)",
                                color: "white",
                                fontSize: 14,
                                fontWeight: 500,
                                textDecoration: "none",
                              }}
                              whileHover={{ scale: 1.05 }}
                            >
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
                              Live Demo
                            </motion.a>
                          )}
                          {project.github_url && (
                            <motion.a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "10px 18px",
                                borderRadius: 10,
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                color: "rgba(255,255,255,0.7)",
                                fontSize: 14,
                                fontWeight: 500,
                                textDecoration: "none",
                              }}
                              whileHover={{
                                scale: 1.05,
                                borderColor: "rgba(139, 92, 246, 0.3)",
                              }}
                            >
                              <svg
                                style={{ width: 16, height: 16 }}
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                              </svg>
                              GitHub
                            </motion.a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
