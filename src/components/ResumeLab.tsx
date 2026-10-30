"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Edit3,
  Download,
  Eye,
  Award,
  Check,
  Trash2,
  User,
  Mail,
  Phone,
  Link2,
  Plus,
  Code,
  Cpu,
} from "lucide-react";
import { Linkedin, Github } from "./ui/icons";
import { CandidateProfile, CANDIDATE } from "../data/candidate";
import { SavedResume } from "../utils/storage";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableCell,
  TableRow,
  BorderStyle,
  VerticalAlign,
  UnderlineType,
  ExternalHyperlink,
} from "docx";
import { jsPDF } from "jspdf";

interface ResumeLabProps {
  candidate: CandidateProfile;
  setCandidate: (profile: CandidateProfile) => void;
  savedResumes: SavedResume[];
  deleteSavedResume: (id: string) => void;
  addSystemLog: (
    type: "system" | "ai" | "success" | "warning" | "error",
    message: string
  ) => void;
}

const ROLE_SKILLS: Record<string, string[]> = {
  "General Placement": [
    "Python",
    "SQL",
    "Data Analysis",
    "Excel",
    "React",
    "TypeScript",
    "REST APIs",
    "Git",
    "GitHub",
    "Data Cleaning",
    "Data Visualization",
    "Problem Solving",
    "Debugging",
    "Technical Documentation",
    "Agile Development",
  ],

  "Zoho Data Analyst": [
    "SQL",
    "Python",
    "Microsoft Excel",
    "Data Cleaning",
    "Data Validation",
    "Pandas",
    "NumPy",
    "Data Visualization",
    "KPI Reporting",
    "Exploratory Data Analysis",
    "Statistical Analysis",
    "Dashboard Development",
    "Data Quality Checks",
    "Report Automation",
    "Business Reporting",
  ],

  "Data Analyst": [
    "SQL",
    "Python",
    "Microsoft Excel",
    "Pandas",
    "NumPy",
    "Data Cleaning",
    "Exploratory Data Analysis",
    "Data Visualization",
    "Dashboard Development",
    "KPI Reporting",
    "Time-Series Analysis",
    "Data Validation",
    "Statistical Analysis",
    "REST API Data Ingestion",
    "GIS Data Analysis",
  ],

  "Data Scientist": [
    "Python",
    "SQL",
    "Pandas",
    "NumPy",
    "Exploratory Data Analysis",
    "Feature Engineering",
    "Data Preprocessing",
    "Statistical Analysis",
    "Supervised Learning Concepts",
    "Classification Concepts",
    "Regression Concepts",
    "Model Evaluation Concepts",
    "Data Visualization",
    "Time-Series Analysis",
    "Scikit-learn Fundamentals",
  ],

  "Business Analyst": [
    "SQL",
    "Python",
    "Microsoft Excel",
    "KPI Reporting",
    "Requirements Analysis",
    "Business Process Analysis",
    "Data Validation",
    "Dashboard Reporting",
    "Stakeholder Communication",
    "Documentation",
    "Root-Cause Analysis",
    "Trend Analysis",
    "Data Visualization",
    "Problem Solving",
    "Presentation Skills",
  ],

  "Data Engineer": [
    "Python",
    "SQL",
    "Data Cleaning",
    "ETL Concepts",
    "Data Transformation",
    "CSV Data Processing",
    "REST APIs",
    "Data Validation",
    "Structured Data Processing",
    "Pandas",
    "NumPy",
    "Azure Data Explorer Fundamentals",
    "GeoJSON Data Pipelines",
    "Git",
    "Data Quality Checks",
  ],

  "Software Engineer": [
    "Python",
    "TypeScript",
    "JavaScript",
    "React",
    "Next.js Fundamentals",
    "REST API Integration",
    "FastAPI",
    "HTML",
    "CSS",
    "Git",
    "GitHub",
    "Debugging",
    "Component-Based Development",
    "JSON",
    "Software Testing Fundamentals",
  ],

  "AI/ML Engineer": [
    "Python",
    "LLM Integration",
    "Ollama",
    "Llama 3.2",
    "FastAPI",
    "REST APIs",
    "Retrieval-Augmented Generation Concepts",
    "Prompt Engineering",
    "React",
    "Data Preprocessing",
    "Pandas",
    "NumPy",
    "Model Evaluation Fundamentals",
    "JSON",
    "Human-in-the-Loop Workflows",
  ],

  "IoT/Embedded Engineer": [
    "ESP32",
    "Embedded C/C++",
    "Arduino",
    "Sensor Integration",
    "MPU6050",
    "GPS Integration",
    "NEO-6M GPS",
    "I2C Communication",
    "UART Communication",
    "IoT Prototyping",
    "Vibration Sensing",
    "Threshold-Based Event Detection",
    "Power Regulation",
    "Hardware Debugging",
    "Telegram API Integration",
  ],
};

const ROLE_HEADLINES: Record<string, string> = {
  "General Placement": "AI & DATA SCIENCE | SOFTWARE & ANALYTICS",
  "Zoho Data Analyst": "DATA ANALYST | SQL, PYTHON & REPORTING",
  "Data Analyst": "DATA ANALYST | PYTHON, SQL & VISUALIZATION",
  "Data Scientist": "DATA SCIENCE | ANALYTICS & ML FUNDAMENTALS",
  "Business Analyst": "BUSINESS ANALYST | DATA & DECISION SUPPORT",
  "Data Engineer": "DATA ENGINEERING | PYTHON, SQL & PIPELINES",
  "Software Engineer": "SOFTWARE ENGINEER | PYTHON & WEB APPLICATIONS",
  "AI/ML Engineer": "AI/ML ENGINEER | LLM APPLICATIONS & PYTHON",
  "IoT/Embedded Engineer": "IOT & EMBEDDED SYSTEMS | ESP32 & SENSOR INTEGRATION",
};

