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
  college: "B.S.Abdur Rahman Crescent Institute of Science And Technology",
  degree: "Bachelor of Technology: Artificial Intelligence and Data Science",
  location: "Chennai, IN 600048",
  email: "junaidahmed2826@gmail.com",
  phone: "+91 6385421273",
  linkedin: "https://www.linkedin.com/in/junaid-ahmed-a38480288",
  github: "",
  skills: [
    { name: "Adaptability and quick learning", score: 90 },
    { name: "Time management and organization", score: 85 },
    { name: "Problem-solving and critical thinking", score: 85 },
    { name: "Proficient in Python", score: 90 },
    { name: "Data cleaning & analytics", score: 90 },
    { name: "QGIS Geospatial Mapping", score: 85 },
    { name: "OGC SensorThings API", score: 85 },
    { name: "Azure IoT services", score: 80 },
    { name: "Embedded C", score: 80 },
    { name: "LLM Prompting & AI Copilots", score: 90 }
  ],
  experience: [
    {
      company: "Trinav SpaceTech",
      role: "GIS R&D Intern",
      duration: "06/2026 - 07/2026",
      location: "Chennai, India (iTNT Hub)",
      bullets: [
        "Developed a Renewable Energy GIS platform for Tamil Nadu supporting renewable infrastructure planning.",
        "Built interactive GIS dashboards using React, Leaflet, GeoJSON and OGC standards.",
        "Processed renewable energy datasets and automated Excel-to-GeoJSON conversion for spatial visualization.",
        "Integrated district boundaries, renewable asset layers and future renewable candidate locations into a unified GIS application.",
        "Implemented OGC WMS and WFS services for interoperable geospatial data access.",
        "Developed district-level renewable analytics including capacity, asset distribution and suitability insights.",
        "Improved GIS performance through marker clustering, optimized data loading and efficient rendering.",
        "Collaborated with the R&D team to test, document and deploy a production-ready GIS platform."
      ]
    },
    {
      company: "EinNel Technologies",
      role: "Data Analyst Intern",
      duration: "07/2025 - 08/2025",
      location: "Chennai, India (Remote)",
      bullets: [
        "Preprocessed and cleaned high-volume telemetry datasets using Python (Pandas, NumPy) and SQL, reducing anomalous records.",
        "Developed SQL queries and ETL pipelines to aggregate structured tables, optimizing search retrieval runtimes.",
        "Built interactive dashboard charts to visualize key engineering parameters, improving operational report generation speed.",
        "Participated in workshops regarding data modeling baselines and machine learning integration workflows."
      ]
    },
    {
      company: "Unschool",
      role: "Marketing & Sales Intern",
      duration: "09/2023 - 10/2023",
      location: "Hyderabad, India",
      bullets: [
        "Achieved highest monthly sales in the regional student cohort, proving sales pipeline tracking and client communication speed.",
        "Analyzed customer outreach datasets in Excel to segment target audiences and optimize campaign response rates."
      ]
    }
  ],
  projects: [
    {
      name: "CrashSense",
      tags: ["IoT", "Embedded", "Safety", "Automation", "Python"],
      desc: "Smart rider safety & accident detection IoT system using ESP32, MPU6050 accelerometer/gyroscope, and GPS tracking.",
      highlight: true,
      bullets: [
        "Designed and fabricated an IoT-based smart helmet safety system leveraging an ESP32 microcontroller and MPU6050 sensor array.",
        "Engineered real-time threshold-based collision detection algorithms in C++ to process accelerometer and gyroscope readings.",
        "Integrated GPS tracking modules to determine precise geographical coordinates during collision alerts.",
        "Developed a backend communication pipeline (via Twilio and GSM modules) to dispatch immediate automated SMS emergency alerts to contacts, reducing accident reporting times."
      ]
    },
    {
      name: "Renewable Energy GIS Planning Platform",
      tags: ["GIS", "React", "Leaflet", "GeoJSON", "OGC WMS", "OGC WFS", "Spatial Analysis"],
      desc: "Interactive Renewable Energy GIS Platform for Tamil Nadu utilizing React, Leaflet, and GeoJSON boundaries.",
      highlight: false,
      bullets: [
        "Built a Renewable Energy GIS platform for Tamil Nadu to visualize existing and proposed solar and wind assets.",
        "Developed interactive map layers using React, Leaflet and GeoJSON with district boundaries, renewable asset layers and future candidate sites.",
        "Built a pipeline to convert Excel datasets into GeoJSON for efficient web-based geospatial visualization.",
        "Implemented OGC-compliant WMS and WFS services for standardized GIS interoperability.",
        "Designed district-wise analytics showing renewable capacity, renewable asset distribution and site suitability.",
        "Optimized application performance using marker clustering, lazy loading and efficient rendering for large geospatial datasets.",
        "Created engineering-focused decision-support popups explaining why each renewable candidate site was selected."
      ]
    }
  ],
  organizations: [
    {
      name: "Tamil Nadu International Balloon Festival",
      role: "Event Coordinator",
      duration: "2025-01",
      bullets: [
        "Assisted international pilots with hot air balloon ground operations and flight preparation. Managed volunteers and crowd control to ensure smooth, safe, and efficient event execution."
      ]
    },
    {
      name: "Students' Sea Turtle Conservation Network",
      role: "Volunteer / Collaborator",
      duration: "2025-04 - Present",
      bullets: [
        "Collaborated nightly with Forest Department along the seashore to collect Olive Ridley eggs, educate the public on conservation, and manage crowd control for protection efforts."
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
