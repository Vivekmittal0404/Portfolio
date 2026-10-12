import "server-only";

import { model, models, Schema } from "mongoose";

const adminSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    displayName: { type: String, required: true, trim: true, maxlength: 80 },
    passwordHash: { type: String, required: true, select: false },
    isActive: { type: Boolean, default: true },
    authVersion: { type: Number, default: 0 },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true },
);
adminSchema.index({ email: 1 }, { unique: true });

const visitorSessionSchema = new Schema(
  {
    anonymousId: { type: String, required: true, unique: true },
    firstSeenAt: { type: Date, required: true },
    lastSeenAt: { type: Date, required: true },
    country: { type: String, default: null },
    region: { type: String, default: null },
    city: { type: String, default: null },
    browser: { type: String, default: "Unknown" },
    operatingSystem: { type: String, default: "Unknown" },
    device: { type: String, default: "Unknown" },
    source: { type: String, default: "Direct" },
    referringDomain: { type: String, default: null },
    landingPage: { type: String, required: true },
    pagesVisited: { type: [String], default: [] },
    utmSource: { type: String, default: null },
    utmMedium: { type: String, default: null },
    utmCampaign: { type: String, default: null },
    durationSeconds: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);
visitorSessionSchema.index({ lastSeenAt: -1 });
visitorSessionSchema.index({ firstSeenAt: -1 });
visitorSessionSchema.index({ source: 1, lastSeenAt: -1 });
visitorSessionSchema.index({ country: 1, city: 1, lastSeenAt: -1 });

const pageViewSchema = new Schema(
  {
    anonymousId: { type: String, required: true },
    path: { type: String, required: true },
    source: { type: String, required: true },
    viewedAt: { type: Date, required: true, default: Date.now },
    durationSeconds: { type: Number, default: 0 },
  },
  { timestamps: false },
);
pageViewSchema.index({ viewedAt: -1 });
pageViewSchema.index({ anonymousId: 1, viewedAt: -1 });
pageViewSchema.index({ path: 1, viewedAt: -1 });
pageViewSchema.index({ source: 1, viewedAt: -1 });

const resumeDownloadSchema = new Schema(
  {
    anonymousId: { type: String, required: true },
    downloadedAt: { type: Date, required: true, default: Date.now },
    country: { type: String, default: null },
    region: { type: String, default: null },
    city: { type: String, default: null },
    browser: { type: String, default: "Unknown" },
    operatingSystem: { type: String, default: "Unknown" },
    device: { type: String, default: "Unknown" },
    source: { type: String, default: "Direct" },
    referringDomain: { type: String, default: null },
    utmSource: { type: String, default: null },
    utmMedium: { type: String, default: null },
    utmCampaign: { type: String, default: null },
  },
  { timestamps: false },
);
resumeDownloadSchema.index({ downloadedAt: -1 });
resumeDownloadSchema.index({ anonymousId: 1, downloadedAt: -1 });
resumeDownloadSchema.index({ source: 1, downloadedAt: -1 });
resumeDownloadSchema.index({ country: 1, city: 1, downloadedAt: -1 });

const contactMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    subject: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    readAt: { type: Date, default: null },
    submittedAt: { type: Date, required: true, default: Date.now },
    country: { type: String, default: null },
    region: { type: String, default: null },
    city: { type: String, default: null },
    source: { type: String, default: "Direct" },
    referringDomain: { type: String, default: null },
  },
  { timestamps: false },
);
contactMessageSchema.index({ submittedAt: -1 });
contactMessageSchema.index({ readAt: 1, submittedAt: -1 });
contactMessageSchema.index({
  name: "text",
  email: "text",
  subject: "text",
  message: "text",
});

const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    year: { type: String, required: true, match: /^\d{4}$/ },
    technologies: { type: [String], default: [] },
    githubUrl: { type: String, default: "" },
    liveDemoUrl: { type: String, default: "" },
    image: { type: String, required: true, maxlength: 500 },
    legacyKey: { type: String, default: undefined },
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);
projectSchema.index({ displayOrder: 1, createdAt: 1 });
projectSchema.index({ featured: -1, displayOrder: 1 });
projectSchema.index({ legacyKey: 1 }, { unique: true, sparse: true });

const rateLimitSchema = new Schema(
  {
    key: { type: String, required: true },
    window: { type: Number, required: true },
    count: { type: Number, required: true, default: 0 },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: false },
);
rateLimitSchema.index({ key: 1, window: 1 }, { unique: true });
rateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const portfolioSettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true },
);

export const Admin = models.Admin || model("Admin", adminSchema);
export const VisitorSession =
  models.VisitorSession || model("VisitorSession", visitorSessionSchema);
export const PageView = models.PageView || model("PageView", pageViewSchema);
export const ResumeDownload =
  models.ResumeDownload || model("ResumeDownload", resumeDownloadSchema);
export const ContactMessage =
  models.ContactMessage || model("ContactMessage", contactMessageSchema);
export const Project = models.Project || model("Project", projectSchema);
export const RateLimit =
  models.RateLimit || model("RateLimit", rateLimitSchema);
export const PortfolioSetting =
  models.PortfolioSetting || model("PortfolioSetting", portfolioSettingSchema);
