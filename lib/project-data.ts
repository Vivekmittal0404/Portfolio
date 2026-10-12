import "server-only";

import { connection } from "next/server";
import { isDatabaseConfigured, connectDatabase } from "@/lib/db";
import { PortfolioSetting, Project } from "@/lib/models";
import {
  initialProjects,
  type PortfolioProject,
} from "@/lib/portfolio-projects";

function toPublicProject(
  project: {
    _id?: unknown;
    title: string;
    description: string;
    year: string;
    technologies: string[];
    githubUrl: string;
    liveDemoUrl: string;
    image: string;
    featured?: boolean;
    displayOrder?: number;
  },
  index: number,
): PortfolioProject {
  return {
    _id: project._id ? String(project._id) : undefined,
    number: String(index + 1).padStart(2, "0"),
    title: project.title,
    year: project.year,
    description: project.description,
    technologies: project.technologies,
    image: project.image,
    github: project.githubUrl,
    demo: project.liveDemoUrl,
    featured: project.featured ?? true,
    displayOrder: project.displayOrder ?? index,
  };
}

export async function seedProjectsWhenEmpty() {
  await connectDatabase();
  const migrationKey = "legacy-projects-v1";
  if (await PortfolioSetting.exists({ key: migrationKey })) return;

  if (!(await Project.exists({}))) {
    try {
      await Project.insertMany(
        initialProjects.map((project, index) => ({
          title: project.title,
          description: project.description,
          year: project.year,
          technologies: project.technologies,
          githubUrl: project.github,
          liveDemoUrl: project.demo,
          image: project.image,
          featured: project.featured,
          displayOrder: project.displayOrder,
          legacyKey: `legacy-project-${index + 1}`,
        })),
        { ordered: false },
      );
    } catch (error) {
      if (
        !(
          error &&
          typeof error === "object" &&
          "code" in error &&
          error.code === 11000
        )
      ) {
        throw error;
      }
    }
  }

  await PortfolioSetting.updateOne(
    { key: migrationKey },
    { $setOnInsert: { value: "complete" } },
    { upsert: true },
  );
}

export async function getPublicProjects() {
  if (!isDatabaseConfigured()) return initialProjects;

  await connection();
  try {
    await connectDatabase();
    const isInitialized = await PortfolioSetting.exists({
      key: "legacy-projects-v1",
    });
    if (!isInitialized) return initialProjects;

    const projects = await Project.find({ featured: true })
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();

    return projects.map(toPublicProject);
  } catch {
    return initialProjects;
  }
}
