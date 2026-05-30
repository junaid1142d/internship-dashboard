"use client";

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, FileText, Cpu, Search, Mail, 
  BookOpen, BarChart2, CheckSquare, Settings, Terminal, 
  HelpCircle, Plus, Copy, Check, LogOut, ArrowRight, ShieldAlert
} from "lucide-react";
import { Linkedin } from "./ui/icons";
import { CANDIDATE as initialCandidate } from "../data/candidate";
import { INITIAL_COMPANIES as initialCompanies, Company } from "../data/companies";
import { storage, AppSettings, defaultSettings, SystemLog, SavedResume } from "../utils/storage";

// Sub-views
import Dashboard from "./Dashboard";
import ResumeLab from "./ResumeLab";
import AtsAnalyzer from "./AtsAnalyzer";
import CompanyDiscovery from "./CompanyDiscovery";
import OutreachCopilot from "./OutreachCopilot";
import LinkedinAssistant from "./LinkedinAssistant";
import InterviewPrep from "./InterviewPrep";
import JobTracker from "./JobTracker";
import Analytics from "./Analytics";

interface ShellProps {
  initialTab?: string;
}

export default function Shell({ initialTab = "dashboard" }: ShellProps) {
  const [tab, setTab] = useState(initialTab);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [candidate, setCandidate] = useState(initialCandidate);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  
  // Modals & Panels UI States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTerminalCollapsed, setIsTerminalCollapsed] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  
  // Temporary Form States inside Settings Modal
  const [settingsForm, setSettingsForm] = useState<AppSettings>(defaultSettings);

  // Load state on mount
  useEffect(() => {
    const loadedCompanies = storage.getCompanies(initialCompanies);
    const loadedCandidate = storage.getCandidate(initialCandidate);
    const loadedSettings = storage.getSettings();
    const loadedSavedResumes = storage.getSavedResumes();
    const loadedLogs = storage.getLogs();

    setCompanies(loadedCompanies);
    setCandidate(loadedCandidate);
    setSettings(loadedSettings);
    setSettingsForm(loadedSettings);
    setSavedResumes(loadedSavedResumes);
    
    if (loadedLogs.length === 0) {
      const initLogs = storage.addLog("system", "Internship Dashboard Kernel v1.0.0 initialized successfully.");
      setLogs(initLogs);
    } else {
      setLogs(loadedLogs);
    }

    // Loading screen sequence
    const timer1 = setTimeout(() => setLoadingStep(1), 400);
    const timer2 = setTimeout(() => setLoadingStep(2), 800);
    const timer3 = setTimeout(() => setLoadingStep(3), 1200);
    const timer4 = setTimeout(() => setIsLoading(false), 1700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  // Sync state helpers
  const triggerToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addSystemLog = (type: SystemLog["type"], message: string) => {
    const updatedLogs = storage.addLog(type, message);
    setLogs(updatedLogs);
  };

  const handleUpdateCompanies = (updatedCompanies: Company[]) => {
    setCompanies(updatedCompanies);
    storage.saveCompanies(updatedCompanies);
  };

  const handleUpdateCandidate = (updatedCandidate: typeof candidate) => {
    setCandidate(updatedCandidate);
    storage.saveCandidate(updatedCandidate);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(settingsForm);
    storage.saveSettings(settingsForm);
    setIsSettingsOpen(false);
    triggerToast("Settings saved successfully!", "success");
    addSystemLog("success", `System settings updated. Server API: ${settingsForm.useServerApi ? 'ENABLED' : 'DISABLED'}`);
  };

  const handleSaveResume = (newResume: SavedResume) => {
    storage.saveResume(newResume);
    const updated = storage.getSavedResumes();
    setSavedResumes(updated);
    addSystemLog("success", `ATS Resume optimized for ${newResume.companyName} with score ${newResume.atsScore}%`);
  };

  const handleDeleteResume = (id: string) => {
    storage.deleteResume(id);
    const updated = storage.getSavedResumes();
    setSavedResumes(updated);
    addSystemLog("warning", "Deleted saved resume from local storage.");
  };

  const clearAllData = () => {
    if (confirm("WARNING: This will wipe all application state, tracking status, and API configurations. Do you want to proceed?")) {
      localStorage.clear();
      setCompanies(initialCompanies);
      setCandidate(initialCandidate);
      setSettings(defaultSettings);
      setSettingsForm(defaultSettings);
      setSavedResumes([]);
      storage.clearLogs();
      const resetLogs = storage.addLog("warning", "All local database state hard-reset to factory defaults.");
      setLogs(resetLogs);
      triggerToast("System memory wiped.", "error");
      setIsSettingsOpen(false);
    }
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "tracker", label: "Tracker Board", icon: CheckSquare },
    { id: "resumelab", label: "Resume Lab", icon: FileText },
    { id: "ats", label: "ATS Analyzer", icon: Cpu },
    { id: "discovery", label: "Discovery", icon: Search },
    { id: "outreach", label: "Outreach Copilot", icon: Mail },
    { id: "linkedin", label: "LinkedIn DM", icon: Linkedin },
    { id: "prep", label: "Interview Prep", icon: BookOpen },
    { id: "analytics", label: "Analytics", icon: BarChart2 }
  ];

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center font-mono text-zinc-400 select-none">
        {/* Glowing Geometric Logo */}
        <div className="relative mb-8 group">
          <div className="absolute inset-0 rounded-full bg-white/5 blur-xl group-hover:bg-white/10 transition-all duration-1000" />
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="w-24 h-24 relative z-10 rounded-2xl border border-zinc-850 object-contain shadow-2xl opacity-90 animate-pulse" 
          />
        </div>

        {/* Title */}
        <div className="text-center space-y-1 mb-6">
          <h2 className="text-sm font-bold tracking-widest text-white uppercase font-mono-tech">
            INTERNSHIP DASHBOARD
          </h2>
          <p className="text-[9px] text-zinc-600 tracking-widest uppercase">
            Junaid Ahmed M · System Initialization
          </p>
        </div>

        {/* Custom Progress Bar */}
        <div className="w-56 h-[3px] bg-zinc-900 border border-zinc-850 rounded-full overflow-hidden mb-6 relative">
          <div 
            className="h-full bg-white transition-all duration-500 ease-out" 
            style={{ 
              width: loadingStep === 0 ? "15%" : loadingStep === 1 ? "45%" : loadingStep === 2 ? "75%" : "100%" 
            }} 
          />
        </div>

        {/* Terminal Loading Logs */}
        <div className="w-64 h-16 text-[9px] text-zinc-500 space-y-1 flex flex-col justify-start">
          <div className="flex items-center gap-1.5">
            <span className={loadingStep >= 0 ? "text-white" : "text-zinc-700"}>[ {loadingStep >= 0 ? "ok" : "••"} ]</span>
            <span>Booting Internship Dashboard Kernel...</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={loadingStep >= 1 ? "text-white" : "text-zinc-700"}>[ {loadingStep >= 1 ? "ok" : "••"} ]</span>
            <span>Parsing Tracking Database...</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={loadingStep >= 2 ? "text-white" : "text-zinc-700"}>[ {loadingStep >= 2 ? "ok" : "••"} ]</span>
            <span>Loading Candidate Profile...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-slate-200 flex flex-col md:flex-row overflow-hidden bg-black">
      
      {/* Background Grayscale Glow Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-radial from-[rgba(255,255,255,0.015)] to-transparent pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-radial from-[rgba(255,255,255,0.01)] to-transparent pointer-events-none z-0" />
      <div className="absolute inset-0 matrix-grid opacity-[0.3] animate-grid-move pointer-events-none z-0" />
      
      {/* System Scanline overlay for hacker feel */}
      <div className="scanline absolute inset-0 pointer-events-none z-40 opacity-[0.15]" />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-[9999] flex items-center gap-2 border border-zinc-800 px-4 py-3 rounded-lg backdrop-blur-md transition-all duration-300 slide-in" style={{
          background: toast.type === "success" ? "rgba(255,255,255,0.08)" : toast.type === "error" ? "rgba(220,38,38,0.15)" : "rgba(255,255,255,0.05)",
          borderColor: toast.type === "success" ? "#ffffff" : toast.type === "error" ? "#dc2626" : "#ffffff",
          color: toast.type === "success" ? "#ffffff" : toast.type === "error" ? "#fca5a5" : "#e4e4e7"
        }}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* ── SIDEBAR NAVIGATION (Desktop) ── */}
      <aside className="hidden md:flex flex-col w-64 glass-panel border-r border-slate-800/80 z-30 shrink-0 select-none">
        
        {/* Header Branding */}
        <div className="p-6 border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-8 h-8 rounded border border-zinc-800 bg-black object-contain shadow" 
            />
            <div>
              <h2 className="font-bold font-mono-tech text-xs tracking-wider bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent uppercase leading-tight">
                Internship<br />Dashboard
              </h2>
              <p className="text-[9px] text-zinc-500 tracking-widest font-mono mt-0.5">V1.0.0 (STABLE)</p>
            </div>
          </div>
        </div>

        {/* User Identity Info */}
        <div className="px-6 py-4 border-b border-slate-800/50">
          <div className="text-xs font-semibold text-slate-200">{candidate.name}</div>
          <div className="text-[10px] text-slate-500 truncate mt-0.5">{candidate.degree}</div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navigationItems.map(item => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-medium transition-all duration-200 outline-none ${
                  active 
                    ? "bg-white/10 text-white border border-white/20 glow-text-teal" 
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40 border border-transparent"
                }`}
              >
                <Icon className={`w-4 text-sm ${active ? "text-white" : "text-zinc-500"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer controls */}
        <div className="p-4 border-t border-zinc-800/80 flex items-center justify-between">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-zinc-400 hover:text-white hover:bg-zinc-900/40 transition-colors w-full"
          >
            <Settings className="w-4 h-4" />
            <span>App Settings</span>
          </button>
        </div>
      </aside>

      {/* ── MOBILE HEADER & NAVIGATION ── */}
      <header className="md:hidden glass-panel border-b border-zinc-800/80 p-4 flex items-center justify-between z-30 select-none">
        <div className="flex items-center gap-2">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="w-7 h-7 rounded border border-zinc-800 bg-black object-contain shadow" 
          />
          <span className="font-bold text-xs tracking-wider bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent font-mono-tech uppercase">
            INTERNSHIP DASHBOARD
          </span>
        </div>
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 rounded bg-zinc-900/40 border border-zinc-800 text-zinc-300 hover:text-white"
        >
          <Settings className="w-4 h-4" />
        </button>
      </header>

      {/* ── MAIN WORKSPACE CONTENT ── */}
      <main className="flex-1 flex flex-col min-w-0 z-10 relative overflow-y-auto pb-24 md:pb-8">
        
        {/* Active Tab rendering */}
        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {tab === "dashboard" && (
            <Dashboard 
              companies={companies} 
              logs={logs} 
              addSystemLog={addSystemLog} 
              setTab={setTab} 
            />
          )}
          {tab === "tracker" && (
            <JobTracker 
              companies={companies} 
              setCompanies={handleUpdateCompanies} 
              addSystemLog={addSystemLog} 
              triggerToast={triggerToast} 
            />
          )}
          {tab === "resumelab" && (
            <ResumeLab 
              candidate={candidate} 
              setCandidate={handleUpdateCandidate} 
              savedResumes={savedResumes}
              deleteSavedResume={handleDeleteResume}
              addSystemLog={addSystemLog}
            />
          )}
          {tab === "ats" && (
            <AtsAnalyzer 
              candidate={candidate} 
              onSaveResume={handleSaveResume}
              addSystemLog={addSystemLog}
              triggerToast={triggerToast}
            />
          )}
          {tab === "discovery" && (
            <CompanyDiscovery 
              companies={companies} 
              setCompanies={handleUpdateCompanies} 
              addSystemLog={addSystemLog} 
              triggerToast={triggerToast}
              setTab={setTab}
            />
          )}
          {tab === "outreach" && (
            <OutreachCopilot 
              companies={companies} 
              addSystemLog={addSystemLog}
              triggerToast={triggerToast}
            />
          )}
          {tab === "linkedin" && (
            <LinkedinAssistant 
              companies={companies} 
              addSystemLog={addSystemLog}
              triggerToast={triggerToast}
            />
          )}
          {tab === "prep" && (
            <InterviewPrep 
              companies={companies} 
              addSystemLog={addSystemLog}
              triggerToast={triggerToast}
            />
          )}
          {tab === "analytics" && (
            <Analytics 
              companies={companies} 
              logs={logs}
              addSystemLog={addSystemLog}
            />
          )}
        </div>

        {/* Footer info at the bottom of the main view */}
        <footer className="w-full text-center py-5 border-t border-zinc-900/40 mt-auto select-none no-print">
          <p className="text-[11px] text-zinc-500 font-mono">
            Developed by{" "}
            <a 
              href="https://www.linkedin.com/in/junaid-ahmed-a38480288" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-zinc-450 hover:text-zinc-200 border-b border-zinc-900 hover:border-zinc-500 transition-all pb-0.5"
            >
              Junaid Ahmed M
            </a>
          </p>
        </footer>
      </main>

      {/* ── MOBILE BOTTOM NAVIGATION BAR ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-slate-800/80 z-30 flex items-center justify-around py-2 px-1">
        {navigationItems.slice(0, 5).map(item => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-all ${
                active ? "text-white" : "text-zinc-500"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-medium">{item.label.split(" ")[0]}</span>
            </button>
          );
        })}
        {/* Toggle navigation panel overlay for remaining items */}
        <div className="relative group">
          <button className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-slate-500">
            <Plus className="w-5 h-5" />
            <span className="text-[9px] font-medium">More</span>
          </button>
          <div className="absolute bottom-12 right-0 hidden group-hover:block glass-panel border border-slate-700/80 p-2 rounded-lg space-y-1 w-32 shadow-xl">
            {navigationItems.slice(5).map(item => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`w-full text-left px-3 py-1.5 rounded text-[10px] block ${
                    active ? "bg-white/10 text-white" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ── COLLAPSIBLE SYSTEM TERMINAL LOGS DRAWER ── */}
      <div className={`hidden lg:flex fixed bottom-0 right-0 z-40 bg-zinc-950/95 border-l border-t border-zinc-800 transition-all duration-300 ${
        isTerminalCollapsed ? "w-64 h-10" : "w-1/3 h-64"
      }`}>
        <div className="flex flex-col w-full h-full">
          {/* Header */}
          <div 
            onClick={() => setIsTerminalCollapsed(!isTerminalCollapsed)}
            className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 cursor-pointer select-none bg-black hover:bg-zinc-900/40"
          >
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-white" />
              <span className="text-xs font-mono font-semibold tracking-wider text-zinc-300">System_Terminal.log</span>
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">
              {isTerminalCollapsed ? "[MAX]" : "[MIN]"}
            </div>
          </div>
          {/* Logs Body */}
          {!isTerminalCollapsed && (
            <div className="flex-1 p-3 overflow-y-auto font-mono text-[10px] space-y-1.5 scrollbar bg-black">
              {logs.map(log => (
                <div key={log.id} className="flex items-start gap-1">
                  <span className="text-zinc-600">[{log.timestamp}]</span>
                  <span className={`px-1 rounded-[3px] text-[9px] uppercase font-bold shrink-0 ${
                    log.type === "success" ? "bg-zinc-900 text-zinc-300 border border-zinc-700" :
                    log.type === "error" ? "bg-white text-black border border-white" :
                    log.type === "warning" ? "bg-zinc-950 text-zinc-400 border border-zinc-800" :
                    log.type === "ai" ? "bg-zinc-800 text-zinc-100 border border-zinc-650" :
                    "bg-zinc-950 text-zinc-500 border border-zinc-900"
                  }`}>
                    {log.type === "success" ? "ok" : log.type === "warning" ? "wrn" : log.type === "error" ? "err" : log.type}
                  </span>
                  <span className="text-zinc-300 leading-normal">{log.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── SETTINGS MODAL ── */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel border border-zinc-800 max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl relative">
            
            <div className="p-6 border-b border-zinc-850 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg font-mono-tech tracking-wider text-white">
                  SYSTEM CONFIGURATION
                </h3>
                <p className="text-xs text-zinc-500">Configure AI API Keys and Database options</p>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="p-6 space-y-5">
              
              {/* Dual API key controls */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-zinc-400 mb-1.5">
                    Anthropic Claude API Key (Secure Local Storage)
                  </label>
                  <input
                    type="password"
                    placeholder="sk-ant-..."
                    value={settingsForm.anthropicApiKey}
                    onChange={e => setSettingsForm({ ...settingsForm, anthropicApiKey: e.target.value })}
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-700 outline-none focus:border-white/50 transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-zinc-400 mb-1.5">
                    OpenAI API Key (Secure Local Storage)
                  </label>
                  <input
                    type="password"
                    placeholder="sk-proj-..."
                    value={settingsForm.openaiApiKey}
                    onChange={e => setSettingsForm({ ...settingsForm, openaiApiKey: e.target.value })}
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-700 outline-none focus:border-white/50 transition-colors font-mono"
                  />
                </div>
              </div>

              {/* API Mode Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/20 border border-zinc-805">
                <div className="pr-4">
                  <span className="block text-xs font-semibold text-slate-200">Server Key Proxy Routing</span>
                  <span className="block text-[10px] text-zinc-500 mt-0.5">
                    If active, utilizes backend environment keys (useful when deployed on Vercel)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settingsForm.useServerApi}
                  onChange={e => setSettingsForm({ ...settingsForm, useServerApi: e.target.checked })}
                  className="w-4 h-4 rounded text-white bg-zinc-900 border-zinc-800 focus:ring-0"
                />
              </div>

              {/* Data Recovery panel */}
              <div className="p-3 rounded-lg border border-red-500/20 bg-red-950/10 space-y-2">
                <div className="flex gap-2 items-start text-red-400">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-semibold">Danger Zone</span>
                    <span className="block text-[10px] text-slate-500">
                      Irreversible actions affecting the localized tracker memory database.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearAllData}
                  className="w-full py-1.5 px-3 rounded bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-medium text-[10px] transition-colors"
                >
                  Factory Hard Reset Database
                </button>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t border-zinc-850">
                <button
                  type="button"
                  onClick={() => {
                    setSettingsForm(settings);
                    setIsSettingsOpen(false);
                  }}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors"
                >
                  Save Settings
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
