"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FolderOpen, Award, LogOut, User } from "lucide-react";
import ProjectsManager from "../components/ProjectsManager";
import CertificatesManager from "../components/CertificatesManager";
import ContactResponsesManager from "../components/ContactResponsesManager";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    projects: 0,
    contacts: 0,
    certificates: 0,
  });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/auth/me");

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        await loadStats();
      } else {
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      router.push("/admin/login");
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const [projectsRes, contactsRes, certificatesRes] = await Promise.all([
        fetch("/api/admin/projects"),
        fetch("/api/admin/contact"),
        fetch("/api/admin/certificates"),
      ]);

      const projectsData = await projectsRes.json();

      let contactsData;
      try {
        contactsData = await contactsRes.json();
      } catch (err) {
        console.error("Failed to parse contacts response JSON:", err);
        contactsData = { contacts: [] };
      }

      const certificatesData = await certificatesRes.json();

      setStats({
        projects: projectsData.projects?.length || 0,
        contacts: contactsData.contacts?.length || 0,
        certificates: certificatesData.certificates?.length || 0,
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 text-sm">
                Welcome back, {user?.username}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-400">
                <User className="h-5 w-5 mr-2" />
                <span className="text-sm">{user?.role}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Total Projects */}
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Projects
              </CardTitle>
              <FolderOpen className="h-5 w-5 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {stats.projects}
              </div>
              <p className="text-sm text-gray-400 mt-1">Active projects</p>
            </CardContent>
          </Card>

          {/* Contact Responses */}
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">
                Contact Responses
              </CardTitle>
              <User className="h-5 w-5 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {stats.contacts}
              </div>
              <p className="text-sm text-gray-400 mt-1">Form submissions</p>
            </CardContent>
          </Card>

          {/* Certificates */}
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">
                Certificates
              </CardTitle>
              <Award className="h-5 w-5 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {stats.certificates}
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Professional certificates
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Content Management</CardTitle>
            <CardDescription className="text-gray-400">
              Manage your portfolio projects, contact responses, and
              certificates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="projects" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
                <TabsTrigger
                  value="projects"
                  className="data-[state=active]:bg-purple-600"
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Projects
                </TabsTrigger>
                <TabsTrigger
                  value="contacts"
                  className="data-[state=active]:bg-purple-600"
                >
                  <User className="h-4 w-4 mr-2" />
                  Contact Responses
                </TabsTrigger>
                <TabsTrigger
                  value="certificates"
                  className="data-[state=active]:bg-purple-600"
                >
                  <Award className="h-4 w-4 mr-2" />
                  Certificates
                </TabsTrigger>
              </TabsList>

              <TabsContent value="projects" className="mt-6">
                <ProjectsManager onStatsChange={loadStats} />
              </TabsContent>

              <TabsContent value="contacts" className="mt-6">
                <ContactResponsesManager />
              </TabsContent>

              <TabsContent value="certificates" className="mt-6">
                <CertificatesManager onStatsChange={loadStats} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
