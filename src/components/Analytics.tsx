"use client";

import React, { useState } from "react";
import { 
  BarChart2, TrendingUp, Sparkles, RefreshCw, 
  MapPin, Tag, CheckSquare, Clock, Award
} from "lucide-react";
import { Company } from "../data/companies";
import { SystemLog, storage } from "../utils/storage";
import { askAI } from "../utils/llm";

interface AnalyticsProps {
  companies: Company[];
  logs: SystemLog[];
  addSystemLog: (type: "system" | "ai" | "success" | "warning" | "error", message: string) => void;
}

export default function Analytics({ companies, logs, addSystemLog }: AnalyticsProps) {
  const [strategyReport, setStrategyReport] = useState("");
  const [loading, setLoading] = useState(false);

  // Compute Statistics
  const total = companies.length;
  const sent = companies.filter(c => c.status !== "pending").length;
  const pending = companies.filter(c => c.status === "pending").length;
  const replies = companies.filter(c => ["replied", "interview"].includes(c.status)).length;
  const interviews = companies.filter(c => c.status === "interview").length;
  
  const responseRate = sent > 0 ? Math.round((replies / sent) * 100) : 0;
  const avgFitScore = total > 0 ? Math.round(companies.reduce((acc, c) => acc + c.score, 0) / total) : 0;

  // Domain Breakdown calculations
  const tagCounts: Record<string, number> = {
    "AI/ML": 0,
    "Data": 0,
    "IoT": 0,
    "SaaS": 0,
    "Software": 0
  };

  companies.forEach(co => {
    co.tags.forEach(t => {
      if (t in tagCounts) tagCounts[t]++;
    });
  });

  // Location Breakdown
  const locationCounts: Record<string, number> = {
    "Chennai": 0,
    "Bangalore": 0,
    "Hyderabad": 0,
    "Remote": 0
  };

  companies.forEach(co => {
    const loc = co.location;
    if (loc in locationCounts) {
      locationCounts[loc]++;
    } else {
      locationCounts[loc] = 1; // custom locations
    }
  });

  const getPercentage = (count: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    addSystemLog("system", "AI Analytics Agent performing quantitative audit on outreach metrics...");

    const systemPrompt = `You are a Career Analytics and Growth Consultant specializing in early-stage tech hiring in India.
Analyze the provided stats of Junaid Ahmed's internship outreach campaign and output a strategic optimization report.

CAMPAIGN METRICS:
- Total startups logged: ${total}
- Custom cold applications sent: ${sent}
- Pending targets in queue: ${pending}
- Response Rate: ${responseRate}%
- Interviews secured: ${interviews}
- Average fit compatibility score: ${avgFitScore}/100
- Location Breakdown: Chennai (${locationCounts["Chennai"]}), Bangalore (${locationCounts["Bangalore"]}), Hyderabad (${locationCounts["Hyderabad"]}), Remote (${locationCounts["Remote"]})
- Domain focus tags breakdown: AI/ML (${tagCounts["AI/ML"]}), Data (${tagCounts["Data"]}), IoT (${tagCounts["IoT"]}), SaaS (${tagCounts["SaaS"]}), Software (${tagCounts["Software"]})

Provide a comprehensive and highly direct report under these sections:
# 📊 PIPELINE CRITIQUE REPORT
## 🚨 Campaign Health rating (e.g. X/10 with bulleted reasons)
## 💡 Highest-Impact Immediate Actions (3 actionable actions)
## 🕒 Outreach Timing & Strategy for Indian founders (Optimal days/hours for Chennai/Bangalore startups)
## ⚡ How to leverage CrashSense (safety helmet project) to raise response rates in AI, IoT, and SaaS domains specifically
## 📈 30-Day Outlook (Projections if he maintains a 3-pitch/day pace)`;

    try {
      const responseText = await askAI({
        system: systemPrompt,
        prompt: "Analyze the current metrics and compile Junaid's strategy report.",
        maxTokens: 1200,
        modelType: "claude"
      });

      setStrategyReport(responseText);
      addSystemLog("ai", "Pipeline Strategy Report generated successfully.");
    } catch (err: any) {
      console.error(err);
      addSystemLog("error", `Strategy compilation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 slide-in">
      
      {/* ── SECTION HEADER ── */}
      <div className="flex items-center justify-between border-b border-slate-800/40 pb-5">
        <div>
          <span className="text-[10px] text-sky-400 font-mono tracking-widest uppercase">CAMPAIGN METRICS</span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-sky-400 bg-clip-text text-transparent mt-0.5">
            Analytics & Strategy
          </h1>
        </div>
      </div>

      {/* ── METRICS DETAILS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Pipeline Response Rate", value: `${responseRate}%`, color: "text-emerald-400", desc: "Replies vs total applications sent" },
          { label: "Mean Compatibility Fit", value: `${avgFitScore}/100`, color: "text-sky-400", desc: "Average fit score of logged startups" },
          { label: "Target Coverage", value: total, color: "text-indigo-400", desc: "Total startups tracked in local DB" },
          { label: "Interviews Secured", value: interviews, color: "text-amber-400", desc: "Final stage conversions" }
        ].map((s, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-2xl">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">{s.label}</span>
            <div className={`text-3xl font-bold font-mono tracking-tight ${s.color} mt-1.5`}>{s.value}</div>
            <p className="text-[10px] text-slate-500 mt-1 leading-normal">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: charts / breakdowns */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Domain tag counts */}
          <div className="glass-panel p-5 rounded-2xl space-y-3.5">
            <div>
              <h3 className="text-xs font-mono font-bold tracking-wider text-sky-400 uppercase">DOMAIN DISTRIBUTION</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Application tags breakdown</p>
            </div>

            <div className="space-y-2.5">
              {Object.entries(tagCounts).map(([tag, count]) => {
                const percent = getPercentage(count);
                return (
                  <div key={tag} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400 font-mono">
                      <span>{tag}</span>
                      <span>{count} co ({percent}%)</span>
                    </div>
                    <div className="h-1.5 bg-slate-900 border border-slate-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-sky-500/80 rounded-full transition-all duration-500" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Location breakdown */}
          <div className="glass-panel p-5 rounded-2xl space-y-3.5">
            <div>
              <h3 className="text-xs font-mono font-bold tracking-wider text-sky-400 uppercase">LOCATION COVERAGE</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Geographical distributions of targets</p>
            </div>

            <div className="space-y-2.5">
              {Object.entries(locationCounts).map(([loc, count]) => {
                const percent = getPercentage(count);
                return (
                  <div key={loc} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400 font-mono">
                      <span>{loc}</span>
                      <span>{count} co ({percent}%)</span>
                    </div>
                    <div className="h-1.5 bg-slate-900 border border-slate-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500/80 rounded-full transition-all duration-500" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right column: AI critique reports */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] text-slate-500 font-mono">AI CONVERSION ADVISOR</span>
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs disabled:bg-slate-800 disabled:text-slate-600 transition-colors shadow-lg cursor-pointer font-sans"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Auditing Metrics...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                  <span>Generate Strategy Audit</span>
                </>
              )}
            </button>
          </div>

          {strategyReport ? (
            <div className="glass-panel p-6 md:p-8 rounded-2xl relative font-sans text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-text bg-[#090e1a]/45 border border-slate-800/80">
              {strategyReport}
            </div>
          ) : (
            <div className="text-center py-24 glass-panel rounded-2xl text-slate-600 text-xs">
              Click "Generate Strategy Audit" to trigger an AI review of your current application database spread, target locations, and response rates.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
