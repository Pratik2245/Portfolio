"use client";

import { useEffect, useRef, useState } from "react";
import { GraduationCap, CalendarDays } from "lucide-react";

interface EducationItem {
  title: string;
  institute: string;
  location: string;
  grade?: string;
  duration: string;
}

const educationData: EducationItem[] = [
  {
    title: "B.Tech in Computer Science and Engineering",
    institute: "Vishwakarma Institute of Technology",
    location: "Bebwewadi Pune, India",
    duration: "2024 - Present",
  },
  {
    title: "Diploma in Computer Technology",
    institute: "Sanjivani K.B.P. Polytechnic",
    location: "Kopargaon Maharashtra, India",
    grade: "94.51%",
    duration: "2020 – 2023",
  },
  {
    title: "10th - SSC",
    institute: "De English Medium School",
    location: "Yeola Maharashtra,India",
    duration: "2010 - 2021",
  },
];

export default function Education() {
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

  return (
    <section id="education" ref={sectionRef} className="py-20 relative">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Education
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
        </div>

        <div className="relative pl-6 lg:pl-12">
          {/* Vertical Line */}
          <div className="absolute left-3.5 lg:left-6 top-0 h-full w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>

          {/* Timeline Items */}
          {educationData.map((edu, index) => (
            <div
              key={index}
              className={`relative mb-12 transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Dot */}
              <div className="absolute left-0 lg:left-2 w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-4 border-slate-900 z-10"></div>

              {/* Content Card */}
              <div className="ml-8 lg:ml-12 bg-slate-900 border border-slate-700 p-6 rounded-xl shadow-md hover:shadow-purple-500/20 hover:border-purple-400 transition-all">
                <div className="flex items-center gap-3 mb-2 text-purple-400 font-semibold">
                  <GraduationCap className="h-5 w-5" />
                  {edu.title}
                </div>
                <h4 className="text-white text-lg font-bold">
                  {edu.institute}
                </h4>
                <p className="text-sm text-gray-400">{edu.location}</p>
                {edu.grade && (
                  <p className="text-sm text-gray-300 mt-2">
                    <span className="font-semibold text-purple-300">
                      Grade:
                    </span>{" "}
                    {edu.grade}
                  </p>
                )}
                <div className="mt-3 flex items-center text-sm text-gray-400 gap-2">
                  <CalendarDays className="w-4 h-4" />
                  {edu.duration}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
