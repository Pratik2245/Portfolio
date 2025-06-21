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
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, ExternalLink, CheckCircle, X, Calendar } from "lucide-react"
import type { Certificate } from "@/lib/models"

interface CertificatesManagerProps {
  onStatsChange: () => void
}

export default function CertificatesManager({ onStatsChange }: CertificatesManagerProps) {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    date: "",
    credentialId: "",
    image: "",
    description: "",
    skills: [] as string[],
    verified: true,
    link: "",
  })

  const [newSkill, setNewSkill] = useState("")

  useEffect(() => {
    loadCertificates()
  }, [])

  const loadCertificates = async () => {
    try {
      const response = await fetch("/api/admin/certificates")
      if (response.ok) {
        const data = await response.json()
        setCertificates(data.certificates)
      }
    } catch (error) {
      console.error("Failed to load certificates:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      issuer: "",
      date: "",
      credentialId: "",
      image: "",
      description: "",
      skills: [],
      verified: true,
      link: "",
    })
    setEditingCertificate(null)
    setNewSkill("")
  }

  const handleEdit = (certificate: Certificate) => {
    setEditingCertificate(certificate)
    setFormData({
      title: certificate.title,
      issuer: certificate.issuer,
      date: certificate.date,
      credentialId: certificate.credentialId,
      image: certificate.image,
      description: certificate.description,
      skills: certificate.skills || [],
      verified: certificate.verified,
      link: certificate.link,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const url = editingCertificate ? `/api/admin/certificates/${editingCertificate._id}` : "/api/admin/certificates"

      const method = editingCertificate ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess(editingCertificate ? "Certificate updated successfully!" : "Certificate created successfully!")
        setIsDialogOpen(false)
        resetForm()
        loadCertificates()
        onStatsChange()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to save certificate")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    }
  }

  const handleDelete = async (certificateId: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return

    try {
      const response = await fetch(`/api/admin/certificates/${certificateId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSuccess("Certificate deleted successfully!")
        loadCertificates()
        onStatsChange()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to delete certificate")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    }
  }

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  if (isLoading) {
    return <div className="text-white">Loading certificates...</div>
  }

  return (
    <div className="space-y-6">
      {(error || success) && (
        <Alert className={error ? "border-red-500/50 bg-red-500/10" : "border-green-500/50 bg-green-500/10"}>
          <AlertDescription className={error ? "text-red-400" : "text-green-400"}>{error || success}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Certificates ({certificates.length})</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Certificate
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingCertificate ? "Edit Certificate" : "Add New Certificate"}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {editingCertificate ? "Update certificate information" : "Create a new certificate entry"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-300">
                    Certificate Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    className="bg-slate-800/50 border-slate-700/50 text-white"
                    placeholder="AWS Certified Solutions Architect"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issuer" className="text-gray-300">
                    Issuer *
                  </Label>
                  <Input
                    id="issuer"
                    value={formData.issuer}
                    onChange={(e) => setFormData((prev) => ({ ...prev, issuer: e.target.value }))}
                    className="bg-slate-800/50 border-slate-700/50 text-white"
                    placeholder="Amazon Web Services"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-gray-300">
                    Date Issued *
                  </Label>
                  <Input
                    id="date"
                    value={formData.date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                    className="bg-slate-800/50 border-slate-700/50 text-white"
                    placeholder="2023"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credentialId" className="text-gray-300">
                    Credential ID
                  </Label>
                  <Input
                    id="credentialId"
                    value={formData.credentialId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, credentialId: e.target.value }))}
                    className="bg-slate-800/50 border-slate-700/50 text-white"
                    placeholder="AWS-SAA-2023-001"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="bg-slate-800/50 border-slate-700/50 text-white"
                  rows={3}
                  placeholder="Demonstrates expertise in designing distributed systems on AWS platform"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-gray-300">
                    Certificate Image URL
                  </Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                    className="bg-slate-800/50 border-slate-700/50 text-white"
                    placeholder="/placeholder.svg?height=100&width=100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link" className="text-gray-300">
                    Verification Link
                  </Label>
                  <Input
                    id="link"
                    value={formData.link}
                    onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
                    className="bg-slate-800/50 border-slate-700/50 text-white"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Related Skills</Label>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="bg-slate-800/50 border-slate-700/50 text-white"
                    placeholder="Add skill..."
                  />
                  <Button type="button" onClick={addSkill} size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-slate-700 text-gray-300">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="ml-2 text-red-400 hover:text-red-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="verified"
                  checked={formData.verified}
                  onChange={(e) => setFormData((prev) => ({ ...prev, verified: e.target.checked }))}
                  className="rounded border-slate-700"
                />
                <Label htmlFor="verified" className="text-gray-300 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-400" />
                  Verified Certificate
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
                  {editingCertificate ? "Update Certificate" : "Create Certificate"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {certificates.map((certificate) => (
          <Card key={certificate._id?.toString()} className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    {certificate.title}
                    {certificate.verified && <CheckCircle className="h-5 w-5 text-green-400" />}
                  </CardTitle>
                  <CardDescription className="text-gray-400 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {certificate.issuer} • {certificate.date}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(certificate)}
                    className="border-purple-500/50 text-purple-400 hover:bg-purple-500 hover:text-white"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(certificate._id!.toString())}
                    className="border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">{certificate.description}</p>

              {certificate.credentialId && (
                <p className="text-gray-500 text-sm mb-4">Credential ID: {certificate.credentialId}</p>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {certificate.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-slate-700 text-gray-300">
                    {skill}
                  </Badge>
                ))}
              </div>

              {certificate.link && (
                <a
                  href={certificate.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-purple-400 hover:text-purple-300 text-sm"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Certificate
                </a>
              )}
            </CardContent>
          </Card>
        ))}

        {certificates.length === 0 && (
          <Card className="bg-slate-800/50 border-slate-700/50 md:col-span-2">
            <CardContent className="text-center py-8">
              <p className="text-gray-400">No certificates found. Create your first certificate!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
