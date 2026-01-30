"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { z } from "zod";
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
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";
import { Spinner } from "@workspace/ui/components/spinner";

const formSchema = z.object({
  keyName: z.string().min(2, { message: "Key name is too short" }),
  publicKey: z.string().min(5, { message: "Public Key is too short" }),
  secretKey: z.string().min(5, { message: "Secret Key is too short" }),
  webhookSecret: z.string().min(5, { message: "Webhook Secret is too short" }),
});

export function EnablePayments() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const result = useQuery(api.functions.payments.checkPaymentStatus);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyName: "",
      publicKey: "",
      secretKey: "",
      webhookSecret: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await axios.post("/api/secrets/create", {
        ...values,
      });
      toast.success("Saved api keys");
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add api keys");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isOpen || isLoading} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {result === undefined ? (
          <Skeleton className="w-[142px] h-[36px] rounded-none" />
        ) : (
          <Button
            className="rounded-none shadow-none font-normal"
            disabled={result?.payments_enabled === true}
          >
            Enable Payments
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[425px] rounded-none p-5">
        <DialogHeader>
          <DialogTitle className="text-neutral-700 font-light">
            Enable Payments
          </DialogTitle>
          <DialogDescription className="font-light text-sm text-muted-foreground">
            Go to your stripe dashboard and grab your public and private api
            keys
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            id="enable-payments"
          >
            <FormField
              control={form.control}
              name="keyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-light">API Key Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the key name"
                      className="shadow-none rounded-none font-light placeholder:font-light"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="font-light">
                    Choose a name for your secret keys
                  </FormDescription>
                  <FormMessage className="font-light" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="publicKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-light">Public Key</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the stripe public key"
                      className="shadow-none rounded-none font-light placeholder:font-light"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="font-light">
                    Go to your stripe dashboard and paste your public api key
                    here
                  </FormDescription>
                  <FormMessage className="font-light" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="secretKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-light">Secret Key</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the stripe public key"
                      className="shadow-none rounded-none font-light placeholder:font-light"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="font-light">
                    Go to your stripe dashboard and paste your secret api key
                    here
                  </FormDescription>
                  <FormMessage className="font-light" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="webhookSecret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-light">Webhook Secret</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the stripe webhook secret"
                      className="shadow-none rounded-none font-light placeholder:font-light"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="font-light">
                    Copy the webhook url from the dashboard and generate a
                    webhook secret from stripe and paste it here, make sure to
                    enable the webhook for all events
                  </FormDescription>
                  <FormMessage className="font-light" />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              disabled={isLoading}
              variant="outline"
              className="rounded-none shadow-none bg-sidebar border font-normal"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            type="submit"
            form="enable-payments"
            disabled={isLoading}
            className="rounded-none shadow-none font-normal"
          >
            {isLoading && <Spinner />}
            {isLoading ? "Saving..." : "Save Keys"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
