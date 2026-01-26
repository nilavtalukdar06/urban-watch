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
import { CalendarCheckIcon, CalendarIcon, XIcon } from "lucide-react";
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

export function CreateTask() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      assignedToUserId: "",
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };
  return (
    <Dialog>
      <DialogTrigger asChild className="my-3">
        <Button
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full shadow-none rounded-sm">
                          <SelectValue placeholder="Select a member to assign task" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="nilav">Nilav Talukdar</SelectItem>
                        <SelectItem value="jhon">Jhon Doe</SelectItem>
                        <SelectItem value="aarav">Aarav Sharma</SelectItem>
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
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                    <FormDescription className="font-light">
                      Enter the due that of the task
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
              >
                Cancel{" "}
                <span>
                  <XIcon />
                </span>
              </Button>
              <Button className="w-fit shadow-none rounded-sm" type="submit">
                Submit{" "}
                <span>
                  <CalendarIcon />
                </span>
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
