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
import { Textarea } from "@workspace/ui/components/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { updateMetadata } from "../functions/update-metadata";
import { useRouter } from "next/navigation";
import { Spinner } from "@workspace/ui/components/spinner";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name is too short" }),
  purpose: z.string().min(5, { message: "Purpose is too short" }),
  goal: z.string().min(5, { message: "Goal is too short" }),
});

export function OnboardingForm() {
  const router = useRouter();
  const mutation = useMutation(api.functions.organizations.createOrganization);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      purpose: "",
      goal: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await mutation({ ...values });
      await updateMetadata();
      toast.success("Profile Created Successfully");
      form.reset();
      router.replace("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create profile");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full my-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal text-neutral-700">
                  Organization Name
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter the organization name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal text-neutral-700">
                  Purpose of organization
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the purpose of your organization"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal text-neutral-700">
                  Goal of organization
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the goals of your organization"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex justify-center items-center">
            <Button className="w-fit" disabled={isLoading}>
              {isLoading ? <Spinner /> : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
