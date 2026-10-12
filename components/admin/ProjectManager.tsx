"use client";

import { useState, type FormEvent } from "react";

type Project = {
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

type ProjectForm = Omit<Project, "id" | "technologies"> & {
  technologiesText: string;
};

const emptyForm: ProjectForm = {
  title: "",
  description: "",
  year: String(new Date().getFullYear()),
  technologiesText: "",
  githubUrl: "",
  liveDemoUrl: "",
  image: "",
  featured: true,
  displayOrder: 0,
};

function toForm(project: Project): ProjectForm {
  return { ...project, technologiesText: project.technologies.join(", ") };
}

export default function ProjectManager({
  initialProjects,
}: {
  initialProjects: Project[];
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function startNew() {
    setEditingId(null);
    setIsFormOpen(true);
    setForm({ ...emptyForm, displayOrder: projects.length });
    setMessage("");
  }

  function startEdit(project: Project) {
    setEditingId(project.id);
    setIsFormOpen(true);
    setForm(toForm(project));
    setMessage("");
  }

  function updateForm<K extends keyof ProjectForm>(
    key: K,
    value: ProjectForm[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    const payload = {
      title: form.title,
      description: form.description,
      year: form.year,
      technologies: form.technologiesText
        .split(",")
        .map((technology) => technology.trim())
        .filter(Boolean),
      githubUrl: form.githubUrl,
      liveDemoUrl: form.liveDemoUrl,
      image: form.image,
      featured: form.featured,
      displayOrder: Number(form.displayOrder),
    };

    try {
      const response = await fetch(
        editingId ? `/api/admin/projects/${editingId}` : "/api/admin/projects",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const result = (await response.json()) as { message?: string };
      if (!response.ok)
        throw new Error(result.message ?? "Unable to save project.");

      const refreshed = await fetch("/api/admin/projects", {
        cache: "no-store",
      });
      if (!refreshed.ok)
        throw new Error("Saved, but the project list could not refresh.");
      setProjects((await refreshed.json()) as Project[]);
      setEditingId(null);
      setIsFormOpen(false);
      setForm(emptyForm);
      setMessage("Project saved.");
    } catch (cause) {
      setMessage(
        cause instanceof Error ? cause.message : "Unable to save project.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function remove(project: Project) {
    if (!window.confirm(`Delete “${project.title}” from the portfolio?`))
      return;
    setMessage("");
    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Unable to delete project.");
      setProjects((current) =>
        current.filter((item) => item.id !== project.id),
      );
      if (editingId === project.id) {
        setEditingId(null);
        setIsFormOpen(false);
        setForm(emptyForm);
      }
      setMessage("Project deleted.");
    } catch (cause) {
      setMessage(
        cause instanceof Error ? cause.message : "Unable to delete project.",
      );
    }
  }

  const fieldClass =
    "mt-2 h-10 w-full border border-white/10 bg-black px-3 text-sm text-white outline-none focus:border-blue-400/60";
  const labelClass = "block text-xs text-gray-400";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          {projects.length} projects · featured items appear publicly
        </p>
        <button
          className="h-10 bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-blue-100"
          onClick={startNew}
          type="button"
        >
          Add project
        </button>
      </div>

      {message && (
        <p aria-live="polite" className="text-sm text-blue-200">
          {message}
        </p>
      )}

      {(isFormOpen || projects.length === 0) && (
        <form
          className="border border-white/10 bg-white/[0.02] p-5 sm:p-6"
          onSubmit={submit}
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-medium">
              {editingId ? "Edit project" : "New project"}
            </h2>
            <button
              className="text-sm text-gray-500 hover:text-white"
              onClick={() => {
                setEditingId(null);
                setIsFormOpen(false);
                setForm(emptyForm);
              }}
              type="button"
            >
              Cancel
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className={labelClass}>
              Title
              <input
                className={fieldClass}
                maxLength={120}
                onChange={(event) => updateForm("title", event.target.value)}
                required
                value={form.title}
              />
            </label>
            <label className={labelClass}>
              Year
              <input
                className={fieldClass}
                maxLength={4}
                onChange={(event) => updateForm("year", event.target.value)}
                pattern="\d{4}"
                required
                value={form.year}
              />
            </label>
            <label className={`${labelClass} md:col-span-2`}>
              Description
              <textarea
                className="mt-2 min-h-24 w-full border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none focus:border-blue-400/60"
                maxLength={2000}
                onChange={(event) =>
                  updateForm("description", event.target.value)
                }
                required
                value={form.description}
              />
            </label>
            <label className={labelClass}>
              Technologies, comma separated
              <input
                className={fieldClass}
                onChange={(event) =>
                  updateForm("technologiesText", event.target.value)
                }
                placeholder="React, Next.js, TypeScript"
                value={form.technologiesText}
              />
            </label>
            <label className={labelClass}>
              Display order
              <input
                className={fieldClass}
                max={10000}
                min={0}
                onChange={(event) =>
                  updateForm("displayOrder", Number(event.target.value))
                }
                type="number"
                value={form.displayOrder}
              />
            </label>
            <label className={labelClass}>
              GitHub URL
              <input
                className={fieldClass}
                onChange={(event) =>
                  updateForm("githubUrl", event.target.value)
                }
                placeholder="https://github.com/..."
                value={form.githubUrl}
              />
            </label>
            <label className={labelClass}>
              Live demo URL
              <input
                className={fieldClass}
                onChange={(event) =>
                  updateForm("liveDemoUrl", event.target.value)
                }
                placeholder="https://..."
                value={form.liveDemoUrl}
              />
            </label>
            <label className={`${labelClass} md:col-span-2`}>
              Image path or HTTPS URL
              <input
                className={fieldClass}
                onChange={(event) => updateForm("image", event.target.value)}
                placeholder="/Project-image/project.png"
                required
                value={form.image}
              />
            </label>
            <label className="flex items-center gap-3 text-sm text-gray-300 md:col-span-2">
              <input
                checked={form.featured}
                onChange={(event) =>
                  updateForm("featured", event.target.checked)
                }
                type="checkbox"
              />
              Show in public Projects section
            </label>
          </div>
          <button
            className="mt-5 h-10 bg-white px-5 text-sm font-medium text-black disabled:opacity-50"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? "Saving..." : "Save project"}
          </button>
        </form>
      )}

      <div className="overflow-x-auto border border-white/10">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-white/[0.03] text-xs text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">Technologies</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr className="border-t border-white/10" key={project.id}>
                <td className="px-4 py-3 tabular-nums text-gray-500">
                  {project.displayOrder}
                </td>
                <td className="px-4 py-3">
                  <span className="text-gray-200">{project.title}</span>
                  <span className="block text-xs text-gray-600">
                    {project.year}
                  </span>
                </td>
                <td className="max-w-[300px] px-4 py-3 text-xs text-gray-500">
                  {project.technologies.join(", ")}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {project.featured ? "Yes" : "No"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button
                      className="text-xs text-blue-300 hover:text-white"
                      onClick={() => startEdit(project)}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="text-xs text-red-300 hover:text-red-200"
                      onClick={() => void remove(project)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-gray-500" colSpan={5}>
                  No projects yet. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
