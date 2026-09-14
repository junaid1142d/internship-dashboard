"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  FileText, Edit3, Download, Eye, Award, Check, 
  Trash2, User, Mail, Phone, Link2, Plus, Code, Cpu
} from "lucide-react";
import { Linkedin, Github } from "./ui/icons";
import { CandidateProfile, CANDIDATE } from "../data/candidate";
import { SavedResume } from "../utils/storage";
import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, BorderStyle, VerticalAlign, UnderlineType, ExternalHyperlink } from "docx";
import { jsPDF } from "jspdf";

interface ResumeLabProps {
  candidate: CandidateProfile;
  setCandidate: (profile: CandidateProfile) => void;
  savedResumes: SavedResume[];
  deleteSavedResume: (id: string) => void;
  addSystemLog: (type: "system" | "ai" | "success" | "warning" | "error", message: string) => void;
}

export default function ResumeLab({ 
  candidate, 
  setCandidate, 
  savedResumes, 
  deleteSavedResume, 
  addSystemLog 
}: ResumeLabProps) {
  const [selectedVariant, setSelectedVariant] = useState<string>("Zoho Data Analyst");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<"variant" | "editor" | "latex" | "history">("variant");
  const [isMounted, setIsMounted] = useState(false);
  const [showPhoto, setShowPhoto] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Local edit states
  const [profileForm, setProfileForm] = useState<CandidateProfile>({ ...candidate });

  // Customized Summaries for Junaid based on Resume Variant (Calibrated to real resume facts)
  const summaries: Record<string, string> = {
    "General Placement": "AI & Data Science student with hands-on experience in GIS, geospatial applications, data analytics and full-stack development. During my internship at Trinav SpaceTech, I developed an interactive Renewable Energy GIS platform using React, GeoJSON and OGC standards to support renewable energy planning. Passionate about solving real-world problems through AI, data and geospatial technologies while continuously learning modern software development practices.",
    "Zoho Data Analyst": "AI & Data Science student with hands-on experience in GIS, geospatial applications, data analytics and full-stack development. During my internship at Trinav SpaceTech, I developed an interactive Renewable Energy GIS platform using React, GeoJSON and OGC standards to support renewable energy planning. Passionate about solving real-world problems through AI, data and geospatial technologies while continuously learning modern software development practices.",
    "Data Analyst": "AI & Data Science student with hands-on experience in GIS, geospatial applications, data analytics and full-stack development. During my internship at Trinav SpaceTech, I developed an interactive Renewable Energy GIS platform using React, GeoJSON and OGC standards to support renewable energy planning. Passionate about solving real-world problems through AI, data and geospatial technologies while continuously learning modern software development practices.",
    "Data Scientist": "AI & Data Science student with hands-on experience in GIS, geospatial applications, data analytics and full-stack development. During my internship at Trinav SpaceTech, I developed an interactive Renewable Energy GIS platform using React, GeoJSON and OGC standards to support renewable energy planning. Passionate about solving real-world problems through AI, data and geospatial technologies while continuously learning modern software development practices.",
    "Business Analyst": "AI & Data Science student with hands-on experience in GIS, geospatial applications, data analytics and full-stack development. During my internship at Trinav SpaceTech, I developed an interactive Renewable Energy GIS platform using React, GeoJSON and OGC standards to support renewable energy planning. Passionate about solving real-world problems through AI, data and geospatial technologies while continuously learning modern software development practices.",
    "Data Engineer": "AI & Data Science student with hands-on experience in GIS, geospatial applications, data analytics and full-stack development. During my internship at Trinav SpaceTech, I developed an interactive Renewable Energy GIS platform using React, GeoJSON and OGC standards to support renewable energy planning. Passionate about solving real-world problems through AI, data and geospatial technologies while continuously learning modern software development practices.",
    "Software Engineer": "AI & Data Science student with hands-on experience in GIS, geospatial applications, data analytics and full-stack development. During my internship at Trinav SpaceTech, I developed an interactive Renewable Energy GIS platform using React, GeoJSON and OGC standards to support renewable energy planning. Passionate about solving real-world problems through AI, data and geospatial technologies while continuously learning modern software development practices.",
    "AI/ML Engineer": "AI & Data Science student with hands-on experience in GIS, geospatial applications, data analytics and full-stack development. During my internship at Trinav SpaceTech, I developed an interactive Renewable Energy GIS platform using React, GeoJSON and OGC standards to support renewable energy planning. Passionate about solving real-world problems through AI, data and geospatial technologies while continuously learning modern software development practices.",
    "IoT/Embedded Engineer": "AI & Data Science student with hands-on experience in GIS, geospatial applications, data analytics and full-stack development. During my internship at Trinav SpaceTech, I developed an interactive Renewable Energy GIS platform using React, GeoJSON and OGC standards to support renewable energy planning. Passionate about solving real-world problems through AI, data and geospatial technologies while continuously learning modern software development practices."
  };

  // Calibrate real experience bullets per variant without faking details
  const getExperienceBullets = (company: string, variant: string, defaultBullets: string[]): string[] => {
    if (company === "EinNel Technologies") {
      switch (variant) {
        case "AI/ML Engineer":
        case "Data Scientist":
          return [
            "Gained valuable experience working within the engineering division, applying Python (Pandas, NumPy) and SQL data-cleaning workflows directly to analytical pipelines.",
            "Supported technical teams in preprocessing telemetry datasets, reducing false readings and cleaning structured tables.",
            "Gained hands-on experience in database queries and specialized analytics software, expanding tech stack proficiency.",
            "Prepared statistical charts and analytics dashboards to assist senior engineering staff.",
            "Participated in machine learning baseline discussions and technical workshops to gain production data knowledge.",
            "Utilized data visualization tools to present analytical insights, improving cross-functional understanding of project metrics."
          ];
        case "Zoho Data Analyst":
        case "Data Analyst":
        case "Business Analyst":
        case "Data Engineer":
          return [
            "Gained valuable experience working within the data analytics division, analyzing structured database tables and telemetry logs.",
            "Supported engineering teams in database queries, reducing retrieval runtimes and optimizing query efficiency.",
            "Gained hands-on experience in Python data libraries (Pandas, NumPy) and visualization tools to build dashboard telemetry.",
            "Prepared comprehensive analytical reports and metric dashboards to assist senior decision-makers.",
            "Participated in workshops regarding data modeling, ETL pipelines, and dashboard integration.",
            "Utilized data analytics to present key performance indicators, enhancing stakeholder understanding of project goals."
          ];
        case "Software Engineer":
        case "IoT/Embedded Engineer":
        case "General Placement":
        default:
          return [
            "Gained valuable experience working with the development team, applying structured coding practices and database query optimizations.",
            "Supported staff in writing SQL scripts and data-cleaning pipelines, reducing computational overhead and debugging tasks.",
            "Gained hands-on experience writing clean Python code and working with internal developer environments.",
            "Prepared technical documentations and database schema reports to assist senior software engineers.",
            "Participated in workshops on code version control, software architecture, and API configuration.",
            "Utilized technical communication skills to document application layouts, alignment logic, and system modules."
          ];
      }
    }

    if (company === "Trinav SpaceTech") {
      return [
        "Developed a Renewable Energy GIS platform for Tamil Nadu supporting renewable infrastructure planning.",
        "Built interactive GIS dashboards using React, Leaflet, GeoJSON and OGC standards.",
        "Processed renewable energy datasets and automated Excel-to-GeoJSON conversion for spatial visualization.",
        "Integrated district boundaries, renewable asset layers and future renewable candidate locations into a unified GIS application.",
        "Implemented OGC WMS and WFS services for interoperable geospatial data access.",
        "Developed district-level renewable analytics including capacity, asset distribution and suitability insights.",
        "Improved GIS performance through marker clustering, optimized data loading and efficient rendering.",
        "Collaborated with the R&D team to test, document and deploy a production-ready GIS platform."
      ];
    }

    if (company === "Unschool") {
      switch (variant) {
        case "General Placement":
        case "Zoho Data Analyst":
        case "Data Analyst":
        case "Data Scientist":
        case "Business Analyst":
        case "Data Engineer":
        case "Software Engineer":
        case "AI/ML Engineer":
        case "IoT/Embedded Engineer":
        default:
          return [
            "Achieved highest monthly sales in the regional student cohort, proving startup agility and execution speed.",
            "Represented an e-learning platform offering courses to help students scale skills, understanding startup scaling dynamics.",
            "Maintained client relations and gathered student feedback, improving user onboarding rates by conducting target follow-ups.",
            "Strengthened customer satisfaction through consistent, high-touch communication and prompt relationship management.",
            "Contacted prospective users through email outreach and phone pitches to scale student enrollment.",
            "Collaborated closely with marketing and product leads to coordinate student campaigns and sales funnels.",
            "Supported sales operations, tracking metrics and implementing outreach campaigns in a fast-paced environment."
          ];
      }
    }

    return defaultBullets;
  };

  const generateLatex = (prof: CandidateProfile, variant: string): string => {
    const escapeLatex = (str: string) => {
      if (!str) return "";
      return str
        .replace(/\\/g, "\\\\")
        .replace(/&/g, "\\&")
        .replace(/%/g, "\\%")
        .replace(/\$/g, "\\$")
        .replace(/#/g, "\\#")
        .replace(/_/g, "\\_")
        .replace(/{/g, "\\{")
        .replace(/}/g, "\\}")
        .replace(/~/g, "\\textasciitilde")
        .replace(/\^/g, "\\textasciicircum");
    };

    const cleanBullets = (bullets: string[]) => {
      return bullets
        .map(b => b.trim())
        .filter(b => b.length > 0)
        .map(b => `  \\item ${escapeLatex(b)}`)
        .join("\n");
    };

    const skillsString = prof.skills.map(s => escapeLatex(s.name)).join(" $\\bullet$ ");
    const linkedinUrl = prof.linkedin.startsWith("http") ? prof.linkedin : `https://${prof.linkedin}`;
    const githubUrl = prof.github
      ? (prof.github.startsWith("http") ? prof.github : `https://${prof.github}`)
      : "https://github.com/junaid1142d";

    const experienceBlock = prof.experience.map(exp => {
      const bullets = getExperienceBullets(exp.company, variant, exp.bullets);
      return `
\\noindent
\\textbf{${escapeLatex(exp.company)}} \\hfill ${escapeLatex(exp.location)} \\\\
\\textit{${escapeLatex(exp.role)}} \\hfill ${escapeLatex(exp.duration)}
\\begin{itemize}[noitemsep,topsep=2pt,parsep=0pt,partopsep=0pt,leftmargin=12pt]
${cleanBullets(bullets)}
\\end{itemize}
\\vspace{4pt}`;
    }).join("");

    const projectsBlock = prof.projects.map(proj => {
      return `
\\noindent
\\textbf{${escapeLatex(proj.name)}} $|$ \\textit{${escapeLatex(proj.tags.join(", "))}}
\\begin{itemize}[noitemsep,topsep=2pt,parsep=0pt,partopsep=0pt,leftmargin=12pt]
${cleanBullets(proj.bullets)}
\\end{itemize}
\\vspace{4pt}`;
    }).join("");

    const orgBlock = prof.organizations.map(org => {
      return `
\\noindent
\\textbf{${escapeLatex(org.role)}} $|$ \\textit{${escapeLatex(org.name)}} \\hfill ${escapeLatex(org.duration)}
\\begin{itemize}[noitemsep,topsep=2pt,parsep=0pt,partopsep=0pt,leftmargin=12pt]
${cleanBullets(org.bullets)}
\\end{itemize}
\\vspace{4pt}`;
    }).join("");

    return `% =========================================================================
% Junaid Ahmed M - ATS-Optimized Professional Resume
% Dynamically Compiled via Resume Lab (Variant: ${variant})
% =========================================================================

\\documentclass[10pt,letterpaper]{article}
\\usepackage[left=0.50in,right=0.50in,top=0.40in,bottom=0.40in]{geometry}
\\usepackage[utf8]{inputenc}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{xcolor}

\\pagestyle{empty}
\\urlstyle{same}

% Section formatting
\\titleformat{\\section}{\\large\\bfseries\\uppercase}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{6pt}{4pt}

\\begin{document}

% Header
% -------------------------------------------------------------------------
% OVERLEAF PHOTO SETUP INSTRUCTIONS:
% If your college requires a profile photo, upload your photo (e.g. photo.png) 
% to your Overleaf project root, and replace this Header block with this layout:
%
% \\usepackage{graphicx} % Add this in the preamble
%
% \\noindent
% \\begin{minipage}[t]{0.82\\textwidth}
%   {\\Huge \\textbf{${escapeLatex(prof.name)}}} \\\\ \\vspace{3pt}
%   \\small \\href{mailto:${escapeLatex(prof.email)}}{${escapeLatex(prof.email)}} $|$ ${escapeLatex(prof.phone)} $|$ \\href{${escapeLatex(linkedinUrl)}}{Junaid Ahmed} $|$ \\href{${escapeLatex(githubUrl)}}{GitHub}
% \\end{minipage}
% \\begin{minipage}[t]{0.16\\textwidth}
%   \\hfill\\includegraphics[width=1.8cm,height=2.2cm,keepaspectratio]{photo.png}
% \\end{minipage}
% -------------------------------------------------------------------------
\\begin{center}
    {\Huge \\textbf{${escapeLatex(prof.name)}}} \\\\ \\vspace{3pt}
    \\small \\href{mailto:${escapeLatex(prof.email)}}{${escapeLatex(prof.email)}} $|$ ${escapeLatex(prof.phone)} $|$ \\href{${escapeLatex(linkedinUrl)}}{Junaid Ahmed} $|$ \\href{${escapeLatex(githubUrl)}}{GitHub}
\\end{center}

\\vspace{-12pt}

% Professional Summary
\\section{Professional Summary}
\\noindent
\\small ${escapeLatex(summaries[variant] || summaries["General Placement"])}

\\vspace{4pt}

% Education
\\section{Education}
\\noindent
\\textbf{${escapeLatex(prof.college)}} \\hfill ${escapeLatex(prof.location.split(",")[0])}, India \\\\
\\textit{${escapeLatex(prof.degree)}} \\hfill 2022 -- 2026

\\vspace{4pt}

% Experience
\\section{Professional Experience}
${experienceBlock}

% Projects
\\section{Projects Focus}
${projectsBlock}

% Organizations \\& Activities
\\section{Organizations \\& Activities}
${orgBlock}

% Skills
\\section{Technical Skills}
\\noindent
\\small ${skillsString}

\\vspace{4pt}

% Languages
\\section{Languages}
\\noindent
\\small English $\\bullet$ Tamil $\\bullet$ Urdu $\\bullet$ Hindi

\\end{document}
`;
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCandidate(profileForm);
    setEditMode(false);
    addSystemLog("success", "Candidate Master Profile data updated in local memory.");
  };

    const downloadPdfDocument = (prof: CandidateProfile, variant: string) => {
    try {
      addSystemLog("system", `Generating hyperlinked PDF: ${variant}`);

      const linkedinUrl = prof.linkedin.startsWith("http") ? prof.linkedin : `https://${prof.linkedin}`;
      const githubUrl = prof.github
        ? (prof.github.startsWith("http") ? prof.github : `https://${prof.github}`)
        : "";

      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const marginX = 14;
      const contentWidth = pageWidth - marginX * 2;
      let y = 16;

      const ensureSpace = (needed: number) => {
        if (y + needed > pageHeight - 12) {
          doc.addPage();
          y = 16;
        }
      };

      const renderCenteredLine = (
        segments: { text: string; url?: string }[],
        fontSize: number,
        bold = false
      ) => {
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", bold ? "bold" : "normal");
        const totalWidth = segments.reduce((w, s) => w + doc.getTextWidth(s.text), 0);
        let x = (pageWidth - totalWidth) / 2;
        segments.forEach(seg => {
          const w = doc.getTextWidth(seg.text);
          if (seg.url) {
            doc.setTextColor(11, 87, 208);
            doc.textWithLink(seg.text, x, y, { url: seg.url });
            doc.setTextColor(0, 0, 0);
          } else {
            doc.text(seg.text, x, y);
          }
          x += w;
        });
        y += fontSize * 0.5;
      };

      const sectionHeader = (title: string) => {
        ensureSpace(10);
        y += 3;
        doc.setFontSize(10.5);
        doc.setFont("helvetica", "bold");
        doc.text(title.toUpperCase(), marginX, y);
        y += 1.2;
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.line(marginX, y, pageWidth - marginX, y);
        y += 4.5;
      };

      const bodyText = (text: string, fontSize = 9, italic = false) => {
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", italic ? "italic" : "normal");
        const lines = doc.splitTextToSize(text, contentWidth);
        lines.forEach((line: string) => {
          ensureSpace(fontSize * 0.5);
          doc.text(line, marginX, y);
          y += fontSize * 0.45;
        });
      };

      const bulletList = (items: string[]) => {
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "normal");
        items.forEach(item => {
          const lines = doc.splitTextToSize(`• ${item}`, contentWidth - 4);
          lines.forEach((line: string, idx: number) => {
            ensureSpace(4);
            doc.text(line, marginX + (idx === 0 ? 2 : 4), y);
            y += 3.9;
          });
        });
      };

      const rowLine = (left: string, right: string, boldLeft = true, fontSize = 9.5) => {
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", boldLeft ? "bold" : "normal");
        doc.text(left, marginX, y);
        doc.setFont("helvetica", "italic");
        const rw = doc.getTextWidth(right);
        doc.text(right, pageWidth - marginX - rw, y);
        y += 4.3;
      };

      renderCenteredLine([{ text: prof.name }], 17, true);
      y += 1;
      renderCenteredLine([{ text: prof.degree }], 9.5, false);
      y += 1.5;

      const contactSegments: { text: string; url?: string }[] = [
        { text: "Email: " },
        { text: prof.email, url: `mailto:${prof.email}` },
        { text: "   |   Phone: " + prof.phone + "   |   LinkedIn: " },
        { text: prof.name, url: linkedinUrl },
      ];
      if (githubUrl) {
        contactSegments.push({ text: "   |   GitHub: " });
        contactSegments.push({ text: prof.github, url: githubUrl });
      }
      renderCenteredLine(contactSegments, 8.5, false);

      y += 2;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(marginX, y, pageWidth - marginX, y);
      y += 5;

      sectionHeader("Professional Summary");
      bodyText(summaries[variant] || summaries["General Placement"], 9);
      y += 1;

      sectionHeader("Education");
      rowLine(prof.college, "Chennai, India");
      bodyText(prof.degree, 8.8, true);
      y += 1;

      sectionHeader("Professional Experience");
      prof.experience.forEach(exp => {
        ensureSpace(10);
        rowLine(`${exp.role}  —  ${exp.company}`, exp.duration);
        bulletList(getExperienceBullets(exp.company, variant, exp.bullets));
        y += 1.5;
      });

      if (prof.projects && prof.projects.length > 0) {
        sectionHeader("Key Engineering Projects");
        prof.projects.forEach(project => {
          ensureSpace(10);
          rowLine(project.name, project.tags.join(", "));
          bodyText(project.desc, 8.5, true);
          bulletList(project.bullets);
          y += 1.5;
        });
      }

      if (prof.organizations && prof.organizations.length > 0) {
        sectionHeader("Organizations & Activities");
        prof.organizations.forEach(org => {
          ensureSpace(10);
          rowLine(`${org.role}  —  ${org.name}`, org.duration);
          bulletList(org.bullets);
          y += 1.5;
        });
      }

      sectionHeader("Technical Skills");
      bodyText(prof.skills.map(s => s.name).join("   •   "), 8.5);
      y += 1;

      sectionHeader("Languages");
      bodyText("English   •   Tamil   •   Urdu   •   Hindi", 8.5);

      doc.save(`Junaid_Ahmed_${variant.replace(/\s+/g, "_")}_Resume.pdf`);
      addSystemLog("success", `PDF exported with live hyperlinks: ${variant} Resume`);
    } catch (error) {
      addSystemLog("error", `Failed to generate PDF: ${error}`);
    }
  };

  const downloadWordDocument = async (prof: CandidateProfile, variant: string) => {
    try {
      addSystemLog("system", `Generating Word document: ${variant}`);
      
      const linkedinUrl = prof.linkedin.startsWith("http") ? prof.linkedin : `https://${prof.linkedin}`;
      const githubUrl = prof.github
        ? (prof.github.startsWith("http") ? prof.github : `https://${prof.github}`)
        : "https://github.com/junaid1142d";

      // Helper to create section headers with underline
      const createSectionHeader = (title: string) => 
        new Paragraph({
          children: [
            new TextRun({
              text: title,
              bold: true,
              size: 22,
            }),
          ],
          spacing: { before: 200, after: 100 },
          border: {
            bottom: {
              color: "000000",
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        });

      // Header section
      const headerParagraphs = [
        new Paragraph({
          children: [
            new TextRun({
              text: prof.name,
              bold: true,
              size: 28,
            }),
          ],
          alignment: "center",
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: prof.degree,
              italics: true,
              size: 20,
            }),
          ],
          alignment: "center",
          spacing: { after: 150 },
        }),
        new Paragraph({
          children: [
            new ExternalHyperlink({
              children: [
                new TextRun({
                  text: prof.email,
                  color: "0B57D0",
                  underline: {},
                  size: 18,
                }),
              ],
              link: `mailto:${prof.email}`,
            }),
            new TextRun({
              text: "  |  ",
              size: 18,
            }),
            new TextRun({
              text: `${prof.phone}  |  `,
              size: 18,
            }),
            new ExternalHyperlink({
              children: [
                new TextRun({
                  text: "Junaid Ahmed",
                  color: "0B57D0",
                  underline: {},
                  size: 18,
                }),
              ],
              link: linkedinUrl,
            }),
            ...(prof.github ? [
              new TextRun({
                text: "  |  ",
                size: 18,
              }),
              new ExternalHyperlink({
                children: [
                  new TextRun({
                    text: "GitHub",
                    color: "0B57D0",
                    underline: {},
                    size: 18,
                  }),
                ],
                link: githubUrl,
              }),
            ] : []),
          ],
          alignment: "center",
          spacing: { after: 300 },
        }),
      ];

      // Professional Summary
      const summaryParagraphs = [
        createSectionHeader("PROFESSIONAL SUMMARY"),
        new Paragraph({
          children: [
            new TextRun({
              text: summaries[variant] || summaries["General Placement"],
              size: 20,
            }),
          ],
          alignment: "both",
          spacing: { after: 300 },
        }),
      ];

      // Education
      const educationParagraphs = [
        createSectionHeader("EDUCATION"),
        new Paragraph({
          children: [
            new TextRun({
              text: prof.college,
              bold: true,
              size: 20,
            }),
            new TextRun({
              text: ` — ${prof.degree}`,
              size: 20,
            }),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Chennai, India | 2022 – 2026",
              size: 20,
            }),
          ],
          spacing: { after: 300 },
        }),
      ];

      // Professional Experience
      const experienceParagraphs: Paragraph[] = [createSectionHeader("PROFESSIONAL EXPERIENCE")];

      prof.experience.forEach((exp) => {
        const bullets = getExperienceBullets(exp.company, variant, exp.bullets);
        experienceParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.role,
                bold: true,
                size: 20,
              }),
              new TextRun({
                text: ` at ${exp.company}`,
                size: 20,
              }),
            ],
            spacing: { before: 100, after: 50 },
          })
        );
        experienceParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.duration,
                italics: true,
                size: 18,
              }),
            ],
            spacing: { after: 100 },
          })
        );
        bullets.forEach((bullet) => {
          experienceParagraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: bullet,
                  size: 20,
                }),
              ],
              spacing: { after: 50 },
              bullet: {
                level: 0,
              },
            })
          );
        });
        experienceParagraphs.push(
          new Paragraph({
            children: [new TextRun("")],
            spacing: { after: 100 },
          })
        );
      });

      // Projects
      const projectsParagraphs: Paragraph[] = [];
      if (prof.projects && prof.projects.length > 0) {
        projectsParagraphs.push(createSectionHeader("PROJECTS FOCUS"));

        prof.projects.forEach((proj) => {
          projectsParagraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: proj.name,
                  bold: true,
                  size: 20,
                }),
                new TextRun({
                  text: ` | ${proj.tags.join(", ")}`,
                  italics: true,
                  size: 20,
                }),
              ],
              spacing: { before: 100, after: 50 },
            })
          );
          projectsParagraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: proj.desc,
                  size: 20,
                }),
              ],
              spacing: { after: 100 },
            })
          );
          proj.bullets.forEach((bullet) => {
            projectsParagraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: bullet,
                    size: 20,
                  }),
                ],
                spacing: { after: 50 },
                bullet: {
                  level: 0,
                },
              })
            );
          });
          projectsParagraphs.push(
            new Paragraph({
              children: [new TextRun("")],
              spacing: { after: 100 },
            })
          );
        });
      }

      // Organizations
      const orgParagraphs: Paragraph[] = [];
      if (prof.organizations && prof.organizations.length > 0) {
        orgParagraphs.push(createSectionHeader("ORGANIZATIONS & ACTIVITIES"));

        prof.organizations.forEach((org) => {
          orgParagraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: org.role,
                  bold: true,
                  size: 20,
                }),
                new TextRun({
                  text: ` — ${org.name}`,
                  size: 20,
                }),
              ],
              spacing: { before: 100, after: 50 },
            })
          );
          orgParagraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: org.duration,
                  italics: true,
                  size: 18,
                }),
              ],
              spacing: { after: 100 },
            })
          );
          org.bullets.forEach((bullet) => {
            orgParagraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: bullet,
                    size: 20,
                  }),
                ],
                spacing: { after: 50 },
                bullet: {
                  level: 0,
                },
              })
            );
          });
          orgParagraphs.push(
            new Paragraph({
              children: [new TextRun("")],
              spacing: { after: 100 },
            })
          );
        });
      }

      // Skills
      const skillsParagraphs = [
        createSectionHeader("TECHNICAL SKILLS"),
        new Paragraph({
          children: [
            new TextRun({
              text: prof.skills.map((s) => s.name).join(" • "),
              size: 20,
            }),
          ],
          spacing: { after: 300 },
        }),
      ];

      // Languages
      const languagesParagraphs = [
        createSectionHeader("LANGUAGES"),
        new Paragraph({
          children: [
            new TextRun({
              text: "English • Tamil • Urdu • Hindi",
              size: 20,
            }),
          ],
          spacing: { after: 300 },
        }),
      ];

      // Combine all sections
      const doc = new Document({
        sections: [
          {
            children: [
              ...headerParagraphs,
              ...summaryParagraphs,
              ...educationParagraphs,
              ...experienceParagraphs,
              ...projectsParagraphs,
              ...orgParagraphs,
              ...skillsParagraphs,
              ...languagesParagraphs,
            ],
          },
        ],
      });

      // Generate and download
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Junaid_Ahmed_${variant.replace(/\s+/g, "_")}_Resume.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      addSystemLog("success", `Word document exported: ${variant} Resume`);
    } catch (error) {
      addSystemLog("error", `Failed to generate Word document: ${error}`);
    }
  };

  const linkedinUrl = candidate.linkedin.startsWith("http") ? candidate.linkedin : `https://${candidate.linkedin}`;
  const githubUrl = candidate.github
    ? (candidate.github.startsWith("http") ? candidate.github : `https://${candidate.github}`)
    : "https://github.com/junaid1142d";

  return (
    <div className="space-y-6 slide-in">
      
      {/* ── SECTION HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/40 pb-5 no-print">
        <div>
          <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">RESUME INTELLIGENCE</span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent mt-0.5 font-mono">
            Resume Lab
          </h1>
        </div>
        
        {/* Navigation Tabs inside page */}
        <div className="flex gap-1.5 p-1 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
          {[
            { id: "variant", label: "AI Variants", icon: Cpu },
            { id: "editor", label: "Master Editor", icon: Edit3 },
            { id: "latex", label: "LaTeX Exporter", icon: Code },
            { id: "history", label: "Saved ATS Resumes", icon: FileText }
          ].map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveSubTab(t.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeSubTab === t.id 
                    ? "bg-zinc-800 text-white border border-zinc-700" 
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SUB-TAB: AI RESUME VARIANTS
      ══════════════════════════════════════════════════ */}
      {activeSubTab === "variant" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start no-print">
          
          {/* Left panel: variant selector */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-panel p-5 rounded-2xl border-zinc-800/80">
              <h3 className="text-xs font-mono font-bold tracking-wider text-zinc-300 mb-3 uppercase">SELECT VARIANT</h3>
              <p className="text-[11px] text-zinc-500 mb-4 leading-relaxed font-sans">
                Choose a preloaded template variation. The summary, skills accent, and CrashSense project bullet points will align to match.
              </p>
              
              <div className="space-y-1.5">
                {candidate.resumeVariants.map(variant => (
                  <button
                    key={variant}
                    onClick={() => setSelectedVariant(variant)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-semibold transition-all ${
                      selectedVariant === variant
                        ? "bg-white/10 border-white/20 text-white"
                        : "border-zinc-800/40 hover:border-zinc-800 hover:bg-zinc-900/30 text-zinc-400"
                    }`}
                  >
                    <span>{variant} Resume</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Print trigger card */}
            <div className="glass-panel p-5 rounded-2xl border border-zinc-800 bg-zinc-900/10 space-y-4">
              <h4 className="text-xs font-semibold text-zinc-300 font-mono-tech flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>ATS COMPATIBLE EXPORTS</span>
              </h4>
              <p className="text-[10px] text-zinc-500 leading-normal font-sans">
                Export your resume in multiple formats: PDF (print-optimized), Word (fully editable), or LaTeX (Overleaf-ready). All formats preserve professional ATS-aligned formatting.
              </p>
              
              <div className="flex items-center gap-2 py-1 border-t border-b border-zinc-800/40 my-2">
                <input
                  type="checkbox"
                  id="show-photo-checkbox"
                  checked={showPhoto}
                  onChange={(e) => setShowPhoto(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-sky-500 focus:ring-sky-500/40 w-3.5 h-3.5 cursor-pointer"
                />
                <label htmlFor="show-photo-checkbox" className="text-xs font-semibold text-zinc-300 cursor-pointer font-mono select-none">
                  Show Placement Photo
                </label>
              </div>

              <div className="space-y-2">
                <button
                  onClick= {() => downloadPdfDocument(candidate, selectedVariant)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-colors shadow-lg cursor-pointer font-mono"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Print PDF</span>
                </button>
                <button
                  onClick={() => downloadWordDocument(candidate, selectedVariant)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-lg cursor-pointer font-mono"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Word (Editable)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right panel: Live Resume A4 Preview */}
          <div className="lg:col-span-8">
            <div className="mb-2.5 flex justify-between items-center px-2">
              <span className="text-[10px] text-zinc-500 font-mono">LIVE PREVIEW (A4 PRINT FIT)</span>
              <span className="text-[10px] text-zinc-300 font-mono uppercase bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded">
                Active variant: {selectedVariant}
              </span>
            </div>

            {/* The interactive web container preview */}
            <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden p-6 md:p-12 shadow-2xl relative">
              <div className="text-slate-800 absolute top-4 right-4 pointer-events-none select-none font-mono text-[10px]">
                A4 CONTAINER PREVIEW
              </div>
              
              {/* Document Header */}
              <div className={`flex flex-row justify-between items-start border-b border-zinc-800 pb-5 gap-4 ${showPhoto ? "text-left" : "text-center w-full"}`}>
                <div className={`flex-1 ${showPhoto ? "text-left" : "text-center"}`}>
                  <h2 className="text-2xl font-bold font-sans tracking-wide text-white">{candidate.name}</h2>
                  <p className="text-xs text-zinc-400 mt-1 font-mono">{candidate.degree}</p>
                  <div className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-zinc-400 mt-3 font-mono ${showPhoto ? "justify-start" : "justify-center"}`}>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-zinc-500" /> 
                      <a href={`mailto:${candidate.email}`} className="text-[#0b57d0] underline hover:text-[#0a46a8] transition-colors">{candidate.email}</a>
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-zinc-500" /> 
                      <a href={`tel:${candidate.phone}`} className="hover:text-white transition-colors">{candidate.phone}</a>
                    </span>
                    <span className="flex items-center gap-1">
                      <Linkedin className="w-3.5 h-3.5 text-zinc-500" /> 
                      <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-[#0b57d0] underline hover:text-[#0a46a8] transition-colors">Junaid Ahmed</a>
                    </span>
                    {candidate.github && (
                      <span className="flex items-center gap-1">
                        <Github className="w-3.5 h-3.5 text-zinc-500" /> 
                        <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-[#0b57d0] underline hover:text-[#0a46a8] transition-colors">GitHub</a>
                      </span>
                    )}
                  </div>
                </div>
                {showPhoto && (
                  <div className="flex-shrink-0">
                    <img 
                      src="/photo.png" 
                      alt="Junaid Ahmed" 
                      className="w-[75px] h-[90px] object-cover rounded-md border border-slate-700 bg-slate-900 shadow-md"
                    />
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="mt-5 space-y-1.5">
                <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">Professional Summary</h3>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">{summaries[selectedVariant]}</p>
              </div>

              {/* Education */}
              <div className="mt-5 space-y-2">
                <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider border-b border-zinc-850 pb-1">Education</h3>
                <div className="flex justify-between items-start text-xs">
                  <div>
                    <span className="font-bold text-zinc-200">{candidate.college}</span>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{candidate.degree}</p>
                  </div>
                  <span className="text-zinc-400 font-mono text-[11px]">Chennai, India</span>
                </div>
              </div>

              {/* Experience */}
              <div className="mt-5 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider border-b border-zinc-850 pb-1">Professional Experience</h3>
                {candidate.experience.map((exp, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <div>
                        <span className="font-bold text-zinc-200">{exp.role}</span>
                        <span className="text-zinc-400 font-mono text-[11px]"> @ {exp.company}</span>
                      </div>
                      <span className="text-zinc-400 font-mono text-[11px]">{exp.duration}</span>
                    </div>
                    <ul className="list-disc list-outside ml-4 text-[11px] text-zinc-300 space-y-1">
                      {getExperienceBullets(exp.company, selectedVariant, exp.bullets).map((bullet, idx) => (
                        <li key={idx} className="leading-relaxed">{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Projects (if present) */}
              {candidate.projects && candidate.projects.length > 0 && (
                <div className="mt-5 space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider border-b border-zinc-850 pb-1">Projects Focus</h3>
                  {candidate.projects.map((project, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-200">{project.name}</span>
                        <div className="flex gap-1.5">
                          {project.tags.map(t => (
                            <span key={t} className="text-[9px] font-mono text-zinc-400 uppercase border border-zinc-800 px-1.5 rounded">{t}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">{project.desc}</p>
                      <ul className="list-disc list-outside ml-4 text-[11px] text-zinc-300 space-y-1">
                        {project.bullets.map((bullet, idx) => (
                          <li key={idx} className="leading-relaxed">{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Organizations & Activities */}
              {candidate.organizations && candidate.organizations.length > 0 && (
                <div className="mt-5 space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider border-b border-zinc-850 pb-1">Organizations & Activities</h3>
                  {candidate.organizations.map((org, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <div>
                          <span className="font-bold text-zinc-200">{org.role}</span>
                          <span className="text-zinc-400 font-mono text-[11px]"> - {org.name}</span>
                        </div>
                        <span className="text-zinc-400 font-mono text-[11px]">{org.duration}</span>
                      </div>
                      <ul className="list-disc list-outside ml-4 text-[11px] text-zinc-300 space-y-1">
                        {org.bullets.map((bullet, idx) => (
                          <li key={idx} className="leading-relaxed">{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              <div className="mt-5 space-y-2">
                <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider border-b border-zinc-850 pb-1">Technical Skills</h3>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-zinc-300 font-mono">
                  {candidate.skills.map((skill, idx) => (
                    <span key={idx} className="flex items-center gap-1.5">
                      <span className="text-zinc-500 text-xs">◈</span>
                      <span>{skill.name}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="mt-5 space-y-2">
                <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider border-b border-zinc-850 pb-1">Languages</h3>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-zinc-300 font-mono">
                  {["English", "Tamil", "Urdu", "Hindi"].map((lang, idx) => (
                    <span key={idx} className="flex items-center gap-1.5">
                      <span className="text-zinc-500 text-xs">◈</span>
                      <span>{lang}</span>
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* ── HIDDEN ABSOLUTE PRINT VIEW (For A4 window.print) ── */}
            {isMounted && typeof document !== "undefined" && createPortal(
              <div id="resume-print-container">
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "flex-start", 
                  borderBottom: "1.5px solid #000000", 
                  paddingBottom: "6px", 
                  marginBottom: "8px", 
                  color: "#000000" 
                }}>
                  <div style={{ flex: 1, textAlign: showPhoto ? "left" : "center" }}>
                    <h1 style={{ fontSize: "18pt", fontWeight: "bold", margin: "0 0 1px", color: "#000000", fontFamily: "sans-serif" }}>{candidate.name}</h1>
                    <p style={{ fontSize: "10pt", margin: "2px 0 0", fontStyle: "italic", color: "#000000", fontFamily: "sans-serif" }}>{candidate.degree}</p>
                    <div style={{ 
                      display: "flex", 
                      justifyContent: showPhoto ? "flex-start" : "center", 
                      gap: "16px", 
                      fontSize: "8.5pt", 
                      marginTop: "4px", 
                      fontFamily: "sans-serif", 
                      color: "#000000" 
                    }}>
                      <span>Email: <a href={`mailto:${candidate.email}`} style={{ textDecoration: "underline", color: "#0b57d0" }}>{candidate.email}</a></span>
                      <span>Phone: <span style={{ color: "#000000" }}>{candidate.phone}</span></span>
                      <span>LinkedIn: <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", color: "#0b57d0" }}>Junaid Ahmed</a></span>
                      {candidate.github && <span>GitHub: <a href={githubUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", color: "#0b57d0" }}>GitHub</a></span>}
                    </div>
                  </div>
                  {showPhoto && (
                    <div style={{ marginLeft: "16px", flexShrink: 0 }}>
                      <img 
                        src="/photo.png" 
                        alt="Junaid Ahmed M" 
                        style={{ 
                          width: "70px", 
                          height: "85px", 
                          objectFit: "cover", 
                          border: "1px solid #000000",
                          borderRadius: "4px"
                        }} 
                      />
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: "8px", color: "#000000" }}>
                  <h3 style={{ fontSize: "10pt", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #000000", paddingBottom: "2px", margin: "0 0 4px" }}>
                    Professional Summary
                  </h3>
                  <p style={{ fontSize: "8.8pt", margin: "0", textAlign: "justify", lineHeight: "1.3", color: "#000000" }}>{summaries[selectedVariant]}</p>
                </div>

                <div style={{ marginBottom: "8px", color: "#000000" }}>
                  <h3 style={{ fontSize: "10pt", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #000000", paddingBottom: "2px", margin: "0 0 4px" }}>
                    Education
                  </h3>
                  <div style={{ display: "flex", justifyContent: "between", fontSize: "8.8pt" }}>
                    <div style={{ flex: 1 }}>
                      <strong>{candidate.college}</strong>
                      <div style={{ fontSize: "8.2pt", marginTop: "1px" }}>{candidate.degree}</div>
                    </div>
                    <div style={{ textAlign: "right", fontStyle: "italic" }}>Chennai, India</div>
                  </div>
                </div>

                <div style={{ marginBottom: "8px", color: "#000000" }}>
                  <h3 style={{ fontSize: "10pt", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #000000", paddingBottom: "2px", margin: "0 0 4px" }}>
                    Professional Experience
                  </h3>
                  {candidate.experience.map((exp, i) => (
                    <div key={i} className="print-no-break" style={{ marginBottom: "5px" }}>
                      <div style={{ display: "flex", justifyContent: "between", fontSize: "8.8pt", fontWeight: "bold" }}>
                        <div style={{ flex: 1 }}>{exp.role} <span style={{ fontWeight: "normal", fontStyle: "italic" }}>at {exp.company}</span></div>
                        <div style={{ textAlign: "right", fontStyle: "italic", fontWeight: "normal" }}>{exp.duration}</div>
                      </div>
                      <ul className="print-bullet-list" style={{ fontSize: "8.2pt", margin: "2px 0 0", paddingLeft: "12px", lineHeight: "1.25" }}>
                        {getExperienceBullets(exp.company, selectedVariant, exp.bullets).map((bullet, idx) => (
                          <li key={idx} style={{ marginBottom: "1.5px" }}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Projects (Print View) */}
                {candidate.projects && candidate.projects.length > 0 && (
                  <div style={{ marginBottom: "8px", color: "#000000" }}>
                    <h3 style={{ fontSize: "10pt", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #000000", paddingBottom: "2px", margin: "0 0 4px" }}>
                      Key Engineering Projects
                    </h3>
                    {candidate.projects.map((project, i) => (
                      <div key={i} className="print-no-break" style={{ marginBottom: "5px" }}>
                        <div style={{ display: "flex", justifyContent: "between", fontSize: "8.8pt", fontWeight: "bold" }}>
                          <div style={{ flex: 1 }}>{project.name}</div>
                          <div style={{ textAlign: "right", fontWeight: "normal", fontStyle: "italic", fontSize: "8.2pt" }}>
                            Tags: {project.tags.join(", ")}
                          </div>
                        </div>
                        <p style={{ fontSize: "8.2pt", margin: "1px 0 2px", fontStyle: "italic", color: "#374151" }}>{project.desc}</p>
                        <ul className="print-bullet-list" style={{ fontSize: "8.2pt", margin: "0", paddingLeft: "12px", lineHeight: "1.25" }}>
                          {project.bullets.map((bullet, idx) => (
                            <li key={idx} style={{ marginBottom: "1.5px" }}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Organizations & Activities (Print View) */}
                {candidate.organizations && candidate.organizations.length > 0 && (
                  <div style={{ marginBottom: "8px", color: "#000000" }}>
                    <h3 style={{ fontSize: "10pt", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #000000", paddingBottom: "2px", margin: "0 0 4px" }}>
                      Organizations & Activities
                    </h3>
                    {candidate.organizations.map((org, i) => (
                      <div key={i} className="print-no-break" style={{ marginBottom: "5px" }}>
                        <div style={{ display: "flex", justifyContent: "between", fontSize: "8.8pt", fontWeight: "bold" }}>
                          <div style={{ flex: 1 }}>{org.role} <span style={{ fontWeight: "normal", fontStyle: "italic" }}>- {org.name}</span></div>
                          <div style={{ textAlign: "right", fontStyle: "italic", fontWeight: "normal" }}>{org.duration}</div>
                        </div>
                        <ul className="print-bullet-list" style={{ fontSize: "8.2pt", margin: "2px 0 0", paddingLeft: "12px", lineHeight: "1.25" }}>
                          {org.bullets.map((bullet, idx) => (
                            <li key={idx} style={{ marginBottom: "1.5px" }}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginBottom: "8px", color: "#000000" }}>
                  <h3 style={{ fontSize: "10pt", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #000000", paddingBottom: "2px", margin: "0 0 4px" }}>
                    Technical Skills & Competencies
                  </h3>
                  <p style={{ fontSize: "8.2pt", margin: "0", fontFamily: "sans-serif", lineHeight: "1.3" }}>
                    {candidate.skills.map(s => s.name).join("  •  ")}
                  </p>
                </div>

                <div style={{ color: "#000000" }}>
                  <h3 style={{ fontSize: "10pt", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #000000", paddingBottom: "2px", margin: "0 0 4px" }}>
                    Languages
                  </h3>
                  <p style={{ fontSize: "8.2pt", margin: "0", fontFamily: "sans-serif", lineHeight: "1.3" }}>
                    English  •  Tamil  •  Urdu  •  Hindi
                  </p>
                </div>
              </div>,
              document.body
            )}

          </div>

        </div>
      )}

      {/* ══════════════════════════════════════════════════
          SUB-TAB: MASTER EDIT PANEL
      ══════════════════════════════════════════════════ */}
      {activeSubTab === "editor" && (
        <div className="glass-panel p-6 rounded-2xl max-w-4xl mx-auto">
          <div className="mb-4 border-b border-slate-800 pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm font-mono-tech text-sky-400 uppercase">PROFILE BUILDER CONSOLE</h3>
              <p className="text-xs text-slate-500 mt-0.5">Edit core skills, experiences, and academic links</p>
            </div>
            <button
              onClick={() => setProfileForm({ ...candidate })}
              className="px-3 py-1 border border-slate-800 rounded bg-slate-900/60 hover:bg-slate-850 hover:text-slate-200 text-[10px] text-slate-400 font-mono transition-colors"
            >
              Reset to Saved
            </button>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-6">
            
            {/* Identity Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono text-slate-500 mb-1">CANDIDATE FULL NAME</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full bg-slate-900/40 border border-slate-800/80 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-sky-500/50"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 mb-1">COLLEGE / INSTITUTE</label>
                <input
                  type="text"
                  value={profileForm.college}
                  onChange={setProfileForm ? e => setProfileForm({ ...profileForm, college: e.target.value }) : undefined}
                  className="w-full bg-slate-900/40 border border-slate-800/80 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-sky-500/50"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 mb-1">DEGREE MAJORS</label>
                <input
                  type="text"
                  value={profileForm.degree}
                  onChange={e => setProfileForm({ ...profileForm, degree: e.target.value })}
                  className="w-full bg-slate-900/40 border border-slate-800/80 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-sky-500/50"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 mb-1">CONTACT EMAIL</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full bg-slate-900/40 border border-slate-800/80 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-sky-500/50"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 mb-1">GITHUB PROFILE LINK</label>
                <input
                  type="text"
                  value={profileForm.github}
                  onChange={e => setProfileForm({ ...profileForm, github: e.target.value })}
                  className="w-full bg-slate-900/40 border border-slate-800/80 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-sky-500/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 mb-1">LINKEDIN PROFILE LINK</label>
                <input
                  type="text"
                  value={profileForm.linkedin}
                  onChange={e => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                  className="w-full bg-slate-900/40 border border-slate-800/80 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-sky-500/50"
                />
              </div>
            </div>

            {/* Skills editable tags */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-mono text-slate-500">TECHNICAL SKILLS SET</label>
                <button
                  type="button"
                  onClick={() => {
                    const sk = prompt("Enter skill name:");
                    if (sk) {
                      setProfileForm({
                        ...profileForm,
                        skills: [...profileForm.skills, { name: sk, score: 80 }]
                      });
                    }
                  }}
                  className="text-sky-400 hover:text-sky-300 text-[10px] flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" /> Add Skill
                </button>
              </div>
              <div className="flex flex-wrap gap-2 p-3 bg-slate-900/25 border border-slate-800 rounded-xl">
                {profileForm.skills.map((s, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px]">
                    <span className="text-slate-300">{s.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const filtered = profileForm.skills.filter((_, i) => i !== idx);
                        setProfileForm({ ...profileForm, skills: filtered });
                      }}
                      className="text-rose-500 hover:text-rose-400 text-xs font-bold leading-none ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Experience Section Editor */}
            <div className="space-y-4 border-t border-slate-800/40 pt-4">
              <h4 className="text-xs font-mono font-bold text-sky-400 uppercase">EDIT WORK EXPERIENCE</h4>
              {profileForm.experience.map((exp, expIdx) => (
                <div key={expIdx} className="p-4 bg-slate-900/20 border border-slate-800 rounded-xl space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-mono text-slate-500 mb-0.5">COMPANY NAME</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={e => {
                          const updated = [...profileForm.experience];
                          updated[expIdx] = { ...updated[expIdx], company: e.target.value };
                          setProfileForm({ ...profileForm, experience: updated });
                        }}
                        className="w-full bg-slate-900/40 border border-slate-800/80 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-sky-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono text-slate-500 mb-0.5">ROLE TITLE</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={e => {
                          const updated = [...profileForm.experience];
                          updated[expIdx] = { ...updated[expIdx], role: e.target.value };
                          setProfileForm({ ...profileForm, experience: updated });
                        }}
                        className="w-full bg-slate-900/40 border border-slate-800/80 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-sky-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono text-slate-500 mb-0.5">DURATION</label>
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={e => {
                          const updated = [...profileForm.experience];
                          updated[expIdx] = { ...updated[expIdx], duration: e.target.value };
                          setProfileForm({ ...profileForm, experience: updated });
                        }}
                        className="w-full bg-slate-900/40 border border-slate-800/80 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-sky-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono text-slate-500 mb-0.5">LOCATION</label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={e => {
                          const updated = [...profileForm.experience];
                          updated[expIdx] = { ...updated[expIdx], location: e.target.value };
                          setProfileForm({ ...profileForm, experience: updated });
                        }}
                        className="w-full bg-slate-900/40 border border-slate-800/80 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-sky-500/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono text-slate-500 mb-0.5">BULLET POINTS (ONE PER LINE)</label>
                    <textarea
                      rows={4}
                      value={exp.bullets.join("\n")}
                      onChange={e => {
                        const updated = [...profileForm.experience];
                        updated[expIdx] = { ...updated[expIdx], bullets: e.target.value.split("\n") };
                        setProfileForm({ ...profileForm, experience: updated });
                      }}
                      className="w-full bg-slate-900/40 border border-slate-800/80 rounded p-2 text-xs text-slate-300 outline-none focus:border-sky-500/50 font-mono leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Projects Section Editor */}
            <div className="space-y-4 border-t border-slate-800/40 pt-4">
              <h4 className="text-xs font-mono font-bold text-sky-400 uppercase">EDIT PROJECTS FOCUS</h4>
              {profileForm.projects.map((proj, projIdx) => (
                <div key={projIdx} className="p-4 bg-slate-900/20 border border-slate-800 rounded-xl space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-mono text-slate-500 mb-0.5">PROJECT NAME</label>
                      <input
                        type="text"
                        value={proj.name}
                        onChange={e => {
                          const updated = [...profileForm.projects];
                          updated[projIdx] = { ...updated[projIdx], name: e.target.value };
                          setProfileForm({ ...profileForm, projects: updated });
                        }}
                        className="w-full bg-slate-900/40 border border-slate-800/80 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-sky-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono text-slate-500 mb-0.5">TAGS (COMMA SEPARATED)</label>
                      <input
                        type="text"
                        value={proj.tags.join(", ")}
                        onChange={e => {
                          const updated = [...profileForm.projects];
                          updated[projIdx] = { ...updated[projIdx], tags: e.target.value.split(",").map(t => t.trim()) };
                          setProfileForm({ ...profileForm, projects: updated });
                        }}
                        className="w-full bg-slate-900/40 border border-slate-800/80 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-sky-500/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono text-slate-500 mb-0.5">PROJECT DESCRIPTION</label>
                    <input
                      type="text"
                      value={proj.desc}
                      onChange={e => {
                        const updated = [...profileForm.projects];
                        updated[projIdx] = { ...updated[projIdx], desc: e.target.value };
                        setProfileForm({ ...profileForm, projects: updated });
                      }}
                      className="w-full bg-slate-900/40 border border-slate-800/80 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-sky-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono text-slate-500 mb-0.5">BULLET POINTS (ONE PER LINE)</label>
                    <textarea
                      rows={4}
                      value={proj.bullets.join("\n")}
                      onChange={e => {
                        const updated = [...profileForm.projects];
                        updated[projIdx] = { ...updated[projIdx], bullets: e.target.value.split("\n") };
                        setProfileForm({ ...profileForm, projects: updated });
                      }}
                      className="w-full bg-slate-900/40 border border-slate-800/80 rounded p-2 text-xs text-slate-300 outline-none focus:border-sky-500/50 font-mono leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Organizations Section Editor */}
            <div className="space-y-4 border-t border-slate-800/40 pt-4">
              <h4 className="text-xs font-mono font-bold text-sky-400 uppercase">EDIT ORGANIZATIONS & ACTIVITIES</h4>
              {profileForm.organizations.map((org, orgIdx) => (
                <div key={orgIdx} className="p-4 bg-slate-900/20 border border-slate-800 rounded-xl space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-[9px] font-mono text-slate-500 mb-0.5">ORGANIZATION NAME</label>
                      <input
                        type="text"
                        value={org.name}
                        onChange={e => {
                          const updated = [...profileForm.organizations];
                          updated[orgIdx] = { ...updated[orgIdx], name: e.target.value };
                          setProfileForm({ ...profileForm, organizations: updated });
                        }}
                        className="w-full bg-slate-900/40 border border-slate-800/80 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-sky-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono text-slate-500 mb-0.5">ROLE TITLE</label>
                      <input
                        type="text"
                        value={org.role}
                        onChange={e => {
                          const updated = [...profileForm.organizations];
                          updated[orgIdx] = { ...updated[orgIdx], role: e.target.value };
                          setProfileForm({ ...profileForm, organizations: updated });
                        }}
                        className="w-full bg-slate-900/40 border border-slate-800/80 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-sky-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono text-slate-500 mb-0.5">DURATION</label>
                      <input
                        type="text"
                        value={org.duration}
                        onChange={e => {
                          const updated = [...profileForm.organizations];
                          updated[orgIdx] = { ...updated[orgIdx], duration: e.target.value };
                          setProfileForm({ ...profileForm, organizations: updated });
                        }}
                        className="w-full bg-slate-900/40 border border-slate-800/80 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-sky-500/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono text-slate-500 mb-0.5">BULLET POINTS (ONE PER LINE)</label>
                    <textarea
                      rows={3}
                      value={org.bullets.join("\n")}
                      onChange={e => {
                        const updated = [...profileForm.organizations];
                        updated[orgIdx] = { ...updated[orgIdx], bullets: e.target.value.split("\n") };
                        setProfileForm({ ...profileForm, organizations: updated });
                      }}
                      className="w-full bg-slate-900/40 border border-slate-800/80 rounded p-2 text-xs text-slate-300 outline-none focus:border-sky-500/50 font-mono leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800/40">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Save Master Profile
              </button>
            </div>

          </form>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          SUB-TAB: LATEX EXPORTER
      ══════════════════════════════════════════════════ */}
      {activeSubTab === "latex" && (
        <div className="space-y-4 max-w-4xl mx-auto slide-in no-print">
          <div className="flex justify-between items-center bg-zinc-900/60 p-4 border border-zinc-800/80 rounded-2xl">
            <div>
              <h3 className="text-xs font-mono font-bold tracking-wider text-sky-400 uppercase">ATS LaTeX Source Code</h3>
              <p className="text-[11px] text-zinc-500 mt-0.5 font-sans leading-normal">
                Copy this code directly into Overleaf. The code is dynamically updated in real-time as you modify the Master Profile.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(generateLatex(candidate, selectedVariant));
                  addSystemLog("success", "LaTeX code copied to clipboard.");
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-mono rounded-xl text-white transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const blob = new Blob([generateLatex(candidate, selectedVariant)], { type: "text/plain;charset=utf-8" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `junaid_ahmed_resume_${selectedVariant.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.tex`;
                  a.click();
                  URL.revokeObjectURL(url);
                  addSystemLog("success", "LaTeX file downloaded successfully.");
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-xl transition-colors cursor-pointer font-mono"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .tex</span>
              </button>
            </div>
          </div>

          <div className="relative border border-zinc-850 rounded-2xl overflow-hidden bg-zinc-950/60">
            <div className="text-[10px] text-zinc-555 border-b border-zinc-850 px-4 py-2 font-mono flex justify-between items-center bg-zinc-950/80">
              <span>LATEX COMPILER RENDERER</span>
              <span className="text-sky-500 font-bold uppercase">{selectedVariant} Resume</span>
            </div>
            <textarea
              readOnly
              rows={24}
              value={generateLatex(candidate, selectedVariant)}
              className="w-full bg-transparent p-4 text-[11px] font-mono text-zinc-300 outline-none leading-relaxed resize-none focus:ring-0 select-all"
            />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          SUB-TAB: SAVED ATS HISTORICAL RESUMES
      ══════════════════════════════════════════════════ */}
      {activeSubTab === "history" && (
        <div className="space-y-4">
          <div className="mb-4">
            <h3 className="text-xs font-mono font-bold tracking-wider text-sky-400 uppercase">SAVED JOBS ALIGNED RESUMES</h3>
            <p className="text-xs text-slate-500 mt-0.5">Historical resumes optimized and saved for specific job descriptions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedResumes.length > 0 ? (
              savedResumes.map(res => (
                <div key={res.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 relative group">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-xs text-slate-200">{res.companyName}</h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{res.role} · Aligned: {res.resumeVariant}</p>
                    </div>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded border border-emerald-500/20 text-emerald-400 bg-emerald-500/10">
                      ATS: {res.atsScore}%
                    </span>
                  </div>

                  {/* Summary sample */}
                  <div className="p-3 bg-slate-900/40 border border-slate-900 rounded-lg text-[10px] text-slate-400 leading-normal italic">
                    "{res.optimizedSummary.substring(0, 140)}..."
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/40 pt-3">
                    <span>Scanned: {res.dateGenerated}</span>
                    <button
                      onClick={() => {
                        if (confirm(`Delete the optimized resume for ${res.companyName}?`)) {
                          deleteSavedResume(res.id);
                        }
                      }}
                      className="text-rose-500 hover:text-rose-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-20 glass-panel rounded-2xl text-slate-600 text-xs">
                No job-aligned resumes generated yet. Head over to the "ATS Analyzer" tab to paste a Job Description and optimize!
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
