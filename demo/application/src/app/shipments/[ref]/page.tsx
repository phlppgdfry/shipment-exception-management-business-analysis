import shipments from "../../../../../mock-data/shipments.json";
import { ShipmentDetail } from "@/components/ShipmentDetail";

export const dynamicParams = false;

export function generateStaticParams() {
  return shipments.map((s) => ({ ref: s.orderRef }));
}

export async function generateMetadata({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  return { title: `Shipment ${ref}` };
}

export default async function ShipmentPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  return <ShipmentDetail orderRef={ref} />;
}
