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
    "Microsoft Excel",
    "JavaScript",
    "TypeScript",
    "React",
    "FastAPI",
    "REST API Integration",
    "Pandas and NumPy",
    "Data Cleaning and Exploratory Analysis",
    "Data Visualization and Dashboard Development",
    "Git and GitHub",
    "QGIS and Geospatial Analysis",
    "GeoJSON and OGC WMS/WFS",
    "LLM Integration with Ollama",
    "ESP32 and Sensor Integration",
  ],

  "Zoho Data Analyst": [
    "SQL Queries, Joins and Data Aggregation",
    "Common Table Expressions and Window Functions",
    "Microsoft Excel, Pivot Tables and Lookup Functions",
    "Power Query (Foundational)",
    "Python, Pandas and NumPy",
    "Data Cleaning and Data Validation",
    "Data Transformation and Data Blending",
    "Relational Data Modeling",
    "Exploratory Data Analysis",
    "Descriptive Statistics",
    "KPI Analysis and Business Reporting",
    "Dashboard and Report Development",
    "Zoho Analytics (Foundational)",
    "Zoho DataPrep (Foundational)",
    "Power BI and DAX (Foundational)",
    "Data Visualization and Trend Analysis",
  ],

  "Data Analyst": [
    "SQL, Joins, Subqueries and Aggregations",
    "CTEs and Window Functions",
    "Microsoft Excel, Pivot Tables and XLOOKUP",
    "Power Query (Foundational)",
    "Python for Data Analysis",
    "Pandas and NumPy",
    "Data Cleaning and Data Preprocessing",
    "Exploratory Data Analysis",
    "Descriptive Statistics and Probability",
    "Correlation and Hypothesis Testing",
    "Data Visualization with Matplotlib and Seaborn (Foundational)",
    "Power BI and DAX (Foundational)",
    "Tableau (Foundational)",
    "KPI Reporting and Dashboard Development",
    "Data Validation and Quality Checks",
    "Trend and Time Series Analysis",
  ],

  "Data Scientist": [
    "Python for Data Science",
    "SQL and Relational Databases",
    "Pandas, NumPy and SciPy (Foundational)",
    "Exploratory Data Analysis",
    "Data Cleaning and Preprocessing",
    "Feature Engineering and Feature Selection",
    "Probability and Statistical Inference",
    "Hypothesis Testing and Experiment Analysis",
    "Supervised Machine Learning",
    "Unsupervised Machine Learning",
    "Regression and Classification",
    "Clustering and Dimensionality Reduction (Foundational)",
    "Scikit learn",
    "Model Training and Cross Validation",
    "Precision, Recall, F1 Score and ROC AUC",
    "MAE, MSE and RMSE",
    "Matplotlib, Seaborn and Jupyter Notebook (Foundational)",
    "Deep Learning with PyTorch (Foundational)",
  ],

  "Business Analyst": [
    "Business Analysis and Requirement Gathering",
    "Stakeholder Requirement Analysis",
    "SQL Queries, Joins and Data Aggregation",
    "Microsoft Excel and Advanced Reporting",
    "Python for Basic Data Analysis",
    "Data Analysis and Data Validation",
    "KPI Definition and Performance Monitoring",
    "Business Intelligence and Dashboard Reporting",
    "Power BI (Foundational)",
    "Tableau (Foundational)",
    "Business Requirement Documents and Functional Requirements",
    "User Stories and Acceptance Criteria",
    "Business Process Mapping and BPMN (Foundational)",
    "Agile and Scrum Fundamentals",
    "Jira and Confluence (Foundational)",
    "User Acceptance Testing and Gap Analysis",
    "Root Cause and Trend Analysis",
  ],

  "Data Engineer": [
    "Python and SQL",
    "Pandas and NumPy",
    "Advanced SQL and Relational Databases",
    "ETL and ELT Pipeline Fundamentals",
    "Data Ingestion and Data Transformation",
    "CSV, JSON and Structured Data Processing",
    "REST API Integration and Data Extraction",
    "Data Cleaning and Validation",
    "Data Modeling and Database Design",
    "Batch Processing and Pipeline Monitoring",
    "GeoJSON and Geospatial Data Pipelines",
    "Azure Data Explorer and KQL",
    "Azure Data Factory (Foundational)",
    "Apache Spark and PySpark (Foundational)",
    "Apache Airflow (Foundational)",
    "PostgreSQL (Foundational)",
    "Git, GitHub and Linux Fundamentals",
  ],

  "Software Engineer": [
    "Python and JavaScript",
    "TypeScript",
    "React and Component Based Development",
    "Next.js (Foundational)",
    "HTML5 and CSS3",
    "Tailwind CSS",
    "Vite",
    "FastAPI and Backend Development",
    "REST API Design and Integration",
    "HTTP Methods and JSON",
    "Database Fundamentals and PostgreSQL (Foundational)",
    "Data Structures and Algorithms Fundamentals",
    "Git and GitHub",
    "Debugging and Software Troubleshooting",
    "Unit Testing with Pytest and Jest (Foundational)",
    "Docker and Container Fundamentals",
    "Responsive Web Application Development",
  ],

  "AI/ML Engineer": [
    "Python for AI and Machine Learning",
    "Pandas and NumPy",
    "Scikit learn and Machine Learning Fundamentals",
    "Data Cleaning and Preprocessing",
    "Exploratory Data Analysis",
    "Feature Engineering",
    "Supervised and Unsupervised Learning",
    "Model Training and Evaluation",
    "Classification and Regression Metrics",
    "Generative AI and Large Language Models",
    "Prompt Engineering",
    "Retrieval Augmented Generation",
    "Text Embeddings and Semantic Search",
    "Vector Databases (Foundational)",
    "LangChain and Hugging Face (Foundational)",
    "Ollama and Llama 3.2",
    "FastAPI and REST API Integration",
    "PyTorch (Foundational)",
    "React and AI Application Integration",
  ],

  "IoT/Embedded Engineer": [
    "Embedded C and C++",
    "Python",
    "ESP32 and Arduino",
    "Microcontroller Programming",
    "Sensor Integration and Interfacing",
    "MPU6050 Motion Sensor",
    "NEO 6M GPS Integration",
    "GPIO, ADC and PWM Fundamentals",
    "I2C and UART Communication",
    "SPI Communication (Foundational)",
    "WiFi Based IoT Communication",
    "MQTT Protocol (Foundational)",
    "Bluetooth Low Energy (Foundational)",
    "Real Time Operating Systems (Foundational)",
    "Vibration Sensing and Event Detection",
    "Power Regulation and Battery Management",
    "Hardware Testing and Debugging",
    "PCB Design with EasyEDA (Foundational)",
    "Telegram API Integration",

  ],
  
  "GIS Analyst": [
    "Geographic Information Systems",
    "QGIS and Desktop GIS",
    "Spatial Data Analysis",
    "Vector Data Processing",
    "Raster Data Processing (Foundational)",
    "Coordinate Reference Systems and Map Projections",
    "Geoprocessing and Spatial Analysis",
    "Cartography and Thematic Mapping",
    "GeoJSON, Shapefile, GeoPackage and CSV",
    "Leaflet and Web GIS Development",
    "OGC WMS and WFS Standards",
    "Spatial Data Preparation and Validation",
    "Excel to GeoJSON Data Conversion",
    "Python for Geospatial Analysis (Foundational)",
    "GeoPandas (Foundational)",
    "ArcGIS Pro (Foundational)",
    "ArcPy (Foundational)",
    "PostgreSQL and PostGIS (Foundational)",
    "GDAL and OGR (Foundational)",
    "Remote Sensing and Satellite Imagery (Foundational)",
    "GPS and GNSS Data Integration",
    "Geospatial REST API Integration",
  ],

};



