"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { getSkillCategories, getSkills } from "@/lib/api";
import type { SkillCategory, Skill } from "@/types";

// 3D Tilt Card
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), {
    stiffness: 400,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), {
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

export default function SkillsPage() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cats, skillsData] = await Promise.all([
          getSkillCategories(),
          getSkills(),
        ]);
        setCategories(cats);
        setSkills(skillsData);
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      }
    }
    fetchData();
  }, []);

  const filteredSkills = activeCategory
    ? skills.filter((s) => s.category === parseInt(activeCategory))
    : skills;

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
              My Skills
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
              Skills & Technologies
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
              Technologies and tools I use to bring products to life
            </motion.p>
          </div>

          {/* Category Filters */}
          <motion.div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 12,
              marginBottom: 64,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={() => setActiveCategory(null)}
              style={{
                padding: "12px 28px",
                borderRadius: 12,
                border: "1px solid",
                borderColor: !activeCategory
                  ? "#8b5cf6"
                  : "rgba(255,255,255,0.1)",
                background: !activeCategory
                  ? "rgba(139, 92, 246, 0.2)"
                  : "rgba(255,255,255,0.02)",
                color: !activeCategory ? "#a78bfa" : "rgba(255,255,255,0.6)",
                fontSize: 15,
                fontWeight: 500,
                cursor: "pointer",
              }}
              whileHover={{ scale: 1.05 }}
            >
              All
            </motion.button>
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id.toString())}
                style={{
                  padding: "12px 28px",
                  borderRadius: 12,
                  border: "1px solid",
                  borderColor:
                    activeCategory === cat.id.toString()
                      ? "#8b5cf6"
                      : "rgba(255,255,255,0.1)",
                  background:
                    activeCategory === cat.id.toString()
                      ? "rgba(139, 92, 246, 0.2)"
                      : "rgba(255,255,255,0.02)",
                  color:
                    activeCategory === cat.id.toString()
                      ? "#a78bfa"
                      : "rgba(255,255,255,0.6)",
                  fontSize: 15,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
                whileHover={{ scale: 1.05 }}
              >
                {cat.name}
              </motion.button>
            ))}
          </motion.div>

          {/* Skills Grid */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 24,
            }}
          >
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 100,
                }}
                style={{ width: 200 }}
              >
                <TiltCard>
                  <motion.div
                    style={{
                      padding: 32,
                      borderRadius: 24,
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                    whileHover={{
                      y: -10,
                      borderColor: `${skill.color}50`,
                      boxShadow: `0 25px 50px ${skill.color}20, 0 0 50px ${skill.color}10`,
                    }}
                  >
                    <motion.div
                      style={{
                        width: 72,
                        height: 72,
                        margin: "0 auto 20px auto",
                        borderRadius: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 32,
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
                        color: "white",
                        fontSize: 17,
                        marginBottom: 8,
                      }}
                    >
                      {skill.name}
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.4)",
                        marginBottom: 16,
                      }}
                    >
                      {skill.category_name}
                    </p>

                    {/* Progress Bar */}
                    <div
                      style={{
                        height: 8,
                        background: "rgba(255,255,255,0.08)",
                        borderRadius: 4,
                        overflow: "hidden",
                        marginBottom: 8,
                      }}
                    >
                      <motion.div
                        style={{
                          height: "100%",
                          borderRadius: 4,
                          background: `linear-gradient(90deg, ${skill.color}, ${skill.color}aa)`,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.proficiency}%` }}
                        transition={{
                          duration: 1.2,
                          delay: 0.3 + index * 0.05,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 14,
                        color: skill.color,
                        fontWeight: 600,
                      }}
                    >
                      {skill.proficiency}%
                    </span>
                  </motion.div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
