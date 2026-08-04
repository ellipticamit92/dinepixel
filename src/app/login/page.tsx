import type { Metadata } from "next";
import { LoginPage } from "@/components/templates/login-page";

export const metadata: Metadata = {
  title: "Login | MenuAI",
};

export default function Login() {
  return <LoginPage />;
}
