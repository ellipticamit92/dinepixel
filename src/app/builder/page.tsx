import type { Metadata } from "next";
import { BuilderPage } from "@/components/templates/builder-page";

export const metadata: Metadata = {
  title: "Builder | Plate",
};

export default function Builder() {
  return <BuilderPage />;
}
