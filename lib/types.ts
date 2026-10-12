export type AdminIdentity = {
  id: string;
  email: string;
  displayName: string;
  lastLoginAt: string | null;
};

export type AdminProject = {
  id: string;
  title: string;
  description: string;
  year: string;
  technologies: string[];
  githubUrl: string;
  liveDemoUrl: string;
  image: string;
  featured: boolean;
  displayOrder: number;
};
