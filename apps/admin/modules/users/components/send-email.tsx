"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
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

const formSchema = z.object({
  subject: z.string().min(2, { message: "Subject is too short" }),
  body: z.string().min(5, { message: "Email body is too short" }),
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SendEmail({ open, onOpenChange, email }: Props) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      body: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none w-[425px] p-5">
        <DialogHeader>
          <DialogTitle className="font-light text-xl text-neutral-600">
            Send Email
          </DialogTitle>
          <DialogDescription className="font-light text-sm text-muted-foreground">
            Shoot an email directly to the user&apos;s inbox
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            id="send-email"
          >
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-light text-neutral-600">
                    Email Subject
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-none shadow-none placeholder:font-light font-light"
                      placeholder="Enter the subject of email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="font-light" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-light text-neutral-600">
                    Email Body
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="rounded-none shadow-none placeholder:font-light font-light"
                      placeholder="Enter the body of email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="font-light" />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="destructive"
              type="button"
              className="rounded-none font-normal shadow-none"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="rounded-none font-normal shadow-none border bg-sidebar"
            variant="outline"
            type="submit"
            form="send-email"
          >
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
