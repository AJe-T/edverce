import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";
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
}

export const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category,
}: CourseCardProps) => {
  return (
    <Link href={`/course-preview/${id}`}>
      <div className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
        {/* Decorative background glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-indigo-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:via-indigo-500/5 group-hover:to-purple-500/10 transition-all duration-500 pointer-events-none" />

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
              {progress !== null ? (
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
              ) : (
                <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {formatPrice(price)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
