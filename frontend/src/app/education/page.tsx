"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getEducation, getCertifications } from "@/lib/api";
import type { Education, Certification } from "@/types";

export default function EducationPage() {
  const [education, setEducation] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [edu, certs] = await Promise.all([
          getEducation(),
          getCertifications(),
        ]);
        setEducation(edu);
        setCertifications(certs);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }
    fetchData();
  }, []);

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
              My Background
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
              Education & Certifications
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
              My academic journey and professional certifications
            </motion.p>
          </div>

          {/* Education Section */}
          <motion.div
            style={{ marginBottom: 80 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2
              style={{
                fontSize: 28,
                fontWeight: 600,
                color: "white",
                marginBottom: 32,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 32 }}>🎓</span>
              Education
            </h2>

            <div style={{ position: "relative", paddingLeft: 32 }}>
              {/* Timeline line */}
              <div
                style={{
                  position: "absolute",
                  left: 7,
                  top: 8,
                  bottom: 8,
                  width: 2,
                  background: "linear-gradient(180deg, #8b5cf6, transparent)",
                }}
              />

              {education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  style={{ position: "relative", marginBottom: 32 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  {/* Timeline dot */}
                  <div
                    style={{
                      position: "absolute",
                      left: -32,
                      top: 8,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "#8b5cf6",
                      boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)",
                    }}
                  />

                  <motion.div
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 20,
                      padding: 28,
                    }}
                    whileHover={{
                      borderColor: "rgba(139, 92, 246, 0.3)",
                      background: "rgba(139, 92, 246, 0.03)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: 12,
                        marginBottom: 12,
                      }}
                    >
                      <h3
                        style={{
                          fontSize: 20,
                          fontWeight: 600,
                          color: "white",
                        }}
                      >
                        {edu.degree}
                      </h3>
                      <span
                        style={{
                          padding: "6px 14px",
                          borderRadius: 8,
                          background: "rgba(139, 92, 246, 0.1)",
                          color: "#a78bfa",
                          fontSize: 13,
                        }}
                      >
                        {new Date(edu.start_date).getFullYear()} -{" "}
                        {edu.end_date
                          ? new Date(edu.end_date).getFullYear()
                          : "Present"}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 16,
                        color: "#a78bfa",
                        marginBottom: 12,
                      }}
                    >
                      {edu.institution}
                    </p>
                    {edu.description && (
                      <p
                        style={{
                          fontSize: 15,
                          color: "rgba(255,255,255,0.4)",
                          lineHeight: 1.7,
                        }}
                      >
                        {edu.description}
                      </p>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Certifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2
              style={{
                fontSize: 28,
                fontWeight: 600,
                color: "white",
                marginBottom: 32,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 32 }}>📜</span>
              Certifications
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 24,
              }}
            >
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <motion.div
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 20,
                      padding: 28,
                      height: "100%",
                    }}
                    whileHover={{
                      y: -8,
                      borderColor: "rgba(139, 92, 246, 0.3)",
                      boxShadow: "0 20px 40px rgba(139, 92, 246, 0.1)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        marginBottom: 16,
                      }}
                    >
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 14,
                          background:
                            "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.2))",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 24,
                        }}
                      >
                        🏆
                      </div>
                      <div>
                        <h3
                          style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: "white",
                            marginBottom: 4,
                          }}
                        >
                          {cert.name}
                        </h3>
                        <p style={{ fontSize: 14, color: "#a78bfa" }}>
                          {cert.issuer}
                        </p>
                      </div>
                    </div>

                    <p
                      style={{
                        fontSize: 14,
                        color: "rgba(255,255,255,0.4)",
                        marginBottom: 16,
                      }}
                    >
                      Issued:{" "}
                      {new Date(cert.issue_date).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>

                    {cert.credential_url && (
                      <motion.a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          color: "#a78bfa",
                          fontSize: 14,
                          textDecoration: "none",
                        }}
                        whileHover={{ color: "#c4b5fd" }}
                      >
                        View Credential
                        <svg
                          style={{ width: 14, height: 14 }}
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
                      </motion.a>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
