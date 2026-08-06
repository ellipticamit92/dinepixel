import type { Metadata } from "next";
import { BloomCafeMenuPage } from "@/components/templates/bloom-cafe-menu-page";

export const metadata: Metadata = {
  title: "Bloom Cafe — Menu",
};

export default function BloomCafe() {
  return <BloomCafeMenuPage />;
}
