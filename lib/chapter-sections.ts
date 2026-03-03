const CHAPTER_SECTION_SEPARATOR = ":::";

export const getChapterSectionAndTitle = (rawTitle: string) => {
  if (!rawTitle.includes(CHAPTER_SECTION_SEPARATOR)) {
    return {
      section: "General",
      lessonTitle: rawTitle,
    };
  }

  const [rawSection, ...rest] = rawTitle.split(CHAPTER_SECTION_SEPARATOR);
  const section = rawSection.trim() || "General";
  const lessonTitle = rest.join(CHAPTER_SECTION_SEPARATOR).trim() || rawTitle;

  return {
    section,
    lessonTitle,
  };
};

export const toStoredChapterTitle = (section: string, lessonTitle: string) => {
  const normalizedSection = section.trim() || "General";
  const normalizedLessonTitle = lessonTitle.trim();
  return `${normalizedSection}${CHAPTER_SECTION_SEPARATOR}${normalizedLessonTitle}`;
};
