import {
  FaGraduationCap,
  FaStickyNote,
  FaComments,
  FaWhatsapp,
} from "react-icons/fa";

export const features = [
  {
    icon: FaGraduationCap,
    title: "Paid Courses",
    description:
      "Structured batches with rigorous syllabi, assignments, and assessments.",
  },
  {
    icon: FaStickyNote,
    title: "Notes",
    description:
      "Concise, exam-ready PDFs and summarized cheat sheets.",
  },
  {
    icon: FaComments,
    title: "Live Doubt Sessions",
    description:
      "Real-time Q&A with mentors to resolve concepts quickly.",
  },
  {
    icon: FaWhatsapp,
    title: "WhatsApp Community",
    description:
      "Peer learning groups for updates, tips, and motivation.",
  },
];

import { FaFireAlt, FaProjectDiagram, FaFlask } from "react-icons/fa";
import { MdScience } from "react-icons/md";

export const subjects = [
  {
    icon: FaFireAlt,
    title: "Thermodynamics",
    description: "Heat, work, and equilibrium",
    tags: ["Physical", "Advanced"],
  },
  {
    icon: FaProjectDiagram,
    title: "Polymer Chemistry",
    description: "Synthesis and characterization",
    tags: ["Organic", "Projects"],
  },
  {
    icon: MdScience,
    title: "Spectroscopy",
    description: "IR, NMR, and MS techniques",
    tags: ["Instrumentation", "Labs"],
  },
];
