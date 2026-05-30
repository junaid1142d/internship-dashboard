"use client";

import React, { useState } from "react";
import { 
  Cpu, FileText, CheckCircle2, AlertTriangle, 
  HelpCircle, RefreshCw, Save, ArrowRight, ShieldCheck, Play
} from "lucide-react";
import { CandidateProfile } from "../data/candidate";
import { askAI } from "../utils/llm";
import { SavedResume } from "../utils/storage";

interface AtsAnalyzerProps {
  candidate: CandidateProfile;
  onSaveResume: (resume: SavedResume) => void;
  addSystemLog: (type: "system" | "ai" | "success" | "warning" | "error", message: string) => void;
  triggerToast: (msg: string, type?: "success" | "error" | "info") => void;
}

interface AtsResult {
  score: number;
  summary: string;
  matchingKeywords: string[];
  missingKeywords: string[];
  optimizedBullets: {
    CrashSense?: string[];
    EinNelTechnologies?: string[];
    Unschool?: string[];
  };
  suggestions: string[];
}

export default function AtsAnalyzer({ 
  candidate, 
  onSaveResume, 
  addSystemLog, 
  triggerToast 
}: AtsAnalyzerProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [baseVariant, setBaseVariant] = useState("IoT/Embedded");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AtsResult | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription || !companyName || !roleTitle) {
      triggerToast("Please fill in Company, Role, and Job Description.", "error");
      return;
    }

    setLoading(true);
    addSystemLog("system", `Starting ATS keyword scan for ${roleTitle} at ${companyName}...`);

    const systemPrompt = `You are an elite ATS Optimizer and Resume Intelligence System tailored for Junaid Ahmed, a B.Tech Artificial Intelligence and Data Science student.
Your task is to analyze the provided Job Description (JD) and Junaid's master resume details to output a structured JSON analysis.

JUNAID'S TRUTHFUL BACKGROUND RULES:
- NEVER make up or fabricate experience, titles, skills, or colleges. Everything must remain 100% truthful.
- College: B.S. Abdur Rahman Crescent Institute, Chennai
- Degree: B.Tech – Artificial Intelligence and Data Science (3rd Year)
- Skills: Python, SQL, C/C++, Data Analytics, ESP32, Arduino, IoT Systems & Hardware, Machine Learning basics.
- Experience:
  1. Data Analyst Intern at EinNel Technologies: Data pipelines processing 50k+ entries, cleaning/normalizing in Pandas/NumPy, building dashboards, optimizing SQL queries.
  2. Marketing & Sales Intern at Unschool: Cold outreach strategies, customer research, sales pitches, edtech onboarding.
- Projects:
  1. CrashSense: Smart helmet IoT safety system (ESP32, MPU6050 accelerometer, GPS tracking, Twilio SMS emergency alerts).
  2. IoT Smart Home: ESP32 sensor node networks, MQTT telemetry, custom HTML relay toggle board.
  3. Data Analytics Projects Suite: Pandas/SQL pipelines, visual mapping (Seaborn), simple ML algorithms (Linear Regression, clustering).

OUTPUT FORMAT:
Return ONLY a valid JSON object. Do NOT include markdown fences, extra commentary, or conversational introductions.
Format:
{
  "score": 0-100 fit rating,
  "summary": "1-2 sentence customized professional summary connecting his AI/Data/IoT background to the JD,",
  "matchingKeywords": ["keywords found in JD that Junaid has"],
  "missingKeywords": ["important tools/skills in JD that Junaid does not explicitly highlight, but can learn or relates to"],
  "optimizedBullets": {
    "CrashSense": ["3-4 rewritten bullet points emphasizing keywords from the JD (e.g. data preprocessing for analytics, I2C calibration for IoT, C++ modular flow for SE) without lying"],
    "EinNelTechnologies": ["2-3 rewritten bullets highlighting matching data analytics or software metrics"],
    "Unschool": ["2-3 bullets focusing on client communication, speed, or product metrics if relevant to startup roles"]
  },
  "suggestions": ["3 short, actionable suggestions to make this application stand out"]
}`;

    const userPrompt = `
Company: ${companyName}
Role: ${roleTitle}
Selected Variant Base: ${baseVariant}
Job Description:
${jobDescription}

Perform the ATS analysis and output the custom JSON.`;

    try {
      const responseText = await askAI({
        system: systemPrompt,
        prompt: userPrompt,
        maxTokens: 1800,
        modelType: "claude"
      });

      // Attempt parsing
      const cleaned = responseText.replace(/```json|```/g, "").trim();
      const parsed: AtsResult = JSON.parse(cleaned);

      setResult(parsed);
      addSystemLog("success", `ATS Scan complete for ${companyName}. Compatibility Score: ${parsed.score}%`);
      triggerToast("Scan and optimization complete!", "success");
    } catch (err: any) {
      console.error(err);
      addSystemLog("error", `ATS Scan failed: ${err.message || "Parsing error"}`);
      triggerToast("AI optimization failed. Please check your API key in Settings.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOptimized = () => {
    if (!result) return;

    // Convert optimized bullets mapping back to storage shape
    const bulletsRecord: Record<string, string[]> = {};
    if (result.optimizedBullets.CrashSense) {
      bulletsRecord["CrashSense"] = result.optimizedBullets.CrashSense;
    }
    if (result.optimizedBullets.EinNelTechnologies) {
      bulletsRecord["EinNel Technologies"] = result.optimizedBullets.EinNelTechnologies;
    }
    if (result.optimizedBullets.Unschool) {
      bulletsRecord["Unschool"] = result.optimizedBullets.Unschool;
    }

    const saved: SavedResume = {
      id: Math.random().toString(36).substr(2, 9),
      companyId: Math.floor(Math.random() * 10000), // temp ID
      companyName,
      role: roleTitle,
      jobDescription,
      optimizedBullets: bulletsRecord,
      optimizedSummary: result.summary,
      atsScore: result.score,
      dateGenerated: new Date().toLocaleDateString(),
      resumeVariant: baseVariant
    };

    onSaveResume(saved);
    triggerToast("Optimized resume saved to Resume Lab!", "success");
    setResult(null);
    setCompanyName("");
    setRoleTitle("");
    setJobDescription("");
  };  return (
    <div className="space-y-6 slide-in">
      
      {/* ── SECTION HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/40 pb-5">
        <div>
          <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">ATS SCORING ENGINE</span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent mt-0.5 font-mono">
            ATS Analyzer
          </h1>
        </div>
      </div>

      {!result ? (
        /* ── JD INPUT FORM ── */
        <div className="max-w-3xl mx-auto glass-panel p-6 rounded-2xl space-y-5 border-zinc-800/80">
          <div className="border-b border-zinc-800 pb-3">
            <h3 className="font-bold text-sm font-mono-tech text-white uppercase flex items-center gap-1.5">
              <Cpu className="w-4 h-4" />
              <span>NEW SCAN CONSOLE</span>
            </h3>
            <p className="text-xs text-zinc-550 mt-0.5 font-sans">Paste target job descriptions to audit resume keywords compatibility</p>
          </div>

          <form onSubmit={handleScan} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono text-zinc-550 mb-1">TARGET COMPANY NAME</label>
                <input
                  type="text"
                  placeholder="e.g. Ather Energy"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none focus:border-white/50 placeholder-zinc-700 font-sans"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-zinc-550 mb-1">INTERNSHIP ROLE TITLE</label>
                <input
                  type="text"
                  placeholder="e.g. IoT Systems Intern"
                  value={roleTitle}
                  onChange={e => setRoleTitle(e.target.value)}
                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none focus:border-white/50 placeholder-zinc-700 font-sans"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-mono text-zinc-550 mb-1">BASE RESUME VARIANT ALIGNMENT</label>
                <select
                  value={baseVariant}
                  onChange={e => setBaseVariant(e.target.value)}
                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none focus:border-white/50 font-sans"
                >
                  {candidate.resumeVariants.map(v => (
                    <option key={v} value={v}>{v} Focus</option>
                  ))}
                </select>
              </div>
              <div className="pt-5 text-[10px] text-zinc-550 font-mono italic">
                * Selected focus determines structural highlights
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-zinc-550 mb-1">PASTE JOB DESCRIPTION TEXT</label>
              <textarea
                rows={8}
                placeholder="Paste the full job post, requirements list, qualifications and tools tags here..."
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg p-3.5 text-xs text-zinc-200 outline-none focus:border-white/50 placeholder-zinc-700 font-mono-tech leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-650 font-bold text-xs text-black transition-all shadow-lg cursor-pointer font-mono"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI Copilot rewriting experience bullets...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Run Scan & Optimize Bullets</span>
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* ── ATS ANALYSIS SCAN RESULTS ── */
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Header Status Grid */}
          <div className="glass-panel p-6 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-6 items-center border-zinc-800/80">
            <div className="text-center md:border-r border-zinc-805 pr-4">
              <span className="text-[10px] font-mono text-zinc-550 uppercase block">ATS Score</span>
              <span className="text-5xl font-mono font-bold text-white mt-1 block">{result.score}%</span>
            </div>
            <div className="md:col-span-3 space-y-2">
              <div className="flex items-center gap-1.5 text-white font-bold text-sm font-sans">
                <ShieldCheck className="w-5 h-5 text-white shrink-0" />
                <span>Truthful Keyword Optimization Successful</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                We've extracted the core keywords from the {companyName} {roleTitle} posting. Below is your optimized summary and experience bullet points that showcase your B.Tech AI & Data Science experience without faking details.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Keywords & Suggestions */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Keywords panel */}
              <div className="glass-panel p-5 rounded-2xl space-y-4 border-zinc-800/80">
                <div>
                  <h4 className="text-xs font-mono font-bold text-white mb-2 uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span>Matching Keywords ({result.matchingKeywords.length})</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.matchingKeywords.map(kw => (
                      <span key={kw} className="text-[9px] font-mono bg-zinc-900 border border-zinc-700 text-white px-2 py-0.5 rounded">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-mono font-bold text-zinc-450 mb-2 uppercase flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Missing Keywords ({result.missingKeywords.length})</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missingKeywords.map(kw => (
                      <span key={kw} className="text-[9px] font-mono bg-zinc-950 border border-zinc-850 text-zinc-400 px-2 py-0.5 rounded">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              <div className="glass-panel p-5 rounded-2xl border-zinc-800/80">
                <h4 className="text-xs font-mono font-bold text-white mb-3 uppercase">ACTION CHECKLIST</h4>
                <ul className="space-y-2.5 text-xs text-zinc-300 leading-normal font-sans">
                  {result.suggestions.map((sug, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-white font-bold shrink-0">{i+1}.</span>
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Right: Optimized Content Rewrites */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Summary */}
              <div className="glass-panel p-5 rounded-2xl space-y-2 border-zinc-800/80">
                <span className="text-[10px] font-mono text-zinc-550 uppercase">Optimized Summary</span>
                <p className="text-xs text-zinc-200 leading-relaxed font-sans italic">
                  "{result.summary}"
                </p>
              </div>

              {/* Bullet rewrites */}
              <div className="glass-panel p-5 rounded-2xl space-y-4 border-zinc-800/80">
                <span className="text-[10px] font-mono text-zinc-550 uppercase block border-b border-zinc-850 pb-2">
                  Optimized Bullet Highlights
                </span>
                
                {result.optimizedBullets.CrashSense && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-zinc-300">CrashSense (IoT Safety)</span>
                    <ul className="list-disc ml-4 text-[11px] text-zinc-400 space-y-1.5 font-sans">
                      {result.optimizedBullets.CrashSense.map((b, i) => (
                        <li key={i} className="leading-relaxed">{b}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.optimizedBullets.EinNelTechnologies && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-zinc-300">EinNel Technologies (Data Analytics)</span>
                    <ul className="list-disc ml-4 text-[11px] text-zinc-400 space-y-1.5 font-sans">
                      {result.optimizedBullets.EinNelTechnologies.map((b, i) => (
                        <li key={i} className="leading-relaxed">{b}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 font-mono">
                <button
                  onClick={() => setResult(null)}
                  className="flex-1 py-2 px-4 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-xs font-semibold text-zinc-350 transition-colors cursor-pointer text-center"
                >
                  Scan New Job
                </button>
                <button
                  onClick={handleSaveOptimized}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-colors shadow-lg cursor-pointer"
                >
                  <Save className="w-4 h-4 text-black" />
                  <span>Save Optimized Variant</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
