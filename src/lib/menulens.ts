import type { Dish, DishCategory } from "@/lib/menu-seed";

export interface MenuLensItem {
  name: string;
  description: string | null;
  price: number | null;
  currency: string;
  category: string | null;
  ingredients: string[];
  dietary_tags: string[];
  allergens: string[];
  confidence: number;
}

export interface MenuLensMenu {
  restaurant_name: string | null;
  items: MenuLensItem[];
  source_notes: string | null;
}

export interface MenuLensJob {
  job_id: string;
  status: "pending" | "processing" | "done" | "error";
  created_at: string;
  menu: MenuLensMenu | null;
  error: string | null;
}

export async function createExtractionJob(file: File): Promise<MenuLensJob> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/menu/extract", { method: "POST", body: formData });
  if (!res.ok) {
    throw new Error(`Couldn't upload that file (${res.status})`);
  }
  return res.json();
}

export async function getExtractionJob(jobId: string): Promise<MenuLensJob> {
  const res = await fetch(`/api/menu/extract/${jobId}`);
  if (!res.ok) {
    throw new Error(`Couldn't check extraction status (${res.status})`);
  }
  return res.json();
}

export async function pollExtractionJob(
  jobId: string,
  {
    timeoutMs = 300_000,
    onStatus,
  }: {
    timeoutMs?: number;
    onStatus?: (status: MenuLensJob["status"]) => void;
  } = {}
): Promise<MenuLensMenu> {
  const start = Date.now();

  while (true) {
    const job = await getExtractionJob(jobId);
    onStatus?.(job.status);

    if (job.status === "done") {
      if (!job.menu) throw new Error("Extraction finished with no menu data");
      return job.menu;
    }
    if (job.status === "error") {
      throw new Error(job.error ?? "Extraction failed");
    }
    if (Date.now() - start > timeoutMs) {
      throw new Error("Extraction is taking too long, please try again");
    }

    await new Promise((resolve) => setTimeout(resolve, 10_000));
  }
}

function dishCategoryOf(item: MenuLensItem): DishCategory {
  const tags = item.dietary_tags.map((t) => t.toLowerCase());
  if (tags.some((t) => t.includes("non-veg") || t.includes("nonveg") || t.includes("meat"))) {
    return "nonveg";
  }
  return "veg";
}

function slugify(name: string, index: number): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base || "dish"}-${index}`;
}

export function dishesFromMenu(menu: MenuLensMenu): Dish[] {
  return menu.items.map((item, index) => ({
    id: slugify(item.name, index),
    name: item.name,
    description: item.description,
    type: item.category ?? "Dish",
    cat: dishCategoryOf(item),
    price: item.price ?? 0,
    ingredients: item.ingredients,
    section: item.category ?? "Menu",
  }));
}
