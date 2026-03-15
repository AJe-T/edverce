import Image from "next/image";
import Link from "next/link";
import { BookOpen, Sparkles } from "lucide-react";

import { formatPrice } from "@/lib/format";
import { CourseProgress } from "@/components/course-progress";

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  category: string;
  isPublished?: boolean;
}

export const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category,
  isPublished = true,
}: CourseCardProps) => {
  const content = (
      <div className={`group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-full flex flex-col ${isPublished ? "shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" : "opacity-90 grayscale-[30%]"}`}>
        {/* Decorative background glow on hover */}
        {isPublished && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-indigo-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:via-indigo-500/5 group-hover:to-purple-500/10 transition-all duration-500 pointer-events-none" />
        )}

        <div className="relative w-full aspect-video overflow-hidden">
          <Image
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            alt={title}
            src={imageUrl}
          />
          {/* Subtle gradient overlay on image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

          <div className="absolute bottom-3 left-3 flex gap-2">
            <span className="px-2.5 py-1 backdrop-blur-md bg-white/10 text-white text-xs font-semibold rounded-md border border-white/20 uppercase tracking-wider">
              {category}
            </span>
          </div>
        </div>

        <div className="flex flex-col flex-grow p-5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2 leading-snug">
            {title}
          </h3>

          <div className="mt-auto pt-4 flex flex-col gap-y-4">
            <div className="flex items-center gap-x-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-x-1.5 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>
                  {chaptersLength}{" "}
                  {chaptersLength === 1 ? "Chapter" : "Chapters"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              {progress === null ? (
                <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {formatPrice(price)}
                </p>
              ) : (
                <div className="w-full relative">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Progress
                    </span>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <CourseProgress
                    variant={progress === 100 ? "success" : "default"}
                    size="sm"
                    value={progress}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );

  return (
    <div className="relative h-full">
      {isPublished ? (
        <Link href={`/course-preview/${id}`}>
          {content}
        </Link>
      ) : (
        <div className="h-full relative overflow-hidden rounded-2xl cursor-not-allowed">
          {content}
          {/* Frosted glass overlay */}
          <div className="absolute inset-0 z-10 bg-slate-950/20 dark:bg-[#020617]/60 backdrop-blur-[6px] flex items-center justify-center pointer-events-none transition-all">
            {/* Glowing orb behind badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-20 bg-indigo-500/40 dark:bg-indigo-500/30 blur-[40px] rounded-full" />
            
            {/* Pill Badge */}
            <div className="relative z-20 px-6 py-2.5 bg-black text-indigo-100 font-extrabold text-sm tracking-[0.2em] rounded-full shadow-[0_0_30px_rgba(79,70,229,0.3)] border border-indigo-500/20 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>COMING SOON</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
