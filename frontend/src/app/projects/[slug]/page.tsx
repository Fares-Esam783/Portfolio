"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getProject } from "@/lib/api";
import type { Project } from "@/types";

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        const data = await getProject(slug);
        setProject(data);
      } catch (err) {
        console.error("Failed to fetch project:", err);
        setError("Project not found");
      } finally {
        setIsLoading(false);
      }
    }
    if (slug) {
      fetchProject();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-primary)",
        }}
      >
        <motion.div
          style={{
            width: 60,
            height: 60,
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

  if (error || !project) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-primary)",
          gap: 24,
        }}
      >
        <h1 style={{ fontSize: 48, fontWeight: 700 }}>404</h1>
        <p style={{ color: "var(--text-secondary)" }}>Project not found</p>
        <Link href="/projects">
          <motion.button
            style={{
              padding: "14px 32px",
              background: "var(--gradient-accent)",
              color: "white",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Projects
          </motion.button>
        </Link>
      </div>
    );
  }

  const techList = project.technologies.split(",").map((t) => t.trim());

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
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: 40 }}
          >
            <Link
              href="/projects"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                color: "var(--text-secondary)",
                fontSize: 14,
              }}
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Projects
            </Link>
          </motion.div>

          {/* Project Image */}
          {project.image_url && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                borderRadius: 24,
                overflow: "hidden",
                marginBottom: 48,
                boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              }}
            >
              <img
                src={project.image_url}
                alt={project.title}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                }}
              />
            </motion.div>
          )}

          {/* Title & Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1
              style={{
                fontSize: "clamp(32px, 5vw, 48px)",
                fontWeight: 700,
                marginBottom: 20,
                background:
                  "linear-gradient(135deg, #c4b5fd, #a78bfa, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {project.title}
            </h1>

            <p
              style={{
                fontSize: 18,
                color: "var(--text-secondary)",
                lineHeight: 1.8,
                marginBottom: 40,
              }}
            >
              {project.description}
            </p>
          </motion.div>

          {/* Technologies */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ marginBottom: 40 }}
          >
            <h3
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 16,
              }}
            >
              Technologies Used
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {techList.map((tech, i) => (
                <span
                  key={i}
                  style={{
                    padding: "8px 16px",
                    background: "rgba(139, 92, 246, 0.1)",
                    border: "1px solid rgba(139, 92, 246, 0.3)",
                    borderRadius: 8,
                    fontSize: 14,
                    color: "#a78bfa",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
          >
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button
                  style={{
                    padding: "16px 32px",
                    background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                    color: "white",
                    borderRadius: 14,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 50px rgba(139, 92, 246, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
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
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  View Live Demo
                </motion.button>
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button
                  style={{
                    padding: "16px 32px",
                    background: "transparent",
                    color: "#a78bfa",
                    borderRadius: 14,
                    border: "2px solid rgba(139, 92, 246, 0.3)",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                  whileHover={{
                    scale: 1.05,
                    borderColor: "rgba(139, 92, 246, 0.6)",
                    background: "rgba(139, 92, 246, 0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    style={{ width: 20, height: 20 }}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  View on GitHub
                </motion.button>
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
