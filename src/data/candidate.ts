export interface Project {
  name: string;
  tags: string[];
  desc: string;
  bullets: string[];
  highlight: boolean;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  location: string;
  bullets: string[];
}

export interface Organization {
  name: string;
  role: string;
  duration: string;
  bullets: string[];
}

export interface CandidateProfile {
  name: string;
  college: string;
  degree: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  skills: { name: string; score: number }[];
  projects: Project[];
  experience: Experience[];
  organizations: Organization[];
  resumeVariants: string[];
}

export const CANDIDATE: CandidateProfile = {
  name: "Junaid Ahmed M",
  college: "B.S. Abdur Rahman Crescent Institute of Science and Technology",
  degree: "Bachelor of Technology in Artificial Intelligence and Data Science",
  location: "Chennai, Tamil Nadu, India",
  email: "junaidahmed2826@gmail.com",
  phone: "+91 6385421273",
  linkedin: "https://www.linkedin.com/in/junaid-ahmed-a38480288",
  github: "https://github.com/junaid1142d",

  skills: [
    { name: "Python", score: 90 },
    { name: "SQL", score: 85 },
    { name: "Microsoft Excel", score: 85 },
    { name: "Data Cleaning and Analysis", score: 88 },
    { name: "Pandas", score: 85 },
    { name: "NumPy", score: 80 },
    { name: "Data Visualization", score: 82 },
    { name: "REST API Integration", score: 82 },
    { name: "React", score: 82 },
    { name: "TypeScript", score: 78 },
    { name: "Git and GitHub", score: 80 },
    { name: "QGIS and GIS Mapping", score: 85 },
    { name: "GeoJSON", score: 85 },
    { name: "OGC WMS/WFS", score: 82 },
    { name: "Prompt Engineering and LLM Integration", score: 85 }
  ],

  experience: [
    {
      company: "Trinav SpaceTech",
      role: "GIS R&D Intern",
      duration: "Jun 2026 – Jul 2026",
      location: "Chennai, India | iTNT Hub",
      bullets: [
        "Developed a Renewable Energy GIS platform for Tamil Nadu to support renewable infrastructure planning.",
        "Built interactive GIS dashboards using React, Leaflet, GeoJSON, and OGC standards.",
        "Processed renewable energy datasets and automated Excel-to-GeoJSON conversion for spatial visualization.",
        "Integrated district boundaries, renewable asset layers, and future renewable candidate locations into a unified GIS application.",
        "Implemented OGC WMS and WFS services for interoperable geospatial data access.",
        "Developed district-level renewable analytics covering capacity, asset distribution, and suitability insights.",
        "Improved GIS performance through marker clustering, optimized data loading, and efficient rendering.",
        "Collaborated with the R&D team to test, document, and deploy the GIS platform."
      ]
    },
    {
      company: "EinNel Technologies",
      role: "Data Analyst Intern",
      duration: "Jul 2025 – Aug 2025",
      location: "Remote, India",
      bullets: [
        "Preprocessed and cleaned telemetry datasets using Python, Pandas, NumPy, and SQL.",
        "Developed SQL queries and data transformation workflows to aggregate structured tables.",
        "Built dashboard charts to visualize engineering parameters and support operational reporting.",
        "Participated in data modeling and machine learning integration workflows."
      ]
    },
    {
      company: "Unschool",
      role: "Marketing and Sales Intern",
      duration: "Sep 2023 – Oct 2023",
      location: "Hyderabad, India",
      bullets: [
        "Achieved the highest monthly sales in the regional student cohort through structured outreach and follow-up.",
        "Used Excel-based outreach data and customer communication to support audience targeting and student engagement."
      ]
    }
  ],

  projects: [
    {
      name: "SolutionForge AI — Local LLM Support Workflow",
      tags: ["Python", "FastAPI", "React", "Vite", "Ollama", "Llama 3.2", "RAG"],
      desc: "A local LLM workflow that retrieves support-ticket context and drafts candidate responses for human review.",
      highlight: true,
      bullets: [
        "Connected a locally hosted Llama 3.2 model through Ollama to a FastAPI backend and React/Vite frontend.",
        "Built workflows for support-ticket retrieval, solution drafting, and human review before responses proceed.",
        "Integrated REST endpoints between the interface and local inference service."
      ]
    },
    {
      name: "Atmospheric Pressure Monitoring Dashboard",
      tags: ["React", "TypeScript", "GIS", "Time Series", "SensorThings API", "Azure Data Explorer"],
      desc: "A geospatial dashboard for exploring atmospheric-pressure observations and station-level trends across Tamil Nadu.",
      highlight: true,
      bullets: [
        "Designed a React and TypeScript dashboard for station-based atmospheric-pressure visualization and time-series analysis.",
        "Structured CSV-based observation ingestion and an OGC SensorThings-compatible design for future Azure Data Explorer integration.",
        "Planned district-level monitoring views to compare observations and historical pressure trends."
      ]
    },
    {
      name: "CrashSense — Smart Helmet Safety System",
      tags: ["ESP32", "Embedded C++", "MPU6050", "GPS", "IoT", "Telegram API"],
      desc: "A smart-helmet prototype for crash detection and location-aware emergency notifications.",
      highlight: true,
      bullets: [
        "Prototyped a smart-helmet system using ESP32, MPU6050 motion sensing, vibration detection, and NEO-6M GPS.",
        "Implemented threshold-based crash detection with vibration confirmation to help reduce false triggers.",
        "Integrated Wi-Fi-based Telegram alerts containing GPS coordinates.",
        "Assembled battery charging and voltage-regulation modules for a portable hardware prototype."
      ]
    },
    {
      name: "Renewable Energy GIS Planning Platform",
      tags: ["GIS", "React", "Leaflet", "GeoJSON", "OGC WMS", "OGC WFS", "Spatial Analysis"],
      desc: "An interactive GIS platform for visualizing renewable energy assets and candidate sites across Tamil Nadu.",
      highlight: false,
      bullets: [
        "Built interactive map layers using React, Leaflet, GeoJSON, and district boundaries.",
        "Created a pipeline to convert Excel datasets into GeoJSON for web-based geospatial visualization.",
        "Implemented OGC-compliant WMS and WFS services for standardized GIS interoperability.",
        "Designed district-wise analytics for renewable capacity, asset distribution, and site suitability.",
        "Optimized map rendering through marker clustering and efficient data loading."
      ]
    }
  ],

  organizations: [
    {
      name: "Tamil Nadu International Balloon Festival",
      role: "Event Coordinator",
      duration: "Jan 2025",
      bullets: [
        "Supported event operations, coordinated volunteers, and assisted with ground activities and crowd management."
      ]
    },
    {
      name: "Students' Sea Turtle Conservation Network",
      role: "Volunteer",
      duration: "2025 – Present",
      bullets: [
        "Participated in coastal conservation activities, public awareness, and protection efforts for Olive Ridley turtle nesting."
      ]
    }
  ],

  resumeVariants: [
    "General Placement",
    "Zoho Data Analyst",
    "Data Analyst",
    "Data Scientist",
    "Business Analyst",
    "Data Engineer",
    "Software Engineer",
    "AI/ML Engineer",
    "IoT/Embedded Engineer"
  ]
};