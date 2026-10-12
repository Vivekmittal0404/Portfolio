import "server-only";

import { connectDatabase } from "@/lib/db";
import {
  ContactMessage,
  PageView,
  Project,
  ResumeDownload,
  VisitorSession,
} from "@/lib/models";
import { seedProjectsWhenEmpty } from "@/lib/project-data";

function dateWindows() {
  const now = new Date();
  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const week = new Date(today);
  week.setUTCDate(week.getUTCDate() - ((week.getUTCDay() + 6) % 7));
  const month = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  return { now, today, yesterday, week, month };
}

export async function getOverviewData() {
  await connectDatabase();
  const { today, yesterday, week, month } = dateWindows();
  const [
    visitorsToday,
    visitorsYesterday,
    visitorsWeek,
    visitorsMonth,
    visitorsTotal,
    downloadsToday,
    downloadsWeek,
    downloadsMonth,
    downloadsTotal,
    unreadMessages,
    messageTotal,
    recentMessages,
    recentDownloads,
  ] = await Promise.all([
    VisitorSession.countDocuments({ firstSeenAt: { $gte: today } }),
    VisitorSession.countDocuments({
      firstSeenAt: { $gte: yesterday, $lt: today },
    }),
    VisitorSession.countDocuments({ firstSeenAt: { $gte: week } }),
    VisitorSession.countDocuments({ firstSeenAt: { $gte: month } }),
    VisitorSession.countDocuments(),
    ResumeDownload.countDocuments({ downloadedAt: { $gte: today } }),
    ResumeDownload.countDocuments({ downloadedAt: { $gte: week } }),
    ResumeDownload.countDocuments({ downloadedAt: { $gte: month } }),
    ResumeDownload.countDocuments(),
    ContactMessage.countDocuments({ readAt: null }),
    ContactMessage.countDocuments(),
    ContactMessage.find().sort({ submittedAt: -1 }).limit(5).lean(),
    ResumeDownload.find().sort({ downloadedAt: -1 }).limit(5).lean(),
  ]);

  return {
    visitors: {
      today: visitorsToday,
      yesterday: visitorsYesterday,
      week: visitorsWeek,
      month: visitorsMonth,
      total: visitorsTotal,
    },
    downloads: {
      today: downloadsToday,
      week: downloadsWeek,
      month: downloadsMonth,
      total: downloadsTotal,
    },
    messages: { unread: unreadMessages, total: messageTotal },
    recentMessages: recentMessages.map((message) => ({
      id: String(message._id),
      name: message.name,
      subject: message.subject,
      submittedAt: message.submittedAt.toISOString(),
      isRead: Boolean(message.readAt),
    })),
    recentDownloads: recentDownloads.map((download) => ({
      id: String(download._id),
      downloadedAt: download.downloadedAt.toISOString(),
      source: download.source,
      country: download.country,
    })),
  };
}

export async function getVisitorRows() {
  await connectDatabase();
  const rows = await VisitorSession.find()
    .sort({ lastSeenAt: -1 })
    .limit(200)
    .lean();

  return rows.map((row) => ({
    id: String(row._id),
    anonymousId: row.anonymousId,
    firstSeenAt: row.firstSeenAt.toISOString(),
    lastSeenAt: row.lastSeenAt.toISOString(),
    country: row.country,
    region: row.region,
    city: row.city,
    browser: row.browser,
    operatingSystem: row.operatingSystem,
    device: row.device,
    source: row.source,
    referringDomain: row.referringDomain,
    landingPage: row.landingPage,
    pagesVisited: row.pagesVisited,
    durationSeconds: row.durationSeconds,
    viewCount: row.viewCount,
  }));
}

export async function getResumeDownloadData() {
  await connectDatabase();
  const { today, week, month } = dateWindows();
  const [total, downloadsToday, downloadsWeek, downloadsMonth, rows] =
    await Promise.all([
      ResumeDownload.countDocuments(),
      ResumeDownload.countDocuments({ downloadedAt: { $gte: today } }),
      ResumeDownload.countDocuments({ downloadedAt: { $gte: week } }),
      ResumeDownload.countDocuments({ downloadedAt: { $gte: month } }),
      ResumeDownload.find().sort({ downloadedAt: -1 }).limit(250).lean(),
    ]);

  return {
    totals: {
      total,
      today: downloadsToday,
      week: downloadsWeek,
      month: downloadsMonth,
    },
    rows: rows.map((row) => ({
      id: String(row._id),
      anonymousId: row.anonymousId,
      downloadedAt: row.downloadedAt.toISOString(),
      country: row.country,
      region: row.region,
      city: row.city,
      browser: row.browser,
      operatingSystem: row.operatingSystem,
      device: row.device,
      source: row.source,
      referringDomain: row.referringDomain,
      utmSource: row.utmSource,
      utmMedium: row.utmMedium,
      utmCampaign: row.utmCampaign,
    })),
  };
}

export async function getMessageRows(search = "") {
  await connectDatabase();
  const query = search.trim().slice(0, 100);
  const filter = query
    ? {
        $or: ["name", "email", "subject", "message"].map((field) => ({
          [field]: {
            $regex: query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            $options: "i",
          },
        })),
      }
    : {};
  const rows = await ContactMessage.find(filter)
    .sort({ submittedAt: -1 })
    .limit(250)
    .lean();

  return rows.map((row) => ({
    id: String(row._id),
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    isRead: Boolean(row.readAt),
    submittedAt: row.submittedAt.toISOString(),
    country: row.country,
    region: row.region,
    city: row.city,
    source: row.source,
    referringDomain: row.referringDomain,
  }));
}

export async function getProjectRows() {
  await seedProjectsWhenEmpty();
  const rows = await Project.find()
    .sort({ displayOrder: 1, createdAt: 1 })
    .lean();
  return rows.map((row) => ({
    id: String(row._id),
    title: row.title,
    description: row.description,
    year: row.year,
    technologies: row.technologies,
    githubUrl: row.githubUrl,
    liveDemoUrl: row.liveDemoUrl,
    image: row.image,
    featured: row.featured,
    displayOrder: row.displayOrder,
  }));
}

function summarize(rows: Array<{ _id: string; count: number }>, total: number) {
  return rows.map((row) => ({
    name: row._id || "Unknown",
    count: row.count,
    percentage: total ? Math.round((row.count / total) * 100) : 0,
  }));
}

export async function getAnalyticsData() {
  await connectDatabase();
  const [
    sources,
    countries,
    cities,
    pages,
    devices,
    browsers,
    totalVisitors,
    totalPageViews,
  ] = await Promise.all([
    VisitorSession.aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$source", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    VisitorSession.aggregate<{ _id: string; count: number }>([
      { $match: { country: { $nin: [null, ""] } } },
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    VisitorSession.aggregate<{ _id: string; count: number }>([
      { $match: { city: { $nin: [null, ""] } } },
      {
        $group: {
          _id: { $concat: ["$city", ", ", { $ifNull: ["$country", ""] }] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    PageView.aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$path", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    VisitorSession.aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$device", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    VisitorSession.aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$browser", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    VisitorSession.countDocuments(),
    PageView.countDocuments(),
  ]);

  return {
    sources: summarize(sources, totalVisitors),
    countries: summarize(countries, totalVisitors),
    cities: summarize(cities, totalVisitors),
    pages: summarize(pages, totalPageViews),
    devices: summarize(devices, totalVisitors),
    browsers: summarize(browsers, totalVisitors),
  };
}

export async function getAdminProjectRecord(id: string) {
  await connectDatabase();
  return Project.findById(id);
}
