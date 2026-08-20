import { NextResponse } from "next/server";
import { getMenuBySlug } from "@/lib/menu-repo";

function iconType(url: string): string {
  const ext = url.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    case "svg":
      return "image/svg+xml";
    case "gif":
      return "image/gif";
    default:
      return "image/png";
  }
}

export async function GET(
  _request: Request,
  ctx: RouteContext<"/[slug]/manifest.webmanifest">
) {
  const { slug } = await ctx.params;
  const menu = await getMenuBySlug(slug);
  if (!menu) return new NextResponse(null, { status: 404 });

  const icon = menu.logoUrl ?? menu.bannerUrl ?? "/favicon.ico";
  const type = iconType(icon);

  return NextResponse.json(
    {
      name: menu.restaurantName,
      short_name: menu.restaurantName,
      start_url: `/${slug}`,
      scope: `/${slug}`,
      display: "standalone",
      background_color: "#f4eee1",
      theme_color: "#f4eee1",
      icons: [
        { src: icon, sizes: "192x192", type, purpose: "any" },
        { src: icon, sizes: "512x512", type, purpose: "any" },
      ],
    },
    { headers: { "content-type": "application/manifest+json" } }
  );
}
