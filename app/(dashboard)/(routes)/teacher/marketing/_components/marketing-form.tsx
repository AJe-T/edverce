"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, ImageIcon, XCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
  popupTitle: z.string().optional(),
  popupIsActive: z.boolean().default(false),
  popupImageUrl: z.string().optional(),
});

export const MarketingForm = ({ initialData }: { initialData: any | null }) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      popupTitle: initialData?.popupTitle || "",
      popupIsActive: initialData?.popupIsActive || false,
      popupImageUrl: initialData?.popupImageUrl || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/marketing`, values);
      toast.success("Marketing settings updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-50 dark:bg-slate-900 rounded-xl p-6">
      <div className="font-medium flex items-center justify-between mb-4 text-xl">
        Popup & Topbar Settings
        <Button
          onClick={toggleEdit}
          variant="ghost"
          className="bg-slate-200 dark:bg-slate-800"
        >
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Settings
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="flex flex-col gap-y-6 mt-4">
          {initialData?.lastModifiedBy && (
            <div className="text-xs bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-md border border-blue-200 inline-block w-max">
              Last Modified By: <span className="font-semibold">{initialData.lastModifiedBy}</span>
            </div>
          )}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-slate-500">
              Topbar Scrolling Text
            </h3>
            <p className="text-md pl-2 border-l-4 border-blue-500 py-1">
              {initialData?.popupTitle || "No text provided"}
            </p>
          </div>
          <div className="space-y-2 mb-2">
            <h3 className="font-bold text-sm text-slate-500">
              Global Activation
            </h3>
            <p className="text-md mt-2">
              {initialData?.popupIsActive ? (
                <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-1 rounded">
                  Active
                </span>
              ) : (
                <span className="text-slate-500 font-bold bg-slate-500/10 px-2 py-1 rounded">
                  Inactive
                </span>
              )}
            </p>
          </div>
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-sm text-slate-500">
              Current Offer Image
            </h3>
            {initialData?.popupImageUrl ? (
              <div className="relative aspect-video mt-2 max-w-sm border rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                  alt="Popup Image"
                  fill
                  className="object-contain"
                  src={initialData?.popupImageUrl}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 bg-slate-200 dark:bg-slate-800 rounded-lg max-w-sm mt-2 border-2 border-dashed">
                <div className="flex flex-col items-center gap-y-2">
                  <ImageIcon className="h-10 w-10 text-slate-400" />
                  <span className="text-sm text-slate-500">
                    No Image Uploaded
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-4"
          >
            <FormField
              control={form.control}
              name="popupTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scrolling Topbar Text</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Use code BLACKFRIDAY for 50% OFF all courses!'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This will smoothly scroll across the very top of all pages
                    in your app.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="popupImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Popup Offer Image</FormLabel>
                  <FormControl>
                    {field.value ? (
                      <div className="relative aspect-video max-w-sm rounded-lg overflow-hidden border bg-slate-100">
                        <Image
                          alt="Popup Image"
                          fill
                          className="object-contain"
                          src={field.value}
                        />
                        <Button
                          type="button"
                          onClick={() => form.setValue("popupImageUrl", "")}
                          variant="destructive"
                          className="absolute top-2 right-2 rounded-full h-8 w-8 p-0 z-10"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <FileUpload
                        endpoint="courseImage"
                        onChange={(url) => {
                          if (url) {
                            form.setValue("popupImageUrl", url);
                          }
                        }}
                      />
                    )}
                  </FormControl>
                  <FormDescription>
                    This image will dynamically popup on screen. Viewers can
                    close it and it is session-limited so it won&apos;t keep
                    annoying them.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="popupIsActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-white dark:bg-slate-950">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-bold">
                      Activate Marketing Campaign
                    </FormLabel>
                    <FormDescription>
                      This will instantly explicitly enable both the Topbar and
                      Popup globally.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2 pt-4 border-t">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                className="w-full sm:w-auto mt-2"
              >
                Save Campaign
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
