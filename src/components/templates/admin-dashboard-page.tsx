"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Check, Pencil, Plus, QrCode, Search, Settings, X } from "lucide-react";
import { PlateNavbar } from "@/components/organisms/plate-navbar";
import { LivePreviewPhone } from "@/components/organisms/live-preview-phone";
import { DishRow } from "@/components/molecules/dish-row";
import { MenuSharePanel } from "@/components/organisms/menu-share-panel";
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
  setDishDescription,
  setDishFullPrice,
  setDishHalfPrice,
  setDishLargePrice,
  setDishMediumPrice,
  setDishName,
  setDishPrice,
  setDishSmallPrice,
  setPricingMode,
} from "@/lib/builder-state";
import {
  applyEnhancedDishImage,
  createMenuItem,
  deleteMenuItem,
  enhanceDishImage,
  removeDishImage,
  resetWeeklyAvailability,
  setFeaturedDish,
  toggleDishAvailability,
  updateMenuDescription,
  updateMenuItem,
  updateRestaurantName,
  uploadDishImage,
} from "@/lib/menu-actions";
import type { MenuForSession, MenuSummary, RegularCustomer } from "@/lib/menu-repo";
import {
  priceStr,
  type Dish,
  type DishCategory,
  type MenuSection,
} from "@/lib/menu-seed";

type Filter = "all" | DishCategory;
type SectionFilter = "all" | MenuSection;

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

