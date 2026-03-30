import { db } from "@/lib/db";
import {
  ANALYTICS_GROUP_BY,
  ANALYTICS_PRESETS,
  type AnalyticsCoursePerformance,
  type AnalyticsDataset,
  type AnalyticsFilters,
  type AnalyticsGroupBy,
  type AnalyticsPreset,
} from "@/lib/analytics";

const DAY_MS = 24 * 60 * 60 * 1000;

const isValidPreset = (value?: string | null): value is AnalyticsPreset =>
  !!value && ANALYTICS_PRESETS.includes(value as AnalyticsPreset);

const isValidGroupBy = (value?: string | null): value is AnalyticsGroupBy =>
  !!value && ANALYTICS_GROUP_BY.includes(value as AnalyticsGroupBy);

const startOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const endOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
};

const startOfHour = (date: Date) => {
  const next = new Date(date);
  next.setMinutes(0, 0, 0);
  return next;
};

const startOfWeek = (date: Date) => {
  const next = startOfDay(date);
  const day = next.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + diff);
  return next;
};

const startOfMonth = (date: Date) => {
  const next = startOfDay(date);
  next.setDate(1);
  return next;
};

const addStep = (date: Date, groupBy: AnalyticsGroupBy) => {
  const next = new Date(date);

  if (groupBy === "hour") {
    next.setHours(next.getHours() + 1);
    return next;
  }

  if (groupBy === "day") {
    next.setDate(next.getDate() + 1);
    return next;
  }

  if (groupBy === "week") {
    next.setDate(next.getDate() + 7);
    return next;
  }

  next.setMonth(next.getMonth() + 1);
  return next;
};

const toInputDate = (date: Date | null) =>
  date
    ? `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`
    : null;

const getDefaultGroupBy = (preset: AnalyticsPreset) => {
  switch (preset) {
    case "day":
      return "hour";
    case "week":
    case "month":
    case "custom":
      return "day";
    case "all":
    default:
      return "month";
  }
};

const parseDateInput = (value?: string | null) => {
  if (!value) return null;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatBucketLabel = (date: Date, groupBy: AnalyticsGroupBy) => {
  if (groupBy === "hour") {
    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (groupBy === "day") {
    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });
  }

  if (groupBy === "week") {
    const weekEnd = new Date(date);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return `${date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    })} - ${weekEnd.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    })}`;
  }

  return date.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
};

const getBucketStart = (date: Date, groupBy: AnalyticsGroupBy) => {
  if (groupBy === "hour") return startOfHour(date);
  if (groupBy === "day") return startOfDay(date);
  if (groupBy === "week") return startOfWeek(date);
  return startOfMonth(date);
};

const getBucketKey = (date: Date, groupBy: AnalyticsGroupBy) => {
  const bucketStart = getBucketStart(date, groupBy);
  return bucketStart.toISOString();
};

const resolveRange = async (filters: AnalyticsFilters) => {
  const now = new Date();
  const preset = isValidPreset(filters.preset) ? filters.preset : "month";
  const requestedGroupBy = isValidGroupBy(filters.groupBy)
    ? filters.groupBy
    : undefined;

  if (preset === "all") {
    const firstPurchase = await db.purchase.findFirst({
      orderBy: {
        createdAt: "asc",
      },
      select: {
        createdAt: true,
      },
    });

    const startDate = firstPurchase ? startOfMonth(firstPurchase.createdAt) : startOfMonth(now);
    const endDate = endOfDay(now);
    const groupBy = requestedGroupBy || getDefaultGroupBy(preset);

    return {
      preset,
      groupBy,
      startDate,
      endDate,
      label: "All time",
    };
  }

  if (preset === "custom") {
    const customStart = parseDateInput(filters.startDate);
    const customEnd = parseDateInput(filters.endDate);
    const endDate = customEnd ? endOfDay(customEnd) : endOfDay(now);
    const startDate = customStart ? startOfDay(customStart) : startOfDay(new Date(endDate.getTime() - 29 * DAY_MS));
    const groupBy = requestedGroupBy || getDefaultGroupBy(preset);

    return {
      preset,
      groupBy,
      startDate,
      endDate,
      label: "Custom range",
    };
  }

  if (preset === "day") {
    const startDate = startOfDay(now);
    return {
      preset,
      groupBy: requestedGroupBy || getDefaultGroupBy(preset),
      startDate,
      endDate: endOfDay(now),
      label: "Today",
    };
  }

  if (preset === "week") {
    const startDate = startOfDay(new Date(now.getTime() - 6 * DAY_MS));
    return {
      preset,
      groupBy: requestedGroupBy || getDefaultGroupBy(preset),
      startDate,
      endDate: endOfDay(now),
      label: "Last 7 days",
    };
  }

  const startDate = startOfDay(new Date(now.getTime() - 29 * DAY_MS));
  return {
    preset,
    groupBy: requestedGroupBy || getDefaultGroupBy("month"),
    startDate,
    endDate: endOfDay(now),
    label: "Last 30 days",
  };
};

