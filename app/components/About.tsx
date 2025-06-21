"use client";

import { useEffect, useRef, useState } from "react";
import { Code, Coffee, Lightbulb, Users } from "lucide-react";
import Image from "next/image";

export default function About() {
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

  const stats = [
    { icon: Code, label: "Projects Completed", value: "10+" },
    { icon: Coffee, label: "Cups of Coffee", value: "1000+" },
    { icon: Lightbulb, label: "Ideas Implemented", value: "100+" },
    { icon: Users, label: "Happy Clients", value: "25+" },
  ];

  return (
    <section id="about" ref={sectionRef} className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              About Me
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Image */}
            <div
              className={`transition-all duration-1000 delay-200 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              <div className="relative">
                <div className="w-full h-[580px] bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl overflow-hidden">
                  <div className="w-full h-full rounded-2xl overflow-hidden border-4 border-purple-500 shadow-xl">
                    <Image
                      src="/pratik1.jpeg"
                      alt="About Me Image"
                      width={600} // Adjust to your preferred size
                      height={600}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Code className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div
              className={`transition-all duration-1000 delay-400 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-5 tracking-tight leading-snug">
                🚀 Passionate Developer & Problem Solver
              </h3>

              <div className="space-y-4 text-base leading-relaxed text-gray-300">
                <p>
                  I'm{" "}
                  <span className="text-purple-400 font-semibold italic">
                    Pratik
                  </span>
                  , a
                  <span className="text-pink-400 font-semibold">
                    {" "}
                    Full-Stack Developer
                  </span>{" "}
                  with
                  <span className="text-rose-400 font-semibold">
                    {" "}
                    3+ years
                  </span>{" "}
                  of experience building clean, scalable, and user-focused web
                  applications.
                </p>

                <p>
                  I specialize in crafting modern UIs and robust backends using
                  <span className="text-teal-300 font-semibold">
                    {" "}
                    cutting-edge tech
                  </span>
                  . My passion lies in building solutions that are not just
                  functional, but intuitive and elegant.
                </p>

                <p>
                  When I’m not coding, I enjoy exploring new tools, contributing
                  to open source, or mentoring developers.
                </p>

                <div className="border-l-4 border-purple-500 pl-4 italic text-sm text-slate-400 bg-slate-800/30 py-2 rounded-md">
                  "Build with purpose. Ship with pride."
                </div>
              </div>

              {/* Personal Details with style */}
              <div className="mt-10 grid grid-cols-2 gap-6 bg-slate-800/30 p-6 rounded-xl border border-slate-700/50 backdrop-blur-sm shadow-md">
                <div>
                  <span className="text-purple-400 font-semibold block">
                    📍 Location:
                  </span>
                  <p className="text-gray-200 mt-1">Pune, Maharashtra</p>
                </div>
                <div>
                  <span className="text-purple-400 font-semibold block">
                    💼 Experience:
                  </span>
                  <p className="text-gray-200 mt-1">NA</p>
                </div>
                <div>
                  <span className="text-purple-400 font-semibold block">
                    ✉️ Email:
                  </span>
                  <p className="text-gray-200 mt-1">
                    paithankarpratik3@gmail.com
                  </p>
                </div>
                <div>
                  <span className="text-purple-400 font-semibold block">
                    ✅ Availability:
                  </span>
                  <p className="text-gray-200 mt-1">Open to Work</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div
            className={`mt-20 transition-all duration-1000 delay-600 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map(({ icon: Icon, label, value }, index) => (
                <div
                  key={label}
                  className={`text-center p-6 bg-slate-800/30 rounded-xl backdrop-blur-sm border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 ${
                    isVisible ? "animate-fade-in-up" : ""
                  }`}
                  style={{ animationDelay: `${800 + index * 100}ms` }}
                >
                  <Icon className="h-8 w-8 text-purple-400 mx-auto mb-4" />
                  <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {value}
                  </div>
                  <div className="text-gray-400 text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
