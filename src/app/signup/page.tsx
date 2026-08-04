import type { Metadata } from "next";
import { SignupPage } from "@/components/templates/signup-page";

export const metadata: Metadata = {
  title: "Sign Up | MenuAI",
};

export default function Signup() {
  return <SignupPage />;
}