const roundMetric = (value: number) => Math.round(value * 10) / 10;

export const getAnalytics = async (
  filters: AnalyticsFilters = {},
): Promise<AnalyticsDataset> => {
  try {
    const resolved = await resolveRange(filters);

    const purchases = await db.purchase.findMany({
      where: {
        createdAt: {
          gte: resolved.startDate,
          lte: resolved.endDate,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        userId: true,
        courseId: true,
        price: true,
        createdAt: true,
        course: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
      },
    });

    const courseIds = Array.from(new Set(purchases.map((purchase) => purchase.courseId)));
    const studentIds = Array.from(new Set(purchases.map((purchase) => purchase.userId)));

    const chapters = courseIds.length
      ? await db.chapter.findMany({
          where: {
            courseId: {
              in: courseIds,
            },
            isPublished: true,
          },
          select: {
            id: true,
            courseId: true,
          },
        })
      : [];

    const chapterIds = chapters.map((chapter) => chapter.id);

    const completedProgress = chapterIds.length && studentIds.length
      ? await db.userProgress.findMany({
          where: {
            chapterId: {
              in: chapterIds,
            },
            userId: {
              in: studentIds,
            },
            isCompleted: true,
          },
          select: {
            userId: true,
            chapterId: true,
          },
        })
      : [];

    const courseChapterCount = new Map<string, number>();
    const chapterToCourse = new Map<string, string>();
    for (const chapter of chapters) {
      chapterToCourse.set(chapter.id, chapter.courseId);
      courseChapterCount.set(
        chapter.courseId,
        (courseChapterCount.get(chapter.courseId) || 0) + 1,
      );
    }

    const courseUserCompletedMap = new Map<string, Map<string, number>>();
    for (const row of completedProgress) {
      const courseId = chapterToCourse.get(row.chapterId);
      if (!courseId) continue;

      const userMap = courseUserCompletedMap.get(courseId) || new Map<string, number>();
      userMap.set(row.userId, (userMap.get(row.userId) || 0) + 1);
      courseUserCompletedMap.set(courseId, userMap);
    }

    const timelineSeed = new Map<
      string,
      {
        label: string;
        revenue: number;
        sales: number;
        studentIds: Set<string>;
      }
    >();

    for (
      let cursor = getBucketStart(resolved.startDate, resolved.groupBy);
      cursor <= resolved.endDate;
      cursor = addStep(cursor, resolved.groupBy)
    ) {
      const key = cursor.toISOString();
      timelineSeed.set(key, {
        label: formatBucketLabel(cursor, resolved.groupBy),
        revenue: 0,
        sales: 0,
        studentIds: new Set<string>(),
      });
    }

    const coursePerformanceMap = new Map<
      string,
      {
        courseId: string;
        title: string;
        revenue: number;
        sales: number;
        studentIds: Set<string>;
        price: number | null;
      }
    >();

    for (const purchase of purchases) {
      const amount = purchase.price ?? purchase.course.price ?? 0;
      const bucketKey = getBucketKey(purchase.createdAt, resolved.groupBy);
      const bucket = timelineSeed.get(bucketKey);

      if (bucket) {
        bucket.revenue += amount;
        bucket.sales += 1;
        bucket.studentIds.add(purchase.userId);
      }

      const courseMetric = coursePerformanceMap.get(purchase.courseId) || {
        courseId: purchase.courseId,
        title: purchase.course.title,
        revenue: 0,
        sales: 0,
        studentIds: new Set<string>(),
        price: purchase.course.price,
      };

      courseMetric.revenue += amount;
      courseMetric.sales += 1;
      courseMetric.studentIds.add(purchase.userId);
      coursePerformanceMap.set(purchase.courseId, courseMetric);
    }

    const coursePerformance: AnalyticsCoursePerformance[] = Array.from(
      coursePerformanceMap.values(),
    ).map((course) => {
      const chapterCount = courseChapterCount.get(course.courseId) || 0;
      const completedMap = courseUserCompletedMap.get(course.courseId) || new Map<string, number>();
      const uniqueStudents = Array.from(course.studentIds);

      let progressTotal = 0;
      let completedStudents = 0;

      for (const studentId of uniqueStudents) {
        const completedChapters = completedMap.get(studentId) || 0;
        const progress = chapterCount
          ? (completedChapters / chapterCount) * 100
          : 0;

        progressTotal += progress;
        if (progress === 100) {
          completedStudents += 1;
        }
      }

      const averageProgress = uniqueStudents.length
        ? progressTotal / uniqueStudents.length
        : 0;

      return {
        courseId: course.courseId,
        title: course.title,
        revenue: roundMetric(course.revenue),
        sales: course.sales,
        students: uniqueStudents.length,
        averageProgress: roundMetric(averageProgress),
        completionRate: roundMetric(
          uniqueStudents.length ? (completedStudents / uniqueStudents.length) * 100 : 0,
        ),
        price: course.price,
      };
    });

    coursePerformance.sort((left, right) => right.revenue - left.revenue);

    const timeline = Array.from(timelineSeed.entries()).map(([bucketKey, bucket]) => ({
      bucketKey,
      label: bucket.label,
      revenue: roundMetric(bucket.revenue),
      sales: bucket.sales,
      students: bucket.studentIds.size,
    }));

    const uniqueStudents = new Set(purchases.map((purchase) => purchase.userId));
    const totalRevenue = coursePerformance.reduce((sum, course) => sum + course.revenue, 0);
    const totalSales = purchases.length;
    const totalCourses = coursePerformance.length;
    const averageProgress = totalCourses
      ? coursePerformance.reduce((sum, course) => sum + course.averageProgress, 0) / totalCourses
      : 0;
    const completionRate = totalCourses
      ? coursePerformance.reduce((sum, course) => sum + course.completionRate, 0) / totalCourses
      : 0;

    const sortBy = (
      selector: (course: AnalyticsCoursePerformance) => number,
      direction: "asc" | "desc" = "desc",
    ) =>
      [...coursePerformance].sort((left, right) => {
        const comparison = selector(left) - selector(right);
        return direction === "asc" ? comparison : -comparison;
      });

    return {
      overview: {
        totalRevenue: roundMetric(totalRevenue),
        totalSales,
        totalStudents: uniqueStudents.size,
        totalCourses,
        averageProgress: roundMetric(averageProgress),
        completionRate: roundMetric(completionRate),
      },
      timeline,
      coursePerformance,
      topRevenueCourses: sortBy((course) => course.revenue).slice(0, 5),
      topStudentCourses: sortBy((course) => course.students).slice(0, 5),
      topProgressCourses: sortBy((course) => course.averageProgress).slice(0, 5),
      lowestProgressCourses: sortBy((course) => course.averageProgress, "asc").slice(0, 5),
      appliedFilters: {
        preset: resolved.preset,
        groupBy: resolved.groupBy,
        startDate: toInputDate(resolved.startDate),
        endDate: toInputDate(resolved.endDate),
        label: resolved.label,
      },
    };
  } catch (error) {
    console.log("[GET_ANALYTICS]", error);
    return {
      overview: {
        totalRevenue: 0,
        totalSales: 0,
        totalStudents: 0,
        totalCourses: 0,
        averageProgress: 0,
        completionRate: 0,
      },
      timeline: [],
      coursePerformance: [],
      topRevenueCourses: [],
      topStudentCourses: [],
      topProgressCourses: [],
      lowestProgressCourses: [],
      appliedFilters: {
        preset: "month",
        groupBy: "day",
        startDate: null,
        endDate: null,
        label: "Last 30 days",
      },
    };
  }
};
