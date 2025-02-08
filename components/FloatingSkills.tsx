"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface Skill {
  id: number;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

const FloatingSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const frameRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const skillNames = [
      // Original items
      "React",
      "Node.js",
      "AWS",
      "AI",
      "Kubernetes",
      "TypeScript",
      "Docker",
      "GraphQL",
      "MongoDB",
      "OpenAI",
      "Terraform",
      "Terragrunt",
      "JavaScript",
      "Python",
      "Vue",
      "PostgreSQL",
      "Redis",

      // Additional items (existing from previous expansions)
      "Agentic AI",
      "Angular",
      "Apollo GraphQL",
      "Blazor",
      "C#", // (kept)
      "DynamoDB",
      "ElasticSearch",
      "Git",
      "Kinesis",
      "LocalStack",
      "Mocha",
      "NestJS",
      "Nuxt.js",
      "Razor",
      "Remix",
      "SASS",
      "SQL Server",
      "SQS",
      "SNS",
      // AI terms
      "ChatGPT",
      "DeepSeek",
      "OpenAI",
      "LangChain",
      "LLMs",
      "Serverless",
      "sops",
      "dotnet",

      // pricipals
      "SOLID",
      "DRY",
      "KISS",
      "YAGNI",
      "CQRS",
      "Event Sourcing",
      "Microservices",
      "Distributed Systems",
      "Resiliency",
    ];
    const initialSkills = skillNames.map((name, index) => ({
      id: index,
      name,
      x: Math.random() * document.documentElement.scrollWidth,
      y: Math.random() * document.documentElement.scrollHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: 50,
    }));

    setSkills(initialSkills);

    const animate = () => {
      setSkills((prevSkills) => {
        const containerWidth = document.documentElement.scrollWidth;
        const containerHeight = document.documentElement.scrollHeight;

        return prevSkills.map((skill) => {
          let { x, y, vx, vy, radius } = skill;

          // Update position
          x += vx;
          y += vy;

          // Boundary collision with smoother response
          if (x - radius < 0 || x + radius > containerWidth) {
            vx *= -0.5;
            x = Math.max(radius, Math.min(x, containerWidth - radius));
          }
          if (y - radius < 0 || y + radius > containerHeight) {
            vy *= -0.5;
            y = Math.max(radius, Math.min(y, containerHeight - radius));
          }

          // Skill collision with reduced response
          prevSkills.forEach((otherSkill) => {
            if (skill.id !== otherSkill.id) {
              const dx = x - otherSkill.x;
              const dy = y - otherSkill.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const minDistance = radius + otherSkill.radius;

              if (distance < minDistance) {
                const angle = Math.atan2(dy, dx);
                const targetX = x + Math.cos(angle) * minDistance;
                const targetY = y + Math.sin(angle) * minDistance;
                const ax = (targetX - x) * 0.01;
                const ay = (targetY - y) * 0.01;

                vx += ax;
                vy += ay;
              }
            }
          });

          // Apply more damping to slow down movement
          vx *= 0.995;
          vy *= 0.995;

          // Add very slight random movement
          vx += (Math.random() - 0.5) * 0.02;
          vy += (Math.random() - 0.5) * 0.02;

          // Limit maximum speed
          const maxSpeed = 0.5;
          const currentSpeed = Math.sqrt(vx * vx + vy * vy);
          if (currentSpeed > maxSpeed) {
            vx = (vx / currentSpeed) * maxSpeed;
            vy = (vy / currentSpeed) * maxSpeed;
          }

          return { ...skill, x, y, vx, vy };
        });
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      {skills.map((skill) => (
        <motion.div
          key={skill.id}
          className="absolute"
          style={{
            left: skill.x - skill.radius,
            top: skill.y - skill.radius,
          }}
        >
          <div
            className="px-4 py-2 bg-cyan-500/10 rounded-full text-cyan-400 text-sm whitespace-nowrap
            backdrop-blur-sm shadow-lg shadow-cyan-500/20 border border-cyan-500/20
            transition-colors duration-200 hover:bg-cyan-500/20"
          >
            {skill.name}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingSkills;
