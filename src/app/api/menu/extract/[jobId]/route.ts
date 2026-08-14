import { NextResponse } from "next/server";

const MENULENS_API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.dinepixel.cloud";

export async function GET(_request: Request, ctx: RouteContext<"/api/menu/extract/[jobId]">) {
  const { jobId } = await ctx.params;

  const res = await fetch(`${MENULENS_API_URL}/extract/${encodeURIComponent(jobId)}`);

  const body = await res.text();
  return new NextResponse(body, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
  });
}