const ROLE_SUMMARIES: Record<string, string> = {
  "General Placement":
    "Artificial Intelligence and Data Science undergraduate with internship experience in geospatial development and data analytics. Built interactive GIS dashboards, Python-based data workflows, and a local LLM support application. Interested in entry-level technology roles involving software development, data, and applied AI.",

  "Zoho Data Analyst":
    "AI and Data Science undergraduate with experience preparing structured datasets, using Python and SQL for analysis, and building dashboard views during internships and projects. Familiar with Excel-based reporting, data validation, KPI presentation, and communicating analytical findings. Interested in supporting data-driven business decisions through accurate and well-documented analysis.",

  "Data Analyst":
    "Data-focused AI and Data Science undergraduate with internship experience in data preprocessing, SQL queries, and dashboard visualization. Applied Python, Pandas, NumPy, Excel, and geospatial analysis to structured datasets. Focused on data quality, clear reporting, trend analysis, and translating raw observations into useful insights.",

  "Data Scientist":
    "AI and Data Science undergraduate with practical experience in Python-based data preparation, exploratory analysis, and visualization, supported by academic study of statistics and machine learning. Built data-driven projects including an atmospheric monitoring dashboard and a local LLM workflow. Seeking to apply sound preprocessing, feature engineering, and evaluation practices to real-world datasets.",

  "Business Analyst":
    "AI and Data Science undergraduate with experience organizing datasets, developing dashboard views, documenting technical workflows, and supporting project delivery. Familiar with SQL, Excel, Python, KPI reporting, data validation, and stakeholder-oriented communication. Interested in turning business questions into structured analysis and actionable recommendations.",

  "Data Engineer":
    "AI and Data Science undergraduate with hands-on experience processing structured datasets, integrating REST APIs, and developing Python-based data workflows. Worked with CSV data, GeoJSON conversion, SQL, and dashboard integrations across analytics and geospatial projects. Interested in building reliable ingestion, transformation, and validation pipelines.",

  "Software Engineer":
    "AI and Data Science undergraduate with project experience building web applications using React, TypeScript, Python, and FastAPI. Integrated REST APIs, connected user interfaces to backend services, and developed a local LLM support workflow. Focused on maintainable application code, debugging, integration, and practical software delivery.",

  "AI/ML Engineer":
    "AI and Data Science undergraduate with hands-on experience integrating a locally hosted Llama 3.2 model through Ollama and FastAPI into a React application. Built workflows for support-ticket retrieval, response drafting, and human review. Interested in LLM applications, retrieval workflows, API integration, and responsible evaluation of AI-powered systems.",

  "IoT/Embedded Engineer":
    "AI and Data Science undergraduate with practical prototyping experience using ESP32, motion and vibration sensors, GPS, and Telegram-based alerts. Developed a smart-helmet concept combining sensor readings with threshold-based crash detection and location reporting. Interested in embedded systems, sensor integration, connected devices, and hardware-software debugging.",
};

function getRoleSkills(variant: string): string[] {
  return ROLE_SKILLS[variant] ?? ROLE_SKILLS["General Placement"];
}

function getRoleSummary(variant: string): string {
  return ROLE_SUMMARIES[variant] ?? ROLE_SUMMARIES["General Placement"];
}

function getRoleHeadline(variant: string): string {
  return ROLE_HEADLINES[variant] ?? ROLE_HEADLINES["General Placement"];
}

