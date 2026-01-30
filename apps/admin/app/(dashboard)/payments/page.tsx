import { EnablePayments } from "@/modules/payments/components/enable-payments";
import { TableView } from "@/modules/payments/views/table-view";
import { Button } from "@workspace/ui/components/button";
import { CopyIcon } from "lucide-react";

export default function Payments() {
  return (
    <div className="px-4 pb-4">
      <p className="text-lg text-neutral-600 font-light">Enable Payments</p>
      <p className="text-sm font-light text-muted-foreground">
        Configure the settings to start collecting payments
      </p>
      <div className="my-2 w-full flex justify-start items-center gap-x-2">
        <Button
          className="pointer-events-none rounded-none font-normal text-neutral-600 bg-sidebar border shadow-none"
          variant="secondary"
        >
          {process.env.WEBHOOK_URL!}/api/stripe/webhook
        </Button>
        <Button variant="outline" className="shadow-none rounded-none">
          <CopyIcon />
        </Button>
      </div>
      <div className="my-4">
        <EnablePayments />
      </div>
      <TableView />
    </div>
  );
}
