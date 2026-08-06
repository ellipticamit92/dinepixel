import type { Metadata } from "next";
import { AuthPage } from "@/components/templates/auth-page";

export const metadata: Metadata = {
  title: "Register | Plate",
};

export default function Signup() {
  return <AuthPage mode="register" />;
}