const ROLE_HEADLINES: Record<string, string> = {
  "General Placement":
    "ARTIFICIAL INTELLIGENCE & DATA SCIENCE UNDERGRADUATE | TECHNOLOGY & ANALYTICAL SOLUTIONS",

  "Zoho Data Analyst":
    "DATA ANALYST | DATA ANALYSIS, BUSINESS INTELLIGENCE & REPORTING",

  "Data Analyst":
    "DATA ANALYST | DATA INSIGHTS, BUSINESS INTELLIGENCE & DECISION SUPPORT",

  "Data Scientist":
    "DATA SCIENTIST | STATISTICAL ANALYSIS, PREDICTIVE MODELING & MACHINE LEARNING",

  "Business Analyst":
    "BUSINESS ANALYST | BUSINESS REQUIREMENTS, PROCESS ANALYSIS & STRATEGIC INSIGHTS",

  "Data Engineer":
    "DATA ENGINEER | DATA MANAGEMENT, INTEGRATION & ENGINEERING",

  "Software Engineer":
    "SOFTWARE ENGINEER | SOFTWARE DEVELOPMENT, APPLICATIONS & SYSTEMS INTEGRATION",

  "AI/ML Engineer":
    "ARTIFICIAL INTELLIGENCE & MACHINE LEARNING ENGINEER | INTELLIGENT APPLICATIONS",

  "IoT/Embedded Engineer":
    "IOT & EMBEDDED SYSTEMS ENGINEER | CONNECTED DEVICES, FIRMWARE & HARDWARE INTEGRATION",

  "GIS Analyst":
  "GIS ANALYST | GEOSPATIAL DATA, SPATIAL ANALYSIS & MAPPING",
};



