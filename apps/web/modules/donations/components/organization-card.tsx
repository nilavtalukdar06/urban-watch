"use client";

import { useState } from "react";
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
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Id } from "@workspace/backend/convex/_generated/dataModel";
import { LinkIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
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
import { Spinner } from "@workspace/ui/components/spinner";
import { toast } from "sonner";

interface Props {
  goal: string;
  name: string;
  organizationId: string;
  payments_enabled: boolean;
  purpose: string;
  userId: string;
  _creationTime: number;
  _id: Id<"organization">;
}

const formSchema = z.object({
  amount: z
    .string()
    .min(1, { message: "Amount is required" })
    .refine(
      (val) => {
        const amount = Number(val);
        return !Number.isNaN(amount) && amount >= 100;
      },
      { message: "Minimum donation amount is 100 INR" },
    ),
});

export function OrganizationTrigger(props: Props) {
  const [isProcessing, setIsProcessing] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsProcessing(true);
    try {
      const amount = Number(values.amount);
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          organizationId: props.organizationId,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }
      const data = await response.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error("Failed to initiate payment");
      setIsProcessing(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <Card className="w-full rounded-none shadow-none bg-sidebar py-3">
          <CardHeader className="px-4">
            <div className="w-full flex justify-between items-center">
              <CardTitle className="text-start text-neutral-700 text-lg font-light">
                {props.name}
              </CardTitle>
              <LinkIcon size={16} className="text-neutral-700" />
            </div>
            <CardDescription className="text-start text-muted-foreground font-light">
              {props.goal}
            </CardDescription>
          </CardHeader>
        </Card>
      </DialogTrigger>
      <DialogContent className="w-[400px] rounded-none p-5">
        <DialogHeader>
          <DialogTitle className="text-neutral-600 font-light text-start">
            {props.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-light text-start">
            {props.goal}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-start justify-center gap-y-1.5">
          <p className="text-neutral-700 text-sm">Our Purpose</p>
          <p className="text-muted-foreground font-light text-sm">
            {props.purpose}
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="donation-form">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className="font-normal text-neutral-700">
                      Enter amount
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the donation amount"
                        inputMode="numeric"
                        className="shadow-none rounded-none placeholder:font-light font-light"
                        disabled={isProcessing}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormDescription className="font-light">
                      All the amounts are in indian rupees
                    </FormDescription>
                    <FormMessage className="font-light" />
                  </FormItem>
                );
              }}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="bg-sidebar rounded-none font-normal shadow-none"
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            variant="destructive"
            form="donation-form"
            className="rounded-none shadow-none font-normal"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Spinner />
                Processing...
              </>
            ) : (
              "Donate"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
