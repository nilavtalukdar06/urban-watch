"use client";

import { FileUploaderMinimal } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";
import { submitReport } from "../functions/submit-report";
import { cn } from "@workspace/ui/lib/utils";
import { Spinner } from "@workspace/ui/components/spinner";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  location: z.string().min(3, { message: "Location is required" }),
  notes: z.string().optional(),
});

export function SubmitReportForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      notes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      await submitReport({
        imageUrl,
        location: values.location,
        notes: values.notes,
      });
      toast.success("Report submitted successfully");
      form.reset();
      setImageUrl("");
      router.replace("/");
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to submit report");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="py-2 w-full max-w-sm mx-auto">
      <div className="text-muted-foreground font-light text-center flex flex-col gap-y-4 justify-center items-center">
        <FileUploaderMinimal
          className={cn(
            "w-full",
            isLoading && "pointer-events-none opacity-50",
          )}
          sourceList="local, camera"
          classNameUploader="uc-light"
          pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!}
          multiple={false}
          removeCopyright={true}
          onCommonUploadSuccess={(e) => {
            e.successEntries.map((item) => setImageUrl(item.cdnUrl));
          }}
        />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-normal">Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the report location"
                      className="rounded-none shadow-none"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-normal">
                    Notes (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes about the report"
                      className="rounded-none shadow-none min-h-[100px]"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex w-full justify-center items-center">
              <Button
                type="submit"
                className="w-fit rounded-none shadow-none"
                disabled={isLoading || !imageUrl}
              >
                {isLoading ? (
                  <span className="flex gap-x-2 justify-center items-center">
                    <Spinner />
                    <span>Submitting...</span>
                  </span>
                ) : (
                  "Submit Report"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
