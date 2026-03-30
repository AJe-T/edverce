"use client";

import axios from "axios";
import { Pencil, Upload, Info, XCircle, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

export const SignatureForm = ({ courses }: { courses: any[] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [signatureUrl, setSignatureUrl] = useState("");
  const [signatureLabel, setSignatureLabel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  // When course changes, pre-fill from existing data
  useEffect(() => {
    if (selectedCourse) {
      setSignatureUrl(selectedCourse.certificateSignatureUrl || "");
      setSignatureLabel(selectedCourse.certificateSignature || "");
    } else {
      setSignatureUrl("");
      setSignatureLabel("");
    }
  }, [selectedCourseId, selectedCourse]);

  const onSubmit = async () => {
    if (!selectedCourseId) {
      toast.error("Please select a course first.");
      return;
    }
    if (!signatureUrl) {
      toast.error("Please upload a signature image.");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.patch(`/api/courses/${selectedCourseId}`, {
        certificateSignatureUrl: signatureUrl,
        certificateSignature: signatureLabel,
      });
      toast.success("Signature saved successfully!");
      setIsEditing(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 border bg-slate-50 dark:bg-slate-900 rounded-xl p-6 space-y-4">
      <div className="font-medium flex items-center justify-between text-xl">
        Certificate Signature Image
        <Button
          onClick={() => setIsEditing((prev) => !prev)}
          variant="ghost"
          className="bg-slate-200 dark:bg-slate-800"
        >
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Signature
            </>
          )}
        </Button>
      </div>

      {/* Guidance — always visible */}
      <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
        <div className="space-y-1.5 text-sm text-blue-700 dark:text-blue-300">
          <p className="font-semibold">Signature image requirements</p>
          <ul className="list-disc list-inside space-y-0.5 text-xs text-blue-600 dark:text-blue-400">
            <li>Use a <strong>white or light-colored</strong> signature on a <strong>transparent background</strong> (PNG)</li>
            <li>The certificate background is <strong>dark navy blue</strong> (#0A0F1C)</li>
            <li>Avoid black ink — it will be invisible on the dark certificate</li>
            <li>Recommended size: <strong>400 × 120px</strong> or similar wide format</li>
          </ul>
          {/* Example preview */}
          <div className="mt-3 space-y-1">
            <p className="text-xs font-semibold">How your signature will appear on the certificate:</p>
            <div className="w-full max-w-xs bg-[#0A0F1C] rounded-lg border border-blue-900 flex items-center justify-center py-4 px-6">
              <span
                className="text-white text-2xl opacity-90"
                style={{ fontFamily: "'Brush Script MT', cursive, serif" }}
              >
                Your Signature Here
              </span>
            </div>
          </div>
        </div>
      </div>

      {!isEditing && (
        <div className="space-y-2">
          <p className="text-sm text-slate-500 italic">
            Select &quot;Edit Signature&quot; to upload or change the signature image for a course.
          </p>
          {selectedCourse?.lastModifiedBy && (
            <div className="text-xs bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-md border border-blue-200 dark:border-blue-800 inline-block">
              Last Modified By: <span className="font-semibold">{selectedCourse.lastModifiedBy}</span>
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <div className="space-y-5">
          {/* Course picker */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Select Course</label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              disabled={isSubmitting}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled>Select a course...</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* Signature label */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Instructor Label <span className="text-slate-400 font-normal">(shown below the signature)</span></label>
            <input
              type="text"
              value={signatureLabel}
              onChange={(e) => setSignatureLabel(e.target.value)}
              disabled={isSubmitting || !selectedCourseId}
              placeholder="e.g. John Doe, Lead Instructor"
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Signature image upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Signature Image <span className="text-slate-400 font-normal">(PNG with transparent background)</span></label>

            {signatureUrl ? (
              <div className="space-y-3">
                {/* Preview on dark cert-like background */}
                <div className="w-full max-w-sm bg-[#0A0F1C] rounded-lg border border-blue-900 flex items-center justify-center py-4 px-6 relative">
                  <div className="relative w-48 h-16">
                    <Image
                      src={signatureUrl}
                      alt="Signature preview"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  This is how your signature will look on the certificate
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setSignatureUrl("")}
                  disabled={isSubmitting}
                >
                  <XCircle className="h-4 w-4" />
                  Remove & re-upload
                </Button>
              </div>
            ) : (
              <div className={!selectedCourseId ? "opacity-50 pointer-events-none" : ""}>
                <FileUpload
                  endpoint="courseImage"
                  onChange={(url) => {
                    if (url) setSignatureUrl(url);
                  }}
                />
                {!selectedCourseId && (
                  <p className="text-xs text-slate-400 mt-1">Select a course above before uploading</p>
                )}
              </div>
            )}
          </div>

          {/* Save button */}
          <div className="flex items-center gap-3 pt-4 border-t">
            <Button
              onClick={onSubmit}
              disabled={isSubmitting || !selectedCourseId || !signatureUrl}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Signature"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
