"use client";

import React, { useState } from "react";
import { 
  Plus, Calendar, Mail, FileText, ChevronRight, ChevronLeft, 
  Trash2, User, Globe, AlertCircle, Edit2, Link2, MapPin, Tag,
  Search
} from "lucide-react";
import { Company } from "../data/companies";

interface JobTrackerProps {
  companies: Company[];
  setCompanies: (companies: Company[]) => void;
  addSystemLog: (type: "system" | "ai" | "success" | "warning" | "error", message: string) => void;
  triggerToast: (msg: string, type?: "success" | "error" | "info") => void;
}

const COLUMNS = [
  { id: "pending", label: "Targets Queue", color: "border-zinc-800 text-zinc-400 bg-zinc-950/20" },
  { id: "sent", label: "Applied", color: "border-zinc-700 text-zinc-300 bg-zinc-900/10" },
  { id: "replied", label: "Replied", color: "border-zinc-650 text-zinc-200 bg-zinc-800/10" },
  { id: "interview", label: "Interviews 🎉", color: "border-white text-white bg-zinc-700/10" },
  { id: "rejected", label: "Archive", color: "border-zinc-900 text-zinc-600 bg-zinc-950/40 line-through" }
];

export default function JobTracker({ 
  companies, 
  setCompanies, 
  addSystemLog, 
  triggerToast 
}: JobTrackerProps) {
  
  // Modals & detail states
  const [selectedCo, setSelectedCo] = useState<Company | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNotes, setEditingNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // New Manual Company Form State
  const [newCo, setNewCo] = useState({
    name: "",
    domain: "",
    location: "Chennai",
    email: "",
    role: "Data Analyst Intern",
    website: "",
    founderName: "",
    notes: "",
    tags: "",
    resumeVariant: "Data Analyst"
  });

  // State move handler
  const moveStatus = (companyId: number, nextStatus: Company["status"]) => {
    const updated = companies.map(c => {
      if (c.id === companyId) {
        addSystemLog("success", `Application status for ${c.name} updated from ${c.status.toUpperCase()} to ${nextStatus.toUpperCase()}`);
        return { 
          ...c, 
          status: nextStatus,
          lastActivity: new Date().toLocaleDateString()
        };
      }
      return c;
    });
    setCompanies(updated);
    triggerToast("Application status updated!", "success");
    if (selectedCo && selectedCo.id === companyId) {
      setSelectedCo({ ...selectedCo, status: nextStatus, lastActivity: new Date().toLocaleDateString() });
    }
  };

  const handleUpdateNotes = () => {
    if (!selectedCo) return;
    const updated = companies.map(c => {
      if (c.id === selectedCo.id) {
        return { ...c, notes: editingNotes };
      }
      return c;
    });
    setCompanies(updated);
    setSelectedCo({ ...selectedCo, notes: editingNotes });
    triggerToast("Notes saved!", "success");
    addSystemLog("system", `Notes updated for ${selectedCo.name}.`);
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Remove ${name} from tracker database?`)) {
      const filtered = companies.filter(c => c.id !== id);
      setCompanies(filtered);
      addSystemLog("warning", `Removed ${name} from application tracker.`);
      triggerToast(`${name} removed.`, "info");
      setSelectedCo(null);
    }
  };

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCo.name || !newCo.email) {
      triggerToast("Company name and email are required.", "error");
      return;
    }

    const tagsArr = newCo.tags.split(",").map(t => t.trim()).filter(Boolean);

    const added: Company = {
      id: Date.now(),
      name: newCo.name,
      domain: newCo.domain || "Technology",
      location: newCo.location,
      email: newCo.email,
      role: newCo.role,
      tags: tagsArr.length ? tagsArr : ["Software"],
      source: "Manual",
      score: 75, // base score for manual entries
      resumeVariant: newCo.resumeVariant as any,
      website: newCo.website || `${newCo.name.toLowerCase().replace(/\s+/g, "")}.com`,
      applyUrl: newCo.website ? `https://${newCo.website}/careers` : "",
      founderName: newCo.founderName || "Team",
      status: "pending",
      followUpStage: 0,
      lastActivity: null,
      notes: newCo.notes || "Manually added target startup.",
      linkedinDm: false
    };

    setCompanies([added, ...companies]);
    addSystemLog("success", `Manually added ${added.name} target to Tracker Queue.`);
    triggerToast(`Added ${added.name} to targets!`, "success");
    
    // reset form
    setNewCo({
      name: "",
      domain: "",
      location: "Chennai",
      email: "",
      role: "Data Analyst Intern",
      website: "",
      founderName: "",
      notes: "",
      tags: "",
      resumeVariant: "Data Analyst"
    });
    setIsAddModalOpen(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-white font-bold";
    if (score >= 80) return "text-zinc-300";
    return "text-zinc-500";
  };

  return (
    <div className="space-y-6 slide-in">
      
      {/* ── SECTION HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/40 pb-5">
        <div>
          <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">PIPELINE TRACKER</span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent mt-0.5 font-mono">
            Tracker Board
          </h1>
        </div>

        {/* Search Bar & Add Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-550" />
            <input
              type="text"
              placeholder="Search companies, roles, tags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-200 outline-none focus:border-zinc-700 font-sans"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-colors shadow-lg cursor-pointer w-full sm:w-auto font-mono shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Target</span>
          </button>
        </div>
      </div>

      {/* ── KANBAN COLUMNS CONTAINER ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start select-none">
        
        {COLUMNS.map(col => {
          const colCompanies = filteredCompanies.filter(c => {
            // Group 'opened', 'sent', and 'followup' stages under "Applied" column for simplicity, or keep distinct.
            if (col.id === "sent") {
              return ["sent", "opened", "followup1", "followup2"].includes(c.status);
            }
            return c.status === col.id;
          });

          return (
            <div key={col.id} className="flex flex-col min-w-0 glass-panel rounded-2xl p-4 border border-slate-800/60 max-h-[75vh]">
              {/* Column Header */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-350">{col.label}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 font-mono">
                  {colCompanies.length}
                </span>
              </div>

              {/* Cards wrapper */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5 scrollbar min-h-[150px]">
                {colCompanies.length > 0 ? (
                  colCompanies.map(co => (
                    <div 
                      key={co.id}
                      onClick={() => {
                        setSelectedCo(co);
                        setEditingNotes(co.notes);
                      }}
                      className="p-3.5 rounded-xl border border-slate-800 hover:border-slate-700/60 bg-[#080d19]/40 hover:bg-[#0b1224]/50 transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <a 
                          href={co.applyUrl || (co.website ? (co.website.startsWith("http") ? co.website : `https://${co.website}`) : `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(co.name)}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="font-bold text-xs text-zinc-300 hover:text-white hover:underline transition-colors line-clamp-1 cursor-pointer"
                        >
                          {co.name}
                        </a>
                        <span className={`text-[10px] font-mono font-bold ${getScoreColor(co.score)}`}>
                          {co.score}%
                        </span>
                      </div>
                      
                      <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">{co.role}</div>
                      <div className="text-[9px] text-slate-600 font-mono mt-0.5">{co.location}</div>

                      {/* Direction Move triggers */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/60 no-print" onClick={e => e.stopPropagation()}>
                        <button
                          disabled={co.status === "pending"}
                          onClick={() => {
                            const statuses: Company["status"][] = ["pending", "sent", "replied", "interview", "rejected"];
                            const currIdx = statuses.indexOf(co.status);
                            if (currIdx > 0) moveStatus(co.id, statuses[currIdx - 1]);
                          }}
                          className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-slate-300 disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronLeft className="w-3 h-3" />
                        </button>
                        
                        <span className="text-[9px] text-slate-550 font-mono uppercase truncate px-1">{co.source}</span>
                        
                        <button
                          disabled={co.status === "rejected"}
                          onClick={() => {
                            const statuses: Company["status"][] = ["pending", "sent", "replied", "interview", "rejected"];
                            // Mapping logical progression
                            let nextS: Company["status"] = "sent";
                            if (co.status === "pending") nextS = "sent";
                            else if (["sent", "opened", "followup1", "followup2"].includes(co.status)) nextS = "replied";
                            else if (co.status === "replied") nextS = "interview";
                            else if (co.status === "interview") nextS = "rejected";
                            
                            moveStatus(co.id, nextS);
                          }}
                          className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-slate-300 disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-700 text-[10px] italic border border-dashed border-slate-850 rounded-xl">
                    Column Empty
                  </div>
                )}
              </div>
            </div>
          );
        })}

      </div>

      {/* ── CARD DETAIL MODAL ── */}
      {selectedCo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel border border-slate-800/80 max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800/50 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-base text-slate-200">
                  <a
                    href={selectedCo.applyUrl || (selectedCo.website ? (selectedCo.website.startsWith("http") ? selectedCo.website : `https://${selectedCo.website}`) : `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(selectedCo.name)}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:text-white"
                  >
                    {selectedCo.name}
                  </a>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedCo.domain} · aligned with {selectedCo.resumeVariant} resume</p>
              </div>
              <button 
                onClick={() => setSelectedCo(null)}
                className="text-slate-400 hover:text-slate-200 text-xs font-mono border border-slate-800 rounded px-2 py-0.5 bg-slate-900"
              >
                Close [esc]
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              
              {/* Properties row */}
              <div className="grid grid-cols-2 gap-4 bg-slate-900/30 border border-slate-900 p-3.5 rounded-xl">
                <div>
                  <span className="text-[10px] font-mono text-slate-550 uppercase">TARGET POSITION</span>
                  <p className="text-slate-250 font-semibold mt-0.5">{selectedCo.role}</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-550 uppercase">FIT COMPATIBILITY</span>
                  <p className={`font-semibold mt-0.5 ${getScoreColor(selectedCo.score)}`}>{selectedCo.score}% Match</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-550 uppercase">FOUNDER NAME</span>
                  <p className="text-slate-250 mt-0.5">{selectedCo.founderName || "N/A"}</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-550 uppercase">EMAIL CONTACT</span>
                  <p className="text-white mt-0.5 font-mono">
                    {selectedCo.email ? (
                      <a href={`mailto:${selectedCo.email}`} className="hover:underline text-zinc-300">{selectedCo.email}</a>
                    ) : "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-550 uppercase">WEBSITE</span>
                  <p className="mt-0.5 truncate text-zinc-300 font-mono">
                    {selectedCo.website ? (
                      <a href={selectedCo.website.startsWith("http") ? selectedCo.website : `https://${selectedCo.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{selectedCo.website}</a>
                    ) : "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-550 uppercase">APPLY LINK</span>
                  <p className="mt-0.5 truncate text-zinc-300 font-mono">
                    {selectedCo.applyUrl ? (
                      <a href={selectedCo.applyUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{selectedCo.applyUrl}</a>
                    ) : "N/A"}
                  </p>
                </div>
              </div>

              {/* Status Switcher */}
              <div>
                <label className="block text-[10px] font-mono text-slate-500 mb-1">MANUALLY SET PIPELINE STATUS</label>
                <div className="flex flex-wrap gap-1.5">
                  {["pending", "sent", "replied", "interview", "rejected"].map(st => (
                    <button
                      key={st}
                      onClick={() => moveStatus(selectedCo.id, st as any)}
                      className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono uppercase font-semibold transition-all ${
                        selectedCo.status === st 
                          ? "bg-zinc-800 border-zinc-700 text-white" 
                          : "border-zinc-800 hover:bg-zinc-900/30 text-zinc-400"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Edit Notes */}
              <div>
                <label className="block text-[10px] font-mono text-slate-500 mb-1">APPLICATION LOGS & NOTES</label>
                <textarea
                  rows={4}
                  value={editingNotes}
                  onChange={e => setEditingNotes(e.target.value)}
                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 outline-none focus:border-white/50"
                  placeholder="Record call logs, task requests, interview details..."
                />
                <button
                  onClick={handleUpdateNotes}
                  className="mt-2 py-1 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] rounded transition-colors font-medium cursor-pointer"
                >
                  Save Log Notes
                </button>
              </div>

              {/* Footer Delete */}
              <div className="border-t border-slate-800/40 pt-4 flex justify-between items-center text-[10px] text-slate-550">
                <span>Last Updated: {selectedCo.lastActivity || "Never"}</span>
                <button
                  onClick={() => handleDelete(selectedCo.id, selectedCo.name)}
                  className="text-rose-500 hover:text-rose-400 flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Startup</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ── ADD MANUAL TARGET MODAL ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel border border-slate-800/80 max-w-xl w-full rounded-2xl overflow-hidden shadow-2xl relative">
            
            <div className="p-6 border-b border-zinc-800 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-sm font-mono-tech tracking-wider text-white uppercase">ADD NEW TARGET STARTUP</h3>
                <p className="text-xs text-zinc-500">Insert custom targeting parameters manually</p>
              </div>
            </div>

            <form onSubmit={handleAddManual} className="p-6 space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 mb-1">COMPANY NAME *</label>
                  <input
                    type="text"
                    required
                    value={newCo.name}
                    onChange={e => setNewCo({ ...newCo, name: e.target.value })}
                    className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none focus:border-white/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 mb-1">INTERNSHIP ROLE TITLE</label>
                  <input
                    type="text"
                    value={newCo.role}
                    onChange={e => setNewCo({ ...newCo, role: e.target.value })}
                    className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none focus:border-white/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 mb-1">FOUNDER / HR EMAIL *</label>
                  <input
                    type="email"
                    required
                    value={newCo.email}
                    onChange={e => setNewCo({ ...newCo, email: e.target.value })}
                    className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none focus:border-white/50 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 mb-1">FOUNDER FULL NAME</label>
                  <input
                    type="text"
                    value={newCo.founderName}
                    onChange={e => setNewCo({ ...newCo, founderName: e.target.value })}
                    className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none focus:border-white/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 mb-1">WEBSITE DOMAIN</label>
                  <input
                    type="text"
                    placeholder="e.g. atherenergy.com"
                    value={newCo.website}
                    onChange={e => setNewCo({ ...newCo, website: e.target.value })}
                    className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none focus:border-white/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 mb-1">LOCATION TARGET</label>
                  <select
                    value={newCo.location}
                    onChange={e => setNewCo({ ...newCo, location: e.target.value })}
                    className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none focus:border-white/50 font-sans"
                  >
                    <option value="Chennai">Chennai</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-500 mb-1">RESUME VARIANT ALIGNMENT</label>
                <select
                  value={newCo.resumeVariant}
                  onChange={e => setNewCo({ ...newCo, resumeVariant: e.target.value })}
                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none focus:border-white/50 font-sans"
                >
                  <option value="AI/ML">AI/ML Focus</option>
                  <option value="Data Analyst">Data Analyst Focus</option>
                  <option value="Software Engineering">Software Engineering Focus</option>
                  <option value="IoT/Embedded">IoT/Embedded Focus</option>
                  <option value="StartupTN Ecosystem">StartupTN Ecosystem Focus</option>
                  <option value="Startup Generalist">Startup Generalist Focus</option>
                  <option value="Product/Operations">Product/Operations Focus</option>
                  <option value="Kenesis Labs CV/ML">Kenesis Labs CV/ML Focus</option>
                  <option value="Asyncronix ML">Asyncronix ML Focus</option>
                  <option value="Trinav SpaceTech">Trinav SpaceTech Focus</option>
                  <option value="Altru Robotics">Altru Robotics Focus</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-500 mb-1">COMMA-SEPARATED TAGS</label>
                <input
                  type="text"
                  placeholder="e.g. IoT, SaaS, AI/ML"
                  value={newCo.tags}
                  onChange={e => setNewCo({ ...newCo, tags: e.target.value })}
                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none focus:border-white/50 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-500 mb-1">BRIEF STARTUP CONTEXT / NOTES</label>
                <textarea
                  rows={2}
                  value={newCo.notes}
                  onChange={e => setNewCo({ ...newCo, notes: e.target.value })}
                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-250 outline-none focus:border-white/50"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800/40">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white hover:bg-zinc-200 text-black font-bold text-xs rounded-lg transition-colors cursor-pointer font-mono"
                >
                  Add Target
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
