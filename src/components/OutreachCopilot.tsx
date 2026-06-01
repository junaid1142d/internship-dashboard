"use client";

import React, { useState, useEffect } from "react";
import { 
  Mail, Send, Copy, Check, RefreshCw, Sparkles, 
  ExternalLink, User, HelpCircle, ArrowRight
} from "lucide-react";
import { Company } from "../data/companies";
import { askAI } from "../utils/llm";

interface OutreachCopilotProps {
  companies: Company[];
  addSystemLog: (type: "system" | "ai" | "success" | "warning" | "error", message: string) => void;
  triggerToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export default function OutreachCopilot({ 
  companies, 
  addSystemLog, 
  triggerToast 
}: OutreachCopilotProps) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [emailType, setEmailType] = useState<string>("founder");
  const [customContext, setCustomContext] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [copied, setCopied] = useState(false);

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-select first company on mount or when selection becomes invalid
  useEffect(() => {
    if (companies.length > 0) {
      const exists = companies.some(c => c.id.toString() === selectedCompanyId);
      if (!exists) {
        setSelectedCompanyId(companies[0].id.toString());
      }
    }
  }, [companies, selectedCompanyId]);

  const selectedCompany = companies.find(c => c.id.toString() === selectedCompanyId);

  const handleGenerate = async () => {
    if (!selectedCompany) {
      triggerToast("Please select a target company first.", "error");
      return;
    }

    setLoading(true);
    addSystemLog("system", `Drafting cold email for ${selectedCompany.name} (${selectedCompany.resumeVariant} focus)...`);

    const systemPrompt = `You are a world-class startup outreach writer.
You write highly personalized cold emails for Junaid Ahmed, a sharp and curious 3rd Year B.Tech Artificial Intelligence and Data Science student.
He is NOT a CSE student. He combines IoT and AI. His email is junaidahmed2826@gmail.com.

EMAIL TONE RULES:
- Write like a sharp, curious engineering student, not a robotic marketing bot.
- Be humble, enthusiastic, and direct. Keep sentences relatively short.
- Reference Junaid's actual experience truthfully:
  - Experience: Data Analyst Intern at EinNel Technologies (processed structured datasets, optimized SQL query speed, built analytics dashboards), Marketing/Sales Intern at Unschool (highest monthly cohort sales).
  - Organizations & Activities: Event Coordinator at Tamil Nadu International Balloon Festival (assisted pilots with ground operations & flight prep), Volunteer at Students' Sea Turtle Conservation Network (coastal protection in collaboration with the Forest Dept).
  - Skills: Adaptability and quick learning, Time management, Problem-solving, Proficient in Python, Data cleaning, Excel functions, Data and analytics.
- ALWAYS reference something specific about the target company's domain or product.
- Keep the length under 150-180 words. Startups hate fluff.
- End with a low-friction ask (e.g. "if you're open to it, I'd love to share a 1-page PDF of my resume, or grab a 5-minute chat").

EMAIL TYPES:
1. "founder" (Cold email to founder/founder-friendly): Curious, builder-to-builder tone. Mention Junaid's real experience or coordinate skills depending on fit.
2. "recruiter" (To Talent Acquisition): Professional, structured, highlighting matching skills.
3. "followup1" (Follow-up #1, approx. 6 days later): Short, value-added bump. Mentions a fresh detail or observation about their space. Under 80 words.
4. "followup2" (Follow-up #2, final bump, 13 days later): Polite close, leaving the door open. Under 70 words.
5. "referral" (To general employee): Warm request for guidance or internal referral.

OUTPUT FORMAT:
Provide the output formatted exactly like this:
Subject: [optimized subject line]
---
[email body]`;

    const userPrompt = `
Company Name: ${selectedCompany.name}
Domain: ${selectedCompany.domain}
Target Role: ${selectedCompany.role}
Founder Name: ${selectedCompany.founderName || "Team"}
Resume Variant Focus: ${selectedCompany.resumeVariant}
Email Type: ${emailType}
Additional Notes on company: ${selectedCompany.notes}
Custom User context to include: ${customContext}

Write the email using Junaid's background. Include his data analyst, outreach, or volunteer coordination experience naturally if it fits the domain.`;

    try {
      const responseText = await askAI({
        system: systemPrompt,
        prompt: userPrompt,
        maxTokens: 900,
        modelType: "claude"
      });

      // Split subject and body
      const parts = responseText.split("---");
      if (parts.length >= 2) {
        const rawSub = parts[0].replace("Subject:", "").replace("subject:", "").trim();
        setSubject(rawSub);
        setBody(parts.slice(1).join("---").trim());
      } else {
        // Fallback split
        const lineIdx = responseText.indexOf("\n");
        const rawSub = responseText.substring(0, lineIdx).replace("Subject:", "").replace("subject:", "").trim();
        setSubject(rawSub);
        setBody(responseText.substring(lineIdx + 1).trim());
      }

      addSystemLog("ai", `Personalized email drafted for ${selectedCompany.name} (${emailType} template).`);
      triggerToast("AI Cold Email generated!", "success");
    } catch (err: any) {
      console.error(err);
      addSystemLog("error", `Email generation failed: ${err.message}`);
      triggerToast("Failed to generate email. Check settings.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!body) return;
    const textToCopy = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    triggerToast("Email copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  // Launch Gmail Client prefilled
  const getGmailUrl = () => {
    if (!selectedCompany) return "#";
    const to = selectedCompany.email || "";
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${encodedSubject}&body=${encodedBody}`;
  };

  return (
    <div className="space-y-6 slide-in">
      
      {/* ── SECTION HEADER ── */}
      <div className="flex items-center justify-between border-b border-zinc-800/40 pb-5">
        <div>
          <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">EMAIL GENERATOR</span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent mt-0.5 font-mono">
            Outreach Copilot
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Form: Select target and type */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="glass-panel p-5 rounded-2xl space-y-4 border border-zinc-850">
            <h3 className="text-xs font-mono font-bold tracking-wider text-zinc-200 uppercase">DRAFT CONFIG</h3>
            
            {/* Target Select with Search Bar */}
            <div className="space-y-2">
              <label className="block text-[10px] font-mono text-zinc-400 uppercase">SELECT TARGET COMPANY</label>
              <input
                type="text"
                placeholder="Search company name..."
                value={searchQuery}
                onChange={e => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  const filtered = companies.filter(c => 
                    c.name.toLowerCase().includes(val.toLowerCase())
                  );
                  if (filtered.length > 0) {
                    setSelectedCompanyId(filtered[0].id.toString());
                  }
                }}
                className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none focus:border-zinc-700 font-sans"
              />
              <select
                value={selectedCompanyId}
                onChange={e => setSelectedCompanyId(e.target.value)}
                className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none focus:border-zinc-700 font-sans"
              >
                {filteredCompanies.map(c => (
                  <option key={c.id} value={c.id} className="bg-zinc-950 text-zinc-300">
                    {c.name} ({c.role})
                  </option>
                ))}
                {filteredCompanies.length === 0 && (
                  <option value="" disabled className="bg-zinc-950 text-zinc-500">
                    No matching companies
                  </option>
                )}
              </select>
            </div>

            {/* Template Selector */}
            <div>
              <label className="block text-[10px] font-mono text-zinc-400 uppercase">EMAIL OUTREACH TYPE</label>
              <select
                value={emailType}
                onChange={e => setEmailType(e.target.value)}
                className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none focus:border-zinc-700 font-sans"
              >
                <option value="founder" className="bg-zinc-950 text-zinc-300">Cold Email to Founder (Recommended)</option>
                <option value="recruiter" className="bg-zinc-950 text-zinc-300">Recruiter / HR outreach</option>
                <option value="followup1" className="bg-zinc-950 text-zinc-300">Follow-up #1 (Value-added bump)</option>
                <option value="followup2" className="bg-zinc-950 text-zinc-300">Follow-up #2 (Final check-in)</option>
                <option value="referral" className="bg-zinc-950 text-zinc-300">Internal Referral Request</option>
              </select>
            </div>

            {/* Custom contextual input */}
            <div>
              <label className="block text-[10px] font-mono text-zinc-400 uppercase">OPTIONAL CONTEXT / INSTRUCTION</label>
              <textarea
                rows={3}
                placeholder="e.g. mention they recently raised Series A, or I saw their founder's tweet about ESP32..."
                value={customContext}
                onChange={e => setCustomContext(e.target.value)}
                className="w-full bg-zinc-950/40 border border-zinc-800 rounded-lg px-3 py-2.5 text-xs text-zinc-200 outline-none focus:border-zinc-750 placeholder-zinc-600 font-sans leading-normal"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !selectedCompany}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-200 disabled:bg-zinc-900 disabled:text-zinc-600 font-bold text-xs text-black transition-colors shadow-lg cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Drafting custom pitch...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Draft Outreach Email</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Stats on selected target */}
          {selectedCompany && (
            <div className="glass-panel p-5 rounded-2xl text-xs space-y-2 border border-zinc-850">
              <h4 className="font-mono text-[10px] text-zinc-400 uppercase border-b border-zinc-850 pb-1.5">Target Intelligence</h4>
              <p><span className="text-zinc-500">Founder:</span> <span className="text-zinc-300">{selectedCompany.founderName || "N/A"}</span></p>
              <p><span className="text-zinc-500">Contact Email:</span> <span className="text-zinc-300 font-mono">{selectedCompany.email || "N/A"}</span></p>
              <p><span className="text-zinc-500">Domain Focus:</span> <span className="text-zinc-300">{selectedCompany.domain}</span></p>
              <p><span className="text-zinc-500">Resume Variant:</span> <span className="text-zinc-300 font-mono text-[10px]">{selectedCompany.resumeVariant}</span></p>
            </div>
          )}

        </div>

        {/* Right Output: Email Viewer */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] text-zinc-400 font-mono">DRAFT VIEWING CONSOLE</span>
            {selectedCompany && (
              <span className="text-[10px] text-zinc-300 font-mono bg-zinc-900/60 border border-zinc-800 px-2 py-0.5 rounded">
                Target: {selectedCompany.name}
              </span>
            )}
          </div>

          {body ? (
            <div className="space-y-4">
              {/* Subject box */}
              <div className="glass-panel p-4 rounded-xl space-y-1.5 border border-zinc-850">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Subject Line</span>
                <div className="text-xs text-zinc-200 font-semibold font-sans">{subject}</div>
              </div>

              {/* Body Box */}
              <div className="glass-panel p-6 rounded-2xl relative font-sans text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap select-text bg-zinc-950/20 border border-zinc-850 min-h-[220px]">
                {body}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/80 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Email Pitch</span>
                    </>
                  )}
                </button>
                <a
                  href={getGmailUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-200 font-bold text-xs text-black transition-colors shadow-lg cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-slate-950" />
                  <span>Launch Gmail Compose</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-24 glass-panel rounded-2xl text-zinc-500 text-xs border border-zinc-850 bg-zinc-950/10">
              Select a target startup and click "Draft Outreach Email" to generate custom pitches using your resume profiles.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
