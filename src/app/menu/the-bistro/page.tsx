import type { Metadata } from "next";
import { BistroMenuPage } from "@/components/templates/bistro-menu-page";

export const metadata: Metadata = {
  title: "The Bistro — Menu",
};

export default function TheBistro() {
  return <BistroMenuPage />;
}
