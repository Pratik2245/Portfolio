"use client";

import { useEffect, useState } from "react";
import { X, Github, ExternalLink, Eye, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface Project {
  _id: string;
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

interface AllProjectsProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectSelect: (project: Project) => void;
}

export default function AllProjects({
  isOpen,
  onClose,
  onProjectSelect,
}: AllProjectsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data.projects); // ✅ FIX: access `data.projects` not `data`
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (!isOpen) return null;

  const categories = ["All", "Full Stack", "Frontend", "Backend", "Mobile"];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.some((tech) =>
        tech.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesFilter =
      activeFilter === "All" || project.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm overflow-y-auto">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              All Projects
            </h2>
            <p className="text-gray-400 mt-2">
              Explore my complete portfolio of work
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 rounded-full p-3"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Loading or Error */}
        {loading && (
          <div className="text-center text-white py-10">
            Loading projects...
          </div>
        )}
        {error && (
          <div className="text-center text-red-500 py-10">
            Failed to load projects.
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search projects, technologies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-700/50 text-white placeholder-gray-400 focus:border-purple-500"
                />
              </div>
              <div className="flex gap-2">
                <Filter className="text-gray-400 h-5 w-5 mt-2.5" />
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={activeFilter === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter(category)}
                    className={`${
                      activeFilter === category
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project._id}
                  className="group bg-slate-800/50 rounded-xl overflow-hidden backdrop-blur-sm border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="relative overflow-hidden h-48">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => onProjectSelect(project)}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(project.github, "_blank")}
                          className="border-white text-white hover:bg-white hover:text-slate-900"
                        >
                          <Github className="h-4 w-4 mr-1" />
                          Code
                        </Button>
                      </div>
                    </div>
                    {project.featured && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
                        {project.title}
                      </h3>
                      <span className="text-xs text-gray-400 bg-slate-700/50 px-2 py-1 rounded">
                        {project.category}
                      </span>
                    </div>

                    <p className="text-gray-400 mb-4 text-sm leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-slate-700/50 text-purple-400 rounded text-xs border border-slate-600/50"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-slate-700/50 text-gray-400 rounded text-xs">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-3 text-sm">
                      <button
                        onClick={() => onProjectSelect(project)}
                        className="flex items-center text-gray-400 hover:text-purple-400 transition-colors duration-300"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-400 hover:text-purple-400 transition-colors duration-300"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Live Demo
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  No projects found matching your criteria
                </div>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setActiveFilter("All");
                  }}
                  variant="outline"
                  className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Count */}
            <div className="text-center mt-8 text-gray-400">
              Showing {filteredProjects.length} of {projects.length} projects
            </div>
          </>
        )}
      </div>
    </div>
  );
}
