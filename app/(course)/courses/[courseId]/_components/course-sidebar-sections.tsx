"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { CourseSidebarItem } from "./course-sidebar-item";
import { cn } from "@/lib/utils";

type SidebarSection = {
  id: string;
  label: string;
  items: Array<{
    id: string;
    label: string;
    isCompleted: boolean;
    isLocked: boolean;
  }>;
};

interface CourseSidebarSectionsProps {
  courseId: string;
  sections: SidebarSection[];
}

export const CourseSidebarSections = ({ courseId, sections }: CourseSidebarSectionsProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    sections.reduce<Record<string, boolean>>((acc, section, index) => {
      acc[section.id] = index === 0;
      return acc;
    }, {})
  );

  const toggleSection = (sectionId: string) => {
    setOpenSections((current) => ({
      ...current,
      [sectionId]: !current[sectionId],
    }));
  };

  return (
    <div className="flex flex-col w-full">
      {sections.map((section) => {
        const isOpen = !!openSections[section.id];

        return (
          <div key={section.id} className="border-b border-border/60">
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-muted/60 transition"
            >
              <span className="text-sm font-semibold">{section.label}</span>
              <ChevronDown
                className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
              />
            </button>
            {isOpen && (
              <div className="pb-1">
                {section.items.map((chapter) => (
                  <CourseSidebarItem
                    key={chapter.id}
                    id={chapter.id}
                    label={chapter.label}
                    isCompleted={chapter.isCompleted}
                    courseId={courseId}
                    isLocked={chapter.isLocked}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
