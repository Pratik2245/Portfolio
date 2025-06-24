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
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { icon: Code, label: "Projects Completed", value: "10+" },
    { icon: Coffee, label: "Cups of Coffee", value: "1000+" },
    { icon: Lightbulb, label: "Ideas Implemented", value: "100+" },
    { icon: Users, label: "Happy Clients", value: "25+" },
  ];

  return (
    <section id="about" ref={sectionRef} className="py-16 sm:py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div
            className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              About Me
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Column */}
            <div
              className={`transition-all duration-1000 delay-200 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              <div className="relative mx-auto max-w-sm sm:max-w-full">
                <div className="w-full h-[400px] sm:h-[500px] bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl overflow-hidden">
                  <div className="w-full h-full rounded-2xl overflow-hidden border-4 border-purple-500 shadow-xl">
                    <Image
                      src="/pratik1.jpeg"
                      alt="About Me Image"
                      width={600}
                      height={600}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Code className="h-6 w-6 sm:h-12 sm:w-12 text-white" />
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div
              className={`transition-all duration-1000 delay-400 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}
            >
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-5 tracking-tight leading-snug">
                🚀 Passionate Developer & Problem Solver
              </h3>

              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-gray-300">
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

              {/* Personal Info */}
              <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 bg-slate-800/30 p-4 sm:p-6 rounded-xl border border-slate-700/50 backdrop-blur-sm shadow-md">
                <div>
                  <span className="text-purple-400 font-semibold block text-sm sm:text-base">
                    📍 Location:
                  </span>
                  <p className="text-gray-200 mt-1 text-sm sm:text-base">
                    Pune, Maharashtra
                  </p>
                </div>
                <div>
                  <span className="text-purple-400 font-semibold block text-sm sm:text-base">
                    💼 Experience:
                  </span>
                  <p className="text-gray-200 mt-1 text-sm sm:text-base">NA</p>
                </div>
                <div>
                  <span className="text-purple-400 font-semibold block text-sm sm:text-base">
                    ✉️ Email:
                  </span>
                  <p className="text-gray-200 mt-1 text-sm sm:text-base">
                    paithankarpratik3@gmail.com
                  </p>
                </div>
                <div>
                  <span className="text-purple-400 font-semibold block text-sm sm:text-base">
                    ✅ Availability:
                  </span>
                  <p className="text-gray-200 mt-1 text-sm sm:text-base">
                    Open to Work
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div
            className={`mt-16 sm:mt-20 transition-all duration-1000 delay-600 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
              {stats.map(({ icon: Icon, label, value }, index) => (
                <div
                  key={label}
                  className="text-center p-4 sm:p-6 bg-slate-800/30 rounded-xl backdrop-blur-sm border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105"
                >
                  <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400 mx-auto mb-2 sm:mb-4" />
                  <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                    {value}
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
