import type { Metadata } from "next";
import { AuthPage } from "@/components/templates/auth-page";

export const metadata: Metadata = {
  title: "Sign in | Plate",
};

export default function Login() {
  return <AuthPage mode="login" />;
}
