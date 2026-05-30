"use client";

import React, { useState, useEffect } from "react";
import { 
  Send, Copy, Check, RefreshCw, Sparkles, 
  ExternalLink, MessageSquare, AlertCircle
} from "lucide-react";
import { Linkedin } from "./ui/icons";
import { Company } from "../data/companies";
import { askAI } from "../utils/llm";

interface LinkedinAssistantProps {
  companies: Company[];
  addSystemLog: (type: "system" | "ai" | "success" | "warning" | "error", message: string) => void;
  triggerToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export default function LinkedinAssistant({ 
  companies, 
  addSystemLog, 
  triggerToast 
}: LinkedinAssistantProps) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [msgType, setMsgType] = useState<string>("conn");
  const [customContext, setCustomContext] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (companies.length > 0 && !selectedCompanyId) {
      setSelectedCompanyId(companies[0].id.toString());
    }
  }, [companies]);

  const selectedCompany = companies.find(c => c.id.toString() === selectedCompanyId);

  const handleGenerate = async () => {
    if (!selectedCompany) {
      triggerToast("Please select a target company first.", "error");
      return;
    }

    setLoading(true);
    addSystemLog("system", `Generating LinkedIn message for ${selectedCompany.founderName || "Founder"} @ ${selectedCompany.name}...`);

    const systemPrompt = `You are a career assistant who writes short, human, high-conversion LinkedIn messages for Junaid Ahmed, a 3rd Year B.Tech Artificial Intelligence and Data Science student.

TONE & RULES:
- Write like a real student developer — curious, warm, polite, and enthusiastic. Never write like a standard template or HR bot.
- Absolutely NO robotic filler like "I hope this finds you well" or "My name is Junaid and I am writing to...". Get straight to the observation.
- Mention his standout project CrashSense (smart rider safety + accident detection IoT system using ESP32 & sensors) if relevant to their space.
- Keep the length strictly constrained depending on type:
  1. "conn" (Connection Request): Max 280 characters. Warm hook, curious observation about their startup, low friction greeting.
  2. "founder" (Direct Message to Founder): Max 80 words. Deeply personalized, student-founder-friendly tone, quick context on skills, and short ask.
  3. "recruiter" (Direct Message to HR/Recruiter): Max 70 words. Mention target role (${selectedCompany.role}), key tools matching his profile, and ask if they are onboarding interns.
  4. "followup" (Follow-up DM): Max 60 words. Polite reminder, brief value observation.

OUTPUT FORMAT:
Return only the generated message content. No extra tags, headers, or conversational introductions.`;

    const userPrompt = `
Company: ${selectedCompany.name}
Domain: ${selectedCompany.domain}
Founder Name: ${selectedCompany.founderName || "Team"}
Role target: ${selectedCompany.role}
Resume Variant: ${selectedCompany.resumeVariant}
Message Type: ${msgType}
Notes: ${selectedCompany.notes}
Custom context: ${customContext}

Draft the LinkedIn message.`;

    try {
      const responseText = await askAI({
        system: systemPrompt,
        prompt: userPrompt,
        maxTokens: 500,
        modelType: "claude"
      });

      setOutput(responseText.trim());
      addSystemLog("ai", `LinkedIn outreach message generated for ${selectedCompany.name} (type: ${msgType}).`);
      triggerToast("LinkedIn DM crafted!", "success");
    } catch (err: any) {
      console.error(err);
      addSystemLog("error", `LinkedIn generation failed: ${err.message}`);
      triggerToast("Generation failed. Check settings.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    triggerToast("Message copied!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 slide-in">
      
      {/* ── SECTION HEADER ── */}
      <div className="flex items-center justify-between border-b border-slate-800/40 pb-5">
        <div>
          <span className="text-[10px] text-sky-400 font-mono tracking-widest uppercase">SOCIAL ASSISTANT</span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-sky-400 bg-clip-text text-transparent mt-0.5">
            LinkedIn Assistant
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Form */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-wider text-sky-400 uppercase">DRAFT CONFIG</h3>
            
            {/* Target Select */}
            <div>
              <label className="block text-[10px] font-mono text-slate-500 mb-1">SELECT TARGET COMPANY</label>
              <select
                value={selectedCompanyId}
                onChange={e => setSelectedCompanyId(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-350 outline-none focus:border-sky-500/50 font-sans"
              >
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.founderName || "Team"})</option>
                ))}
              </select>
            </div>

            {/* Message Type */}
            <div>
              <label className="block text-[10px] font-mono text-slate-500 mb-1">MESSAGE OUTREACH TYPE</label>
              <select
                value={msgType}
                onChange={e => setMsgType(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-350 outline-none focus:border-sky-500/50 font-sans"
              >
                <option value="conn">Connection Invite Note (Max 280 Chars)</option>
                <option value="founder">Direct Message to Founder (Warm & Specific)</option>
                <option value="recruiter">Direct Message to HR Recruiter (Role Focused)</option>
                <option value="followup">Follow-up Direct Message</option>
              </select>
            </div>

            {/* Custom Notes */}
            <div>
              <label className="block text-[10px] font-mono text-slate-500 mb-1">ADD EXTRA CONTEXT</label>
              <textarea
                rows={3}
                placeholder="Mention an article they published or specific technology overlap..."
                value={customContext}
                onChange={e => setCustomContext(e.target.value)}
                className="w-full bg-slate-900/40 border border-slate-800/80 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-sky-500/50 placeholder-slate-650 font-sans"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !selectedCompany}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-600 font-bold text-xs text-slate-950 transition-colors shadow-lg shadow-sky-500/10 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Drafting LinkedIn DM...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Draft LinkedIn Message</span>
                </>
              )}
            </button>
          </div>

          {/* Guidelines info card */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-[#080d19]/10 flex gap-3 text-slate-400">
            <AlertCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div className="text-[10px] space-y-1.5">
              <span className="font-semibold block text-slate-350">Outreach Guardrails</span>
              <p>Connection requests must fit within the strict 300 character limit enforced by LinkedIn. Keep them light.</p>
              <p>For founder DMs, prioritize describing the problem-solving journey of your IoT helmet project, CrashSense.</p>
            </div>
          </div>

        </div>

        {/* Right Output */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] text-slate-500 font-mono">SOCIAL CHAT OUTPUT</span>
            {selectedCompany && (
              <span className="text-[10px] text-sky-400 font-mono">
                Target: {selectedCompany.founderName || "Team"} @ {selectedCompany.name}
              </span>
            )}
          </div>

          {output ? (
            <div className="space-y-4">
              
              {/* Output message body */}
              <div className="glass-panel p-6 rounded-2xl relative font-sans text-xs text-slate-200 leading-relaxed whitespace-pre-wrap select-text bg-[#090d1a]/45 min-h-[180px]">
                {output}
                {msgType === "conn" && (
                  <div className="absolute bottom-3 right-3 text-[10px] text-slate-500 font-mono">
                    Length: {output.length} / 300 chars
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Message Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Message</span>
                    </>
                  )}
                </button>
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 font-bold text-xs text-slate-950 transition-colors shadow-lg cursor-pointer"
                >
                  <Linkedin className="w-4 h-4 text-slate-950" />
                  <span>Launch LinkedIn Desktop</span>
                </a>
              </div>

            </div>
          ) : (
            <div className="text-center py-24 glass-panel rounded-2xl text-slate-600 text-xs">
              Select a target founder and generate a message to craft high-conversion LinkedIn notes.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
