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
  linkedin: "linkedin.com/in/junaid-ahmed-a38480288",
  github: "",
  skills: [
    { name: "Adaptability and quick learning", score: 90 },
    { name: "Time management and organization", score: 85 },
    { name: "Problem-solving and critical thinking", score: 85 },
    { name: "Digital literacy", score: 80 },
    { name: "Proficient in Python", score: 90 },
    { name: "Data cleaning", score: 85 },
    { name: "Excel functions", score: 80 },
    { name: "Data and analytics", score: 90 }
  ],
  experience: [
    {
      company: "EinNel Technologies",
      role: "Data Analyst Intern",
      duration: "07/2025 - 08/2025",
      location: "Chennai, India (Remote)",
      bullets: [
        "Gained valuable experience working within a specific industry, applying learned concepts directly into relevant work situations.",
        "Supported staff members in their daily tasks, reducing workload burden and allowing for increased focus on higher-priority assignments.",
        "Gained hands-on experience in various software programs, increasing proficiency and expanding technical skill set.",
        "Prepared project presentations and reports to assist senior staff.",
        "Participated in workshops and presentations related to projects to gain knowledge.",
        "Utilized strong communication abilities during presentations which led to increased understanding among colleagues regarding project goals and objectives."
      ]
    },
    {
      company: "Unschool",
      role: "Marketing & Sales Intern",
      duration: "09/2023 - 10/2023",
      location: "Hyderabad, India",
      bullets: [
        "Achieved highest monthly sales in team at Unschool.",
        "Unschool is an e-learning platform offering industry-relevant courses and internships to help students gain practical skills and experience.",
        "Helped sales professionals maintain customer relationships by making follow up calls to recent buyers.",
        "Strengthened client relationships through regular communication and follow-ups, leading to repeat business.",
        "Contacted prospective customers through phone calls and emails to develop business.",
        "Collaborated closely with sales team to manage leads and help with proposals.",
        "Supported sales and marketing teams in creation and implementation of marketing campaigns."
      ]
    }
  ],
  projects: [],
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
    "AI/ML",
    "Data Analyst",
    "Software Engineering",
    "IoT/Embedded",
    "StartupTN Ecosystem",
    "Startup Generalist",
    "Product/Operations"
  ]
};

