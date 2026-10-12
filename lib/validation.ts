import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(200),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  subject: z
    .string()
    .trim()
    .max(120)
    .optional()
    .transform((value) => value || "Portfolio contact"),
  message: z.string().trim().min(10).max(5000),
  botcheck: z.string().max(200).optional().default(""),
});

const safeLink = z
  .string()
  .trim()
  .max(500)
  .refine((value) => {
    if (!value) return true;
    if (value.startsWith("/") && !value.startsWith("//")) return true;

    try {
      return new URL(value).protocol === "https:";
    } catch {
      return false;
    }
  }, "Use an HTTPS URL or a local path.");

export const projectSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(2000),
  year: z
    .string()
    .trim()
    .regex(/^\d{4}$/),
  technologies: z.array(z.string().trim().min(1).max(40)).max(20),
  githubUrl: safeLink,
  liveDemoUrl: safeLink,
  image: safeLink,
  featured: z.boolean(),
  displayOrder: z.number().int().min(0).max(10000),
});

export const pageViewSchema = z.object({
  anonymousId: z.string().uuid(),
  path: z
    .string()
    .trim()
    .min(1)
    .max(300)
    .refine((path) => path.startsWith("/") && !path.startsWith("//")),
  referrer: z.string().max(2000).optional().default(""),
  utmSource: z.string().trim().max(100).optional().default(""),
  utmMedium: z.string().trim().max(100).optional().default(""),
  utmCampaign: z.string().trim().max(150).optional().default(""),
});

export const sessionDurationSchema = z.object({
  anonymousId: z.string().uuid(),
  durationSeconds: z.number().int().min(0).max(86400),
});

export const messageUpdateSchema = z.object({
  isRead: z.boolean(),
});

export const profileUpdateSchema = z.object({
  displayName: z.string().trim().min(2).max(80),
});

export const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(12).max(200),
});
