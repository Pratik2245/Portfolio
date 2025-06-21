"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Github, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ProjectModal from "./ProjectModal";
import AllProjects from "./AllProjects";

export default function Projects() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [projects, setProjects] = useState<any[]>([]); // fetched data
  const sectionRef = useRef<HTMLElement>(null);

  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAllProjectsOpen, setIsAllProjectsOpen] = useState(false);

  // Fetch from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects", {
          cache: "no-store",
        });
        const data = await res.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, []);

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

  const categories = ["All", "Full Stack", "Frontend", "Backend", "Mobile"];

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  const handleProjectPreview = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleViewAllProjects = () => {
    setIsAllProjectsOpen(true);
  };

  return (
    <section id="projects" ref={sectionRef} className="py-20">
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
              Featured Projects
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
            <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
              A showcase of my recent work and personal projects that
              demonstrate my skills and passion for development
            </p>
          </div>

          {/* Filter Buttons */}
          <div
            className={`flex flex-wrap justify-center gap-4 mb-12 transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeFilter === category ? "default" : "outline"}
                onClick={() => setActiveFilter(category)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  activeFilter === category
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <div
                key={project._id || project.id}
                className={`group bg-slate-900/50 rounded-2xl overflow-hidden backdrop-blur-sm border border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                } ${project.featured ? "md:col-span-2 lg:col-span-1" : ""}`}
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                {/* Project Image */}
                <div className="relative overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleProjectPreview(project)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <a
                        href={project.github}
                        rel="noopener noreferrer"
                        className="inline-flex items-center border border-white text-white hover:bg-white hover:text-slate-900 text-sm px-4 py-2 rounded-md transition"
                      >
                        <Github className="h-4 w-4 mr-1" />
                        Code
                      </a>
                    </div>
                  </div>
                  {project.featured && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </div>
                  )}
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies?.map((tech: string) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-slate-800/50 text-purple-400 rounded-full text-xs border border-slate-700/50"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Project Links */}
                  <div className="flex gap-3">
                    <a
                      href={project.live}
                      className="flex items-center text-gray-400 hover:text-purple-400 transition-colors duration-300"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Live Demo
                    </a>
                    <a
                      href={project.github}
                      className="flex items-center text-gray-400 hover:text-purple-400 transition-colors duration-300"
                    >
                      <Github className="h-4 w-4 mr-1" />
                      Source Code
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View More Button */}
          <div
            className={`text-center mt-12 transition-all duration-1000 delay-800 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <Button
              size="lg"
              onClick={handleViewAllProjects}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              View All Projects
            </Button>
          </div>

          {/* Project Modal */}
          <ProjectModal
            project={selectedProject}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />

          {/* All Projects Modal */}
          <AllProjects
            isOpen={isAllProjectsOpen}
            onClose={() => setIsAllProjectsOpen(false)}
            onProjectSelect={handleProjectPreview}
          />
        </div>
      </div>
    </section>
  );
}
