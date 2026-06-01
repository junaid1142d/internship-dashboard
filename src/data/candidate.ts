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
  resumeVariants: string[];
}

export const CANDIDATE: CandidateProfile = {
  name: "Junaid Ahmed M",
  college: "B.S. Abdur Rahman Crescent Institute, Chennai",
  degree: "B.Tech – Artificial Intelligence and Data Science",
  location: "Chennai, India",
  email: "junaidahmed2826@gmail.com",
  phone: "+91 6385421273",
  linkedin: "linkedin.com/in/junaid-ahmed-a38480288",
  github: "",
  skills: [
    { name: "Python", score: 90 },
    { name: "SQL", score: 85 },
    { name: "C/C++", score: 80 },
    { name: "Data Analytics", score: 85 },
    { name: "ESP32 / Arduino", score: 90 },
    { name: "IoT Systems & Hardware", score: 92 },
    { name: "Machine Learning basics", score: 70 },
    { name: "Data Preprocessing & Visualization", score: 85 },
    { name: "Client Outreach & Communication", score: 80 },
  ],
  experience: [
    {
      company: "EinNel Technologies",
      role: "Data Analyst Intern",
      duration: "June 2025 - August 2025",
      location: "Chennai, India",
      bullets: [
        "Collaborated with the engineering team to design and deploy data analytics pipelines, processing over 50,000+ data entries.",
        "Preprocessed, cleaned, and normalized structured and unstructured datasets using Python (Pandas, NumPy) to ensure 98% data integrity.",
        "Developed interactive dashboards and reports using data visualization tools to communicate analytical findings to key stakeholders.",
        "Optimized complex SQL queries, reducing analytical data retrieval times by 20% across internal databases."
      ]
    },
    {
      company: "Unschool",
      role: "Marketing & Sales Intern",
      duration: "December 2024 - February 2025",
      location: "Remote / Chennai, India",
      bullets: [
        "Formulated and executed cold outreach and communication strategies, onboarding 200+ new learners to the edtech platform.",
        "Conducted market research and user demographic segmentation to tailor sales pitches for high-potential student groups.",
        "Collaborated with product teams to provide student-end user feedback, improving the platform conversion rates by 12%.",
        "Refined pitching and interpersonal communication skills, working in a fast-paced, high-growth startup environment."
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
      name: "IoT Smart Home automation",
      tags: ["IoT", "ESP32", "Sensors", "Automation"],
      desc: "Smart device control system using ESP32, MQTT/HTTP protocols, and integrated sensor nodes.",
      highlight: false,
      bullets: [
        "Built a modular smart home control system using ESP32 microcontrollers and a network of digital/analog sensors.",
        "Implemented secure MQTT protocol broker interfaces for low-latency device-to-cloud telemetry and device toggling.",
        "Designed a custom web dashboard UI using HTML/JS and CSS, allowing remote toggle of multi-channel relay modules.",
        "Configured failsafes and automated temperature/humidity-triggered ventilation loops utilizing DHT22 sensor readings."
      ]
    },
    {
      name: "Data Analytics Projects Suite",
      tags: ["Data Analytics", "Python", "SQL", "ML Basics"],
      desc: "Comprehensive data analysis pipelines analyzing academic datasets and telemetry data using Python and SQL.",
      highlight: false,
      bullets: [
        "Analyzed large datasets using Python (Pandas, Matplotlib, Seaborn) to uncover underlying patterns, trends, and anomalies.",
        "Engineered structured ETL pipelines using SQL to ingest, aggregate, and report on multi-dimensional sensor and sales datasets.",
        "Applied basic Machine Learning models (Linear Regression, K-Means Clustering) to predict user behaviors and telemetry events.",
        "Presented actionable analytics reports to stakeholders, leveraging clear graphical charts and statistical metrics."
      ]
    }
  ],
  resumeVariants: [
    "AI/ML",
    "Data Analyst",
    "Software Engineering",
    "IoT/Embedded",
    "StartupTN Ecosystem",
    "Startup Generalist",
    "Product/Operations"
  ]
};
