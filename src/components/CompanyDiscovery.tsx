"use client";

import React, { useState } from "react";
import { 
  Search, MapPin, Tag, Filter, Globe, Plus, Sparkles, 
  ExternalLink, Mail, ArrowUpRight, RefreshCw, Check
} from "lucide-react";
import { Linkedin } from "./ui/icons";
import { Company } from "../data/companies";
import { askAI } from "../utils/llm";
import { storage } from "../utils/storage";

interface CompanyDiscoveryProps {
  companies: Company[];
  setCompanies: (companies: Company[]) => void;
  addSystemLog: (type: "system" | "ai" | "success" | "warning" | "error", message: string) => void;
  triggerToast: (msg: string, type?: "success" | "error" | "info") => void;
  setTab: (tab: string) => void;
}

export default function CompanyDiscovery({ 
  companies, 
  setCompanies, 
  addSystemLog, 
  triggerToast,
  setTab
}: CompanyDiscoveryProps) {
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [minScore, setMinScore] = useState<number>(0);
  
  // AI discovery state
  const [aiSuggestions, setAiSuggestions] = useState<Company[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"database" | "ai_discovery" | "auto_import">("database");

  // Auto Importer state
  const [jobPasteText, setJobPasteText] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [importLoading, setImportLoading] = useState(false);
  const [feedSyncing, setFeedSyncing] = useState(false);
  const [scrapedFeed, setScrapedFeed] = useState<Company[]>([
    {
      id: 9001,
      name: "Ather Energy",
      domain: "Electric Vehicles / IoT",
      location: "Bangalore",
      email: "careers@atherenergy.com",
      role: "IoT Engineer Intern",
      tags: ["IoT", "Embedded", "C++", "ESP32"],
      source: "Indeed Feed",
      score: 95,
      resumeVariant: "IoT/Embedded",
      website: "atherenergy.com",
      applyUrl: "https://www.atherenergy.com/careers",
      founderName: "Tarun Mehta",
      notes: "Hardware focus fits your CrashSense project. They need ESP32 firmware developers.",
      status: "pending",
      followUpStage: 0,
      lastActivity: null,
      linkedinDm: false
    },
    {
      id: 9002,
      name: "Mad Street Den",
      domain: "Computer Vision / AI",
      location: "Chennai",
      email: "joinus@madstreetden.com",
      role: "Computer Vision Intern",
      tags: ["AI/ML", "Python", "Data", "SaaS"],
      source: "LinkedIn Feed",
      score: 92,
      resumeVariant: "AI/ML",
      website: "madstreetden.com",
      applyUrl: "https://www.madstreetden.com/careers",
      founderName: "Ashwini Asokan",
      notes: "Chennai based AI giant. Matches your AI & Data Science majors.",
      status: "pending",
      followUpStage: 0,
      lastActivity: null,
      linkedinDm: false
    },
    {
      id: 9003,
      name: "FourKites",
      domain: "Supply Chain Analytics",
      location: "Chennai",
      email: "chennai-jobs@fourkites.com",
      role: "Data Analyst Intern",
      tags: ["Data Analytics", "Python", "SQL", "SaaS"],
      source: "LinkedIn Feed",
      score: 90,
      resumeVariant: "Data Analyst",
      website: "fourkites.com",
      applyUrl: "https://www.fourkites.com/careers",
      founderName: "Mathew Elenjickal",
      notes: "Great analytics opportunities. SQL querying skills align with your EinNel intern experience.",
      status: "pending",
      followUpStage: 0,
      lastActivity: null,
      linkedinDm: false
    }
  ]);

  // Filter logic
  const filteredCompanies = companies.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.notes.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesLocation = locationFilter === "all" || c.location.toLowerCase() === locationFilter.toLowerCase();
    const matchesTag = tagFilter === "all" || c.tags.some(t => t.toLowerCase() === tagFilter.toLowerCase());
    const matchesSource = sourceFilter === "all" || c.source.toLowerCase() === sourceFilter.toLowerCase();
    const matchesScore = c.score >= minScore;

    return matchesSearch && matchesLocation && matchesTag && matchesSource && matchesScore;
  }).sort((a, b) => b.score - a.score);

  // Dynamic AI startup discovery agent
  const handleAiDiscovery = async () => {
    setAiLoading(true);
    addSystemLog("system", "Running AI discovery agent to scan new Indian tech startups...");
    
    const existingNames = companies.slice(0, 40).map(c => c.name).join(", ");
    
    const systemPrompt = `You are a startup scouting bot specializing in Indian tech internships.
Your goal is to find 6 REAL startups or fast-growing tech companies in India (prefer Chennai, Bangalore, or remote) that are hiring or likely to hire interns in AI/ML, Data Analytics, IoT/Embedded, or Product Engineering.
Do NOT suggest any of these existing companies: ${existingNames}.

Output requirements:
Return ONLY a valid JSON array of objects. Do not include markdown fences, comments, or conversational sentences.
JSON Format:
[
  {
    "id": random integer between 2000 and 5000,
    "name": "Exact company name",
    "domain": "SaaS / Computer Vision / Embedded Systems etc",
    "location": "Chennai / Bangalore / Hyderabad / Remote",
    "email": "careers@domain.com or founder@domain.com",
    "role": "Suggested Target Role Intern",
    "tags": ["AI/ML", "IoT", "Data", "SaaS", "Software"],
    "source": "AI Discover",
    "score": 0-100 fit rating based on Junaid's profile,
    "resumeVariant": "AI/ML" or "Data Analyst" or "Software Engineering" or "IoT/Embedded" or "Startup Generalist",
    "website": "domain.com",
    "applyUrl": "https://domain.com/careers",
    "founderName": "Founder's actual name",
    "notes": "Domain focus and why it's a great fit for Junaid"
  }
]`;

    try {
      const responseText = await askAI({
        system: systemPrompt,
        prompt: "Scout 6 real startups in Chennai, Bangalore, or remote for Junaid's AI, Data, and IoT profile. Output clean JSON array.",
        maxTokens: 1400,
        modelType: "claude"
      });

      const cleaned = responseText.replace(/```json|```/g, "").trim();
      const parsed: Company[] = JSON.parse(cleaned);
      
      // Inject standard fields
      const formatted = parsed.map(c => ({
        ...c,
        status: "pending" as any,
        followUpStage: 0,
        lastActivity: null,
        linkedinDm: false
      }));

      setAiSuggestions(formatted);
      addSystemLog("success", `AI Discovery scanner returned ${formatted.length} new startup targets.`);
      triggerToast(`Discovered ${formatted.length} new startups!`, "success");
    } catch (err: any) {
      console.error(err);
      addSystemLog("error", `AI Discovery failed: ${err.message || "Parsing error"}`);
      triggerToast("AI Search failed. Check your API settings.", "error");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddAiCompany = (co: Company) => {
    // Check duplication
    if (companies.some(c => c.name.toLowerCase() === co.name.toLowerCase())) {
      triggerToast(`${co.name} already exists in database.`, "error");
      return;
    }

    const updated = [co, ...companies];
    setCompanies(updated);
    storage.saveCompanies(updated);
    
    // Remove from suggestions list
    setAiSuggestions(prev => prev.filter(s => s.name !== co.name));
    
    addSystemLog("success", `Added discovered company ${co.name} to active target queue.`);
    triggerToast(`Added ${co.name} to Tracker!`, "success");
  };

  const handleAutoImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobPasteText.trim()) {
      triggerToast("Please paste job description or requirements first.", "error");
      return;
    }

    setImportLoading(true);
    addSystemLog("ai", "Initiating AI job parser agent to analyze text...");

    const parserSystemPrompt = `You are an expert job details extraction agent. Extract structured information from the provided job description text.
Format the output ONLY as a valid JSON object. Do not include markdown wraps, comments, or extra explanations.
If certain fields like website or founder name cannot be determined, make a realistic guess based on the company name, or output a placeholder.

Candidate profile context (use this to evaluate the match score and select resumeVariant, but do NOT include this in the output):
- Name: Junaid Ahmed (B.Tech AI & Data Science)
- Skills: Python, SQL, C/C++, Data Analytics, ESP32, Arduino, IoT Systems (No Raspberry Pi)
- Standout Project: CrashSense (Smart helmet rider safety + accident detection IoT node)
- Internships: EinNel Technologies (Data Analyst Intern), Unschool (Marketing & Sales Intern)

JSON Format to output:
{
  "name": "Exact Company Name",
  "domain": "SaaS / AI / IoT / Robotics etc.",
  "location": "City Name (e.g. Chennai, Bangalore, Remote)",
  "email": "careers@domain.com or founder@domain.com (make a realistic guess if not found)",
  "role": "Target Internship Role",
  "tags": ["AI/ML", "IoT", "Data", "SaaS", "Software"],
  "score": 0-100 fit rating based on compatibility with Junaid's background,
  "resumeVariant": "AI/ML" | "Data Analyst" | "Software Engineering" | "IoT/Embedded" | "Startup Generalist" | "Product/Operations",
  "website": "companydomain.com",
  "applyUrl": "Apply page URL or home careers page",
  "founderName": "Founder's name or Hiring Manager",
  "notes": "A 2-sentence explanation of why the candidate is a match, mentioning how their CrashSense project or data analysis internship aligns."
}`;

    try {
      const responseText = await askAI({
        system: parserSystemPrompt,
        prompt: `Analyze and parse this job listing details:\n\n${jobPasteText}\n\nJob URL: ${jobUrl || 'Not provided'}`,
        maxTokens: 800,
        modelType: "claude"
      });

      const cleaned = responseText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      const newCompany: Company = {
        ...parsed,
        id: Date.now(),
        status: "pending",
        followUpStage: 0,
        lastActivity: null,
        linkedinDm: false,
        source: jobUrl ? "LinkedIn Parse" : "Text Paste Parse"
      };

      const updated = [newCompany, ...companies];
      setCompanies(updated);
      storage.saveCompanies(updated);

      addSystemLog("success", `AI Auto-Imported target ${newCompany.name} as "${newCompany.role}" (Fit Score: ${newCompany.score}%).`);
      triggerToast(`Successfully added ${newCompany.name} to Tracker!`, "success");
      setJobPasteText("");
      setJobUrl("");
      setActiveSubTab("database");
    } catch (err: any) {
      console.error(err);
      addSystemLog("error", `Failed to parse job description: ${err.message}`);
      triggerToast("Failed to parse. Verify your API keys in Settings.", "error");
    } finally {
      setImportLoading(false);
    }
  };

  const handleSyncFeed = async () => {
    setFeedSyncing(true);
    addSystemLog("system", "Connecting to LinkedIn & Indeed scraper APIs (simulation)...");
    
    setTimeout(() => {
      const newPostings: Company[] = [
        {
          id: 9004,
          name: "Agnikul Cosmos",
          domain: "Aerospace / DeepTech",
          location: "Chennai",
          email: "hr@agnikul.in",
          role: "Embedded Software Intern",
          tags: ["IoT", "Embedded", "C/C++", "Software"],
          source: "LinkedIn Feed",
          score: 94,
          resumeVariant: "IoT/Embedded",
          website: "agnikul.in",
          applyUrl: "https://agnikul.in/careers",
          founderName: "Srinath Ravichandran",
          notes: "Chennai aerospace startup. Heavy C/C++ usage fits your ESP32 algorithm optimization.",
          status: "pending",
          followUpStage: 0,
          lastActivity: null,
          linkedinDm: false
        },
        {
          id: 9005,
          name: "FourKites",
          domain: "Logistics SaaS",
          location: "Remote",
          email: "careers@fourkites.com",
          role: "Python Data Intern",
          tags: ["Data Analytics", "Python", "SQL"],
          source: "Indeed Feed",
          score: 88,
          resumeVariant: "Data Analyst",
          website: "fourkites.com",
          applyUrl: "https://careers.fourkites.com",
          founderName: "Mathew Elenjickal",
          notes: "They require Python Pandas and SQL query optimization. Highly matches your EinNel Technologies experience.",
          status: "pending",
          followUpStage: 0,
          lastActivity: null,
          linkedinDm: false
        }
      ];

      setScrapedFeed(prev => {
        const filtered = newPostings.filter(p => !prev.some(x => x.name.toLowerCase() === p.name.toLowerCase()));
        return [...filtered, ...prev];
      });

      setFeedSyncing(false);
      addSystemLog("success", "Scraper sync finished. Found 2 new internship opportunities.");
      triggerToast("Scraped feed synced successfully!", "success");
    }, 1200);
  };

  const handleImportFromFeed = (co: Company) => {
    if (companies.some(c => c.name.toLowerCase() === co.name.toLowerCase())) {
      triggerToast(`${co.name} already exists in database.`, "error");
      return;
    }

    const updated = [co, ...companies];
    setCompanies(updated);
    storage.saveCompanies(updated);
    
    setScrapedFeed(prev => prev.filter(s => s.id !== co.id));
    
    addSystemLog("success", `Imported ${co.name} from Live Feed scraper.`);
    triggerToast(`Added ${co.name} to Tracker!`, "success");
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-white border-zinc-700 bg-zinc-800/30";
    if (score >= 80) return "text-zinc-200 border-zinc-800 bg-zinc-900/30";
    if (score >= 70) return "text-zinc-400 border-zinc-900 bg-zinc-950/20";
    return "text-zinc-550 border-zinc-950 bg-transparent";
  };

  return (
    <div className="space-y-6 slide-in">
      
      {/* ── SECTION HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/40 pb-5">
        <div>
          <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">TARGETING DATABASE</span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent mt-0.5 font-mono">
            Company Discovery
          </h1>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-1.5 p-1 rounded-lg bg-zinc-900/60 border border-zinc-800/60 font-mono">
          <button
            onClick={() => setActiveSubTab("database")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === "database" 
                ? "bg-zinc-800 text-white border border-zinc-700" 
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Startup Database ({filteredCompanies.length})
          </button>
          <button
            onClick={() => {
              setActiveSubTab("ai_discovery");
              if (aiSuggestions.length === 0) handleAiDiscovery();
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === "ai_discovery" 
                ? "bg-zinc-800 text-white border border-zinc-700" 
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>AI Discovery Radar</span>
          </button>
          <button
            onClick={() => setActiveSubTab("auto_import")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === "auto_import" 
                ? "bg-zinc-800 text-white border border-zinc-700" 
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span>LinkedIn / Indeed Importer</span>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SUB-TAB: ACTIVE DATABASE WITH RICH FILTERS
      ══════════════════════════════════════════════════ */}
      {activeSubTab === "database" && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="glass-panel p-4 rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center border-zinc-800/80">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search startups or roles..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-200 outline-none focus:border-white/50"
              />
            </div>

            {/* Location Select */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
              <select
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
                className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg px-2 py-2 text-xs text-zinc-300 outline-none focus:border-white/50 font-sans"
              >
                <option value="all">All Locations</option>
                <option value="chennai">Chennai Only</option>
                <option value="bangalore">Bangalore Only</option>
                <option value="hyderabad">Hyderabad Only</option>
                <option value="remote">Remote Only</option>
              </select>
            </div>

            {/* Domain tag select */}
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-zinc-500 shrink-0" />
              <select
                value={tagFilter}
                onChange={e => setTagFilter(e.target.value)}
                className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg px-2 py-2 text-xs text-zinc-300 outline-none focus:border-white/50 font-sans"
              >
                <option value="all">All Domains</option>
                <option value="ai/ml">AI / ML Focus</option>
                <option value="data">Data Science Focus</option>
                <option value="iot">IoT & Hardware</option>
                <option value="saas">SaaS Products</option>
                <option value="software">Software Engineering</option>
              </select>
            </div>

            {/* Source select */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-zinc-500 shrink-0" />
              <select
                value={sourceFilter}
                onChange={e => setSourceFilter(e.target.value)}
                className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg px-2 py-2 text-xs text-zinc-300 outline-none focus:border-white/50 font-sans"
              >
                <option value="all">All Sources</option>
                <option value="curated">Curated Lists</option>
                <option value="linkedin">LinkedIn</option>
                <option value="yc">Y Combinator</option>
                <option value="wellfound">Wellfound</option>
                <option value="indeed">Indeed</option>
                <option value="internshala">Internshala</option>
              </select>
            </div>

            {/* Min score filter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-zinc-500 shrink-0">Min Fit:</span>
              <select
                value={minScore}
                onChange={e => setMinScore(Number(e.target.value))}
                className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg px-2 py-2 text-xs text-zinc-300 outline-none focus:border-white/50 font-sans"
              >
                <option value="0">All Match Scores</option>
                <option value="90">Elite Fit (90+)</option>
                <option value="80">Strong Fit (80+)</option>
                <option value="70">Good Fit (70+)</option>
              </select>
            </div>

          </div>

          {/* Database Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompanies.map(co => (
              <div 
                key={co.id} 
                className="glass-panel p-5 rounded-2xl flex flex-col justify-between border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/10 transition-all duration-300 group"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-zinc-200 group-hover:text-white transition-colors">
                        {co.name}
                      </h4>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{co.domain}</p>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getScoreColor(co.score)}`}>
                      {co.score}% Match
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-1">
                    {co.tags.map(t => (
                      <span key={t} className="text-[9px] font-mono border border-zinc-800 text-zinc-400 bg-zinc-950/40 px-1.5 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="text-xs space-y-1.5 pt-2 border-t border-zinc-850">
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <span className="text-[10px] text-zinc-500 font-mono">ROLE:</span>
                      <span className="text-zinc-300 truncate">{co.role}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <span className="text-[10px] text-zinc-500 font-mono">LOC:</span>
                      <span className="text-zinc-300 font-mono">{co.location}</span>
                    </div>
                    {co.founderName && (
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <span className="text-[10px] text-zinc-500 font-mono">CONTACT:</span>
                        <span className="text-zinc-400">{co.founderName}</span>
                      </div>
                    )}
                    {co.email && (
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <span className="text-[10px] text-zinc-500 font-mono">EMAIL:</span>
                        <a href={`mailto:${co.email}`} className="text-zinc-300 hover:text-white hover:underline truncate">{co.email}</a>
                      </div>
                    )}
                    {co.website && (
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <span className="text-[10px] text-zinc-500 font-mono">WEBSITE:</span>
                        <a href={co.website.startsWith("http") ? co.website : `https://${co.website}`} target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white hover:underline truncate">{co.website}</a>
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans mt-2 italic line-clamp-2">
                    "{co.notes}"
                  </p>
                </div>

                <div className="flex gap-2 border-t border-zinc-850 pt-4 mt-4 text-[10px]">
                  <button 
                    onClick={() => setTab("outreach")}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/10 hover:bg-zinc-900/30 text-zinc-300 transition-all font-semibold cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Email Copilot</span>
                  </button>
                  <button 
                    onClick={() => setTab("linkedin")}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/10 hover:bg-zinc-900/30 text-zinc-300 transition-all font-semibold cursor-pointer"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-zinc-400" />
                    <span>LinkedIn DM</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          SUB-TAB: ACTIVE AI RADAR DISCOVERY
      ══════════════════════════════════════════════════ */}
      {activeSubTab === "ai_discovery" && (
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-zinc-800 bg-zinc-900/10">
            <div>
              <h3 className="text-sm font-bold text-white font-mono-tech flex items-center gap-1.5 uppercase">
                <Sparkles className="w-4 h-4 text-white" />
                <span>AI Scouting Radar Active</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-1 font-sans">
                Claude scans the Indian startup ecosystem to find early-stage DeepTech, AI, and IoT targets that fit Junaid Ahmed's profile.
              </p>
            </div>
            <button
              onClick={handleAiDiscovery}
              disabled={aiLoading}
              className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs disabled:bg-zinc-800 disabled:text-zinc-650 transition-colors shrink-0 cursor-pointer font-mono"
            >
              {aiLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Scanning Ecosystem...</span>
                </>
              ) : (
                <span>Re-scan Ecosystem</span>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiSuggestions.length > 0 ? (
              aiSuggestions.map((co, i) => (
                <div key={i} className="glass-panel p-5 rounded-2xl border border-zinc-800 flex flex-col justify-between bg-zinc-950/20">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-zinc-200">{co.name}</h4>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{co.domain}</p>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getScoreColor(co.score)}`}>
                        {co.score}% Fit
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {co.tags.map(t => (
                        <span key={t} className="text-[9px] font-mono border border-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="text-xs space-y-1 pt-2 border-t border-zinc-850">
                      <p><span className="text-[10px] font-mono text-zinc-500">ROLE:</span> <span className="text-zinc-300 font-semibold">{co.role}</span></p>
                      <p><span className="text-[10px] font-mono text-zinc-500">CITY:</span> <span className="text-zinc-400">{co.location}</span></p>
                      <p><span className="text-[10px] font-mono text-zinc-500">FOUNDER:</span> <span className="text-zinc-400">{co.founderName}</span></p>
                      {co.email && <p><span className="text-[10px] font-mono text-zinc-500">EMAIL:</span> <a href={`mailto:${co.email}`} className="text-zinc-300 hover:text-white hover:underline truncate inline-block max-w-[200px]">{co.email}</a></p>}
                      {co.website && <p><span className="text-[10px] font-mono text-zinc-500">WEBSITE:</span> <a href={co.website.startsWith("http") ? co.website : `https://${co.website}`} target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white hover:underline truncate inline-block max-w-[200px]">{co.website}</a></p>}
                    </div>

                    <p className="text-[11px] text-zinc-400 italic bg-black p-2.5 rounded-lg border border-zinc-900 mt-2 leading-relaxed font-sans">
                      "{co.notes}"
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4 pt-3 border-t border-zinc-850">
                    <button
                      onClick={() => handleAddAiCompany(co)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-colors cursor-pointer font-mono"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add to Tracker</span>
                    </button>
                  </div>

                </div>
              ))
            ) : (
              !aiLoading && (
                <div className="col-span-2 text-center py-20 text-zinc-650 text-xs font-sans">
                  Scan complete or no suggestions available. Click "Re-scan Ecosystem" above.
                </div>
              )
            )}
          </div>
        </div>
      )}

    </div>
  );
}
