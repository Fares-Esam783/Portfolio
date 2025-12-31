"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { getPersonalInfo, getSocialLinks } from "@/lib/api";
import type { PersonalInfo, SocialLink } from "@/types";

export default function ContactPage() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [info, links] = await Promise.all([
          getPersonalInfo(),
          getSocialLinks(),
        ]);
        setPersonalInfo(info);
        setSocialLinks(links);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormState({ name: "", email: "", subject: "", message: "" });
  };

  const inputStyle = {
    width: "100%",
    padding: "16px 20px",
    borderRadius: 14,
    background: "var(--bg-card)",
    border: "1px solid var(--border-primary)",
    color: "var(--text-primary)",
    fontSize: 16,
    outline: "none",
    transition: "all 0.3s",
  };

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
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
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
              Get In Touch
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
              Let's Work Together
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
              Have a project in mind? I'd love to hear from you.
            </motion.p>
          </div>

          {/* Main Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: 48,
            }}
          >
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 24,
                  padding: 40,
                }}
              >
                <h2
                  style={{
                    fontSize: 28,
                    fontWeight: 600,
                    color: "white",
                    marginBottom: 32,
                  }}
                >
                  Contact Information
                </h2>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 24,
                    marginBottom: 40,
                  }}
                >
                  {[
                    {
                      icon: "📧",
                      label: "Email",
                      value: personalInfo?.email || "faresesam7589@gmail.com",
                      href: `mailto:${
                        personalInfo?.email || "faresesam7589@gmail.com"
                      }`,
                    },
                    {
                      icon: "📱",
                      label: "Phone",
                      value: personalInfo?.phone || "+20 121 080 6085",
                      href: `tel:${personalInfo?.phone || "+201210806085"}`,
                    },
                    {
                      icon: "📍",
                      label: "Location",
                      value: personalInfo?.location || "Egypt",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      style={{ display: "flex", alignItems: "center", gap: 16 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                    >
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 16,
                          background: "rgba(139, 92, 246, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 24,
                        }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: 14,
                            color: "rgba(255,255,255,0.4)",
                            marginBottom: 4,
                          }}
                        >
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            style={{
                              fontSize: 16,
                              color: "white",
                              textDecoration: "none",
                            }}
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p style={{ fontSize: 16, color: "white" }}>
                            {item.value}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Social Links */}
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: "white",
                    marginBottom: 20,
                  }}
                >
                  Follow Me
                </h3>
                <div style={{ display: "flex", gap: 12 }}>
                  {socialLinks.map((link) => (
                    <motion.a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        width: 52,
                        height: 52,
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
                        boxShadow: "0 10px 30px rgba(139, 92, 246, 0.2)",
                      }}
                    >
                      {link.platform === "github" ? (
                        <svg
                          style={{ width: 22, height: 22 }}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                      ) : link.platform === "linkedin" ? (
                        <svg
                          style={{ width: 22, height: 22 }}
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
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    inset: -2,
                    background:
                      "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.2))",
                    borderRadius: 26,
                    filter: "blur(15px)",
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 24,
                    padding: 40,
                  }}
                >
                  <h2
                    style={{
                      fontSize: 28,
                      fontWeight: 600,
                      color: "white",
                      marginBottom: 32,
                    }}
                  >
                    Send a Message
                  </h2>

                  {submitted ? (
                    <motion.div
                      style={{ textAlign: "center", padding: 40 }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div style={{ fontSize: 64, marginBottom: 24 }}>✅</div>
                      <h3
                        style={{
                          fontSize: 24,
                          fontWeight: 600,
                          color: "white",
                          marginBottom: 12,
                        }}
                      >
                        Message Sent!
                      </h3>
                      <p
                        style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}
                      >
                        Thank you for reaching out. I'll get back to you soon.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 20,
                        }}
                      >
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(180px, 1fr))",
                            gap: 20,
                          }}
                        >
                          <input
                            type="text"
                            placeholder="Your Name"
                            value={formState.name}
                            onChange={(e) =>
                              setFormState({
                                ...formState,
                                name: e.target.value,
                              })
                            }
                            required
                            style={inputStyle}
                          />
                          <input
                            type="email"
                            placeholder="Your Email"
                            value={formState.email}
                            onChange={(e) =>
                              setFormState({
                                ...formState,
                                email: e.target.value,
                              })
                            }
                            required
                            style={inputStyle}
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Subject"
                          value={formState.subject}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              subject: e.target.value,
                            })
                          }
                          required
                          style={inputStyle}
                        />
                        <textarea
                          placeholder="Your Message"
                          value={formState.message}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              message: e.target.value,
                            })
                          }
                          required
                          rows={5}
                          style={{ ...inputStyle, resize: "none" }}
                        />
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          style={{
                            padding: "18px 40px",
                            background:
                              "linear-gradient(135deg, #8b5cf6, #6366f1)",
                            color: "white",
                            fontWeight: 600,
                            fontSize: 17,
                            borderRadius: 14,
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 10,
                          }}
                          whileHover={{
                            scale: 1.02,
                            boxShadow: "0 15px 40px rgba(139, 92, 246, 0.3)",
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isSubmitting ? (
                            <>
                              <motion.div
                                style={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: "50%",
                                  border: "2px solid rgba(255,255,255,0.3)",
                                  borderTopColor: "white",
                                }}
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              />
                              Sending...
                            </>
                          ) : (
                            <>
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
                                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                />
                              </svg>
                              Send Message
                            </>
                          )}
                        </motion.button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
