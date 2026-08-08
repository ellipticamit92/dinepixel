"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { PlateNavbar } from "@/components/organisms/plate-navbar";
import { LivePreviewPhone } from "@/components/organisms/live-preview-phone";
import { DishRow } from "@/components/molecules/dish-row";
import { LogoUpload } from "@/components/molecules/logo-upload";
import { AdminOfferNotifier } from "@/components/organisms/admin-offer-notifier";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  RAISED_SM,
  INSET,
  INSET_SM,
  ACCENT_GLOW_SM,
} from "@/lib/neu-shadows";
import { menuUrl } from "@/lib/site";
import {
  addDish,
  addIngredient,
  flipDishCategory,
  removeDish,
  removeIngredient,
  setDishPrice,
} from "@/lib/builder-state";
import {
  MENU_SECTIONS,
  SEED_DISHES,
  priceStr,
  type Dish,
  type DishCategory,
  type MenuSection,
} from "@/lib/menu-seed";

const SLUG = "bloom-cafe";
type Filter = "all" | DishCategory;
type SectionFilter = "all" | MenuSection;

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "dish"
  );
}

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-background p-4" style={{ boxShadow: RAISED_SM }}>
      <div className="font-display text-2xl text-[oklch(0.26_0.02_60)]">{value}</div>
      <div className="mt-1 text-xs font-bold tracking-[0.5px] text-muted-foreground uppercase">
        {label}
      </div>
    </div>
  );
}

