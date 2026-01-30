import { CopyWebhookUrl } from "@/modules/payments/components/copy-webhook-url";
import { EnablePayments } from "@/modules/payments/components/enable-payments";
import { TableView } from "@/modules/payments/views/table-view";

export default function Payments() {
  return (
    <div className="px-4 pb-4">
      <p className="text-lg text-neutral-600 font-light">Enable Payments</p>
      <p className="text-sm font-light text-muted-foreground">
        Configure the settings to start collecting payments
      </p>
      <CopyWebhookUrl />
      <div className="my-4">
        <EnablePayments />
      </div>
      <TableView />
    </div>
  );
}
