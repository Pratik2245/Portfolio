"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Github, Linkedin, Mail, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const roles = [
    "Full Stack Developer",
    "UI/UX Designer",
    "Problem Solver",
    "Tech Enthusiast",
    "Android Developer",
  ];

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % roles.length;
      const fullText = roles[i];

      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 500);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, roles]);

  const scrollToAbout = () => {
    document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 sm:pt-24"
    >
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-48 sm:w-72 h-48 sm:h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 sm:w-80 h-60 sm:h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto mt-10 sm:mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
            {/* Content Section */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent animate-fade-in">
                Pratik Paithankar
              </h1>

              <div className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 h-12 flex items-center justify-center lg:justify-start">
                <span className="mr-2">I'm a</span>
                <span className="text-purple-400 font-semibold min-w-[200px] sm:min-w-[300px] text-left">
                  {text}
                  <span className="animate-blink">|</span>
                </span>
              </div>

              <p className="text-sm sm:text-lg text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up">
                Passionate developer crafting digital experiences with modern
                technologies. I love turning complex problems into simple,
                beautiful solutions.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  onClick={() =>
                    document
                      .querySelector("#contact")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Get In Touch
                </Button>
                <a
                  href="/Resume_Pratik_Kishor_Paithankar.pdf"
                  download
                  className="border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center gap-2 text-sm justify-center"
                >
                  <Download className="h-5 w-5" />
                  Download CV
                </a>
              </div>

              {/* Social Icons */}
              <div className="flex justify-center lg:justify-start space-x-6 mb-8">
                {[
                  {
                    icon: Github,
                    href: "https://github.com/Pratik2245",
                    label: "GitHub",
                  },
                  {
                    icon: Linkedin,
                    href: "https://www.linkedin.com/in/pratikpaithankar/",
                    label: "LinkedIn",
                  },
                  {
                    icon: Mail,
                    href: "mailto:paithankarpratik3@gmail.com",
                    label: "Email",
                  },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    className="p-3 rounded-full bg-slate-800/50 text-gray-400 hover:text-purple-400 hover:bg-slate-700/50 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                    aria-label={label}
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                ))}
              </div>
            </div>

            {/* Image Section */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-56 sm:w-72 h-56 sm:h-72 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg">
                <img
                  src="/pratik1.jpeg"
                  alt="Profile Image"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Scroll Down Icon */}
          <div className="text-center mt-12">
            <button
              onClick={scrollToAbout}
              className="animate-bounce text-gray-400 hover:text-purple-400 transition-colors duration-300"
              aria-label="Scroll to About Section"
            >
              <ChevronDown className="h-8 w-8 mx-auto" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
