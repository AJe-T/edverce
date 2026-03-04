import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { File } from "lucide-react";

import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { getChapterSectionAndTitle } from "@/lib/chapter-sections";

import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { CourseProgressButton } from "./_components/course-progress-button";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const { chapter, course, attachments, nextChapter, userProgress, purchase } =
    await getChapter({
      userId,
      chapterId: params.chapterId,
      courseId: params.courseId,
    });

  if (!chapter || !course) {
    return redirect("/");
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;
  const { lessonTitle, section } = getChapterSectionAndTitle(chapter.title);

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter." />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter."
        />
      )}
      <div className="flex flex-col mx-auto pb-20">
        {/* Contained theater backdrop for video with Ambient Mode Glow */}
        <div className="w-full flex justify-center bg-slate-50 dark:bg-slate-950/30 p-4 sm:p-6 lg:p-8 z-10 border-b border-border shadow-inner relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-video bg-blue-500/20 dark:bg-blue-500/30 blur-[100px] rounded-full pointer-events-none animate-pulse duration-1000" />

          <div className="w-full max-w-5xl aspect-video relative rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-800 bg-black z-10">
            <VideoPlayer
              chapterId={params.chapterId}
              title={lessonTitle}
              courseId={params.courseId}
              nextChapterId={nextChapter?.id}
              videoUrl={chapter.videoUrl || ""}
              isLocked={isLocked}
              completeOnEnd={completeOnEnd}
            />
          </div>
        </div>

        {/* Content Layout */}
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col gap-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-blue-500 uppercase tracking-widest">
                {section}
              </span>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                {lessonTitle}
              </h2>
            </div>
            <div className="flex items-center gap-x-4">
              {purchase ? (
                <CourseProgressButton
                  chapterId={params.chapterId}
                  courseId={params.courseId}
                  nextChapterId={nextChapter?.id}
                  isCompleted={!!userProgress?.isCompleted}
                />
              ) : (
                <CourseEnrollButton
                  courseId={params.courseId}
                  price={course.price!}
                />
              )}
            </div>
          </div>

          <Separator className="bg-border/50" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Description */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border/50 shadow-sm p-6 overflow-hidden">
                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                  About this lesson
                </h3>
                <Preview value={chapter.description!} />
              </div>
            </div>

            {/* Right Column: Widgets */}
            <div className="space-y-6">
              {!!attachments.length && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border/50 shadow-sm p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                    <File className="w-5 h-5 text-blue-500" /> Lesson Resources
                  </h3>
                  <div className="flex flex-col gap-3">
                    {attachments.map((attachment) => (
                      <a
                        href={attachment.url}
                        target="_blank"
                        key={attachment.id}
                        className="group flex items-center p-3 w-full bg-slate-50 dark:bg-slate-800 border border-border hover:border-blue-500/50 rounded-xl transition-all"
                      >
                        <div className="bg-blue-100 dark:bg-blue-500/10 p-2 rounded-lg mr-3 group-hover:bg-blue-500 transition-colors">
                          <File className="w-4 h-4 text-blue-500 group-hover:text-white transition-colors" />
                        </div>
                        <p className="line-clamp-1 text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {attachment.name}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