function safeUrl(value: string): string {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function escapeLatex(value: string): string {
  return value
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/([&%$#_{}])/g, "\\$1")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
}

function cleanFileName(value: string): string {
  return value
    .trim()
    .replace(/[^a-z0-9_-]+/gi, "_")
    .replace(/^_+|_+$/g, "");
}
export default function ResumeLab({
  candidate,
  setCandidate,
  savedResumes,
  deleteSavedResume,
  addSystemLog,
}: ResumeLabProps) {
  const [selectedVariant, setSelectedVariant] = useState("Data Analyst");
  const [activeTab, setActiveTab] = useState<
    "builder" | "editor" | "latex" | "history"
  >("builder");
  const [profileForm, setProfileForm] = useState<CandidateProfile>({
    ...candidate,
    skills: [...candidate.skills],
    projects: [...candidate.projects],
    experience: [...candidate.experience],
    organizations: [...candidate.organizations],
  });
  const [latexCode, setLatexCode] = useState("");
  const [notice, setNotice] = useState("");
  const [showPhoto, setShowPhoto] = useState(false);

  useEffect(() => {
    setProfileForm({
      ...candidate,
      skills: [...candidate.skills],
      projects: [...candidate.projects],
      experience: [...candidate.experience],
      organizations: [...candidate.organizations],
    });
  }, [candidate]);

  const skills = getRoleSkills(selectedVariant);
  const summary = getRoleSummary(selectedVariant);
  const headline = getRoleHeadline(selectedVariant);

  const orderedProjects = useMemoProjects(candidate.projects, selectedVariant);

  function notify(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  }

  function saveProfile() {
    setCandidate(profileForm);
    addSystemLog("success", "Candidate profile updated.");
    notify("Profile saved.");
  }

  function makeLatex(): string {
    const lines: string[] = [
      "\\documentclass[10pt,a4paper]{article}",
      "\\usepackage[margin=1.35cm]{geometry}",
      "\\usepackage[T1]{fontenc}",
      "\\usepackage{enumitem}",
      "\\usepackage[hidelinks]{hyperref}",
      "\\usepackage{titlesec}",
      "\\setlength{\\parindent}{0pt}",
      "\\setlength{\\parskip}{2pt}",
      "\\titleformat{\\section}{\\large\\bfseries}{}{0pt}{}",
      "\\begin{document}",
      "\\begin{center}",
      `{\\LARGE\\textbf{${escapeLatex(candidate.name)}}}\\\\`,
      escapeLatex(headline),
      "\\\\[3pt]",
      `\\href{mailto:${escapeLatex(candidate.email)}}{${escapeLatex(candidate.email)}}`,
      `\\quad $|$ \\quad ${escapeLatex(candidate.phone)}`,
      `\\quad $|$ \\quad \\href{${safeUrl(candidate.linkedin)}}{LinkedIn}`,
      `\\quad $|$ \\quad \\href{https://github.com/junaid1142d}{github.com/junaid1142d}`,
      "\\end{center}",
      "\\vspace{-5pt}",
      "\\section*{Professional Summary}",
      escapeLatex(summary),
      "\\section*{Education}",
      `\\textbf{${escapeLatex(candidate.college)}}\\\\`,
      `${escapeLatex(candidate.degree)}\\hfill Chennai, India`,
      "\\section*{Technical Skills}",
      escapeLatex(skills.join(" $\\cdot$ ")),
      "\\section*{Professional Experience}",
    ];

    candidate.experience.forEach((experience) => {
      lines.push(
        `\\textbf{${escapeLatex(experience.role)} — ${escapeLatex(experience.company)}}\\hfill ${escapeLatex(experience.duration)}\\\\`,
        `\\textit{${escapeLatex(experience.location)}}`,
        "\\begin{itemize}[leftmargin=14pt,itemsep=1pt,topsep=2pt]"
      );

      experience.bullets.slice(0, 3).forEach((bullet) => {
        lines.push(`\\item ${escapeLatex(bullet)}`);
      });

      lines.push("\\end{itemize}");
    });

    lines.push("\\section*{Selected Projects}");

    orderedProjects.slice(0, 3).forEach((project) => {
      lines.push(
        `\\textbf{${escapeLatex(project.name)}}\\\\`,
        `\\textit{${escapeLatex(project.tags.join(" | "))}}\\\\`,
        escapeLatex(project.desc),
        "\\begin{itemize}[leftmargin=14pt,itemsep=1pt,topsep=2pt]"
      );

      project.bullets.slice(0, 3).forEach((bullet) => {
        lines.push(`\\item ${escapeLatex(bullet)}`);
      });

      lines.push("\\end{itemize}");
    });

    if (candidate.organizations.length > 0) {
      lines.push("\\section*{Leadership and Volunteering}");

      candidate.organizations.slice(0, 2).forEach((organization) => {
        lines.push(
          `\\textbf{${escapeLatex(organization.role)}} — ${escapeLatex(organization.name)}\\hfill ${escapeLatex(organization.duration)}\\\\`,
          escapeLatex(organization.bullets[0] ?? "")
        );
      });
    }

    lines.push(
      "\\section*{Languages}",
      "English $\\cdot$ Tamil $\\cdot$ Urdu $\\cdot$ Hindi",
      "\\end{document}"
    );

    return lines.join("\n");
  }

  function downloadPdf() {
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const left = 14;
      const right = 14;
      const contentWidth = pageWidth - left - right;
      const bottom = pageHeight - 12;
      let y = 12;

      const ensureSpace = (height: number) => {
        if (y + height > bottom) {
          pdf.addPage();
          y = 12;
        }
      };

      const textBlock = (
        text: string,
        fontSize = 9.6,
        options: { bold?: boolean; italic?: boolean } = {}
      ) => {
        pdf.setFont(
          "helvetica",
          options.bold ? "bold" : options.italic ? "italic" : "normal"
        );
        pdf.setFontSize(fontSize);

        const lines = pdf.splitTextToSize(text, contentWidth);
        const lineHeight = fontSize * 0.48;

        lines.forEach((line: string) => {
          ensureSpace(lineHeight + 0.2);
          pdf.text(line, left, y);
          y += lineHeight;
        });
      };

      const section = (title: string) => {
        ensureSpace(8);
        y += 1.6;
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.setTextColor(20, 20, 20);
        pdf.text(title.toUpperCase(), left, y);
        y += 1.5;
        pdf.setDrawColor(70, 70, 70);
        pdf.setLineWidth(0.25);
        pdf.line(left, y, pageWidth - right, y);
        y += 3;
      };

      const bullet = (text: string) => {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9.2);
        const lines = pdf.splitTextToSize(`• ${text}`, contentWidth - 1);

        lines.forEach((line: string) => {
          ensureSpace(4);
          pdf.text(line, left + 1, y);
          y += 4.1;
        });
      };

      // Name and contact details
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(22);
      pdf.text(candidate.name, pageWidth / 2, y, { align: "center" });
      y += 5.2;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9.5);
      pdf.text(headline, pageWidth / 2, y, { align: "center" });
      y += 4.5;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      
const contactItems = [
  { text: candidate.email, url: `mailto:${candidate.email}` },
  {
    text: candidate.phone,
    url: `tel:${candidate.phone.replace(/[^\d+]/g, "")}`,
  },
  { text: "LinkedIn", url: safeUrl(candidate.linkedin) },
  {
  text: "github.com/junaid1142d",
  url: "https://github.com/junaid1142d",
},
];

pdf.setFont("helvetica", "normal");
pdf.setFontSize(7.8);

const contactParts: { text: string; url?: string }[] = [];
contactItems.forEach((item, index) => {
  if (index > 0) contactParts.push({ text: "  |  " });
  contactParts.push(item);
});

const totalWidth = contactParts.reduce(
  (sum, item) => sum + pdf.getTextWidth(item.text),
  0
);

let contactX = Math.max(14, (pageWidth - totalWidth) / 2);

contactParts.forEach((item) => {
  const width = pdf.getTextWidth(item.text);

  if (item.url) {
    pdf.setTextColor(11, 87, 208);
    pdf.text(item.text, contactX, y);
pdf.link(contactX, y - 3, width, 4, { url: item.url });
    pdf.setDrawColor(11, 87, 208);
    pdf.setLineWidth(0.15);
    pdf.line(contactX, y + 0.5, contactX + width, y + 0.5);
  } else {
    pdf.setTextColor(20, 20, 20);
    pdf.text(item.text, contactX, y);
  }

  contactX += width;
});

pdf.setTextColor(20, 20, 20);
y += 3.8;

      y += 2;

      pdf.setDrawColor(30, 30, 30);
      pdf.setLineWidth(0.45);
      pdf.line(left, y, pageWidth - right, y);
      y += 3;

      section("Professional Summary");
      textBlock(summary, 9.6);
      y += 0.6;

      section("Education");
      textBlock(candidate.college, 9.5, { bold: true });
      textBlock(candidate.degree, 9, { italic: true });
      textBlock("Chennai, Tamil Nadu, India", 8);
      y += 0.5;

      section("Technical Skills");
      textBlock(skills.join("  •  "), 9);
      y += 0.5;

      section("Professional Experience");

      candidate.experience.forEach((experience) => {
        ensureSpace(8);
        textBlock(
          `${experience.role} | ${experience.company} | ${experience.duration}`,
          9.4,
          { bold: true }
        );
        textBlock(experience.location, 8.5, { italic: true });

        experience.bullets.slice(0, 3).forEach(bullet);
        y += 0.7;
      });

      section("Selected Projects");

      orderedProjects.slice(0, 3).forEach((project) => {
        ensureSpace(10);
        textBlock(project.name, 9.4, { bold: true });
        textBlock(project.tags.join(" | "), 8.2, { italic: true });
        textBlock(project.desc, 9);

        project.bullets.slice(0, 3).forEach(bullet);
        y += 0.7;
      });

      if (candidate.organizations.length) {
        section("Leadership and Volunteering");

        candidate.organizations.slice(0, 2).forEach((organization) => {
          textBlock(
            `${organization.role} | ${organization.name} | ${organization.duration}`,
            8.3,
            { bold: true }
          );
          textBlock(organization.bullets[0] ?? "", 8);
        });
      }

      section("Languages");
      textBlock("English | Tamil | Urdu | Hindi", 8.4);

      pdf.save(
        `${cleanFileName(candidate.name)}_${cleanFileName(selectedVariant)}_Resume.pdf`
      );

      addSystemLog("success", `PDF resume exported for ${selectedVariant}.`);
      notify("PDF exported.");
    } catch (error) {
      console.error(error);
      addSystemLog("error", "PDF export failed.");
      notify("PDF export failed. Check the browser console.");
    }
  }
    

  async function downloadWord() {
    try {
      const children: (Paragraph | Table)[] = [];

      // Resume name
      children.push(
        new Paragraph({
          alignment: "center",
          spacing: { after: 3 },
          children: [
            new TextRun({
              text: candidate.name,
              bold: true,
              size: 34,
            }),
          ],
        }),

        // Professional headline
        new Paragraph({
          alignment: "center",
          spacing: { after: 5 },
          children: [
            new TextRun({
              text: headline,
              bold: true,
              size: 18,
            }),
          ],
        }),

        // Clickable email and phone
        new Paragraph({
          alignment: "center",
          spacing: { after: 3 },
          children: [
            new ExternalHyperlink({
              link: `mailto:${candidate.email}`,
              children: [
                new TextRun({
                  text: candidate.email,
                  color: "0B57D0",
                  underline: {},
                  size: 17,
                }),
              ],
            }),
            new TextRun({ text: " | ", size: 17 }),
            new ExternalHyperlink({
              link: `tel:${candidate.phone.replace(/[^\d+]/g, "")}`,
              children: [
                new TextRun({
                  text: candidate.phone,
                  color: "0B57D0",
                  underline: {},
                  size: 17,
                }),
              ],
            }),
          ],
        }),

        // Clickable LinkedIn and GitHub
        new Paragraph({
          alignment: "center",
          spacing: { after: 3 },
          children: [
            new ExternalHyperlink({
              link: safeUrl(candidate.linkedin),
              children: [
                new TextRun({
                  text: "LinkedIn",
                  color: "0B57D0",
                  underline: {},
                  size: 17,
                }),
              ],
            }),
            new ExternalHyperlink({
  link: "https://github.com/junaid1142d",
  children: [
    new TextRun({
      text: "github.com/junaid1142d",
      color: "0B57D0",
      underline: {},
      size: 19,
    }),
  ],
}),
          ],
        }),

        // Location
        new Paragraph({
          alignment: "center",
          spacing: { after: 8 },
          children: [
            new TextRun({
              text: candidate.location,
              size: 16,
            }),
          ],
        })
      );

      // Section headings
      const addSection = (title: string) => {
        children.push(
          new Paragraph({
            heading: "Heading1",
            spacing: { before: 8, after: 3 },
            border: {
              bottom: {
                style: BorderStyle.SINGLE,
                size: 4,
                color: "333333",
                space: 2,
              },
            },
            children: [
              new TextRun({
                text: title.toUpperCase(),
                bold: true,
                size: 19,
              }),
            ],
          })
        );
      };

      // Regular text
      const addText = (
        text: string,
        options: {
          bold?: boolean;
          italic?: boolean;
          size?: number;
        } = {}
      ) => {
        children.push(
          new Paragraph({
            spacing: { after: 2 },
            children: [
              new TextRun({
                text,
                bold: options.bold ?? false,
                italics: options.italic ?? false,
                size: options.size ?? 17,
              }),
            ],
          })
        );
      };

      // Bullet points
      const addBullet = (text: string) => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 1 },
            children: [
              new TextRun({
                text,
                size: 16,
              }),
            ],
          })
        );
      };

      // Professional Summary
      addSection("Professional Summary");
      addText(summary);

      // Education
      addSection("Education");
      addText(candidate.college, { bold: true });
      addText(candidate.degree, { italic: true });
      addText("Chennai, Tamil Nadu, India", { size: 16 });

      // Technical Skills
      addSection("Technical Skills");
      addText(skills.join(" • "), { size: 16 });

      // Professional Experience
      addSection("Professional Experience");

      candidate.experience.forEach((experience) => {
        addText(
          `${experience.role} | ${experience.company} | ${experience.duration}`,
          { bold: true }
        );

        addText(experience.location, {
          italic: true,
          size: 16,
        });

        experience.bullets.slice(0, 3).forEach(addBullet);
      });

      // Selected Projects
      addSection("Selected Projects");

      orderedProjects.slice(0, 3).forEach((project) => {
        addText(project.name, { bold: true });
        addText(project.tags.join(" | "), {
          italic: true,
          size: 15,
        });
        addText(project.desc, { size: 16 });

        project.bullets.slice(0, 3).forEach(addBullet);
      });

      // Leadership and Volunteering
      if (candidate.organizations.length > 0) {
        addSection("Leadership and Volunteering");

        candidate.organizations.slice(0, 2).forEach((organization) => {
          addText(
            `${organization.role} | ${organization.name} | ${organization.duration}`,
            { bold: true, size: 16 }
          );

          addText(organization.bullets[0] ?? "", {
            size: 16,
          });
        });
      }

      // Languages
      addSection("Languages");
      addText("English • Tamil • Urdu • Hindi");

      // Create the Word document
      const wordDocument = new Document({
        creator: candidate.name,
        title: `${selectedVariant} Resume`,
        description: `ATS-friendly ${selectedVariant} resume`,
        sections: [
          {
            properties: {
              page: {
                size: {
                  width: 11906,
                  height: 16838,
                },
                margin: {
                  top: 680,
                  right: 820,
                  bottom: 680,
                  left: 820,
                },
              },
            },
            children,
          },
        ],
      });

      // Download the Word file
      const blob = await Packer.toBlob(wordDocument);
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement("a");

      link.href = url;
      link.download = `${cleanFileName(candidate.name)}_${cleanFileName(selectedVariant)}.docx`;

      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      addSystemLog(
        "success",
        `Word resume exported for ${selectedVariant}.`
      );

      notify("Editable Word resume exported.");
    } catch (error) {
      console.error(error);
      addSystemLog("error", "Word export failed.");
      notify("Word export failed. Check the browser console.");
    }
  }


  function downloadLatex() {
    const source = makeLatex();
    setLatexCode(source);

    const blob = new Blob([source], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${cleanFileName(candidate.name)}_${cleanFileName(selectedVariant)}_Resume.tex`;
    link.click();
    URL.revokeObjectURL(url);

    addSystemLog("success", `LaTeX resume exported for ${selectedVariant}.`);
    notify("LaTeX source exported.");
  }

  async function copyLatex() {
    const source = latexCode || makeLatex();

    try {
      await navigator.clipboard.writeText(source);
      setLatexCode(source);
      notify("LaTeX source copied.");
    } catch {
      setLatexCode(source);
      notify("LaTeX source is shown below. Select and copy it manually.");
    }
  }

  function updateProfileField(
    field: keyof CandidateProfile,
    value: string
  ) {
    setProfileForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function updateExperienceBullet(
    experienceIndex: number,
    bulletIndex: number,
    value: string
  ) {
    setProfileForm((previous) => {
      const experience = [...previous.experience];
      const bullets = [...experience[experienceIndex].bullets];
      bullets[bulletIndex] = value;
      experience[experienceIndex] = {
        ...experience[experienceIndex],
        bullets,
      };

      return {
        ...previous,
        experience,
      };
    });
  }

  function addSkill() {
    const value = window.prompt("Enter a skill you can confidently discuss:");
    if (!value?.trim()) return;

    setProfileForm((previous) => ({
      ...previous,
      skills: [
        ...previous.skills,
        {
          name: value.trim(),
          score: 70,
        },
      ],
    }));
  }

  function removeSkill(index: number) {
    setProfileForm((previous) => ({
      ...previous,
      skills: previous.skills.filter((_, current) => current !== index),
    }));
  }

  function saveCurrentVariant() {
    const source = makeLatex();
    setLatexCode(source);
    setActiveTab("latex");
    notify("Generated the current role-specific LaTeX source.");
  }
    return (
    <main className="w-full min-w-0 space-y-6 text-white">
      <header className="flex flex-col gap-4 border-b border-zinc-800 pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono-tech text-xs uppercase tracking-[0.22em] text-zinc-500">
            Career workspace / Documents
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Resume Lab
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Build role-specific resumes with tailored summaries, targeted
            skills, selected projects, and ATS-readable document structure.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={downloadPdf}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            <Download size={16} />
            Export PDF
          </button>

          <button
            type="button"
            onClick={downloadWord}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            <FileText size={16} />
            Export Word
          </button>
        </div>
      </header>

      {notice && (
        <div
          role="status"
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-200"
        >
          {notice}
        </div>
      )}

      <nav className="flex flex-wrap gap-2" aria-label="Resume Lab sections">
        {[
          { id: "builder", label: "Resume Builder", icon: FileText },
          { id: "editor", label: "Edit Profile", icon: Edit3 },
          { id: "latex", label: "LaTeX Export", icon: Code },
          { id: "history", label: "Saved Resumes", icon: Eye },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                setActiveTab(
                  tab.id as "builder" | "editor" | "latex" | "history"
                )
              }
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                active
                  ? "border-white bg-white text-black"
                  : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600 hover:text-white"
              }`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {activeTab === "builder" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <h2 className="text-sm font-semibold">Choose a target role</h2>
              <p className="mt-1 text-xs leading-5 text-zinc-500">
                The summary, headline, skills, and project order change with
                the selected role.
              </p>

              <div className="mt-4 space-y-2">
                {candidate.resumeVariants.map((variant) => {
                  const active = selectedVariant === variant;

                  return (
                    <button
                      key={variant}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                      className={`flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-3 text-left text-sm transition ${
                        active
                          ? "border-white bg-white text-black"
                          : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800"
                      }`}
                    >
                      <span>{variant}</span>
                      {active && <Check size={16} />}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="flex items-center gap-2">
                <Award size={17} className="text-zinc-300" />
                <h2 className="text-sm font-semibold">ATS-friendly structure</h2>
              </div>

              <ul className="mt-3 space-y-2 text-xs leading-5 text-zinc-400">
                <li>• Standard section headings</li>
                <li>• Single-column resume content</li>
                <li>• Role-specific keywords and skills</li>
                <li>• Selective, relevant project bullets</li>
                <li>• Text-based PDF and editable Word export</li>
              </ul>

              <p className="mt-3 border-t border-zinc-800 pt-3 text-xs leading-5 text-zinc-500">
                ATS scores vary by employer and job description. Review the
                job requirements and remove any skill you cannot substantiate.
              </p>
            </section>

            <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <h2 className="text-sm font-semibold">Export options</h2>

              <div className="mt-3 grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={downloadPdf}
                  className="flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2.5 text-sm font-semibold text-black hover:bg-zinc-200"
                >
                  <Download size={15} />
                  Download PDF
                </button>

                <button
                  type="button"
                  onClick={downloadWord}
                  className="flex items-center justify-center gap-2 rounded-lg border border-zinc-700 px-3 py-2.5 text-sm font-semibold text-white hover:bg-zinc-900"
                >
                  <FileText size={15} />
                  Download editable Word
                </button>

                <button
                  type="button"
                  onClick={downloadLatex}
                  className="flex items-center justify-center gap-2 rounded-lg border border-zinc-700 px-3 py-2.5 text-sm font-semibold text-white hover:bg-zinc-900"
                >
                  <Code size={15} />
                  Download LaTeX
                </button>
              </div>
            </section>
          </aside>

          <section className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold">Live resume preview</h2>
                <p className="mt-1 text-xs text-zinc-500">
                  {selectedVariant} · A4 portrait · Single column
                </p>
              </div>

              <label className="flex items-center gap-2 text-xs text-zinc-400">
                <input
                  type="checkbox"
                  checked={showPhoto}
                  onChange={(event) => setShowPhoto(event.target.checked)}
                  className="h-4 w-4 accent-white"
                />
                Show photo placeholder
              </label>
            </div>

            <article className="resume-paper">
              <header className="border-b border-zinc-500 pb-3 text-center">
                <h1 className="text-2xl font-bold tracking-tight">
                  {candidate.name}
                </h1>

                <p className="mt-1 text-xs font-bold tracking-wide">
                  {headline}
                </p>

                {showPhoto && (
                  <div className="mx-auto mt-3 flex h-16 w-16 items-center justify-center border border-zinc-400 text-[9px] text-zinc-500">
                    PHOTO
                  </div>
                )}

                
<div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 break-words text-[9pt]">
  <a
    href={`mailto:${candidate.email}`}
    className="text-blue-600 underline underline-offset-2"
  >
    <Mail className="mr-1 inline h-3 w-3" />
    {candidate.email}
  </a>

  <a
    href={`tel:${candidate.phone.replace(/[^\d+]/g, "")}`}
    className="text-blue-600 underline underline-offset-2"
  >
    <Phone className="mr-1 inline h-3 w-3" />
    {candidate.phone}
  </a>

  <a
    href={safeUrl(candidate.linkedin)}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 underline underline-offset-2"
  >
    <Linkedin className="mr-1 inline h-3 w-3" />
    LinkedIn
  </a>

  <a
  href="https://github.com/junaid1142d"
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-600 underline underline-offset-2"
>
  github.com/junaid1142d
</a>
</div>


                <p className="mt-1 text-[8.5pt]">{candidate.location}</p>
              </header>

              <section className="resume-section">
                <h2 className="resume-section-title">Professional Summary</h2>
                <p>{summary}</p>
              </section>

              <section className="resume-section">
                <h2 className="resume-section-title">Education</h2>
                <p className="font-bold">{candidate.college}</p>
                <p className="italic">{candidate.degree}</p>
                <p>Chennai, Tamil Nadu, India</p>
              </section>

              <section className="resume-section">
                <h2 className="resume-section-title">Technical Skills</h2>
                <p>{skills.join(" • ")}</p>
              </section>

              <section className="resume-section">
                <h2 className="resume-section-title">Professional Experience</h2>

                {candidate.experience.map((experience, index) => (
                  <div
                    key={`${experience.company}-${index}`}
                    className="mb-3"
                  >
                    <div className="flex flex-wrap justify-between gap-x-3">
                      <p className="font-bold">
                        {experience.role} | {experience.company}
                      </p>
                      <p className="text-[9pt]">{experience.duration}</p>
                    </div>

                    <p className="italic">{experience.location}</p>

                    <ul className="ml-4 mt-1 list-disc space-y-0.5">
                      {experience.bullets.slice(0, 3).map((bullet, bulletIndex) => (
                        <li key={bulletIndex}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
                            <section className="resume-section">
                <h2 className="resume-section-title">Selected Projects</h2>

                {orderedProjects.slice(0, 3).map((project, index) => (
                  <div key={`${project.name}-${index}`} className="mb-3">
                    <p className="font-bold">{project.name}</p>
                    <p className="text-[8.5pt] italic">
                      {project.tags.join(" | ")}
                    </p>
                    <p>{project.desc}</p>

                    <ul className="ml-4 mt-1 list-disc space-y-0.5">
                      {project.bullets.slice(0, 3).map((bullet, bulletIndex) => (
                        <li key={bulletIndex}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>

              {candidate.organizations.length > 0 && (
                <section className="resume-section">
                  <h2 className="resume-section-title">
                    Leadership and Volunteering
                  </h2>

                  {candidate.organizations.slice(0, 2).map((organization, index) => (
                    <div key={`${organization.name}-${index}`} className="mb-2">
                      <p className="font-bold">
                        {organization.role} | {organization.name}
                      </p>
                      <p className="text-[8.5pt]">{organization.duration}</p>
                      <p>{organization.bullets[0] ?? ""}</p>
                    </div>
                  ))}
                </section>
              )}

              <section className="resume-section">
                <h2 className="resume-section-title">Languages</h2>
                <p>English • Tamil • Urdu • Hindi</p>
              </section>
            </article>

            <p className="mt-3 text-center text-xs leading-5 text-zinc-500">
              The preview is a layout guide. Verify the exported PDF and Word
              document before sending them to an employer.
            </p>
          </section>
        </div>
      )}

      {activeTab === "editor" && (
        <section className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-950 p-4 md:p-6">
          <div>
            <h2 className="text-xl font-semibold">Candidate profile editor</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Edit your details once and reuse them across the resume variants.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {(
              [
                ["name", "Full name"],
                ["degree", "Degree"],
                ["college", "College"],
                ["location", "Location"],
                ["email", "Email"],
                ["phone", "Phone"],
                ["linkedin", "LinkedIn URL"],
                ["github", "GitHub URL"],
              ] as [keyof CandidateProfile, string][]
            ).map(([field, label]) => (
              <label key={field} className="block">
                <span className="mb-1.5 block text-xs font-medium text-zinc-400">
                  {label}
                </span>

                <input
                  type="text"
                  value={String(profileForm[field] ?? "")}
                  onChange={(event) =>
                    updateProfileField(field, event.target.value)
                  }
                  className="w-full rounded-lg border border-zinc-800 bg-black px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
                />
              </label>
            ))}
          </div>

          <div className="border-t border-zinc-800 pt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold">Master skill list</h3>
                <p className="mt-1 text-xs text-zinc-500">
                  Role-specific lists are used in the generated resume.
                  This list is your editable profile inventory.
                </p>
              </div>

              <button
                type="button"
                onClick={addSkill}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-900"
              >
                <Plus size={15} />
                Add skill
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {profileForm.skills.map((skill, index) => (
                <span
                  key={`${skill.name}-${index}`}
                  className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-black px-3 py-2 text-xs text-zinc-300"
                >
                  {skill.name}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    aria-label={`Remove ${skill.name}`}
                    className="text-zinc-500 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-5">
            <h3 className="font-semibold">Experience bullet editor</h3>
            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Keep bullets accurate. Add measurable results only when you can
              support them with real evidence.
            </p>

            <div className="mt-4 space-y-5">
              {profileForm.experience.map((experience, experienceIndex) => (
                <div
                  key={`${experience.company}-${experienceIndex}`}
                  className="rounded-lg border border-zinc-800 bg-black p-4"
                >
                  <h4 className="font-semibold">
                    {experience.role} · {experience.company}
                  </h4>

                  <p className="mt-1 text-xs text-zinc-500">
                    {experience.duration} · {experience.location}
                  </p>

                  <div className="mt-4 space-y-3">
                    {experience.bullets.map((bullet, bulletIndex) => (
                      <label
                        key={`${experience.company}-${bulletIndex}`}
                        className="block"
                      >
                        <span className="mb-1 block text-[11px] text-zinc-500">
                          Bullet {bulletIndex + 1}
                        </span>

                        <textarea
                          rows={2}
                          value={bullet}
                          onChange={(event) =>
                            updateExperienceBullet(
                              experienceIndex,
                              bulletIndex,
                              event.target.value
                            )
                          }
                          className="w-full resize-y rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm leading-5 text-white outline-none focus:border-zinc-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-zinc-800 pt-5">
            <button
              type="button"
              onClick={saveProfile}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-zinc-200"
            >
              <Check size={16} />
              Save profile changes
            </button>

            <button
              type="button"
              onClick={() => {
                setProfileForm({
                  ...CANDIDATE,
                  skills: [...CANDIDATE.skills],
                  projects: [...CANDIDATE.projects],
                  experience: [...CANDIDATE.experience],
                  organizations: [...CANDIDATE.organizations],
                });
                notify("Editor reset to the default profile. Save to apply it.");
              }}
              className="rounded-lg border border-zinc-700 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-900"
            >
              Reset editor
            </button>
          </div>
        </section>
      )}

      {activeTab === "latex" && (
        <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">LaTeX export</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Generate source for Overleaf or a local LaTeX editor.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={saveCurrentVariant}
                className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-900"
              >
                Generate source
              </button>

              <button
                type="button"
                onClick={copyLatex}
                className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-zinc-200"
              >
                Copy source
              </button>

              <button
                type="button"
                onClick={downloadLatex}
                className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-900"
              >
                Download .tex
              </button>
            </div>
          </div>

          <textarea
            value={latexCode}
            onChange={(event) => setLatexCode(event.target.value)}
            placeholder="Click Generate source to create the current role-specific LaTeX resume."
            rows={22}
            spellCheck={false}
            className="mt-5 w-full rounded-lg border border-zinc-800 bg-black p-4 font-mono text-xs leading-5 text-zinc-200 outline-none focus:border-zinc-600"
          />
        </section>
      )}

      {activeTab === "history" && (
        <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 md:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-zinc-800 bg-black p-2">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Saved resumes</h2>
              <p className="mt-1 text-sm text-zinc-500">
                {savedResumes.length} saved item(s) in your local history.
              </p>
            </div>
          </div>

          {savedResumes.length === 0 ? (
            <div className="mt-5 rounded-lg border border-dashed border-zinc-800 px-4 py-10 text-center">
              <p className="font-medium text-zinc-300">No saved resumes yet</p>
              <p className="mt-2 text-sm text-zinc-500">
                Export your resume or use your dashboard's existing save
                workflow to add a saved resume here.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {savedResumes.map((resume) => (
                <div
                  key={resume.id}
                  className="flex flex-col justify-between gap-3 rounded-lg border border-zinc-800 bg-black p-4 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="break-words font-medium text-white">
                      {resume.companyName || "Saved resume"}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Saved resume ID: {resume.id}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Delete this saved resume from your history?"
                        )
                      ) {
                        deleteSavedResume(resume.id);
                        notify("Saved resume deleted.");
                      }
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-400 hover:border-red-900 hover:text-red-300"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
function useMemoProjects(
  projects: CandidateProfile["projects"],
  variant: string
): CandidateProfile["projects"] {
  const priorities: Record<string, string[]> = {
    "General Placement": [
      "SolutionForge AI",
      "Atmospheric Pressure Monitoring Dashboard",
      "CrashSense",
      "Renewable Energy GIS",
    ],
    "Zoho Data Analyst": [
      "Atmospheric Pressure Monitoring Dashboard",
      "Renewable Energy GIS",
      "SolutionForge AI",
      "CrashSense",
    ],
    "Data Analyst": [
      "Atmospheric Pressure Monitoring Dashboard",
      "Renewable Energy GIS",
      "SolutionForge AI",
      "CrashSense",
    ],
    "Data Scientist": [
      "Atmospheric Pressure Monitoring Dashboard",
      "SolutionForge AI",
      "Renewable Energy GIS",
      "CrashSense",
    ],
    "Business Analyst": [
      "Renewable Energy GIS",
      "Atmospheric Pressure Monitoring Dashboard",
      "SolutionForge AI",
      "CrashSense",
    ],
    "Data Engineer": [
      "Atmospheric Pressure Monitoring Dashboard",
      "Renewable Energy GIS",
      "SolutionForge AI",
      "CrashSense",
    ],
    "Software Engineer": [
      "SolutionForge AI",
      "Atmospheric Pressure Monitoring Dashboard",
      "Renewable Energy GIS",
      "CrashSense",
    ],
    "AI/ML Engineer": [
      "SolutionForge AI",
      "Atmospheric Pressure Monitoring Dashboard",
      "CrashSense",
      "Renewable Energy GIS",
    ],
    "IoT/Embedded Engineer": [
      "CrashSense",
      "Atmospheric Pressure Monitoring Dashboard",
      "SolutionForge AI",
      "Renewable Energy GIS",
    ],
  };

  const order = priorities[variant] ?? priorities["General Placement"];

  return [...projects].sort((a, b) => {
    const indexA = order.findIndex((name) =>
      a.name.toLowerCase().includes(name.toLowerCase())
    );
    const indexB = order.findIndex((name) =>
      b.name.toLowerCase().includes(name.toLowerCase())
    );

    const rankA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
    const rankB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;

    return rankA - rankB;
  });
}
