import { Navbar } from "@/components/shared/navbar";

export default function SubmitReport() {
  return (
    <div className="w-full">
      <Navbar />
      <div className="p-4 w-full flex flex-col justify-center items-center gap-y-4 my-12 max-w-sm mx-auto">
        <div className="flex justify-center items-center flex-col">
          <h3 className="text-lg text-neutral-700 text-center">
            Submit Report
          </h3>
          <p className="text-sm text-muted-foreground font-light text-center">
            Enter the basic details about the report and let ai do the job
          </p>
        </div>
      </div>
    </div>
  );
}
