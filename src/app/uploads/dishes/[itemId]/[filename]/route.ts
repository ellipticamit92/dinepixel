import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CONTENT_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};

const FILENAME_PATTERN = /^dish\.(png|jpg|jpeg|webp|gif|svg)$/;

export async function GET(
  _request: Request,
  ctx: RouteContext<"/uploads/dishes/[itemId]/[filename]">
) {
  const { itemId, filename } = await ctx.params;

  const match = FILENAME_PATTERN.exec(filename);
  if (!/^[a-z0-9]+$/i.test(itemId) || !match) {
    return new NextResponse(null, { status: 404 });
  }

  const dir = path.join(process.cwd(), "uploads", "dishes", itemId);
  const filePath = path.join(dir, filename);
  if (path.dirname(filePath) !== dir) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const data = await readFile(filePath);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "content-type": CONTENT_TYPES[match[1]],
        "cache-control": "public, max-age=300",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
