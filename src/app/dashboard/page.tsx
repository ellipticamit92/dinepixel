import type { Metadata } from "next";
import { DashboardPage } from "@/components/templates/dashboard-page";

export const metadata: Metadata = {
  title: "Upload Your Menu | MenuAI",
};

export default function Dashboard() {
  return <DashboardPage />;
}
