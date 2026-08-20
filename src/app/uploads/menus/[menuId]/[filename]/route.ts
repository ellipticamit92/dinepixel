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

const FILENAME_PATTERN = /^(logo|banner)\.(png|jpg|jpeg|webp|gif|svg)$/;

export async function GET(
  _request: Request,
  ctx: RouteContext<"/uploads/menus/[menuId]/[filename]">
) {
  const { menuId, filename } = await ctx.params;

  const match = FILENAME_PATTERN.exec(filename);
  if (!/^[a-z0-9]+$/i.test(menuId) || !match) {
    return new NextResponse(null, { status: 404 });
  }

  const dir = path.join(process.cwd(), "uploads", "menus", menuId);
  const filePath = path.join(dir, filename);
  if (path.dirname(filePath) !== dir) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const data = await readFile(filePath);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "content-type": CONTENT_TYPES[match[2]],
        "cache-control": "public, max-age=300",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
