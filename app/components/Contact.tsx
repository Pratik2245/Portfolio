"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Github,
  Linkedin,
  InstagramIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error. Please try again later.");
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "paithankarpratik3@gmail.com",
      link: "mailto:paithankarpratik3@gmail.com",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+918010552914",
      link: "tel:+918010552914",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Pune, Maharashtra",
      link: "#",
    },
  ];

  const socialLinks = [
    { icon: Github, href: "https://github.com/Pratik2245", label: "GitHub" },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/pratikpaithankar/",
      label: "LinkedIn",
    },
    {
      icon: InstagramIcon,
      href: "https://www.instagram.com/pratikpaithankar2004/",
      label: "Instagram",
    },
  ];

  return (
    <section id="contact" ref={sectionRef} className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Get In Touch
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
            <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
              I'm always open to discussing new opportunities, interesting
              projects, or just having a chat about technology
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div
              className={`transition-all duration-1000 delay-200 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              <h3 className="text-2xl font-bold text-white mb-8">
                Let's Connect
              </h3>
              <div className="space-y-6 mb-8">
                {contactInfo.map(({ icon: Icon, title, value, link }) => (
                  <a
                    key={title}
                    href={link}
                    className="flex items-center p-4 bg-slate-900/50 rounded-xl backdrop-blur-sm border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 group"
                  >
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">{title}</div>
                      <div className="text-white font-semibold group-hover:text-purple-400 transition-colors duration-300">
                        {value}
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  Follow Me
                </h4>
                <div className="flex space-x-4">
                  {socialLinks.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="p-3 bg-slate-900/50 rounded-lg text-gray-400 hover:text-purple-400 hover:bg-slate-800/50 transition-all duration-300 transform hover:scale-110 border border-slate-700/50 hover:border-purple-500/50"
                    >
                      <Icon className="h-6 w-6" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-green-400 font-semibold">
                    Available for new projects
                  </span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div
              className={`transition-all duration-1000 delay-400 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-slate-900/50 border-slate-700/50 text-white"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-slate-900/50 border-slate-700/50 text-white"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-gray-300">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="bg-slate-900/50 border-slate-700/50 text-white"
                    placeholder="What's this about?"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-300">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="bg-slate-900/50 border-slate-700/50 text-white resize-none"
                    placeholder="Tell me about your project or just say hello!"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
