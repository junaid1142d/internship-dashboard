"use client";

import React, { useState, useEffect } from "react";
import { 
  BookOpen, Sparkles, RefreshCw, Copy, Check, 
  HelpCircle, ChevronRight, CheckSquare, Award
} from "lucide-react";
import { Company } from "../data/companies";
import { askAI } from "../utils/llm";

interface InterviewPrepProps {
  companies: Company[];
  addSystemLog: (type: "system" | "ai" | "success" | "warning" | "error", message: string) => void;
  triggerToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export default function InterviewPrep({ 
  companies, 
  addSystemLog, 
  triggerToast 
}: InterviewPrepProps) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [prepKit, setPrepKit] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Select first company that has sent/opened/replied/interview status, fallback to first in list
    if (companies.length > 0 && !selectedCompanyId) {
      const activeCo = companies.find(c => ["sent", "opened", "replied", "interview"].includes(c.status));
      setSelectedCompanyId(activeCo ? activeCo.id.toString() : companies[0].id.toString());
    }
  }, [companies]);

  const selectedCompany = companies.find(c => c.id.toString() === selectedCompanyId);

  const handleGenerate = async () => {
    if (!selectedCompany) {
      triggerToast("Please select a target company first.", "error");
      return;
    }

    setLoading(true);
    addSystemLog("system", `Generating interview prep kit for ${selectedCompany.name} (${selectedCompany.role})...`);

    const systemPrompt = `You are a Senior Technical Recruiter and Career Coach specializing in Indian startups.
Your goal is to build an elite, highly personalized Interview Preparation Kit for Junaid Ahmed, a B.Tech Artificial Intelligence and Data Science student (3rd Year) from B.S. Abdur Rahman Crescent Institute, Chennai.

JUNAID'S TRUTHFUL PORTFOLIO OVERVIEW:
- Experience:
  1. Data Analyst Intern at EinNel Technologies (worked on data analytics pipeline, cleaned/normalized telemetry datasets in Python Pandas/NumPy, created dashboards, optimized SQL queries).
  2. Marketing & Sales Intern at Unschool (cold outreach, onboarding sales, customer segments research).
- Projects:
  1. CrashSense: Smart helmet IoT rider safety system (ESP32, MPU6050 accelerometer, GPS tracking, Twilio SMS alerts).
  2. IoT Smart Home: ESP32 sensor nodes, MQTT telemetry, relay switch dashboards.
  3. Data Analytics Suite: Pandas/SQL pipelines, Seaborn visualization maps, basic ML models (Linear Regression, K-Means clustering).
- Skills: Python, SQL, C/C++, Data Analytics, ESP32, Arduino.

PREP KIT OUTLINE:
Provide a structured prep guide with the following sections. Write in clear Markdown:

# INTERVIEW PREPARATION KIT: [Company Name]
## 📊 1. COMPANY INTELLIGENCE
- Give 3-4 bullet facts about [Company Name]'s domain ([Domain]), products, and recent engineering focus.

## 🎯 2. LIKELY INTERVIEW QUESTIONS & MODEL ANSWERS
- Generate 4 Technical Questions + 2 Behavioral/HR Questions tailored to the role of [Role] and Junaid's specific skills.
- Provide a detailed "Model Answer" for each, showing Junaid how to reference his EinNel Technologies or Unschool experience naturally and truthfully.

## ⚙️ 3. PROJECT PITCH: CRASHSENSE (SMART IoT HELMET)
- Explain Junaid how to pitch his strongest project CrashSense for this SPECIFIC role. Customize the focus:
  - If role is AI/ML: focus on acceleration threshold logic, accelerometer data anomalies filtering, data logging.
  - If role is Data Analyst: focus on sensor calibration plots, impact gravity metrics, SMS latency numbers.
  - If role is IoT/Embedded: focus on ESP32 interrupts, I2C wiring to MPU6050, serial UART connection to GPS, MQTT triggers.
  - If role is generalist/product: focus on user safety requirements, prototyping speed, customer feedback.

## 📝 4. 48-HOUR REVISION ROADMAP
- List 4 key technical topics Junaid should revise immediately (e.g., specific SQL joins, telemetry loops, Pandas grouping, ML evaluation metrics) to match this company's stack.

## 💬 5. SMART QUESTIONS TO ASK THEM
- Suggest 3 impressive questions Junaid can ask the interviewer about their engineering scale, telemetry logs, or product pipeline.

OUTPUT TONE:
Direct, encouraging, highly technical, and customized. Avoid generic interview tips.`;

    const userPrompt = `
Company: ${selectedCompany.name}
Domain: ${selectedCompany.domain}
Role Target: ${selectedCompany.role}
Notes on Company: ${selectedCompany.notes}
Resume Variant Focus: ${selectedCompany.resumeVariant}

Generate the prep kit.`;

    try {
      const responseText = await askAI({
        system: systemPrompt,
        prompt: userPrompt,
        maxTokens: 1500,
        modelType: "claude"
      });

      setPrepKit(responseText.trim());
      addSystemLog("ai", `Interview prep kit generated for ${selectedCompany.name} (${selectedCompany.role}).`);
      triggerToast("Interview Prep Kit ready!", "success");
    } catch (err: any) {
      console.error(err);
      addSystemLog("error", `Interview prep generation failed: ${err.message}`);
      triggerToast("Failed to generate prep kit. Check settings.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!prepKit) return;
    navigator.clipboard.writeText(prepKit);
    setCopied(true);
    triggerToast("Prep kit copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 slide-in">
      
      {/* ── SECTION HEADER ── */}
      <div className="flex items-center justify-between border-b border-slate-800/40 pb-5">
        <div>
          <span className="text-[10px] text-sky-400 font-mono tracking-widest uppercase">INTERVIEW PREPARATION</span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-sky-400 bg-clip-text text-transparent mt-0.5">
            Interview Prep AI
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left selector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-wider text-sky-400 uppercase">PREP TARGET</h3>
            
            {/* Target Select */}
            <div>
              <label className="block text-[10px] font-mono text-slate-500 mb-1">SELECT COMPANY</label>
              <select
                value={selectedCompanyId}
                onChange={e => {
                  setSelectedCompanyId(e.target.value);
                  setPrepKit(""); // clear old prep
                }}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-355 outline-none focus:border-sky-500/50 font-sans"
              >
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !selectedCompany}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-600 font-bold text-xs text-slate-950 transition-colors shadow-lg shadow-sky-500/10 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Company Stack...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Generate Prep Kit</span>
                </>
              )}
            </button>
          </div>

          {/* Quick tips panel */}
          {selectedCompany && (
            <div className="glass-panel p-5 rounded-2xl text-xs space-y-3">
              <h4 className="font-mono text-[10px] text-slate-500 uppercase border-b border-slate-800/80 pb-1">Revision Focus</h4>
              <div className="flex gap-2 items-start">
                <ChevronRight className="w-4 h-4 text-sky-400 shrink-0" />
                <span>
                  Variant: <strong className="text-slate-300">{selectedCompany.resumeVariant}</strong>
                </span>
              </div>
              <div className="flex gap-2 items-start">
                <ChevronRight className="w-4 h-4 text-sky-400 shrink-0" />
                <span>
                  Check that your <strong className="text-slate-300">CrashSense</strong> explanation covers sensors, calculations, and network latencies.
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Right Output: Markdown view */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] text-slate-500 font-mono">PREPARATION MANUAL</span>
            {selectedCompany && (
              <span className="text-[10px] text-sky-400 font-mono uppercase bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded">
                Status: {selectedCompany.status}
              </span>
            )}
          </div>

          {prepKit ? (
            <div className="space-y-4">
              
              {/* Manual body */}
              <div className="glass-panel p-6 md:p-8 rounded-2xl relative font-sans text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-text bg-[#090e1a]/45 min-h-[300px] border border-slate-800/80">
                {/* Simulated Markdown simple parsing just using styling lines */}
                {prepKit}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800/60 font-semibold text-xs text-slate-350 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Prep Kit Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Manual</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          ) : (
            <div className="text-center py-24 glass-panel rounded-2xl text-slate-600 text-xs">
              Select a target company and click "Generate Prep Kit" to analyze potential interview questionnaires, technical roadmaps, and custom pitches.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
