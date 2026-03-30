"use client";

import { Chapter } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Grip, Pencil } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getChapterSectionAndTitle } from "@/lib/chapter-sections";

interface ChaptersListProps {
  items: Chapter[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
};

export const ChaptersList = ({
  items,
  onReorder,
  onEdit
}: ChaptersListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedChapters = items.slice(startIndex, endIndex + 1);

    setChapters(items);

    const bulkUpdateData = updatedChapters.map((chapter) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id)
    }));

    onReorder(bulkUpdateData);
  }

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => {
              const { section, lessonTitle } = getChapterSectionAndTitle(chapter.title);
              return (
              <Draggable 
                key={chapter.id} 
                draggableId={chapter.id} 
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-muted border-border border text-foreground rounded-md mb-4 text-sm",
                      chapter.isPublished && "bg-primary/10 border-primary/20 text-primary"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r border-r-border hover:bg-muted/70 rounded-l-md transition",
                        chapter.isPublished && "border-r-primary/20 hover:bg-primary/10"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip
                        className="h-5 w-5"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span>{lessonTitle}</span>
                      <div className="flex items-center gap-x-2">
                        <span className="text-[11px] text-muted-foreground">{section}</span>
                        {(chapter as any).lastModifiedBy && (
                          <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                            Mod: {(chapter as any).lastModifiedBy}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      {chapter.isFree && (
                        <Badge>
                          Free
                        </Badge>
                      )}
                      <Badge
                        className={cn(
                          "bg-muted-foreground",
                          chapter.isPublished && "bg-primary"
                        )}
                      >
                        {chapter.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <button
                        onClick={() => onEdit(chapter.id)}
                        className="flex items-center gap-x-1.5 ml-2 px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-700/20 rounded-md transition font-semibold text-xs cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </button>
                    </div>
                  </div>
                )}
              </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