const ROLE_SUMMARIES: Record<string, string> = {
  "General Placement":
    "Artificial Intelligence and Data Science undergraduate with internship experience in geospatial development and data analytics. Has built a local LLM support application, interactive GIS dashboards and an ESP32 based smart helmet prototype. Brings practical experience in Python, SQL, React, FastAPI, data processing and API integration, with an interest in software, analytics and applied AI roles.",

  "Zoho Data Analyst":
    "Artificial Intelligence and Data Science undergraduate with internship experience in Python based data preparation, SQL queries, Excel workflows and structured data analysis. Experienced in cleaning datasets, transforming records, validating data and developing dashboard views for reporting. Building foundational knowledge of Zoho Analytics and Zoho DataPrep, with a focus on accurate business reporting, KPI tracking and clear analytical insights.",

  "Data Analyst":
    "Data focused Artificial Intelligence and Data Science undergraduate with internship experience in cleaning telemetry datasets, writing SQL queries and preparing structured data using Python, Pandas and NumPy. Skilled in exploratory analysis, data validation, statistical interpretation and presenting findings through visualisations and dashboards. Interested in helping teams understand performance, identify trends and make informed business decisions.",

  "Data Scientist":
    "Artificial Intelligence and Data Science undergraduate with practical experience in Python based data preparation, exploratory analysis and statistical investigation. Has worked with structured datasets and developed projects involving local language models, geospatial observations and sensor data. Academic knowledge includes machine learning, regression, classification and model evaluation, with an interest in developing reliable predictive solutions from real world data.",

  "Business Analyst":
    "Artificial Intelligence and Data Science undergraduate with experience organising datasets, analysing information and developing dashboards for technical projects. Able to work with SQL, Excel and Python to examine trends, validate information and prepare clear reports. Interested in understanding business requirements, documenting processes, defining useful performance indicators and translating analysis into practical recommendations.",

  "Data Engineer":
    "Artificial Intelligence and Data Science undergraduate with practical experience building Python data workflows, processing CSV and GeoJSON datasets and integrating REST APIs. Worked on structured data preparation, SQL transformations and geospatial dashboard workflows during internships and projects. Interested in developing dependable data ingestion, transformation and validation pipelines, with foundational knowledge of cloud and big data technologies.",

  "Software Engineer":
    "Artificial Intelligence and Data Science undergraduate with project experience developing web applications using React, TypeScript, Python and FastAPI. Built frontend interfaces, integrated REST APIs and connected local AI services to application workflows. Comfortable with component based development, JSON data handling, debugging and application integration, with an interest in building reliable software products.",

  "AI/ML Engineer":
    "Artificial Intelligence and Data Science undergraduate with practical experience integrating a locally hosted Llama 3.2 model through Ollama and FastAPI into a React application. Developed support ticket retrieval, AI assisted response drafting and human review workflows. Has a foundation in Python, data preparation and machine learning concepts, and is focused on building useful LLM applications, retrieval systems and reliable AI services.",

  "IoT/Embedded Engineer":
    "Artificial Intelligence and Data Science undergraduate with practical prototyping experience using ESP32, embedded C++, motion sensors, vibration detection and GPS. Developed a smart helmet concept that combines sensor readings with crash confirmation logic and Telegram based emergency location alerts. Interested in embedded firmware, microcontroller programming, sensor communication, connected devices and hardware debugging.",

  "GIS Analyst":
  "Artificial Intelligence and Data Science undergraduate with geospatial development internship experience at Trinav SpaceTech. Built interactive GIS dashboards and map based workflows using QGIS, React, Leaflet and GeoJSON. Worked with district boundary layers, tabular to GeoJSON conversion, spatial data preparation and OGC WMS and WFS services. Interested in GIS analysis, geospatial data quality, thematic mapping and location based decision support.",
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
      const left = 12;
      const right = 12;
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
        const lineHeight = fontSize * 0.42;

        lines.forEach((line: string) => {
          ensureSpace(lineHeight + 0.2);
          pdf.text(line, left, y);
          y += lineHeight;
        });
      };

      const section = (title: string) => {
        ensureSpace(8);
        y += 1;
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.setTextColor(20, 20, 20);
        pdf.text(title.toUpperCase(), left, y);
        y += 1.4;
        pdf.setDrawColor(70, 70, 70);
        pdf.setLineWidth(0.25);
        pdf.line(left, y, pageWidth - right, y);
        y += 2.8;
      };

      const bullet = (text: string) => {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9.2);
        const lines = pdf.splitTextToSize(`• ${text}`, contentWidth - 1);

        lines.forEach((line: string) => {
          ensureSpace(4);
          pdf.text(line, left + 1, y);
          y += 4.3;
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
y += 3.4;

      y += 2;

      pdf.setDrawColor(30, 30, 30);
      pdf.setLineWidth(0.45);
      pdf.line(left, y, pageWidth - right, y);
      y += 3;

      section("Professional Summary");
      textBlock(summary, 9.6);
      y += 1;

      section("Education");
      textBlock(candidate.college, 9.5, { bold: true });
      textBlock(candidate.degree, 9, { italic: true });
      textBlock("Chennai, Tamil Nadu, India", 8);
      y += 0.8;

      section("Technical Skills");
      textBlock(skills.join("  •  "), 9);
      y += 0.8;

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
        y += 0.5;
      });

      section("Selected Projects");

      orderedProjects.slice(0, 3).forEach((project) => {
        ensureSpace(10);
        textBlock(project.name, 9.4, { bold: true });
        textBlock(project.tags.join(" | "), 8.2, { italic: true });
        textBlock(project.desc, 9);

        project.bullets.slice(0, 3).forEach(bullet);
        y += 1;
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
  `${cleanFileName(selectedVariant)}_${cleanFileName(candidate.name)}_Resume.pdf`
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

     "GIS Analyst": [
  "Renewable Energy GIS",
  "Atmospheric Pressure Monitoring Dashboard",
  "CrashSense",
  "SolutionForge AI",
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