export function AdminDashboardPage({
  session,
  menu,
  allMenus,
  regularCustomers,
}: {
  session: { name: string };
  menu: MenuForSession | null;
  allMenus: MenuSummary[];
  regularCustomers: RegularCustomer[];
}) {
  const [items, setItems] = useState<Dish[]>(menu?.dishes ?? []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [uploadingImageId, setUploadingImageId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [sectionFilter, setSectionFilter] = useState<SectionFilter>("all");
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCat, setNewCat] = useState<DishCategory>("veg");
  const [newSection, setNewSection] = useState<MenuSection>(
    menu?.dishes[0]?.section ?? "Menu"
  );

  const [featuredId, setFeaturedId] = useState<string | null>(
    menu?.dishes.find((d) => d.featured)?.id ?? null
  );

  // Tab
  const [activeTab, setActiveTab] = useState<"overview" | "menu">("overview");

  // Inline identity editing
  const [editingIdentity, setEditingIdentity] = useState(false);
  const [draftName, setDraftName] = useState(menu?.restaurantName ?? "");
  const [draftDescription, setDraftDescription] = useState(menu?.description ?? "");
  const [savingIdentity, setSavingIdentity] = useState(false);
  const [displayName, setDisplayName] = useState(menu?.restaurantName ?? session.name);
  const [displayDescription, setDisplayDescription] = useState(menu?.description ?? "");

  const vegCount = items.filter((d) => d.cat === "veg").length;
  const nonvegCount = items.length - vegCount;
  const soldOutCount = items.filter((d) => d.available === false).length;
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

  const sections = useMemo(() => {
    const seen = new Set<MenuSection>();
    const ordered: MenuSection[] = [];
    for (const dish of items) {
      if (seen.has(dish.section)) continue;
      seen.add(dish.section);
      ordered.push(dish.section);
    }
    return ordered;
  }, [items]);

  const groups = useMemo(
    () =>
      sections
        .map((section) => ({
          section,
          dishes: filtered.filter((d) => d.section === section),
        }))
        .filter((g) => g.dishes.length > 0),
    [sections, filtered]
  );

  const persist = (dish: Dish) =>
    updateMenuItem({
      id: dish.id,
      name: dish.name,
      description: dish.description,
      cat: dish.cat,
      price: dish.price,
      halfPrice: dish.halfPrice,
      fullPrice: dish.fullPrice,
      smallPrice: dish.smallPrice,
      mediumPrice: dish.mediumPrice,
      largePrice: dish.largePrice,
      ingredients: dish.ingredients,
    });

  const flipDish = async (id: string) => {
    const before = items;
    const next = flipDishCategory(items, id);
    const dish = next.find((d) => d.id === id);
    if (!dish) return;
    setItems(next);
    try {
      await persist(dish);
    } catch {
      setItems(before);
      toast.error(`Couldn't update ${dish.name}`);
    }
  };

  const saveDish = async (id: string) => {
    const dish = items.find((d) => d.id === id);
    if (!dish) return;
    setEditingId(null);
    try {
      const saved = await persist(dish);
      setItems((prev) => prev.map((d) => (d.id === saved.id ? saved : d)));
      toast.success(`${saved.name} updated`);
    } catch {
      toast.error(`Couldn't save ${dish.name} — try again`);
    }
  };

  const deleteDish = async (id: string) => {
    const before = items;
    const dish = items.find((d) => d.id === id);
    if (!dish) return;
    setItems((prev) => removeDish(prev, id));
    if (editingId === id) setEditingId(null);
    try {
      await deleteMenuItem(id);
      toast.success(`${dish.name} removed from menu`);
    } catch {
      setItems(before);
      toast.error(`Couldn't remove ${dish.name}`);
    }
  };

  const toggleAvailable = async (id: string) => {
    const dish = items.find((d) => d.id === id);
    if (!dish) return;
    const next = dish.available !== false ? false : true;
    setItems((prev) => prev.map((d) => (d.id === id ? { ...d, available: next } : d)));
    try {
      await toggleDishAvailability(id, next);
    } catch {
      setItems((prev) => prev.map((d) => (d.id === id ? { ...d, available: !next } : d)));
      toast.error(`Couldn't update ${dish.name}`);
    }
  };

  const resetAvailability = async () => {
    if (!menu) return;
    setItems((prev) => prev.map((d) => ({ ...d, available: true })));
    try {
      const { count } = await resetWeeklyAvailability(menu.id);
      if (count > 0) toast.success(`${count} ${count === 1 ? "dish" : "dishes"} marked available`);
      else toast.success("All dishes already available");
    } catch {
      toast.error("Couldn't reset availability");
    }
  };

  const toggleFeatured = async (id: string) => {
    if (!menu) return;
    const nextId = featuredId === id ? null : id;
    setFeaturedId(nextId);
    try {
      await setFeaturedDish(menu.id, nextId);
      toast.success(nextId ? "Marked as Popular this week" : "Removed Popular this week");
    } catch {
      setFeaturedId(featuredId);
      toast.error("Couldn't update featured dish");
    }
  };

  const saveIdentity = async () => {
    if (!menu) return;
    const name = draftName.trim();
    if (!name) { toast.error("Restaurant name can't be empty"); return; }
    setSavingIdentity(true);
    try {
      await Promise.all([
        updateRestaurantName(menu.id, name),
        updateMenuDescription(menu.id, draftDescription.trim() || null),
      ]);
      setDisplayName(name);
      setDisplayDescription(draftDescription.trim());
      setEditingIdentity(false);
      toast.success("Menu info updated");
    } catch {
      toast.error("Couldn't save menu info");
    } finally {
      setSavingIdentity(false);
    }
  };

  const selectDishImage = async (dish: Dish, file: File) => {
    setUploadingImageId(dish.id);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const { url } = await uploadDishImage(dish.id, formData);
      setItems((prev) => prev.map((d) => (d.id === dish.id ? { ...d, imageUrl: url } : d)));
      toast.success(`${dish.name} photo updated`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Couldn't upload photo for ${dish.name}`);
    } finally {
      setUploadingImageId(null);
    }
  };

  const removeDishPhoto = async (dish: Dish) => {
    const before = items;
    setItems((prev) => prev.map((d) => (d.id === dish.id ? { ...d, imageUrl: null } : d)));
    try {
      await removeDishImage(dish.id);
      toast.success(`${dish.name} photo removed`);
    } catch {
      setItems(before);
      toast.error(`Couldn't remove photo for ${dish.name}`);
    }
  };

  const generateDishVariants = async (dish: Dish, count: number): Promise<string[]> => {
    const { images } = await enhanceDishImage(dish.id, count);
    return images;
  };

  const applyDishVariant = async (dish: Dish, url: string): Promise<void> => {
    const { url: savedUrl } = await applyEnhancedDishImage(dish.id, url);
    setItems((prev) => prev.map((d) => (d.id === dish.id ? { ...d, imageUrl: savedUrl } : d)));
    toast.success(`${dish.name} photo updated`);
  };

  const submitNewDish = async () => {
    if (!menu) {
      toast.error("Build a menu first, then add dishes here");
      return;
    }
    const name = newName.trim();
    const price = parseInt(newPrice, 10);
    if (!name || !price) {
      toast.error("Add a name and price to create a dish");
      return;
    }
    try {
      const dish = await createMenuItem({
        menuId: menu.id,
        name,
        type: newType.trim() || "Dish",
        cat: newCat,
        price,
        section: newSection.trim() || "Menu",
      });
      setItems((prev) => addDish(prev, dish));
      setNewName("");
      setNewType("");
      setNewPrice("");
      setNewCat("veg");
      setAddOpen(false);
      toast.success(`${dish.name} added to menu`);
    } catch {
      toast.error(`Couldn't add ${name}`);
    }
  };

  // Shared stats row rendered in both tabs
  const statsRow = (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <StatTile value={String(items.length)} label="Total dishes" />
      <StatTile value={String(vegCount)} label="Veg" />
      <StatTile value={String(nonvegCount)} label="Non-veg" />
      <StatTile value={String(usedSectionCount)} label="Categories" />
      <StatTile value={priceStr(menuValue)} label="Menu value" />
      <div className="rounded-2xl bg-background p-4" style={{ boxShadow: RAISED_SM }}>
        <div className="font-display text-2xl" style={{ color: soldOutCount > 0 ? "var(--nonveg)" : "oklch(0.26 0.02 60)" }}>
          {soldOutCount}
        </div>
        <div className="mt-1 text-xs font-bold tracking-[0.5px] text-muted-foreground uppercase">Sold out</div>
        {soldOutCount > 0 ? (
          <button
            type="button"
            onClick={resetAvailability}
            className="mt-2 rounded-full px-2.5 py-[4px] font-condensed text-[10.5px] font-bold tracking-[0.2px] text-[oklch(0.42_0.12_150)]"
            style={{ boxShadow: RAISED_SM }}
          >
            Reset all
          </button>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="flex flex-1 flex-col bg-background font-sans text-[oklch(0.28_0.02_60)]">
      <PlateNavbar session={session} />

      <div className="mx-auto grid w-full max-w-[1180px] items-start gap-8 px-6 py-6 pb-16 sm:px-10 lg:grid-cols-[1fr_380px]">
        <div>
          {/* Menu switcher — shown when owner has multiple menus */}
          {allMenus.length > 1 ? (
            <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
              {allMenus.map((m) => (
                <a
                  key={m.id}
                  href={`/admin?menu=${m.id}`}
                  className="shrink-0 rounded-full px-4 py-[7px] font-condensed text-[13px] font-bold tracking-[0.2px] whitespace-nowrap"
                  style={{
                    color: m.id === menu?.id ? "oklch(0.26 0.02 60)" : "oklch(0.52 0.03 60)",
                    boxShadow: m.id === menu?.id ? INSET : RAISED_SM,
                  }}
                >
                  {m.restaurantName}
                  <span className="ml-1.5 font-normal opacity-60">{m.dishCount}</span>
                </a>
              ))}
            </div>
          ) : null}

          {/* Tab switcher */}
          <div className="flex gap-[7px] rounded-[14px] p-1" style={{ boxShadow: INSET }}>
            {(["overview", "menu"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className="flex-1 rounded-[10px] py-2.5 font-condensed text-[14px] font-bold tracking-[0.2px] capitalize"
                style={{
                  background: "var(--background)",
                  color: activeTab === tab ? "oklch(0.26 0.02 60)" : "oklch(0.52 0.03 60)",
                  boxShadow: activeTab === tab ? RAISED_SM : "none",
                }}
              >
                {tab === "overview" ? "Overview" : "Menu"}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW TAB ── */}
          {activeTab === "overview" ? (
            <div className="mt-5 flex flex-col gap-5">
              {/* Live badge */}
              {menu ? (
                <div
                  className="inline-flex w-fit items-center gap-[9px] rounded-full bg-background px-4 py-[9px] text-[13px] font-bold tracking-[0.4px]"
                  style={{ color: "oklch(0.42 0.12 150)", boxShadow: INSET }}
                >
                  <span className="size-[9px] rounded-full" style={{ background: "var(--success)" }} />
                  Live &amp; published
                </div>
              ) : null}

              {/* Identity card */}
              <div className="rounded-2xl bg-background p-[18px]" style={{ boxShadow: RAISED_SM }}>
                {editingIdentity ? (
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold tracking-[0.6px] text-[oklch(0.56_0.03_60)] uppercase">
                        Restaurant name
                      </label>
                      <input
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        placeholder="e.g. The Bistro Cafe"
                        maxLength={200}
                        className="w-full rounded-[11px] px-3.5 py-3 text-[15px] font-semibold text-[oklch(0.26_0.02_60)] outline-none"
                        style={{ boxShadow: INSET_SM }}
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold tracking-[0.6px] text-[oklch(0.56_0.03_60)] uppercase">
                        Tagline / description
                      </label>
                      <input
                        value={draftDescription}
                        onChange={(e) => setDraftDescription(e.target.value)}
                        placeholder="e.g. Family-owned cafe since 1998"
                        maxLength={300}
                        className="w-full rounded-[11px] px-3.5 py-3 text-sm font-semibold text-[oklch(0.38_0.02_60)] outline-none"
                        style={{ boxShadow: INSET_SM }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={saveIdentity}
                        disabled={savingIdentity}
                        className="flex items-center gap-1.5 rounded-[11px] px-4 py-2.5 font-condensed text-[13px] font-bold text-[oklch(0.35_0.02_60)] disabled:opacity-60"
                        style={{ boxShadow: RAISED_SM }}
                      >
                        <Check className="size-3.5" strokeWidth={2.5} />
                        {savingIdentity ? "Saving…" : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setDraftName(displayName); setDraftDescription(displayDescription); setEditingIdentity(false); }}
                        className="flex items-center gap-1.5 rounded-[11px] px-4 py-2.5 font-condensed text-[13px] font-bold text-[oklch(0.5_0.02_60)]"
                        style={{ boxShadow: RAISED_SM }}
                      >
                        <X className="size-3.5" strokeWidth={2.5} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h1 className="font-display text-[26px] tracking-[0.3px] text-[oklch(0.24_0.02_60)] sm:text-[32px]">
                        {displayName}
                      </h1>
                      {displayDescription ? (
                        <p className="mt-1 text-[13.5px] text-muted-foreground">{displayDescription}</p>
                      ) : (
                        <p className="mt-1 text-[13px] italic text-muted-foreground opacity-60">No tagline yet — click Edit to add one</p>
                      )}
                    </div>
                    {menu ? (
                      <button
                        type="button"
                        onClick={() => { setDraftName(displayName); setDraftDescription(displayDescription); setEditingIdentity(true); }}
                        className="flex shrink-0 items-center gap-1.5 rounded-[10px] px-3 py-2 font-condensed text-[12.5px] font-bold text-[oklch(0.46_0.02_60)]"
                        style={{ boxShadow: RAISED_SM }}
                      >
                        <Pencil className="size-3.5" strokeWidth={2} />
                        Edit
                      </button>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Quick links */}
              <div className="flex flex-wrap gap-2.5">
                {menu ? (
                  <a
                    href={`/${menu.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-[11px] px-[18px] py-[11px] font-condensed text-sm font-bold text-[oklch(0.35_0.02_60)]"
                    style={{ boxShadow: RAISED_SM }}
                  >
                    dinepixel.cloud/{menu.slug} ↗
                  </a>
                ) : null}
                <Link
                  href="/admin/tables"
                  className="flex items-center gap-1.5 rounded-[11px] px-[15px] py-[11px] font-condensed text-sm font-bold text-[oklch(0.35_0.02_60)]"
                  style={{ boxShadow: RAISED_SM }}
                >
                  <QrCode className="size-4" strokeWidth={2} />
                  Tables
                </Link>
                <Link
                  href="/admin/settings"
                  className="flex items-center gap-1.5 rounded-[11px] px-[15px] py-[11px] font-condensed text-sm font-bold text-[oklch(0.35_0.02_60)]"
                  style={{ boxShadow: RAISED_SM }}
                >
                  <Settings className="size-4" strokeWidth={2} />
                  Settings
                </Link>
              </div>

              {/* Stats */}
              {statsRow}

              {/* Share panel */}
              {menu ? (
                <div className="rounded-2xl bg-background p-[18px]" style={{ boxShadow: RAISED_SM }}>
                  <div className="text-xs font-bold tracking-[0.6px] text-[oklch(0.56_0.03_60)] uppercase">
                    Share your menu
                  </div>
                  <div className="mt-4">
                    <MenuSharePanel slug={menu.slug} />
                  </div>
                </div>
              ) : null}

              {/* Offer notifier */}
              <AdminOfferNotifier logoUrl={menu?.logoUrl ?? null} customers={regularCustomers} />
            </div>
          ) : null}

          {/* ── MENU TAB ── */}
          {activeTab === "menu" ? (
            <div className="mt-5 flex flex-col gap-5">
              {/* Stats */}
              {statsRow}

              {/* Search + filter + add */}
              <div className="flex flex-wrap items-center gap-2.5">
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

              {/* Section chips */}
              <div className="flex flex-wrap gap-[7px]">
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
                {sections.map((section) => (
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

              {/* Add dish form */}
              {addOpen ? (
                <div className="rounded-2xl bg-background p-4" style={{ boxShadow: RAISED_SM }}>
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
                      <button type="button" onClick={() => setNewCat("veg")} className="rounded-[8px] px-3 py-[7px] font-condensed text-[13px] font-bold" style={{ background: "var(--background)", color: newCat === "veg" ? "oklch(0.4 0.12 150)" : "oklch(0.55 0.03 60)", boxShadow: newCat === "veg" ? RAISED_SM : "none" }}>Veg</button>
                      <button type="button" onClick={() => setNewCat("nonveg")} className="rounded-[8px] px-3 py-[7px] font-condensed text-[13px] font-bold" style={{ background: "var(--background)", color: newCat === "nonveg" ? "oklch(0.48 0.19 25)" : "oklch(0.55 0.03 60)", boxShadow: newCat === "nonveg" ? RAISED_SM : "none" }}>Non-Veg</button>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-[7px]">
                    {sections.map((section) => (
                      <button key={section} type="button" onClick={() => setNewSection(section)} className="rounded-full px-3 py-[6px] font-condensed text-[12px] font-bold tracking-[0.2px]" style={{ background: "var(--background)", color: newSection === section ? "oklch(0.26 0.02 60)" : "oklch(0.55 0.03 60)", boxShadow: newSection === section ? INSET_SM : RAISED_SM }}>
                        {section}
                      </button>
                    ))}
                    <input value={newSection} onChange={(e) => setNewSection(e.target.value)} placeholder="Category" className="w-[150px] rounded-full px-3.5 py-[7px] text-[12.5px] font-semibold text-[oklch(0.28_0.02_60)] outline-none" style={{ boxShadow: INSET_SM }} />
                  </div>
                  <div className="mt-3.5 flex gap-2.5">
                    <button type="button" onClick={submitNewDish} className="rounded-[10px] bg-primary px-4 py-2.5 font-condensed text-[13.5px] font-bold text-primary-foreground" style={{ boxShadow: ACCENT_GLOW_SM }}>Add to menu</button>
                    <button type="button" onClick={() => setAddOpen(false)} className="rounded-[10px] px-4 py-2.5 font-condensed text-[13.5px] font-bold text-[oklch(0.46_0.02_60)]" style={{ boxShadow: RAISED_SM }}>Cancel</button>
                  </div>
                </div>
              ) : null}

              {/* Dish list */}
              {groups.length ? (
                <Accordion multiple defaultValue={sections} className="flex flex-col gap-3">
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
                          <span className="rounded-full px-2 py-0.5 text-xs font-bold text-muted-foreground" style={{ boxShadow: INSET_SM }}>
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
                              uploadingImage={uploadingImageId === dish.id}
                              onFlip={() => flipDish(dish.id)}
                              onToggleEdit={() => setEditingId((prev) => (prev === dish.id ? null : dish.id))}
                              onToggleAvailable={() => toggleAvailable(dish.id)}
                              isFeatured={featuredId === dish.id}
                              onSetFeatured={() => toggleFeatured(dish.id)}
                              onSetName={(name) => setItems((prev) => setDishName(prev, dish.id, name))}
                              onSetDescription={(desc) => setItems((prev) => setDishDescription(prev, dish.id, desc))}
                              onSetPrice={(price) => setItems((prev) => setDishPrice(prev, dish.id, price))}
                              onSetHalfPrice={(price) => setItems((prev) => setDishHalfPrice(prev, dish.id, price))}
                              onSetFullPrice={(price) => setItems((prev) => setDishFullPrice(prev, dish.id, price))}
                              onSetSmallPrice={(price) => setItems((prev) => setDishSmallPrice(prev, dish.id, price))}
                              onSetMediumPrice={(price) => setItems((prev) => setDishMediumPrice(prev, dish.id, price))}
                              onSetLargePrice={(price) => setItems((prev) => setDishLargePrice(prev, dish.id, price))}
                              onSetPricingMode={(mode) => setItems((prev) => setPricingMode(prev, dish.id, mode))}
                              onDraftChange={(value) => setDrafts((prev) => ({ ...prev, [dish.id]: value }))}
                              onAddIngredient={() => {
                                const value = drafts[dish.id] ?? "";
                                setItems((prev) => addIngredient(prev, dish.id, value));
                                setDrafts((prev) => ({ ...prev, [dish.id]: "" }));
                              }}
                              onRemoveIngredient={(index) => setItems((prev) => removeIngredient(prev, dish.id, index))}
                              onImageSelect={(file) => selectDishImage(dish, file)}
                              onImageRemove={() => removeDishPhoto(dish)}
                              onEnhanceGenerate={menu?.imageEnhancerUrl ? (count) => generateDishVariants(dish, count) : undefined}
                              onEnhanceApply={menu?.imageEnhancerUrl ? (url) => applyDishVariant(dish, url) : undefined}
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
                <div className="rounded-2xl bg-background p-8 text-center text-[14px] font-semibold text-muted-foreground" style={{ boxShadow: INSET_SM }}>
                  {items.length === 0 ? (
                    <>
                      No menu saved yet.{" "}
                      <a href="/builder" className="font-bold text-primary underline-offset-2 hover:underline">Upload a menu</a>{" "}
                      to get started.
                    </>
                  ) : (
                    "No dishes match your search."
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>

        <LivePreviewPhone
          items={items}
          empty={items.length === 0}
          cafeName={menu?.restaurantName ?? undefined}
          logoUrl={menu?.logoUrl ?? null}
          bannerUrl={menu?.bannerUrl ?? null}
          theme={menu?.theme}
          menuId={menu?.id}
        />
      </div>
    </div>
  );
}
