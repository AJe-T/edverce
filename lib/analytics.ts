export const ANALYTICS_PRESETS = [
  "day",
  "week",
  "month",
  "all",
  "custom",
] as const;

export const ANALYTICS_GROUP_BY = [
  "hour",
  "day",
  "week",
  "month",
] as const;

export type AnalyticsPreset = (typeof ANALYTICS_PRESETS)[number];
export type AnalyticsGroupBy = (typeof ANALYTICS_GROUP_BY)[number];

export interface AnalyticsFilters {
  preset?: AnalyticsPreset;
  groupBy?: AnalyticsGroupBy;
  startDate?: string | null;
  endDate?: string | null;
}

export interface AnalyticsOverview {
  totalRevenue: number;
  totalSales: number;
  totalStudents: number;
  totalCourses: number;
  averageProgress: number;
  completionRate: number;
}

export interface AnalyticsTimelinePoint {
  bucketKey: string;
  label: string;
  revenue: number;
  sales: number;
  students: number;
}

export interface AnalyticsCoursePerformance {
  courseId: string;
  title: string;
  revenue: number;
  sales: number;
  students: number;
  averageProgress: number;
  completionRate: number;
  price: number | null;
}

export interface AnalyticsAppliedFilters {
  preset: AnalyticsPreset;
  groupBy: AnalyticsGroupBy;
  startDate: string | null;
  endDate: string | null;
  label: string;
}

export interface AnalyticsDataset {
  overview: AnalyticsOverview;
  timeline: AnalyticsTimelinePoint[];
  coursePerformance: AnalyticsCoursePerformance[];
  topRevenueCourses: AnalyticsCoursePerformance[];
  topStudentCourses: AnalyticsCoursePerformance[];
  topProgressCourses: AnalyticsCoursePerformance[];
  lowestProgressCourses: AnalyticsCoursePerformance[];
  appliedFilters: AnalyticsAppliedFilters;
}