export function AdminDashboardPage({ session }: { session: { name: string } }) {
  const [items, setItems] = useState<Dish[]>(SEED_DISHES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [previewTab, setPreviewTab] = useState<DishCategory>("veg");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [sectionFilter, setSectionFilter] = useState<SectionFilter>("all");
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCat, setNewCat] = useState<DishCategory>("veg");
  const [newSection, setNewSection] = useState<MenuSection>("Cafe Bites");

  const vegCount = items.filter((d) => d.cat === "veg").length;
  const nonvegCount = items.length - vegCount;
  const menuValue = items.reduce((sum, d) => sum + d.price, 0);
  const usedSectionCount = new Set(items.map((d) => d.section)).size;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((d) => {
      const matchesFilter = filter === "all" || d.cat === filter;
      const matchesSection = sectionFilter === "all" || d.section === sectionFilter;
      const matchesQuery = !q || d.name.toLowerCase().includes(q);
      return matchesFilter && matchesSection && matchesQuery;
    });
  }, [items, filter, sectionFilter, query]);

  const groups = useMemo(
    () =>
      MENU_SECTIONS.map((section) => ({
        section,
        dishes: filtered.filter((d) => d.section === section),
      })).filter((g) => g.dishes.length > 0),
    [filtered]
  );

  const handleLogoChange = (dataUrl: string | null) => {
    setLogoUrl(dataUrl);
    toast.success(dataUrl ? "Logo updated" : "Logo removed");
  };

  const saveDish = (id: string) => {
    setEditingId(null);
    const dish = items.find((d) => d.id === id);
    toast.success(dish ? `${dish.name} updated` : "Dish updated");
  };

  const deleteDish = (id: string) => {
    const dish = items.find((d) => d.id === id);
    setItems((prev) => removeDish(prev, id));
    if (editingId === id) setEditingId(null);
    toast.success(dish ? `${dish.name} removed from menu` : "Dish removed");
  };

  const submitNewDish = () => {
    const name = newName.trim();
    const price = parseInt(newPrice, 10);
    if (!name || !price) {
      toast.error("Add a name and price to create a dish");
      return;
    }
    const dish: Dish = {
      id: `${slugify(name)}-${Date.now().toString(36)}`,
      name,
      type: newType.trim() || "Dish",
      cat: newCat,
      price,
      ingredients: [],
      section: newSection,
    };
    setItems((prev) => addDish(prev, dish));
    setNewName("");
    setNewType("");
    setNewPrice("");
    setNewCat("veg");
    setNewSection("Cafe Bites");
    setAddOpen(false);
    toast.success(`${name} added to menu`);
  };

  return (
    <div className="flex flex-1 flex-col bg-background font-sans text-[oklch(0.28_0.02_60)]">
      <PlateNavbar session={session} />

      <div className="mx-auto grid w-full max-w-[1180px] items-start gap-8 px-6 py-6 pb-16 sm:px-10 lg:grid-cols-[1fr_380px]">
        <div>
          <div
            className="inline-flex items-center gap-[9px] rounded-full bg-background px-4 py-[9px] text-[13px] font-bold tracking-[0.4px]"
            style={{ color: "oklch(0.42 0.12 150)", boxShadow: INSET }}
          >
            <span className="size-[9px] rounded-full" style={{ background: "var(--success)" }} />
            Live &amp; published
          </div>

          <div className="mt-3.5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-[28px] tracking-[0.3px] text-[oklch(0.24_0.02_60)] sm:text-[34px]">
                Bloom Cafe menu
              </h1>
              <p className="mt-2 text-[14.5px] text-muted-foreground">
                Edits here go live on your public menu instantly.
              </p>
            </div>
            <a
              href={`/menu/${SLUG}`}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded-[11px] px-[18px] py-[11px] font-condensed text-sm font-bold text-[oklch(0.35_0.02_60)]"
              style={{ boxShadow: RAISED_SM }}
            >
              {menuUrl(SLUG)} ↗
            </a>
          </div>

          <div className="mt-6 rounded-2xl bg-background p-[18px]" style={{ boxShadow: RAISED_SM }}>
            <div className="text-xs font-bold tracking-[0.6px] text-[oklch(0.56_0.03_60)] uppercase">
              Cafe branding
            </div>
            <div className="mt-3">
              <LogoUpload value={logoUrl} onChange={handleLogoChange} />
            </div>
          </div>

          <AdminOfferNotifier logoUrl={logoUrl} />

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            <StatTile value={String(items.length)} label="Total dishes" />
            <StatTile value={String(vegCount)} label="Veg" />
            <StatTile value={String(nonvegCount)} label="Non-veg" />
            <StatTile value={String(usedSectionCount)} label="Categories" />
            <StatTile value={priceStr(menuValue)} label="Menu value" />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <div
              className="flex min-w-[200px] flex-1 items-center gap-2 rounded-[11px] px-3.5 py-[9px]"
              style={{ boxShadow: INSET_SM }}
            >
              <Search className="size-4 text-[oklch(0.55_0.03_60)]" strokeWidth={2} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dishes"
                className="w-full border-none bg-transparent text-sm font-semibold text-[oklch(0.28_0.02_60)] outline-none"
              />
            </div>

            <div className="flex gap-[7px] rounded-[13px] p-1" style={{ boxShadow: INSET_SM }}>
              {(
                [
                  ["all", "All"],
                  ["veg", "Veg"],
                  ["nonveg", "Non-Veg"],
                ] as [Filter, string][]
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  className="rounded-[9px] px-3.5 py-[7px] font-condensed text-[13px] font-bold tracking-[0.2px]"
                  style={{
                    background: "var(--background)",
                    color: filter === value ? "oklch(0.26 0.02 60)" : "oklch(0.55 0.03 60)",
                    boxShadow: filter === value ? RAISED_SM : "none",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setAddOpen((v) => !v)}
              className="ml-auto flex shrink-0 items-center gap-1.5 rounded-[11px] bg-primary px-4 py-[11px] font-condensed text-sm font-bold text-primary-foreground"
              style={{ boxShadow: ACCENT_GLOW_SM }}
            >
              <Plus className="size-4" strokeWidth={3} />
              Add dish
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-[7px]">
            <button
              type="button"
              onClick={() => setSectionFilter("all")}
              className="rounded-full px-3.5 py-[7px] font-condensed text-[12.5px] font-bold tracking-[0.2px]"
              style={{
                background: "var(--background)",
                color: sectionFilter === "all" ? "oklch(0.26 0.02 60)" : "oklch(0.55 0.03 60)",
                boxShadow: sectionFilter === "all" ? INSET_SM : RAISED_SM,
              }}
            >
              All categories
            </button>
            {MENU_SECTIONS.map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => setSectionFilter(section)}
                className="rounded-full px-3.5 py-[7px] font-condensed text-[12.5px] font-bold tracking-[0.2px]"
                style={{
                  background: "var(--background)",
                  color: sectionFilter === section ? "oklch(0.26 0.02 60)" : "oklch(0.55 0.03 60)",
                  boxShadow: sectionFilter === section ? INSET_SM : RAISED_SM,
                }}
              >
                {section}
              </button>
            ))}
          </div>

          {addOpen ? (
            <div className="mt-3.5 rounded-2xl bg-background p-4" style={{ boxShadow: RAISED_SM }}>
              <div className="flex flex-wrap gap-3">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Dish name"
                  className="min-w-[160px] flex-1 rounded-[10px] px-3.5 py-[9px] text-sm font-semibold text-[oklch(0.28_0.02_60)] outline-none"
                  style={{ boxShadow: INSET_SM }}
                />
                <input
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  placeholder="Type (e.g. Sandwich)"
                  className="min-w-[140px] flex-1 rounded-[10px] px-3.5 py-[9px] text-sm font-semibold text-[oklch(0.28_0.02_60)] outline-none"
                  style={{ boxShadow: INSET_SM }}
                />
                <input
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  type="number"
                  placeholder="Price (₹)"
                  className="w-[110px] rounded-[10px] px-3.5 py-[9px] text-sm font-semibold text-[oklch(0.28_0.02_60)] outline-none"
                  style={{ boxShadow: INSET_SM }}
                />
                <div className="flex gap-[7px] rounded-[10px] p-1" style={{ boxShadow: INSET_SM }}>
                  <button
                    type="button"
                    onClick={() => setNewCat("veg")}
                    className="rounded-[8px] px-3 py-[7px] font-condensed text-[13px] font-bold"
                    style={{
                      background: "var(--background)",
                      color: newCat === "veg" ? "oklch(0.4 0.12 150)" : "oklch(0.55 0.03 60)",
                      boxShadow: newCat === "veg" ? RAISED_SM : "none",
                    }}
                  >
                    Veg
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCat("nonveg")}
                    className="rounded-[8px] px-3 py-[7px] font-condensed text-[13px] font-bold"
                    style={{
                      background: "var(--background)",
                      color: newCat === "nonveg" ? "oklch(0.48 0.19 25)" : "oklch(0.55 0.03 60)",
                      boxShadow: newCat === "nonveg" ? RAISED_SM : "none",
                    }}
                  >
                    Non-Veg
                  </button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-[7px]">
                {MENU_SECTIONS.map((section) => (
                  <button
                    key={section}
                    type="button"
                    onClick={() => setNewSection(section)}
                    className="rounded-full px-3 py-[6px] font-condensed text-[12px] font-bold tracking-[0.2px]"
                    style={{
                      background: "var(--background)",
                      color: newSection === section ? "oklch(0.26 0.02 60)" : "oklch(0.55 0.03 60)",
                      boxShadow: newSection === section ? INSET_SM : RAISED_SM,
                    }}
                  >
                    {section}
                  </button>
                ))}
              </div>
              <div className="mt-3.5 flex gap-2.5">
                <button
                  type="button"
                  onClick={submitNewDish}
                  className="rounded-[10px] bg-primary px-4 py-2.5 font-condensed text-[13.5px] font-bold text-primary-foreground"
                  style={{ boxShadow: ACCENT_GLOW_SM }}
                >
                  Add to menu
                </button>
                <button
                  type="button"
                  onClick={() => setAddOpen(false)}
                  className="rounded-[10px] px-4 py-2.5 font-condensed text-[13.5px] font-bold text-[oklch(0.46_0.02_60)]"
                  style={{ boxShadow: RAISED_SM }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}

          <div className="mt-5">
            {groups.length ? (
              <Accordion multiple defaultValue={MENU_SECTIONS} className="flex flex-col gap-3">
                {groups.map(({ section, dishes }) => (
                  <AccordionItem
                    key={section}
                    value={section}
                    className="not-last:border-b-0 rounded-2xl bg-background px-4"
                    style={{ boxShadow: RAISED_SM }}
                  >
                    <AccordionTrigger className="py-3.5 font-condensed text-[15px] font-bold tracking-[0.2px] text-[oklch(0.28_0.02_60)] no-underline hover:no-underline">
                      <span className="flex items-center gap-2.5">
                        {section}
                        <span
                          className="rounded-full px-2 py-0.5 text-xs font-bold text-muted-foreground"
                          style={{ boxShadow: INSET_SM }}
                        >
                          {dishes.length}
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-2.5 pb-1">
                        {dishes.map((dish) => (
                          <DishRow
                            key={dish.id}
                            dish={dish}
                            editing={editingId === dish.id}
                            draft={drafts[dish.id] ?? ""}
                            onFlip={() => setItems((prev) => flipDishCategory(prev, dish.id))}
                            onToggleEdit={() =>
                              setEditingId((prev) => (prev === dish.id ? null : dish.id))
                            }
                            onSetPrice={(price) =>
                              setItems((prev) => setDishPrice(prev, dish.id, price))
                            }
                            onDraftChange={(value) =>
                              setDrafts((prev) => ({ ...prev, [dish.id]: value }))
                            }
                            onAddIngredient={() => {
                              const value = drafts[dish.id] ?? "";
                              setItems((prev) => addIngredient(prev, dish.id, value));
                              setDrafts((prev) => ({ ...prev, [dish.id]: "" }));
                            }}
                            onRemoveIngredient={(index) =>
                              setItems((prev) => removeIngredient(prev, dish.id, index))
                            }
                            onSave={() => saveDish(dish.id)}
                            onDelete={() => deleteDish(dish.id)}
                          />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div
                className="rounded-2xl bg-background p-8 text-center text-[14px] font-semibold text-muted-foreground"
                style={{ boxShadow: INSET_SM }}
              >
                No dishes match your search.
              </div>
            )}
          </div>
        </div>

        <LivePreviewPhone
          items={items}
          tab={previewTab}
          onTabChange={setPreviewTab}
          empty={false}
          logoUrl={logoUrl}
        />
      </div>
    </div>
  );
}
