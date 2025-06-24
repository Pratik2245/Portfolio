"use client";

import { useState } from "react";
import {
  X,
  Github,
  ExternalLink,
  Calendar,
  Users,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  images: string[];
  technologies: string[];
  category: string;
  github: string;
  live: string;
  featured: boolean;
  duration: string;
  team: string;
  challenges: string[];
  features: string[];
  results: string[];
}

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({
  project,
  isOpen,
  onClose,
}: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !project) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + project.images.length) % project.images.length
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-6xl max-h-screen md:max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden border border-slate-700/50">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 rounded-full p-2"
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Modal Content */}
        <div className="overflow-y-auto overflow-x-hidden max-h-screen md:max-h-[90vh]">
          {/* Header Section */}
          <div className="relative">
            <div className="relative h-60 sm:h-72 md:h-96 overflow-hidden">
              <Image
                src={project.images[currentImageIndex] || project.image}
                alt={project.title}
                fill
                className="object-cover"
              />

              {project.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-slate-900/50 hover:bg-slate-800/70 text-white rounded-full p-2"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-slate-900/50 hover:bg-slate-800/70 text-white rounded-full p-2"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>

                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {project.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          index === currentImageIndex
                            ? "bg-purple-400"
                            : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex flex-wrap items-center justify-between">
                  <div className="mb-2 sm:mb-0">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                      {project.title}
                    </h2>
                    <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-semibold">
                      {project.category}
                    </span>
                  </div>
                  {project.featured && (
                    <div className="flex items-center text-yellow-400">
                      <Star className="h-5 w-5 mr-1 fill-current" />
                      <span className="text-sm font-semibold">Featured</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                    Project Overview
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {project.longDescription}
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-gray-400">
                      <Calendar className="h-5 w-5 mr-2 text-purple-400" />
                      <span>Duration: {project.duration}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Users className="h-5 w-5 mr-2 text-purple-400" />
                      <span>Team: {project.team}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      onClick={() => window.open(project.live, "_blank")}
                    >
                      <ExternalLink className="mr-2 h-5 w-5" />
                      View Live Project
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                      onClick={() => window.open(project.github, "_blank")}
                    >
                      <Github className="mr-2 h-5 w-5" />
                      View Source Code
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                    Key Features
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {project.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                    Challenges & Solutions
                  </h3>
                  <div className="space-y-3">
                    {project.challenges.map((challenge, index) => (
                      <div
                        key={index}
                        className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50"
                      >
                        <p className="text-gray-300">{challenge}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                    Results & Impact
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {project.results.map((result, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20"
                      >
                        <p className="text-gray-300">{result}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                  <h4 className="text-lg font-bold text-white mb-4">
                    Technologies Used
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-slate-700/50 text-purple-400 rounded-full text-sm border border-slate-600/50"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                  <h4 className="text-lg font-bold text-white mb-4">
                    Project Stats
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Completion</span>
                      <span className="text-green-400 font-semibold">100%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Code Quality</span>
                      <span className="text-purple-400 font-semibold">A+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Performance</span>
                      <span className="text-blue-400 font-semibold">
                        95/100
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                  <h4 className="text-lg font-bold text-white mb-4">
                    Related Projects
                  </h4>
                  <div className="space-y-2">
                    <a
                      href="#"
                      className="block text-purple-400 hover:text-purple-300"
                    >
                      → Similar E-commerce Project
                    </a>
                    <a
                      href="#"
                      className="block text-purple-400 hover:text-purple-300"
                    >
                      → React Dashboard Template
                    </a>
                    <a
                      href="#"
                      className="block text-purple-400 hover:text-purple-300"
                    >
                      → Payment Integration Guide
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
