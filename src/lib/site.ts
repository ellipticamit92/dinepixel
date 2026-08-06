export const SITE_HOST = "plate.menu";

export function menuUrl(slug: string) {
  return `${SITE_HOST}/${slug}`;
}
