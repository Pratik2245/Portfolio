"use client";

import { useEffect, useRef, useState } from "react";
import { Award, Calendar, ExternalLink, CheckCircle } from "lucide-react";

interface Certificate {
  _id?: string;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  image: string;
  description: string;
  skills: string[];
  verified: boolean;
  link: string;
}

export default function Certifications() {
  const [certifications, setCertifications] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await fetch("/api/certifications");
        if (!res.ok) {
          const err = await res.text();
          throw new Error(err || `Status ${res.status}`);
        }
        const data = await res.json();
        if (!Array.isArray(data.certificates)) {
          throw new Error("API response is missing 'certificates' array");
        }
        setCertifications(data.certificates);
      } catch (err: any) {
        console.error("Failed to load certificates:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  return (
    <section
      id="certifications"
      ref={sectionRef}
      className="py-20 bg-slate-800/30"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* ...header code omitted for brevity... */}

          {loading && (
            <div className="text-center text-gray-400">Loading...</div>
          )}
          {error && (
            <div className="text-center text-red-400">Error: {error}</div>
          )}

          {!loading && !error && certifications.length === 0 && (
            <div className="text-center text-gray-400">
              No certifications found.
            </div>
          )}

          {!loading && !error && certifications.length > 0 && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {certifications.map((cert, i) => (
                  <div
                    key={cert._id || i}
                    className={`group bg-slate-900/50 p-6 rounded-2xl backdrop-blur-sm border border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                    }`}
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
                          <Award className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          {cert.verified && (
                            <div className="flex items-center text-green-400 text-sm mb-1">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Verified
                            </div>
                          )}
                          <div className="flex items-center text-gray-400 text-sm">
                            <Calendar className="h-4 w-4 mr-1" />
                            {cert.date}
                          </div>
                        </div>
                      </div>
                      {cert.link && (
                        <a
                          href={cert.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      )}
                    </div>

                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors duration-300">
                        {cert.title}
                      </h3>
                      <p className="text-purple-400 font-semibold mb-2">
                        {cert.issuer}
                      </p>
                      <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        {cert.description}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Credential ID: {cert.credentialId}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {cert.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-slate-800/50 text-purple-400 rounded-full text-xs border border-slate-700/50"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className={`mt-16 transition-all duration-1000 delay-600 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      {certifications.length}+
                    </div>
                    <div className="text-gray-400">Certifications</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      {certifications.filter((c) => c.verified).length} Verified
                    </div>
                    <div className="text-gray-400">Verified</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      {new Set(certifications.map((c) => c.issuer)).size}
                    </div>
                    <div className="text-gray-400">Issuers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      {/* Example: show last year extracted */}
                      {Math.max(
                        ...certifications.map((c) => parseInt(c.date, 10))
                      )}{" "}
                      Latest
                    </div>
                    <div className="text-gray-400">Year</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
