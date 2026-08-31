import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { menuLimitFor } from "@/lib/plans";
import { BuilderPage } from "@/components/templates/builder-page";

export const metadata: Metadata = {
  title: "Builder | Dinepixel",
};

export default async function Builder() {
  const session = await getSession();
  if (!session) redirect("/login?next=/builder");

  const owner = await prisma.user.findUnique({
    where: { email: session.email },
    select: { plan: true, _count: { select: { menus: true } } },
  });

  const plan = owner?.plan ?? "free";
  const menuCount = owner?._count.menus ?? 0;
  const menuLimit = menuLimitFor(plan);

  return (
    <BuilderPage
      session={session}
      plan={plan}
      menuCount={menuCount}
      menuLimit={menuLimit}
    />
  );
}
