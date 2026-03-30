"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface PreviewProps {
  value: string;
}

export const Preview = ({ value }: PreviewProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    editable: false,
    editorProps: {
      attributes: {
        class: "focus:outline-none text-slate-700 dark:text-slate-300 " +
               "[&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:leading-relaxed [&_p]:mb-2 " +
               "[&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:dark:border-slate-700 [&_blockquote]:pl-4 [&_blockquote]:italic " +
               "[&_code]:bg-slate-100 [&_code]:dark:bg-slate-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:font-mono [&_code]:text-sm " +
               "[&_pre]:bg-slate-900 [&_pre]:text-slate-50 [&_pre]:p-4 [&_pre]:rounded-md [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0"
      }
    }
  });

  return (
    <div className="bg-card text-card-foreground">
      <EditorContent editor={editor} />
    </div>
  );
};
