"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  FileText, Edit3, Download, Eye, Award, Check, 
  Trash2, User, Mail, Phone, Link2, Plus, Code, Cpu
} from "lucide-react";
import { Linkedin, Github } from "./ui/icons";
import { CandidateProfile, CANDIDATE } from "../data/candidate";
import { SavedResume } from "../utils/storage";

interface ResumeLabProps {
  candidate: CandidateProfile;
  setCandidate: (profile: CandidateProfile) => void;
  savedResumes: SavedResume[];
  deleteSavedResume: (id: string) => void;
  addSystemLog: (type: "system" | "ai" | "success" | "warning" | "error", message: string) => void;
}

export default function ResumeLab({ 
  candidate, 
  setCandidate, 
  savedResumes, 
  deleteSavedResume, 
  addSystemLog 
}: ResumeLabProps) {
  const [selectedVariant, setSelectedVariant] = useState<string>("IoT/Embedded");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<"variant" | "editor" | "history">("variant");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Local edit states
  const [profileForm, setProfileForm] = useState<CandidateProfile>({ ...candidate });

  // Customized Summaries for Junaid based on Resume Variant (Calibrated to real resume facts)
  const summaries: Record<string, string> = {
    "AI/ML": "B.Tech Artificial Intelligence & Data Science student at Crescent Institute. Experienced in data preprocessing, cleaning structured datasets with Python, and writing SQL queries. Proactive learner skilled at translating raw data into analytics dashboards, seeking to apply statistical foundations and machine learning models to real-world datasets.",
    "Data Analyst": "Detail-oriented B.Tech Artificial Intelligence & Data Science student with hands-on experience as a Data Analyst Intern at EinNel Technologies. Proficient in preprocessing raw datasets using Python (Pandas/NumPy), writing SQL queries, and designing interactive visualization dashboards. Skilled in maintaining data integrity and generating reports.",
    "Software Engineering": "B.Tech Artificial Intelligence & Data Science student with experience in script automation, Python programming, and database query optimization. Practical understanding of data structures, version control, and modular coding. Eager to contribute to software development, backend logic design, and database maintenance.",
    "IoT/Embedded": "B.Tech AI & Data Science student with an interest in connected systems, sensor data analytics, and telemetry parsing. Practical experience organizing complex ground operations, volunteers, and field logistics. Proficient in Python scripting and data cleaning for connected systems.",
    "StartupTN Ecosystem": "Builder-focused B.Tech AI & Data Science student eager to work at StartupTN to gain exposure, study regional startup enablement mechanics, and learn ecosystem operations. Combines solid technical skills in Python and SQL database query optimization with hands-on marketing outreach at Unschool and coordinator roles at major events. Motivated to learn from and contribute to the StartupTN team.",
    "Startup Generalist": "Adaptive and quick-learning B.Tech AI & Data Science student with a multi-disciplinary background across Python scripting, data analytics, sales outreach, and volunteer management. Achieved top sales metrics at Unschool and coordinated large crowd operations. Highly proactive problem-solver with a strong execution focus.",
    "Product/Operations": "Data-driven B.Tech AI & Data Science student combining technical analytical skills with strong communication and sales experience. Proven execution speed and coordination agility. Skilled at tracking metrics, mapping product usability values, and translating user feedback into operational workflows."
  };

  // Calibrate real experience bullets per variant without faking details
  const getExperienceBullets = (company: string, variant: string, defaultBullets: string[]): string[] => {
    if (company === "EinNel Technologies") {
      switch (variant) {
        case "AI/ML":
          return [
            "Gained valuable experience working within the engineering division, applying Python (Pandas, NumPy) and SQL data-cleaning workflows directly to analytical pipelines.",
            "Supported technical teams in preprocessing telemetry datasets, reducing false readings and cleaning structured tables.",
            "Gained hands-on experience in database queries and specialized analytics software, expanding tech stack proficiency.",
            "Prepared statistical charts and analytics dashboards to assist senior engineering staff.",
            "Participated in machine learning baseline discussions and technical workshops to gain production data knowledge.",
            "Utilized data visualization tools to present analytical insights, improving cross-functional understanding of project metrics."
          ];
        case "Data Analyst":
          return [
            "Gained valuable experience working within the data analytics division, analyzing structured database tables and telemetry logs.",
            "Supported engineering teams in database queries, reducing retrieval runtimes and optimizing query efficiency.",
            "Gained hands-on experience in Python data libraries (Pandas, NumPy) and visualization tools to build dashboard telemetry.",
            "Prepared comprehensive analytical reports and metric dashboards to assist senior decision-makers.",
            "Participated in workshops regarding data modeling, ETL pipelines, and dashboard integration.",
            "Utilized data analytics to present key performance indicators, enhancing stakeholder understanding of project goals."
          ];
        case "Software Engineering":
          return [
            "Gained valuable experience working with the development team, applying structured coding practices and database query optimizations.",
            "Supported staff in writing SQL scripts and data-cleaning pipelines, reducing computational overhead and debugging tasks.",
            "Gained hands-on experience writing clean Python code and working with internal developer environments.",
            "Prepared technical documentations and database schema reports to assist senior software engineers.",
            "Participated in workshops on code version control, software architecture, and API configuration.",
            "Utilized technical communication skills to document application layouts, alignment logic, and system modules."
          ];
        default:
          return defaultBullets;
      }
    }

    if (company === "Unschool") {
      switch (variant) {
        case "StartupTN Ecosystem":
        case "Startup Generalist":
        case "Product/Operations":
          return [
            "Achieved highest monthly sales in the regional student cohort, proving startup agility and execution speed.",
            "Represented an e-learning platform offering courses to help students scale skills, understanding startup scaling dynamics.",
            "Maintained client relations and gathered student feedback, improving user onboarding rates by conducting target follow-ups.",
            "Strengthened customer satisfaction through consistent, high-touch communication and prompt relationship management.",
            "Contacted prospective users through email outreach and phone pitches to scale student enrollment.",
            "Collaborated closely with marketing and product leads to coordinate student campaigns and sales funnels.",
            "Supported sales operations, tracking metrics and implementing outreach campaigns in a fast-paced environment."
          ];
        default:
          return defaultBullets;
      }
    }

    return defaultBullets;
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCandidate(profileForm);
    setEditMode(false);
    addSystemLog("success", "Candidate Master Profile data updated in local memory.");
  };

  const triggerPrint = () => {
    addSystemLog("system", `Generating printable PDF variant: ${selectedVariant}`);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="space-y-6 slide-in">
      
      {/* ── SECTION HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/40 pb-5 no-print">
        <div>
          <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">RESUME INTELLIGENCE</span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent mt-0.5 font-mono">
            Resume Lab
          </h1>
        </div>
        
        {/* Navigation Tabs inside page */}
        <div className="flex gap-1.5 p-1 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
          {[
            { id: "variant", label: "AI Variants", icon: Cpu },
            { id: "editor", label: "Master Editor", icon: Edit3 },
            { id: "history", label: "Saved ATS Resumes", icon: FileText }
          ].map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveSubTab(t.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeSubTab === t.id 
                    ? "bg-zinc-800 text-white border border-zinc-700" 
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SUB-TAB: AI RESUME VARIANTS
      ══════════════════════════════════════════════════ */}
      {activeSubTab === "variant" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start no-print">
          
          {/* Left panel: variant selector */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-panel p-5 rounded-2xl border-zinc-800/80">
              <h3 className="text-xs font-mono font-bold tracking-wider text-zinc-300 mb-3 uppercase">SELECT VARIANT</h3>
              <p className="text-[11px] text-zinc-500 mb-4 leading-relaxed font-sans">
                Choose a preloaded template variation. The summary, skills accent, and CrashSense project bullet points will align to match.
              </p>
              
              <div className="space-y-1.5">
                {candidate.resumeVariants.map(variant => (
                  <button
                    key={variant}
                    onClick={() => setSelectedVariant(variant)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-semibold transition-all ${
                      selectedVariant === variant
                        ? "bg-white/10 border-white/20 text-white"
                        : "border-zinc-800/40 hover:border-zinc-800 hover:bg-zinc-900/30 text-zinc-400"
                    }`}
                  >
                    <span>{variant} Resume</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Print trigger card */}
            <div className="glass-panel p-5 rounded-2xl border border-zinc-800 bg-zinc-900/10 space-y-3">
              <h4 className="text-xs font-semibold text-zinc-300 font-mono-tech flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>ATS COMPATIBLE PDF EXPORT</span>
              </h4>
              <p className="text-[10px] text-zinc-500 leading-normal font-sans">
                Exporting triggers standard A4 PDF print layouts. No background colors, standard sans-serif styles, optimized for scanners.
              </p>
              <button
                onClick={triggerPrint}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-colors shadow-lg cursor-pointer font-mono"
              >
                <Download className="w-4 h-4" />
                <span>Export Print PDF</span>
              </button>
            </div>
          </div>

          {/* Right panel: Live Resume A4 Preview */}
          <div className="lg:col-span-8">
            <div className="mb-2.5 flex justify-between items-center px-2">
              <span className="text-[10px] text-zinc-500 font-mono">LIVE PREVIEW (A4 PRINT FIT)</span>
              <span className="text-[10px] text-zinc-300 font-mono uppercase bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded">
                Active variant: {selectedVariant}
              </span>
            </div>

            {/* The interactive web container preview */}
            <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden p-6 md:p-12 shadow-2xl relative">
              <div className="text-slate-800 absolute top-4 right-4 pointer-events-none select-none font-mono text-[10px]">
                A4 CONTAINER PREVIEW
              </div>
              
              {/* Document Header */}
              <div className="text-center border-b border-zinc-800 pb-5">
                <h2 className="text-2xl font-bold font-sans tracking-wide text-white">{candidate.name}</h2>
                <p className="text-xs text-zinc-400 mt-1 font-mono">{candidate.degree}</p>
                <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1.5 text-[11px] text-zinc-400 mt-3 font-mono">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-zinc-500" /> <a href={`mailto:${candidate.email}`} className="hover:text-white transition-colors">{candidate.email}</a></span>
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-zinc-500" /> <a href={`tel:${candidate.phone}`} className="hover:text-white transition-colors">{candidate.phone}</a></span>
                  {candidate.github && (
                    <span className="flex items-center gap-1"><Github className="w-3.5 h-3.5 text-zinc-500" /> <a href={candidate.github.startsWith("http") ? candidate.github : `https://${candidate.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{candidate.github}</a></span>
                  )}
                  <span className="flex items-center gap-1"><Linkedin className="w-3.5 h-3.5 text-zinc-500" /> <a href={candidate.linkedin.startsWith("http") ? candidate.linkedin : `https://${candidate.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{candidate.linkedin}</a></span>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-5 space-y-1.5">
                <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">Professional Summary</h3>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">{summaries[selectedVariant]}</p>
              </div>

              {/* Education */}
              <div className="mt-5 space-y-2">
                <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider border-b border-zinc-850 pb-1">Education</h3>
                <div className="flex justify-between items-start text-xs">
                  <div>
                    <span className="font-bold text-zinc-200">{candidate.college}</span>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{candidate.degree}</p>
                  </div>
                  <span className="text-zinc-400 font-mono text-[11px]">Chennai, India</span>
                </div>
              </div>

              {/* Experience */}
              <div className="mt-5 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider border-b border-zinc-850 pb-1">Professional Experience</h3>
                {candidate.experience.map((exp, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <div>
                        <span className="font-bold text-zinc-200">{exp.role}</span>
                        <span className="text-zinc-400 font-mono text-[11px]"> @ {exp.company}</span>
                      </div>
                      <span className="text-zinc-400 font-mono text-[11px]">{exp.duration}</span>
                    </div>
                    <ul className="list-disc list-outside ml-4 text-[11px] text-zinc-300 space-y-1">
                      {getExperienceBullets(exp.company, selectedVariant, exp.bullets).map((bullet, idx) => (
                        <li key={idx} className="leading-relaxed">{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Projects (if present) */}
              {candidate.projects && candidate.projects.length > 0 && (
                <div className="mt-5 space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider border-b border-zinc-850 pb-1">Projects Focus</h3>
                  {candidate.projects.map((project, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-200">{project.name}</span>
                        <div className="flex gap-1.5">
                          {project.tags.map(t => (
                            <span key={t} className="text-[9px] font-mono text-zinc-400 uppercase border border-zinc-800 px-1.5 rounded">{t}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">{project.desc}</p>
                      <ul className="list-disc list-outside ml-4 text-[11px] text-zinc-300 space-y-1">
                        {project.bullets.map((bullet, idx) => (
                          <li key={idx} className="leading-relaxed">{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Organizations & Activities */}
              {candidate.organizations && candidate.organizations.length > 0 && (
                <div className="mt-5 space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider border-b border-zinc-850 pb-1">Organizations & Activities</h3>
                  {candidate.organizations.map((org, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <div>
                          <span className="font-bold text-zinc-200">{org.role}</span>
                          <span className="text-zinc-400 font-mono text-[11px]"> - {org.name}</span>
                        </div>
                        <span className="text-zinc-400 font-mono text-[11px]">{org.duration}</span>
                      </div>
                      <ul className="list-disc list-outside ml-4 text-[11px] text-zinc-300 space-y-1">
                        {org.bullets.map((bullet, idx) => (
                          <li key={idx} className="leading-relaxed">{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              <div className="mt-5 space-y-2">
                <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider border-b border-zinc-850 pb-1">Technical Skills</h3>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-zinc-300 font-mono">
                  {candidate.skills.map((skill, idx) => (
                    <span key={idx} className="flex items-center gap-1.5">
                      <span className="text-zinc-500 text-xs">◈</span>
                      <span>{skill.name}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="mt-5 space-y-2">
                <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider border-b border-zinc-850 pb-1">Languages</h3>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-zinc-300 font-mono">
                  {["English", "Tamil", "Urdu", "Hindi"].map((lang, idx) => (
                    <span key={idx} className="flex items-center gap-1.5">
                      <span className="text-zinc-500 text-xs">◈</span>
                      <span>{lang}</span>
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* ── HIDDEN ABSOLUTE PRINT VIEW (For A4 window.print) ── */}
            {isMounted && typeof document !== "undefined" && createPortal(
              <div id="resume-print-container">
                <div style={{ textAlign: "center", borderBottom: "1.5px solid #000000", paddingBottom: "6px", marginBottom: "8px" }}>
                  <h1 style={{ fontSize: "18pt", fontWeight: "bold", margin: "0 0 1px", color: "#000000" }}>{candidate.name}</h1>
                  <p style={{ fontSize: "10pt", margin: "2px 0 0", fontStyle: "italic", color: "#000000" }}>{candidate.degree}</p>
                  <div style={{ display: "flex", justifyContent: "center", gap: "16px", fontSize: "8.5pt", marginTop: "4px", fontFamily: "sans-serif", color: "#000000" }}>
                    <span>Email: <a href={`mailto:${candidate.email}`} style={{ textDecoration: "underline", color: "#0b57d0" }}>{candidate.email}</a></span>
                    <span>Phone: <span style={{ color: "#000000" }}>{candidate.phone}</span></span>
                    {candidate.github && <span>GitHub: <a href={candidate.github.startsWith("http") ? candidate.github : `https://${candidate.github}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", color: "#0b57d0" }}>{candidate.github}</a></span>}
                    <span>LinkedIn: <a href={candidate.linkedin.startsWith("http") ? candidate.linkedin : `https://${candidate.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", color: "#0b57d0" }}>{candidate.linkedin}</a></span>
                  </div>
                </div>

                <div style={{ marginBottom: "8px", color: "#000000" }}>
                  <h3 style={{ fontSize: "10pt", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #000000", paddingBottom: "2px", margin: "0 0 4px" }}>
                    Professional Summary
                  </h3>
                  <p style={{ fontSize: "8.8pt", margin: "0", textAlign: "justify", lineHeight: "1.3", color: "#000000" }}>{summaries[selectedVariant]}</p>
                </div>

                <div style={{ marginBottom: "8px", color: "#000000" }}>
                  <h3 style={{ fontSize: "10pt", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #000000", paddingBottom: "2px", margin: "0 0 4px" }}>
                    Education
                  </h3>
                  <div style={{ display: "flex", justifyContent: "between", fontSize: "8.8pt" }}>
                    <div style={{ flex: 1 }}>
                      <strong>{candidate.college}</strong>
                      <div style={{ fontSize: "8.2pt", marginTop: "1px" }}>{candidate.degree}</div>
                    </div>
                    <div style={{ textAlign: "right", fontStyle: "italic" }}>Chennai, India</div>
                  </div>
                </div>

                <div style={{ marginBottom: "8px", color: "#000000" }}>
                  <h3 style={{ fontSize: "10pt", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #000000", paddingBottom: "2px", margin: "0 0 4px" }}>
                    Professional Experience
                  </h3>
                  {candidate.experience.map((exp, i) => (
                    <div key={i} className="print-no-break" style={{ marginBottom: "5px" }}>
                      <div style={{ display: "flex", justifyContent: "between", fontSize: "8.8pt", fontWeight: "bold" }}>
                        <div style={{ flex: 1 }}>{exp.role} <span style={{ fontWeight: "normal", fontStyle: "italic" }}>at {exp.company}</span></div>
                        <div style={{ textAlign: "right", fontStyle: "italic", fontWeight: "normal" }}>{exp.duration}</div>
                      </div>
                      <ul className="print-bullet-list" style={{ fontSize: "8.2pt", margin: "2px 0 0", paddingLeft: "12px", lineHeight: "1.25" }}>
                        {getExperienceBullets(exp.company, selectedVariant, exp.bullets).map((bullet, idx) => (
                          <li key={idx} style={{ marginBottom: "1.5px" }}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Projects (Print View) */}
                {candidate.projects && candidate.projects.length > 0 && (
                  <div style={{ marginBottom: "8px", color: "#000000" }}>
                    <h3 style={{ fontSize: "10pt", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #000000", paddingBottom: "2px", margin: "0 0 4px" }}>
                      Key Engineering Projects
                    </h3>
                    {candidate.projects.map((project, i) => (
                      <div key={i} className="print-no-break" style={{ marginBottom: "5px" }}>
                        <div style={{ display: "flex", justifyContent: "between", fontSize: "8.8pt", fontWeight: "bold" }}>
                          <div style={{ flex: 1 }}>{project.name}</div>
                          <div style={{ textAlign: "right", fontWeight: "normal", fontStyle: "italic", fontSize: "8.2pt" }}>
                            Tags: {project.tags.join(", ")}
                          </div>
                        </div>
                        <p style={{ fontSize: "8.2pt", margin: "1px 0 2px", fontStyle: "italic", color: "#374151" }}>{project.desc}</p>
                        <ul className="print-bullet-list" style={{ fontSize: "8.2pt", margin: "0", paddingLeft: "12px", lineHeight: "1.25" }}>
                          {project.bullets.map((bullet, idx) => (
                            <li key={idx} style={{ marginBottom: "1.5px" }}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Organizations & Activities (Print View) */}
                {candidate.organizations && candidate.organizations.length > 0 && (
                  <div style={{ marginBottom: "8px", color: "#000000" }}>
                    <h3 style={{ fontSize: "10pt", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #000000", paddingBottom: "2px", margin: "0 0 4px" }}>
                      Organizations & Activities
                    </h3>
                    {candidate.organizations.map((org, i) => (
                      <div key={i} className="print-no-break" style={{ marginBottom: "5px" }}>
                        <div style={{ display: "flex", justifyContent: "between", fontSize: "8.8pt", fontWeight: "bold" }}>
                          <div style={{ flex: 1 }}>{org.role} <span style={{ fontWeight: "normal", fontStyle: "italic" }}>- {org.name}</span></div>
                          <div style={{ textAlign: "right", fontStyle: "italic", fontWeight: "normal" }}>{org.duration}</div>
                        </div>
                        <ul className="print-bullet-list" style={{ fontSize: "8.2pt", margin: "2px 0 0", paddingLeft: "12px", lineHeight: "1.25" }}>
                          {org.bullets.map((bullet, idx) => (
                            <li key={idx} style={{ marginBottom: "1.5px" }}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginBottom: "8px", color: "#000000" }}>
                  <h3 style={{ fontSize: "10pt", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #000000", paddingBottom: "2px", margin: "0 0 4px" }}>
                    Technical Skills & Competencies
                  </h3>
                  <p style={{ fontSize: "8.2pt", margin: "0", fontFamily: "sans-serif", lineHeight: "1.3" }}>
                    {candidate.skills.map(s => s.name).join("  •  ")}
                  </p>
                </div>

                <div style={{ color: "#000000" }}>
                  <h3 style={{ fontSize: "10pt", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #000000", paddingBottom: "2px", margin: "0 0 4px" }}>
                    Languages
                  </h3>
                  <p style={{ fontSize: "8.2pt", margin: "0", fontFamily: "sans-serif", lineHeight: "1.3" }}>
                    English  •  Tamil  •  Urdu  •  Hindi
                  </p>
                </div>
              </div>,
              document.body
            )}

          </div>

        </div>
      )}

      {/* ══════════════════════════════════════════════════
          SUB-TAB: MASTER EDIT PANEL
      ══════════════════════════════════════════════════ */}
      {activeSubTab === "editor" && (
        <div className="glass-panel p-6 rounded-2xl max-w-4xl mx-auto">
          <div className="mb-4 border-b border-slate-800 pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm font-mono-tech text-sky-400 uppercase">PROFILE BUILDER CONSOLE</h3>
              <p className="text-xs text-slate-500 mt-0.5">Edit core skills, experiences, and academic links</p>
            </div>
            <button
              onClick={() => setProfileForm({ ...candidate })}
              className="px-3 py-1 border border-slate-800 rounded bg-slate-900/60 hover:bg-slate-850 hover:text-slate-200 text-[10px] text-slate-400 font-mono transition-colors"
            >
              Reset to Saved
            </button>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-6">
            
            {/* Identity Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono text-slate-500 mb-1">CANDIDATE FULL NAME</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full bg-slate-900/40 border border-slate-800/80 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-sky-500/50"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 mb-1">COLLEGE / INSTITUTE</label>
                <input
                  type="text"
                  value={profileForm.college}
                  onChange={setProfileForm ? e => setProfileForm({ ...profileForm, college: e.target.value }) : undefined}
                  className="w-full bg-slate-900/40 border border-slate-800/80 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-sky-500/50"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 mb-1">DEGREE MAJORS</label>
                <input
                  type="text"
                  value={profileForm.degree}
                  onChange={e => setProfileForm({ ...profileForm, degree: e.target.value })}
                  className="w-full bg-slate-900/40 border border-slate-800/80 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-sky-500/50"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 mb-1">CONTACT EMAIL</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full bg-slate-900/40 border border-slate-800/80 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-sky-500/50"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 mb-1">GITHUB PROFILE LINK</label>
                <input
                  type="text"
                  value={profileForm.github}
                  onChange={e => setProfileForm({ ...profileForm, github: e.target.value })}
                  className="w-full bg-slate-900/40 border border-slate-800/80 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-sky-500/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 mb-1">LINKEDIN PROFILE LINK</label>
                <input
                  type="text"
                  value={profileForm.linkedin}
                  onChange={e => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                  className="w-full bg-slate-900/40 border border-slate-800/80 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-sky-500/50"
                />
              </div>
            </div>

            {/* Skills editable tags */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-mono text-slate-500">TECHNICAL SKILLS SET</label>
                <button
                  type="button"
                  onClick={() => {
                    const sk = prompt("Enter skill name:");
                    if (sk) {
                      setProfileForm({
                        ...profileForm,
                        skills: [...profileForm.skills, { name: sk, score: 80 }]
                      });
                    }
                  }}
                  className="text-sky-400 hover:text-sky-300 text-[10px] flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" /> Add Skill
                </button>
              </div>
              <div className="flex flex-wrap gap-2 p-3 bg-slate-900/25 border border-slate-800 rounded-xl">
                {profileForm.skills.map((s, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px]">
                    <span className="text-slate-300">{s.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const filtered = profileForm.skills.filter((_, i) => i !== idx);
                        setProfileForm({ ...profileForm, skills: filtered });
                      }}
                      className="text-rose-500 hover:text-rose-400 text-xs font-bold leading-none ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800/40">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Save Master Profile
              </button>
            </div>

          </form>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          SUB-TAB: SAVED ATS HISTORICAL RESUMES
      ══════════════════════════════════════════════════ */}
      {activeSubTab === "history" && (
        <div className="space-y-4">
          <div className="mb-4">
            <h3 className="text-xs font-mono font-bold tracking-wider text-sky-400 uppercase">SAVED JOBS ALIGNED RESUMES</h3>
            <p className="text-xs text-slate-500 mt-0.5">Historical resumes optimized and saved for specific job descriptions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedResumes.length > 0 ? (
              savedResumes.map(res => (
                <div key={res.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 relative group">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-xs text-slate-200">{res.companyName}</h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{res.role} · Aligned: {res.resumeVariant}</p>
                    </div>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded border border-emerald-500/20 text-emerald-400 bg-emerald-500/10">
                      ATS: {res.atsScore}%
                    </span>
                  </div>

                  {/* Summary sample */}
                  <div className="p-3 bg-slate-900/40 border border-slate-900 rounded-lg text-[10px] text-slate-400 leading-normal italic">
                    "{res.optimizedSummary.substring(0, 140)}..."
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/40 pt-3">
                    <span>Scanned: {res.dateGenerated}</span>
                    <button
                      onClick={() => {
                        if (confirm(`Delete the optimized resume for ${res.companyName}?`)) {
                          deleteSavedResume(res.id);
                        }
                      }}
                      className="text-rose-500 hover:text-rose-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-20 glass-panel rounded-2xl text-slate-600 text-xs">
                No job-aligned resumes generated yet. Head over to the "ATS Analyzer" tab to paste a Job Description and optimize!
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
