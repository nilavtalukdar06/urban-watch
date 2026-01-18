"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@workspace/backend/convex/_generated/api";
import { toast } from "sonner";
import { useState } from "react";
import { Spinner } from "@workspace/ui/components/spinner";
import { updateMetadata } from "../functions/update-metadata";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full Name is required" }),
  phoneNumber: z.string().length(10, { message: "Invalid Phone number" }),
  dateOfBirth: z.string().min(3, { message: "Date of birth is required" }),
  permanentAddress: z
    .string()
    .min(5, { message: "Permanent Address is required" }),
});

export function OnboardingForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const mutation = useMutation(api.functions.users.createUser);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      dateOfBirth: "",
      permanentAddress: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      await mutation({ ...values });
      await updateMetadata();
      toast.success("Profile Created Successfully");
      router.replace("/");
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create profile");
      }
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="py-4 w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal">Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal">Phone Number</FormLabel>
                <FormControl>
                  <Input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    placeholder="Enter your 10 digit phone number"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal">Date Of Birth</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your date of birth" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="permanentAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal">Permanent Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full justify-center items-center">
            <Button type="submit" className="w-fit" disabled={isLoading}>
              {isLoading ? <Spinner /> : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
