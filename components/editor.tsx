"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Code, SquareCode, Undo, Redo } from "lucide-react";

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
}

const Toolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 border border-b-0 border-slate-200 dark:border-slate-800 p-2 bg-slate-50 dark:bg-slate-900 rounded-t-md">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive("bold") ? "bg-slate-200 dark:bg-slate-800 text-blue-500" : "text-slate-500"}`}
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive("italic") ? "bg-slate-200 dark:bg-slate-800 text-blue-500" : "text-slate-500"}`}
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive("strike") ? "bg-slate-200 dark:bg-slate-800 text-blue-500" : "text-slate-500"}`}
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive("heading", { level: 1 }) ? "bg-slate-200 dark:bg-slate-800 text-blue-500" : "text-slate-500"}`}
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive("heading", { level: 2 }) ? "bg-slate-200 dark:bg-slate-800 text-blue-500" : "text-slate-500"}`}
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive("heading", { level: 3 }) ? "bg-slate-200 dark:bg-slate-800 text-blue-500" : "text-slate-500"}`}
      >
        <Heading3 className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive("bulletList") ? "bg-slate-200 dark:bg-slate-800 text-blue-500" : "text-slate-500"}`}
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive("orderedList") ? "bg-slate-200 dark:bg-slate-800 text-blue-500" : "text-slate-500"}`}
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive("blockquote") ? "bg-slate-200 dark:bg-slate-800 text-blue-500" : "text-slate-500"}`}
      >
        <Quote className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive("code") ? "bg-slate-200 dark:bg-slate-800 text-blue-500" : "text-slate-500"}`}
      >
        <Code className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive("codeBlock") ? "bg-slate-200 dark:bg-slate-800 text-blue-500" : "text-slate-500"}`}
      >
        <SquareCode className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1 flex-1 bg-transparent"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
};

export const Editor = ({ onChange, value }: EditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[150px] p-4 bg-white dark:bg-slate-950 rounded-b-md border border-slate-200 dark:border-slate-800 " +
               "[&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:leading-relaxed [&_p]:mb-2 " +
               "[&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:dark:border-slate-700 [&_blockquote]:pl-4 [&_blockquote]:italic " +
               "[&_code]:bg-slate-100 [&_code]:dark:bg-slate-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:font-mono [&_code]:text-sm " +
               "[&_pre]:bg-slate-900 [&_pre]:text-slate-50 [&_pre]:p-4 [&_pre]:rounded-md [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0"
      }
    }
  });

  return (
    <div className="bg-card text-card-foreground">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
