import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { TermsPage } from "@/components/templates/terms-page";

export const metadata: Metadata = {
  title: "Terms & Conditions | Plate",
};

export default async function Terms() {
  const session = await getSession();
  return <TermsPage session={session} />;
}
