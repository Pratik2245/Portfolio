"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, X, Code, Database, Palette, Server } from "lucide-react"
import type { Skill } from "@/lib/models"

interface SkillsManagerProps {
  onStatsChange: () => void
}

export default function SkillsManager({ onStatsChange }: SkillsManagerProps) {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    category: "",
    icon: "",
    skills: [] as { name: string; level: number }[],
  })

  const [newSkillName, setNewSkillName] = useState("")
  const [newSkillLevel, setNewSkillLevel] = useState(80)

  const iconOptions = [
    { value: "Code", label: "Code", icon: Code },
    { value: "Server", label: "Server", icon: Server },
    { value: "Database", label: "Database", icon: Database },
    { value: "Palette", label: "Palette", icon: Palette },
  ]

  useEffect(() => {
    loadSkills()
  }, [])

  const loadSkills = async () => {
    try {
      const response = await fetch("/api/admin/skills")
      if (response.ok) {
        const data = await response.json()
        setSkills(data.skills)
      }
    } catch (error) {
      console.error("Failed to load skills:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      category: "",
      icon: "",
      skills: [],
    })
    setEditingSkill(null)
    setNewSkillName("")
    setNewSkillLevel(80)
  }

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setFormData({
      category: skill.category,
      icon: skill.icon,
      skills: skill.skills || [],
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (formData.skills.length === 0) {
      setError("Please add at least one skill")
      return
    }

    try {
      const url = editingSkill ? `/api/admin/skills/${editingSkill._id}` : "/api/admin/skills"

      const method = editingSkill ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess(editingSkill ? "Skill category updated successfully!" : "Skill category created successfully!")
        setIsDialogOpen(false)
        resetForm()
        loadSkills()
        onStatsChange()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to save skill category")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    }
  }

  const handleDelete = async (skillId: string) => {
    if (!confirm("Are you sure you want to delete this skill category?")) return

    try {
      const response = await fetch(`/api/admin/skills/${skillId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSuccess("Skill category deleted successfully!")
        loadSkills()
        onStatsChange()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to delete skill category")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    }
  }

  const addSkill = () => {
    if (newSkillName.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, { name: newSkillName.trim(), level: newSkillLevel }],
      }))
      setNewSkillName("")
      setNewSkillLevel(80)
    }
  }

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find((option) => option.value === iconName)
    return iconOption ? iconOption.icon : Code
  }

  if (isLoading) {
    return <div className="text-white">Loading skills...</div>
  }

  return (
    <div className="space-y-6">
      {(error || success) && (
        <Alert className={error ? "border-red-500/50 bg-red-500/10" : "border-green-500/50 bg-green-500/10"}>
          <AlertDescription className={error ? "text-red-400" : "text-green-400"}>{error || success}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Skill Categories ({skills.length})</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Skill Category
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingSkill ? "Edit Skill Category" : "Add New Skill Category"}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {editingSkill ? "Update skill category information" : "Create a new skill category"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-gray-300">
                    Category Name *
                  </Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="bg-slate-800/50 border-slate-700/50 text-white"
                    placeholder="Frontend Development"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon" className="text-gray-300">
                    Icon *
                  </Label>
                  <Select
                    value={formData.icon}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, icon: value }))}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-white">
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {iconOptions.map((option) => {
                        const IconComponent = option.icon
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center">
                              <IconComponent className="h-4 w-4 mr-2" />
                              {option.label}
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-gray-300">Skills in this category</Label>

                <div className="flex gap-2 items-end">
                  <div className="flex-1 space-y-2">
                    <Label className="text-gray-300 text-sm">Skill Name</Label>
                    <Input
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      className="bg-slate-800/50 border-slate-700/50 text-white"
                      placeholder="React"
                    />
                  </div>
                  <div className="w-32 space-y-2">
                    <Label className="text-gray-300 text-sm">Level (%)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={newSkillLevel}
                      onChange={(e) => setNewSkillLevel(Number(e.target.value))}
                      className="bg-slate-800/50 border-slate-700/50 text-white"
                    />
                  </div>
                  <Button type="button" onClick={addSkill} size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-800/30 p-3 rounded">
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-300 font-medium">{skill.name}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                          <span className="text-purple-400 text-sm font-bold">{skill.level}%</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {formData.skills.length === 0 && (
                  <p className="text-gray-400 text-sm">No skills added yet. Add skills using the form above.</p>
                )}
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
                  {editingSkill ? "Update Category" : "Create Category"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {skills.map((skillCategory) => {
          const IconComponent = getIconComponent(skillCategory.icon)
          return (
            <Card key={skillCategory._id?.toString()} className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-4">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white">{skillCategory.category}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {skillCategory.skills?.length || 0} skills
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(skillCategory)}
                      className="border-purple-500/50 text-purple-400 hover:bg-purple-500 hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(skillCategory._id!.toString())}
                      className="border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {skillCategory.skills?.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-medium">{skill.name}</span>
                        <span className="text-purple-400 font-bold">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}

        {skills.length === 0 && (
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="text-center py-8">
              <p className="text-gray-400">No skill categories found. Create your first skill category!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
