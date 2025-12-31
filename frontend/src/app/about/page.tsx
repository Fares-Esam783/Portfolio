"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getPersonalInfo, getSocialLinks, getCV } from "@/lib/api";
import type { PersonalInfo, SocialLink, CV } from "@/types";

export default function AboutPage() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [cv, setCv] = useState<CV | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [info, links, cvData] = await Promise.all([
          getPersonalInfo(),
          getSocialLinks(),
          getCV(),
        ]);
        setPersonalInfo(info);
        setSocialLinks(links);
        setCv(cvData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }
    fetchData();
  }, []);

  const services = [
    {
      icon: "🎨",
      title: "Frontend Development",
      description:
        "Building responsive, interactive UIs with React, Next.js, and modern CSS",
    },
    {
      icon: "⚙️",
      title: "Backend Development",
      description:
        "Creating robust APIs and services with Django, PHP, and Node.js",
    },
    {
      icon: "📱",
      title: "Responsive Design",
      description:
        "Ensuring seamless experiences across all devices and screen sizes",
    },
    {
      icon: "🚀",
      title: "Performance Optimization",
      description: "Optimizing applications for speed, scalability, and SEO",
    },
  ];

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
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
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
              About Me
            </motion.span>
            <motion.h1
              style={{
                fontSize: "clamp(40px, 8vw, 64px)",
                fontWeight: 700,
                background:
                  "linear-gradient(135deg, #c4b5fd, #a78bfa, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Get to know me better
            </motion.h1>
          </div>

          {/* Main Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: 48,
              alignItems: "start",
            }}
          >
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div style={{ position: "sticky", top: 120 }}>
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      inset: -2,
                      background:
                        "linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(99, 102, 241, 0.3))",
                      borderRadius: 28,
                      filter: "blur(20px)",
                    }}
                  />
                  <div
                    style={{
                      position: "relative",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 24,
                      padding: 40,
                      textAlign: "center",
                    }}
                  >
                    {/* Photo */}
                    {personalInfo?.profile_photo_url && (
                      <div
                        style={{
                          position: "relative",
                          width: 160,
                          height: 160,
                          margin: "0 auto 24px auto",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            inset: -12,
                            background:
                              "linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(99, 102, 241, 0.4))",
                            borderRadius: "50%",
                            filter: "blur(25px)",
                          }}
                        />
                        <img
                          src={personalInfo.profile_photo_url}
                          alt={personalInfo.name}
                          style={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "4px solid rgba(255,255,255,0.1)",
                          }}
                        />
                      </div>
                    )}

                    <h2
                      style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: "white",
                        marginBottom: 8,
                      }}
                    >
                      {personalInfo?.name || "Fares Essam"}
                    </h2>
                    <p
                      style={{
                        fontSize: 18,
                        color: "#a78bfa",
                        marginBottom: 32,
                      }}
                    >
                      {personalInfo?.title || "Full Stack Developer"}
                    </p>

                    {/* Contact Info */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                        marginBottom: 32,
                        textAlign: "left",
                      }}
                    >
                      {[
                        {
                          icon: "📍",
                          value: personalInfo?.location || "Egypt",
                        },
                        {
                          icon: "📧",
                          value:
                            personalInfo?.email || "faresesam7589@gmail.com",
                        },
                        {
                          icon: "📱",
                          value: personalInfo?.phone || "+20 121 080 6085",
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            color: "rgba(255,255,255,0.5)",
                            fontSize: 15,
                          }}
                        >
                          <span style={{ fontSize: 18 }}>{item.icon}</span>
                          <span>{item.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Social Links */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 12,
                        marginBottom: 24,
                      }}
                    >
                      {socialLinks.map((link) => (
                        <motion.a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 14,
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "rgba(255,255,255,0.5)",
                          }}
                          whileHover={{
                            scale: 1.1,
                            background: "rgba(139, 92, 246, 0.2)",
                            borderColor: "rgba(139, 92, 246, 0.5)",
                            color: "white",
                          }}
                        >
                          {link.platform === "github" ? (
                            <svg
                              style={{ width: 20, height: 20 }}
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                          ) : link.platform === "linkedin" ? (
                            <svg
                              style={{ width: 20, height: 20 }}
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                          ) : (
                            <span style={{ fontSize: 14, fontWeight: 700 }}>
                              {link.platform[0].toUpperCase()}
                            </span>
                          )}
                        </motion.a>
                      ))}
                    </div>

                    {/* Download CV */}
                    {cv && (
                      <a
                        href={cv.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <motion.button
                          style={{
                            width: "100%",
                            padding: "16px 32px",
                            background:
                              "linear-gradient(135deg, #8b5cf6, #6366f1)",
                            color: "white",
                            fontWeight: 600,
                            fontSize: 16,
                            borderRadius: 14,
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 10,
                          }}
                          whileHover={{
                            scale: 1.03,
                            boxShadow: "0 15px 40px rgba(139, 92, 246, 0.3)",
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
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Download Resume
                        </motion.button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              style={{ display: "flex", flexDirection: "column", gap: 32 }}
            >
              {/* About Text */}
              <div
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 24,
                  padding: 40,
                }}
              >
                <h3
                  style={{
                    fontSize: 24,
                    fontWeight: 600,
                    background: "linear-gradient(135deg, #a78bfa, #8b5cf6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: 24,
                  }}
                >
                  Who I Am
                </h3>
                <div
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 17,
                    lineHeight: 1.8,
                  }}
                >
                  {(
                    personalInfo?.about_text ||
                    `I'm a dedicated Full Stack Developer based in Egypt with a passion for creating exceptional digital experiences. With expertise in React, PHP, and Django, I bring ideas to life through clean, efficient code.

My journey in software development has equipped me with a deep understanding of both frontend and backend technologies. I thrive on tackling complex challenges and transforming them into elegant, user-friendly solutions.

When I'm not coding, I'm exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community.`
                  )
                    .split("\n\n")
                    .map((p, i) => (
                      <p key={i} style={{ marginBottom: 16 }}>
                        {p}
                      </p>
                    ))}
                </div>
              </div>

              {/* What I Do */}
              <div
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 24,
                  padding: 40,
                }}
              >
                <h3
                  style={{
                    fontSize: 24,
                    fontWeight: 600,
                    background: "linear-gradient(135deg, #a78bfa, #8b5cf6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: 24,
                  }}
                >
                  What I Do
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: 20,
                  }}
                >
                  {services.map((item, index) => (
                    <motion.div
                      key={item.title}
                      style={{
                        padding: 24,
                        borderRadius: 16,
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{
                        y: -5,
                        borderColor: "rgba(139, 92, 246, 0.3)",
                        background: "rgba(139, 92, 246, 0.05)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 32,
                          display: "block",
                          marginBottom: 16,
                        }}
                      >
                        {item.icon}
                      </span>
                      <h4
                        style={{
                          fontSize: 18,
                          fontWeight: 600,
                          color: "white",
                          marginBottom: 8,
                        }}
                      >
                        {item.title}
                      </h4>
                      <p
                        style={{
                          fontSize: 14,
                          color: "rgba(255,255,255,0.4)",
                          lineHeight: 1.6,
                        }}
                      >
                        {item.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
