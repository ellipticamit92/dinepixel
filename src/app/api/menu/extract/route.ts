import { NextResponse } from "next/server";

const MENULENS_API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.dinepixel.cloud";

export async function POST(request: Request) {
  const incoming = await request.formData();
  const file = incoming.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const outgoing = new FormData();
  outgoing.append("file", file, file.name);

  const res = await fetch(`${MENULENS_API_URL}/extract`, {
    method: "POST",
    body: outgoing,
  });

  const body = await res.text();
  return new NextResponse(body, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
  });
}
