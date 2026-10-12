import { Suspense } from "react";
import { CustomerTracking } from "@/components/CustomerTracking";
import { LoadingState } from "@/components/ui";

export const metadata = { title: "Customer view" };

export default function TrackPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <CustomerTracking />
    </Suspense>
  );
}
