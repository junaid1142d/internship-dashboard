"use client";

import React from "react";
import { 
  Award, Clock, CheckCircle2, AlertCircle, TrendingUp, 
  Send, User, ArrowUpRight, Search, Mail, Cpu, Play
} from "lucide-react";
import { Company } from "../data/companies";
import { SystemLog } from "../utils/storage";

interface DashboardProps {
  companies: Company[];
  logs: SystemLog[];
  addSystemLog: (type: SystemLog["type"], message: string) => void;
  setTab: (tab: string) => void;
}

export default function Dashboard({ companies, logs, addSystemLog, setTab }: DashboardProps) {
  
  // Calculate metrics
  const total = companies.length;
  const sent = companies.filter(c => c.status !== "pending" && c.status !== "rejected").length;
  const pending = companies.filter(c => c.status === "pending").length;
  const replies = companies.filter(c => ["replied", "interview"].includes(c.status)).length;
  const interviews = companies.filter(c => c.status === "interview").length;
  const followups = companies.filter(c => c.followUpStage > 0).length;
  
  const responseRate = sent > 0 ? Math.round((replies / sent) * 100) : 0;
  
  // Calculate Campaign Health Score (out of 10)
  // Formula based on volume of applications, response rate, and followups
  const volumePoints = Math.min(sent / 25, 4); // max 4 points for sending 100 applications
  const responsePoints = Math.min(responseRate / 10, 4); // max 4 points for 40% response rate
  const interviewPoints = interviews > 0 ? 2 : 0; // 2 points for securing an interview
  const healthScore = Math.round((volumePoints + responsePoints + interviewPoints) * 10) / 10;
  const finalHealthScore = Math.min(healthScore, 10);

  // Get Top Pending High Fit Priority Companies
  const priorityQueue = [...companies]
    .filter(c => c.status === "pending")
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // Recommendations Alerts
  const alerts: string[] = [];
  const needsFollowup = companies.filter(c => c.status === "sent" && c.followUpStage === 0).slice(0, 2);
  if (needsFollowup.length > 0) {
    needsFollowup.forEach(c => {
      alerts.push(`Action Required: Cold email sent to ${c.name} has no reply. Draft Follow-up #1 in Outreach tab.`);
    });
  }
  
  const highFitCount = companies.filter(c => c.status === "pending" && c.score >= 90).length;
  if (highFitCount > 0) {
    alerts.push(`Opportunity Available: You have ${highFitCount} pending high-fit (90+ score) startups. Scan them in ATS Analyzer.`);
  }

  if (alerts.length === 0) {
    alerts.push("System nominal: Campaign active and operating with target metrics.");
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-white font-bold";
    if (score >= 80) return "text-zinc-200";
    if (score >= 70) return "text-zinc-400";
    return "text-zinc-650";
  };

  const getStatusColor = (status: Company["status"]) => {
    switch (status) {
      case "pending": return "text-zinc-500 bg-zinc-950 border-zinc-900";
      case "sent": return "text-zinc-300 bg-zinc-900/60 border-zinc-800";
      case "opened": return "text-zinc-200 bg-zinc-800/60 border-zinc-700";
      case "replied": return "text-zinc-100 bg-zinc-700/60 border-zinc-600 font-semibold";
      case "interview": return "text-black bg-white border-white font-bold";
      case "rejected": return "text-zinc-600 bg-zinc-950/20 border-zinc-950 line-through";
      default: return "text-zinc-400 bg-zinc-900/25 border-zinc-850";
    }
  };

  return (
    <div className="space-y-6 slide-in">
      
      {/* ── HEADER TITLE ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/40 pb-5">
        <div>
          <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">SUMMER 2026 CAMPAIGN</span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent mt-0.5 font-mono">
            hello , JUNAID AHMED M
          </h1>
        </div>
        <div className="flex gap-2 shrink-0">
          <button 
            onClick={() => setTab("discovery")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Discover Startups</span>
          </button>
          <button 
            onClick={() => setTab("ats")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-xs font-bold text-black transition-colors shadow-lg cursor-pointer font-mono"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Analyze Resume</span>
          </button>
        </div>
      </div>

      {/* ── METRIC CARDS GRID ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {[
          { label: "Active Pipeline", value: sent, icon: Send, color: "text-zinc-300" },
          { label: "Pending Targets", value: pending, icon: Clock, color: "text-zinc-400" },
          { label: "Replies Logged", value: replies, icon: CheckCircle2, color: "text-zinc-200" },
          { label: "Interviews Secured", value: interviews, icon: Award, color: "text-white" },
          { label: "Response Rate", value: `${responseRate}%`, icon: TrendingUp, color: "text-zinc-300" }
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="glass-panel p-5 rounded-xl flex flex-col justify-between min-h-[105px] border-zinc-800/80">
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">{card.label}</span>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div className="text-2xl font-bold font-mono tracking-tight text-white mt-2">{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* ── CAMPAIGN HEALTH & ALERTS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Campaign Health Score Gauge */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between border-zinc-800/80">
          <div>
            <h3 className="font-bold text-sm tracking-wider font-mono-tech text-zinc-300">CAMPAIGN HEALTH</h3>
            <p className="text-xs text-zinc-500 mt-0.5 font-sans">Calculated tracking fitness index</p>
          </div>
          
          <div className="flex flex-col items-center justify-center my-4">
            <div className="relative flex items-center justify-center">
              {/* Outer Ring */}
              <div className="w-32 h-32 rounded-full border-[3px] border-zinc-800 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-3xl font-bold font-mono text-white">{finalHealthScore}</span>
                  <span className="text-xs text-zinc-500 block font-mono">/ 10</span>
                </div>
              </div>
              {/* Spinning Accent */}
              <div className="absolute inset-0 rounded-full border-t-[3px] border-white animate-spin opacity-40" style={{ animationDuration: '3s' }} />
            </div>
          </div>

          <div className="text-center text-xs text-zinc-450 leading-relaxed font-mono">
            {finalHealthScore >= 8 ? "🔥 Elite campaign progression! Keep scaling applications." :
             finalHealthScore >= 5 ? "⚡ Solid activity metrics. Send more custom cold emails." :
             "⚠️ Low outreach pipeline velocity. Increase your submissions."}
          </div>
        </div>

        {/* Dynamic AI Alert Feed */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 flex flex-col border-zinc-800/80">
          <div className="mb-4">
            <h3 className="font-bold text-sm tracking-wider font-mono-tech text-zinc-300">AI PILOT RECOMMENDATIONS</h3>
            <p className="text-xs text-zinc-500 mt-0.5 font-sans">Real-time optimization advice based on metrics</p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[160px] pr-1.5">
            {alerts.map((alert, i) => (
              <div key={i} className="flex gap-3 p-3.5 rounded-xl border border-zinc-850 bg-zinc-950/40 hover:border-zinc-800 transition-colors">
                <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span className="text-xs text-zinc-300 leading-relaxed font-sans">{alert}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── PRIORITY QUEUE & RECENT ACTIVITY ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* High-Fit Priority Queue */}
        <div className="glass-panel p-6 rounded-2xl border-zinc-800/80">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-sm tracking-wider font-mono-tech text-zinc-300">PRIORITY OUTREACH QUEUE</h3>
              <p className="text-xs text-zinc-500 mt-0.5 font-sans">Startups with highest scoring portfolio compatibility</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-zinc-800 text-zinc-300 bg-zinc-900/30 font-mono uppercase">
              fit score
            </span>
          </div>

          <div className="space-y-2.5">
            {priorityQueue.length > 0 ? (
              priorityQueue.map(co => (
                <div key={co.id} className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-900 hover:border-zinc-800 bg-zinc-950/20 hover:bg-zinc-900/10 transition-all group">
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-zinc-300 group-hover:text-white transition-colors">{co.name}</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-zinc-500 truncate font-sans">{co.role}</span>
                      <span className="text-[10px] text-zinc-650 font-mono">·</span>
                      <span className="text-[10px] text-zinc-400 font-mono">{co.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className={`text-xs font-bold font-mono ${getScoreColor(co.score)}`}>
                      {co.score}%
                    </span>
                    <button 
                      onClick={() => setTab("outreach")}
                      className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all cursor-pointer"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-zinc-600 text-xs font-sans">
                No pending targets. Run "Discover Startups" to populate more targets.
              </div>
            )}
          </div>
        </div>

        {/* Live System Activity Feed */}
        <div className="glass-panel p-6 rounded-2xl border-zinc-800/80">
          <div className="mb-4">
            <h3 className="font-bold text-sm tracking-wider font-mono-tech text-zinc-300">LIVE SYSTEM ACTIVITY</h3>
            <p className="text-xs text-zinc-500 mt-0.5 font-sans">Latest actions logged by Internship Dashboard kernel</p>
          </div>

          <div className="space-y-3 font-mono text-[10px] max-h-[225px] overflow-y-auto pr-1">
            {logs.slice(0, 5).map(log => (
              <div key={log.id} className="flex gap-2 p-2 rounded bg-zinc-950/20 border border-zinc-900/50">
                <span className="text-zinc-600 shrink-0">[{log.timestamp}]</span>
                <span className="text-zinc-400 shrink-0 uppercase font-semibold">[{log.type}]</span>
                <span className="text-zinc-300 truncate">{log.message}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
