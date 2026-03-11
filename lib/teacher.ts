export const isTeacher = (userId?: string | null) => {
  if (!userId) return false;

  const teacherIds = (process.env.NEXT_PUBLIC_TEACHER_ID || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  return teacherIds.includes(userId);
}