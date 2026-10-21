export type PortfolioItem = {
  slug: string;
  title: string;
  description: string;
  overview: string;
  role: string;
  year: string;
  tech: string[];
  github?: string;
  live?: string;
  coverGradient: string;
  coverImage?: string;
};

export const portfolio: PortfolioItem[] = [
  {
    slug: "orbit-notes",
    title: "Orbit Notes",
    description: "A soft web notebook for fleeting ideas and motion experiments.",
    overview:
      "Orbit Notes is a lightweight notes UI exploring playful motion, glass panels, and a calm writing surface. Built as a personal lab for interface timing.",
    role: "Design & development",
    year: "2026",
    tech: ["Next.js", "TypeScript", "Motion"],
    github: "https://github.com/",
    live: "#",
    coverGradient: "linear-gradient(160deg,#14161C,#3B5BFF)",
  },
  {
    slug: "cubesat-ground",
    title: "CubeSat Ground Notes",
    description: "Internal notes and tools around a student CubeSat effort.",
    overview:
      "A living document set for CubeSat ground workflows — checklists, telemetry notes, and simple dashboards. Honest WIP rather than a polished product.",
    role: "Software contributor",
    year: "2025",
    tech: ["Python", "React", "CSV / logs"],
    github: "https://github.com/",
    coverGradient: "linear-gradient(160deg,#0B1D2A,#5ED6B0)",
  },
  {
    slug: "astroshutter",
    title: "AstroShutter",
    description: "Experiments around night sky capture and timing helpers.",
    overview:
      "AstroShutter collects small utilities and framing notes for longer exposures — pairing photography practice with tiny scripts that keep sessions organized.",
    role: "Photography & tooling",
    year: "2025",
    tech: ["Photography", "Lightroom", "Scripts"],
    github: "https://github.com/",
    coverGradient: "linear-gradient(160deg,#1B1F3B,#FFC83D)",
  },
];

export function getPortfolioItem(slug: string) {
  return portfolio.find((p) => p.slug === slug);
}
