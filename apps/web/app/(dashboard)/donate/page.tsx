import { Navbar } from "@/components/shared/navbar";

export default function DonationPage() {
  return (
    <div className="w-full">
      <Navbar />
      <div className="w-full p-4">
        <p className="font-light text-lg text-neutral-600">
          Donate to Organizations
        </p>
        <p className="text-sm text-muted-foreground font-light">
          View all the Organizations and NGOs accepting donations
        </p>
      </div>
    </div>
  );
}
