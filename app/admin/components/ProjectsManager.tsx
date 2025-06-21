"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, ExternalLink, Github, X } from "lucide-react"
import type { Project } from "@/lib/models"

interface ProjectsManagerProps {
  onStatsChange: () => void
}

export default function ProjectsManager({ onStatsChange }: ProjectsManagerProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDescription: "",
    image: "",
    images: [] as string[],
    technologies: [] as string[],
    category: "",
    github: "",
    live: "",
    featured: false,
    duration: "",
    team: "",
    challenges: [] as string[],
    features: [] as string[],
    results: [] as string[],
  })

  const [newTech, setNewTech] = useState("")
  const [newChallenge, setNewChallenge] = useState("")
  const [newFeature, setNewFeature] = useState("")
  const [newResult, setNewResult] = useState("")
  const [newImage, setNewImage] = useState("")

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await fetch("/api/admin/projects")
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects)
      }
    } catch (error) {
      console.error("Failed to load projects:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      longDescription: "",
      image: "",
      images: [],
      technologies: [],
      category: "",
      github: "",
      live: "",
      featured: false,
      duration: "",
      team: "",
      challenges: [],
      features: [],
      results: [],
    })
    setEditingProject(null)
    setNewTech("")
    setNewChallenge("")
    setNewFeature("")
    setNewResult("")
    setNewImage("")
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription,
      image: project.image,
      images: project.images || [],
      technologies: project.technologies || [],
      category: project.category,
      github: project.github,
      live: project.live,
      featured: project.featured,
      duration: project.duration,
      team: project.team,
      challenges: project.challenges || [],
      features: project.features || [],
      results: project.results || [],
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const url = editingProject ? `/api/admin/projects/${editingProject._id}` : "/api/admin/projects"

      const method = editingProject ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess(editingProject ? "Project updated successfully!" : "Project created successfully!")
        setIsDialogOpen(false)
        resetForm()
        loadProjects()
        onStatsChange()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to save project")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    }
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSuccess("Project deleted successfully!")
        loadProjects()
        onStatsChange()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to delete project")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    }
  }

  const addArrayItem = (field: keyof typeof formData, value: string, setValue: (val: string) => void) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()],
      }))
      setValue("")
    }
  }

  const removeArrayItem = (field: keyof typeof formData, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }))
  }

  if (isLoading) {
    return <div className="text-white">Loading projects...</div>
  }

  return (
    <div className="space-y-6">
      {(error || success) && (
        <Alert className={error ? "border-red-500/50 bg-red-500/10" : "border-green-500/50 bg-green-500/10"}>
          <AlertDescription className={error ? "text-red-400" : "text-green-400"}>{error || success}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Projects ({projects.length})</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
              <DialogDescription className="text-gray-400">
                {editingProject ? "Update project information" : "Create a new project entry"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-300">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    className="bg-slate-800/50 border-slate-700/50 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-gray-300">
                    Category *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="Full Stack">Full Stack</SelectItem>
                      <SelectItem value="Frontend">Frontend</SelectItem>
                      <SelectItem value="Backend">Backend</SelectItem>
                      <SelectItem value="Mobile">Mobile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">
                  Short Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="bg-slate-800/50 border-slate-700/50 text-white"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longDescription" className="text-gray-300">
                  Long Description *
                </Label>
                <Textarea
                  id="longDescription"
                  value={formData.longDescription}
                  onChange={(e) => setFormData((prev) => ({ ...prev, longDescription: e.target.value }))}
                  className="bg-slate-800/50 border-slate-700/50 text-white"
                  rows={4}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-gray-300">
                    Main Image URL *
                  </Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                    className="bg-slate-800/50 border-slate-700/50 text-white"
                    placeholder="/placeholder.svg?height=300&width=400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Additional Images</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      className="bg-slate-800/50 border-slate-700/50 text-white"
                      placeholder="Image URL"
                    />
                    <Button
                      type="button"
                      onClick={() => addArrayItem("images", newImage, setNewImage)}
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.images.map((image, index) => (
                      <Badge key={index} variant="secondary" className="bg-slate-700 text-gray-300">
                        Image {index + 1}
                        <button
                          type="button"
                          onClick={() => removeArrayItem("images", index)}
                          className="ml-2 text-red-400 hover:text-red-300"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="github" className="text-gray-300">
                    GitHub URL
                  </Label>
                  <Input
                    id="github"
                    value={formData.github}
                    onChange={(e) => setFormData((prev) => ({ ...prev, github: e.target.value }))}
                    className="bg-slate-800/50 border-slate-700/50 text-white"
                    placeholder="https://github.com/..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="live" className="text-gray-300">
                    Live Demo URL
                  </Label>
                  <Input
                    id="live"
                    value={formData.live}
                    onChange={(e) => setFormData((prev) => ({ ...prev, live: e.target.value }))}
                    className="bg-slate-800/50 border-slate-700/50 text-white"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-gray-300">
                    Duration
                  </Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                    className="bg-slate-800/50 border-slate-700/50 text-white"
                    placeholder="3 months"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team" className="text-gray-300">
                    Team
                  </Label>
                  <Input
                    id="team"
                    value={formData.team}
                    onChange={(e) => setFormData((prev) => ({ ...prev, team: e.target.value }))}
                    className="bg-slate-800/50 border-slate-700/50 text-white"
                    placeholder="Solo Project"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Technologies</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    className="bg-slate-800/50 border-slate-700/50 text-white"
                    placeholder="Add technology..."
                  />
                  <Button
                    type="button"
                    onClick={() => addArrayItem("technologies", newTech, setNewTech)}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="bg-slate-700 text-gray-300">
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeArrayItem("technologies", index)}
                        className="ml-2 text-red-400 hover:text-red-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Key Features</Label>
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="bg-slate-800/50 border-slate-700/50 text-white"
                    placeholder="Add feature..."
                  />
                  <Button
                    type="button"
                    onClick={() => addArrayItem("features", newFeature, setNewFeature)}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-800/30 p-2 rounded">
                      <span className="text-gray-300 text-sm">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem("features", index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Challenges</Label>
                <div className="flex gap-2">
                  <Input
                    value={newChallenge}
                    onChange={(e) => setNewChallenge(e.target.value)}
                    className="bg-slate-800/50 border-slate-700/50 text-white"
                    placeholder="Add challenge..."
                  />
                  <Button
                    type="button"
                    onClick={() => addArrayItem("challenges", newChallenge, setNewChallenge)}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {formData.challenges.map((challenge, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-800/30 p-2 rounded">
                      <span className="text-gray-300 text-sm">{challenge}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem("challenges", index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Results</Label>
                <div className="flex gap-2">
                  <Input
                    value={newResult}
                    onChange={(e) => setNewResult(e.target.value)}
                    className="bg-slate-800/50 border-slate-700/50 text-white"
                    placeholder="Add result..."
                  />
                  <Button
                    type="button"
                    onClick={() => addArrayItem("results", newResult, setNewResult)}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {formData.results.map((result, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-800/30 p-2 rounded">
                      <span className="text-gray-300 text-sm">{result}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem("results", index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                  className="rounded border-slate-700"
                />
                <Label htmlFor="featured" className="text-gray-300">
                  Featured Project
                </Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-slate-700 text-gray-300 hover:bg-slate-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  {editingProject ? "Update Project" : "Create Project"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <Card key={project._id?.toString()} className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    {project.title}
                    {project.featured && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">Featured</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {project.category} • {project.duration} • {project.team}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(project)}
                    className="border-purple-500/50 text-purple-400 hover:bg-purple-500 hover:text-white"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(project._id!.toString())}
                    className="border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="bg-slate-700 text-gray-300">
                    {tech}
                  </Badge>
                ))}
              </div>

              <div className="flex space-x-4 text-sm">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-400 hover:text-purple-400"
                  >
                    <Github className="h-4 w-4 mr-1" />
                    GitHub
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-400 hover:text-purple-400"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Live Demo
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {projects.length === 0 && (
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="text-center py-8">
              <p className="text-gray-400">No projects found. Create your first project!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
