"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: string;
}

export default function ContactResponsesManager() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/admin/contact");
      const data = await res.json();
      setContacts(data.contacts);
    } catch (err) {
      console.error("Failed to load contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this message?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/contact/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const { message } = await res.json();
        console.error("Failed to delete contact:", message);
        return;
      }

      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-white text-center py-6">
        Loading contact responses...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {contacts.length === 0 ? (
        <p className="text-gray-400 text-center py-6">
          No contact form submissions found.
        </p>
      ) : (
        contacts.map((c) => (
          <div
            key={c._id}
            className="rounded-xl p-4 bg-slate-800 border border-slate-700 shadow hover:shadow-purple-800 transition-shadow text-sm text-white space-y-2"
          >
            <div className="flex flex-wrap gap-4">
              <span>
                <span className="text-gray-400">Name:</span> {c.name}
              </span>
              <span>
                <span className="text-gray-400">Email:</span> {c.email}
              </span>
              <span>
                <span className="text-gray-400">Subject:</span> {c.subject}
              </span>
              {c.createdAt && (
                <span className="ml-auto text-gray-500 text-xs">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              )}
            </div>

            <div className="text-gray-300">
              <span className="text-gray-400">Message:</span> {c.message}
            </div>

            <div className="flex justify-end mt-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(c._id)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
