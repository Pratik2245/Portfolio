"use client";

import { useEffect, useRef, useState } from "react";
import { Code, Database, Palette, Server } from "lucide-react";

export default function Skills() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const skillCategories = [
    {
      icon: Code,
      title: "Frontend Development",
      skills: ["React/Next.js", "TypeScript", "Tailwind CSS", "Vue.js"],
    },
    {
      icon: Server,
      title: "Backend Development",
      skills: ["Node.js", "Python", "Express.js", "GraphQL"],
    },
    {
      icon: Database,
      title: "Database & Cloud",
      skills: ["PostgreSQL", "MongoDB", "AWS", "Docker"],
    },
    {
      icon: Palette,
      title: "Design & Tools",
      skills: ["Figma", "Adobe XD", "Git/GitHub", "VS Code"],
    },
  ];

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden"
    >
      {/* Matching blurred decorations from About section */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Skills & Expertise
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
            <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
              A glimpse into the technologies and tools I work with across
              different development domains.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {skillCategories.map(({ icon: Icon, title, skills }, index) => (
              <div
                key={title}
                className={`group relative overflow-hidden rounded-3xl p-6 bg-slate-900 border border-slate-700 hover:border-purple-400 shadow-xl hover:shadow-purple-400/20 transition duration-500 backdrop-blur-lg ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition" />
                <div className="flex flex-col items-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mt-4 text-center">
                    {title}
                  </h3>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-1 text-sm font-medium text-purple-300 bg-purple-500/10 border border-purple-500/30 rounded-full hover:bg-purple-600/20 hover:text-purple-100 transition"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
