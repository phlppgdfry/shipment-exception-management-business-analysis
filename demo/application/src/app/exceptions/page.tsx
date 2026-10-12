import { Suspense } from "react";
import { ExceptionWorkbench } from "@/components/ExceptionWorkbench";
import { LoadingState } from "@/components/ui";

export const metadata = { title: "Exception management" };

export default function ExceptionsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ExceptionWorkbench />
    </Suspense>
  );
}
