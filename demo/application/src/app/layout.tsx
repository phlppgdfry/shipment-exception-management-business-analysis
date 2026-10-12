import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Logistics Control Tower — shipment exception management", template: "%s · Logistics Control Tower" },
  description: "Interactive demo of a portfolio business analysis case: shipment exceptions detected by rules, owned by a planner and told to the customer before they call. Fictional data.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
