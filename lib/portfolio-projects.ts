export type PortfolioProject = {
  _id?: string;
  number: string;
  title: string;
  year: string;
  description: string;
  technologies: string[];
  image: string;
  github: string;
  demo: string;
  featured: boolean;
  displayOrder: number;
};

export const initialProjects: PortfolioProject[] = [
  {
    number: "01",
    title: "ElectroHub",
    year: "2026",
    description:
      "A full-stack e-commerce web application designed to provide users with a smooth online shopping experience.",
    technologies: [
      "React.js",
      "Node.js",
      "Typescript",
      "MongoDB",
      "React Router",
      "Vite",
      "Vercel",
    ],
    image: "/Project-image/Electrohub.png",
    github:
      "https://github.com/Vivekmittal0404/Electrohub-An-Ecommerce-web-application",
    demo: "https://electrohub-taupe.vercel.app/",
    featured: true,
    displayOrder: 0,
  },
  {
    number: "02",
    title: "Movie Relationship Explorer",
    year: "2026",
    description:
      "A full-stack graph-powered movie exploration platform supporting movie search, detailed movie information, relationship visualization, and related-movie discovery.",
    technologies: [
      "React.js",
      "Node.js",
      "Express",
      "CognoDB",
      "Render",
      "REST APIs",
      "Cypher queries",
    ],
    image: "/Project-image/MovieExplorer.png",
    github: "https://github.com/Vivekmittal0404/Movie-Relationship-Explorer",
    demo: "https://movie-relationship-explorer-frontend.onrender.com/",
    featured: true,
    displayOrder: 1,
  },
  {
    number: "03",
    title: "BlackCoffer Dashboard",
    year: "2026",
    description:
      "A comprehensive dashboard for visualizing and analyzing data from the BlackCoffer platform.",
    technologies: [
      "React.js",
      "Node.js",
      "Express",
      "MongoDB",
      "Vercel",
      "REST APIs",
      "D3.js visualization",
    ],
    image: "/Project-image/BlackCofferDashboard.png",
    github: "https://github.com/Vivekmittal0404/blackcoffer_dashboard",
    demo: "https://blackcoffer-dashboard-liard.vercel.app/",
    featured: true,
    displayOrder: 2,
  },
];
