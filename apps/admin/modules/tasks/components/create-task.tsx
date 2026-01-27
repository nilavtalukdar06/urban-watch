"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  CalendarCheckIcon,
  CalendarIcon,
  LoaderIcon,
  XIcon,
} from "lucide-react";
import { Calendar } from "@workspace/ui/components/calendar";
import { z } from "zod";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { cn } from "@workspace/ui/lib/utils";
import { useEffect, useState } from "react";
import { getOrganizationMemebers } from "../functions/get-members";
import { toast } from "sonner";
import { Badge } from "@workspace/ui/components/badge";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";

const formSchema = z.object({
  title: z.string().min(2, { message: "Task title is too short" }),
  description: z.string().min(5, { message: "Task description is too short" }),
  assignedToUserId: z.string().min(1, { message: "Assignee is required" }),
  dueDate: z
    .date({
      required_error: "Due date is required",
      invalid_type_error: "Invalid date",
    })
    .refine((date) => date.getTime() > Date.now(), {
      message: "Date must be in the future",
    }),
});

type Member = {
  userId: string | undefined;
  role: string;
  name: string;
  email: string | undefined;
};

export function CreateTask() {
  const mutation = useMutation(api.functions.tasks.createTask);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [members, setMembers] = useState<Member[] | []>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      assignedToUserId: "",
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const selectedMember = members.find(
        (m) => m.userId === values.assignedToUserId,
      );
      if (!selectedMember) {
        toast.error("Invalid assignee selected");
        return;
      }
      await mutation({
        ...values,
        assigneeName: selectedMember.name,
        dueDate: values.dueDate.getTime(),
      });
      toast.success("Task added successfully");
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit task");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        const result = await getOrganizationMemebers();
        setMembers(result);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch organization members");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, [setMembers]);
  return (
    <Dialog open={isOpen || isSubmitting} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className="my-3">
        <Button
          disabled={isLoading}
          variant="secondary"
          className="bg-sidebar! border font-normal shadow-none"
        >
          <span>Add Task</span>
          <CalendarCheckIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[425px] p-5 rounded-sm">
        <DialogHeader>
          <DialogTitle className="font-normal text-neutral-600">
            Create Task
          </DialogTitle>
          <DialogDescription className="font-light text-muted-foreground">
            Create and assign tasks within this organization
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className="font-normal text-neutral-600">
                      Task Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the task title"
                        {...field}
                        className="shadow-none rounded-sm"
                      />
                    </FormControl>
                    <FormDescription className="font-light">
                      This is the title of your task, keep it short and
                      concised.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className="font-normal text-neutral-600">
                      Task Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the task description"
                        {...field}
                        className="shadow-none rounded-sm"
                      />
                    </FormControl>
                    <FormDescription className="font-light">
                      This is the description of your task, write briefly about
                      the task that you are planning for.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="assignedToUserId"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className="font-normal text-neutral-600">
                      Assign Task
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full shadow-none rounded-sm h-12!">
                          <SelectValue placeholder="Select a member to assign task" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem
                            value={member.userId!}
                            key={member.userId}
                          >
                            <div className="flex flex-col justify-center items-start">
                              <span>{member.name}</span>
                              <span className="text-xs text-muted-foreground font-light">
                                {member.email}
                              </span>
                            </div>
                            <Badge
                              variant="secondary"
                              className={cn(
                                member.role === "org:admin"
                                  ? "bg-red-50 text-red-500 flex items-center"
                                  : "bg-purple-50 text-purple-500",
                              )}
                            >
                              {member.role
                                .split(":")[1]
                                ?.charAt(0)
                                .toUpperCase() +
                                member.role.split(":")[1]!.slice(1)}
                            </Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    <FormDescription className="font-light">
                      Assign the task to one of your team memebers.
                    </FormDescription>
                  </FormItem>
                );
              }}
            />
            <FormField
              name="dueDate"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className="font-normal text-neutral-600">
                      Select the due date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger className="w-full" asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal shadow-none rounded-sm",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                    <FormDescription className="font-light">
                      Enter the due date of the task
                    </FormDescription>
                  </FormItem>
                );
              }}
            />
            <div className="w-full flex justify-end items-center gap-x-3 mt-4">
              <Button
                className="w-fit shadow-none rounded-sm"
                variant="outline"
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setIsOpen(false);
                  form.reset();
                }}
              >
                <span>Cancel</span>
                <XIcon />
              </Button>
              <Button
                className="w-fit shadow-none rounded-sm bg-gradient-to-br from-blue-400 to-blue-500"
                type="submit"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? "Loading..." : "Submit"}</span>
                {isSubmitting ? (
                  <LoaderIcon className="animate-spin" />
                ) : (
                  <CalendarIcon />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
