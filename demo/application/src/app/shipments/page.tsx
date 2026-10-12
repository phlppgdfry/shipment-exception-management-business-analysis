import { Suspense } from "react";
import { ShipmentExplorer } from "@/components/ShipmentExplorer";
import { LoadingState } from "@/components/ui";

export const metadata = { title: "Shipment explorer" };

export default function ShipmentsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ShipmentExplorer />
    </Suspense>
  );
}
