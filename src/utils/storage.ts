import { Company } from "../data/companies";
import { CandidateProfile } from "../data/candidate";

const KEYS = {
  COMPANIES: "internship_os_companies",
  CANDIDATE: "internship_os_candidate",
  SETTINGS: "internship_os_settings",
  SAVED_RESUMES: "internship_os_saved_resumes",
  LOGS: "internship_os_logs"
};

export interface AppSettings {
  anthropicApiKey: string;
  openaiApiKey: string;
  useServerApi: boolean;
  supabaseUrl: string;
  supabaseAnonKey: string;
  syncEnabled: boolean;
}

export interface SavedResume {
  id: string;
  companyId: number;
  companyName: string;
  role: string;
  jobDescription: string;
  optimizedBullets: Record<string, string[]>; // project name -> optimized bullets
  optimizedSummary: string;
  atsScore: number;
  dateGenerated: string;
  resumeVariant: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  type: "system" | "ai" | "success" | "warning" | "error";
  message: string;
}

export const defaultSettings: AppSettings = {
  anthropicApiKey: "",
  openaiApiKey: "",
  useServerApi: true,
  supabaseUrl: "",
  supabaseAnonKey: "",
  syncEnabled: false
};

// Safe access checking for SSR (Next.js server environments)
const isBrowser = () => typeof window !== "undefined";

const REMOVED_COMPANY_TERMS = ["kenesis", "assycronix", "trinav", "altru", "evtron", "innoxr", "level play ai"];
const sanitizeCompanies = (companies: Company[]): Company[] => {
  return companies.filter(company => {
    const normalized = company.name.toLowerCase();
    return !REMOVED_COMPANY_TERMS.some(term => normalized.includes(term));
  });
};

export const storage = {
  getCompanies: (defaultList: Company[]): Company[] => {
    if (!isBrowser()) return defaultList;
    try {
      const data = localStorage.getItem(KEYS.COMPANIES);
      const parsed = data ? JSON.parse(data) as Company[] : defaultList;
      return sanitizeCompanies(parsed);
    } catch (e) {
      console.error("Error reading companies from storage", e);
      return defaultList;
    }
  },

  saveCompanies: (companies: Company[]): void => {
    if (!isBrowser()) return;
    try {
      localStorage.setItem(KEYS.COMPANIES, JSON.stringify(sanitizeCompanies(companies)));
    } catch (e) {
      console.error("Error saving companies to storage", e);
    }
  },

  getCandidate: (defaultProfile: CandidateProfile): CandidateProfile => {
    if (!isBrowser()) return defaultProfile;
    try {
      const data = localStorage.getItem(KEYS.CANDIDATE);
      return data ? JSON.parse(data) : defaultProfile;
    } catch (e) {
      console.error("Error reading candidate from storage", e);
      return defaultProfile;
    }
  },

  saveCandidate: (profile: CandidateProfile): void => {
    if (!isBrowser()) return;
    try {
      localStorage.setItem(KEYS.CANDIDATE, JSON.stringify(profile));
    } catch (e) {
      console.error("Error saving candidate to storage", e);
    }
  },

  getSettings: (): AppSettings => {
    if (!isBrowser()) return defaultSettings;
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
    } catch (e) {
      console.error("Error reading settings from storage", e);
      return defaultSettings;
    }
  },

  saveSettings: (settings: AppSettings): void => {
    if (!isBrowser()) return;
    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error("Error saving settings to storage", e);
    }
  },

  getSavedResumes: (): SavedResume[] => {
    if (!isBrowser()) return [];
    try {
      const data = localStorage.getItem(KEYS.SAVED_RESUMES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error reading saved resumes", e);
      return [];
    }
  },

  saveResume: (resume: SavedResume): void => {
    if (!isBrowser()) return;
    try {
      const resumes = storage.getSavedResumes();
      // Remove older optimized resume for the same company/role if it exists
      const filtered = resumes.filter(r => r.companyId !== resume.companyId);
      filtered.unshift(resume); // Put newest at the front
      localStorage.setItem(KEYS.SAVED_RESUMES, JSON.stringify(filtered));
    } catch (e) {
      console.error("Error saving resume", e);
    }
  },

  deleteResume: (id: string): void => {
    if (!isBrowser()) return;
    try {
      const resumes = storage.getSavedResumes();
      const filtered = resumes.filter(r => r.id !== id);
      localStorage.setItem(KEYS.SAVED_RESUMES, JSON.stringify(filtered));
    } catch (e) {
      console.error("Error deleting resume", e);
    }
  },

  getLogs: (): SystemLog[] => {
    if (!isBrowser()) return [];
    try {
      const data = localStorage.getItem(KEYS.LOGS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  addLog: (type: SystemLog["type"], message: string): SystemLog[] => {
    if (!isBrowser()) return [];
    const log: SystemLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message
    };
    try {
      const logs = storage.getLogs();
      logs.unshift(log);
      const trimmed = logs.slice(0, 100); // Limit to last 100 logs
      localStorage.setItem(KEYS.LOGS, JSON.stringify(trimmed));
      return trimmed;
    } catch (e) {
      return [];
    }
  },

  clearLogs: (): void => {
    if (!isBrowser()) return;
    localStorage.removeItem(KEYS.LOGS);
  }
};
