"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Minus, Package, Pencil, Plus, Trash2, X, Check } from "lucide-react";
import { RAISED_SM, INSET_SM, INSET, ACCENT_GLOW_SM } from "@/lib/neu-shadows";
import {
  adjustIngredientStock,
  createIngredient,
  deleteIngredient,
  getIngredients,
  updateIngredient,
  type IngredientRow,
} from "@/lib/inventory-actions";

const UNITS = ["units", "kg", "g", "L", "mL", "dozen", "pcs", "bags", "bottles", "boxes"];

function StockBar({ current, min }: { current: number; min: number }) {
  const isLow = min > 0 && current <= min;
  const pct = min > 0 ? Math.min(100, (current / (min * 3)) * 100) : 50;
  return (
    <div className="h-[5px] w-full overflow-hidden rounded-full" style={{ boxShadow: INSET_SM }}>
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{
          width: `${Math.max(4, pct)}%`,
          background: isLow ? "var(--nonveg)" : "var(--primary)",
        }}
      />
    </div>
  );
}

export function AdminInventoryTab({ menuId }: { menuId: string }) {
  const [ingredients, setIngredients] = useState<IngredientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Add form state
  const [newName, setNewName] = useState("");
  const [newUnit, setNewUnit] = useState("units");
  const [newStock, setNewStock] = useState("");
  const [newMin, setNewMin] = useState("");
  const [saving, setSaving] = useState(false);

  // Edit draft state
  const [editDraft, setEditDraft] = useState<Omit<IngredientRow, "id">>({
    name: "",
    unit: "units",
    currentStock: 0,
    minStock: 0,
  });

  useEffect(() => {
    getIngredients(menuId)
      .then(setIngredients)
      .catch(() => toast.error("Failed to load ingredients"))
      .finally(() => setLoading(false));
  }, [menuId]);

  const lowStockCount = ingredients.filter(
    (i) => i.minStock > 0 && i.currentStock <= i.minStock
  ).length;

  async function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    setSaving(true);
    try {
      const created = await createIngredient(menuId, {
        name,
        unit: newUnit,
        currentStock: parseFloat(newStock) || 0,
        minStock: parseFloat(newMin) || 0,
      });
      setIngredients((prev) => [...prev, created]);
      setNewName("");
      setNewUnit("units");
      setNewStock("");
      setNewMin("");
      setAddOpen(false);
      toast.success(`${created.name} added`);
    } catch {
      toast.error("Failed to add ingredient");
    } finally {
      setSaving(false);
    }
  }

  async function handleStockAdjust(ingredient: IngredientRow, delta: number) {
    const next = Math.max(0, ingredient.currentStock + delta);
    setIngredients((prev) =>
      prev.map((i) => (i.id === ingredient.id ? { ...i, currentStock: next } : i))
    );
    try {
      await adjustIngredientStock(ingredient.id, menuId, next);
    } catch {
      setIngredients((prev) =>
        prev.map((i) => (i.id === ingredient.id ? ingredient : i))
      );
      toast.error("Failed to update stock");
    }
  }

  function startEdit(ingredient: IngredientRow) {
    setEditingId(ingredient.id);
    setEditDraft({
      name: ingredient.name,
      unit: ingredient.unit,
      currentStock: ingredient.currentStock,
      minStock: ingredient.minStock,
    });
  }

  async function handleSaveEdit(id: string) {
    setSaving(true);
    try {
      await updateIngredient(id, menuId, editDraft);
      setIngredients((prev) =>
        prev.map((i) => (i.id === id ? { ...i, ...editDraft } : i))
      );
      setEditingId(null);
      toast.success("Ingredient updated");
    } catch {
      toast.error("Failed to update ingredient");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(ingredient: IngredientRow) {
    setIngredients((prev) => prev.filter((i) => i.id !== ingredient.id));
    try {
      await deleteIngredient(ingredient.id, menuId);
      toast.success(`${ingredient.name} removed`);
    } catch {
      setIngredients((prev) => [...prev, ingredient]);
      toast.error("Failed to delete ingredient");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-sm font-semibold text-muted-foreground">
        Loading inventory…
      </div>
    );
  }

  return (
    <div className="mt-5 flex flex-col gap-4">
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1 rounded-2xl bg-background p-4" style={{ boxShadow: RAISED_SM }}>
          <span className="font-display text-2xl text-[oklch(0.26_0.02_60)]">{ingredients.length}</span>
          <span className="text-xs font-bold tracking-[0.5px] text-muted-foreground uppercase">Total items</span>
        </div>
        <div className="flex flex-col gap-1 rounded-2xl bg-background p-4" style={{ boxShadow: RAISED_SM }}>
          <span
            className="font-display text-2xl"
            style={{ color: lowStockCount > 0 ? "var(--nonveg)" : "oklch(0.26_0.02_60)" }}
          >
            {lowStockCount}
          </span>
          <span className="text-xs font-bold tracking-[0.5px] text-muted-foreground uppercase">Low stock</span>
        </div>
        <div className="flex flex-col gap-1 rounded-2xl bg-background p-4" style={{ boxShadow: RAISED_SM }}>
          <span className="font-display text-2xl text-[oklch(0.26_0.02_60)]">
            {ingredients.filter((i) => i.currentStock > 0).length}
          </span>
          <span className="text-xs font-bold tracking-[0.5px] text-muted-foreground uppercase">In stock</span>
        </div>
      </div>

      {/* Add ingredient button */}
      {!addOpen ? (
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-primary"
          style={{ boxShadow: RAISED_SM }}
        >
          <div
            className="flex size-6 items-center justify-center rounded-[7px]"
            style={{ background: "var(--primary)", boxShadow: ACCENT_GLOW_SM }}
          >
            <Plus className="size-3.5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          Add ingredient
        </button>
      ) : (
        <div className="flex flex-col gap-3 rounded-2xl bg-background p-4" style={{ boxShadow: RAISED_SM }}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[oklch(0.26_0.02_60)]">New ingredient</span>
            <button
              type="button"
              onClick={() => setAddOpen(false)}
              className="flex size-7 items-center justify-center rounded-[8px]"
              style={{ boxShadow: RAISED_SM }}
            >
              <X className="size-3.5 text-muted-foreground" strokeWidth={2} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <input
                type="text"
                placeholder="Ingredient name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                className="w-full rounded-xl bg-background px-3.5 py-2.5 text-sm font-medium outline-none placeholder:text-muted-foreground"
                style={{ boxShadow: INSET_SM }}
                autoFocus
              />
            </div>
            <select
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              className="rounded-xl bg-background px-3 py-2.5 text-sm font-medium outline-none"
              style={{ boxShadow: INSET_SM }}
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              placeholder="Current stock"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              className="rounded-xl bg-background px-3.5 py-2.5 text-sm font-medium outline-none placeholder:text-muted-foreground"
              style={{ boxShadow: INSET_SM }}
            />
            <div className="col-span-2">
              <input
                type="number"
                min="0"
                placeholder="Min stock alert threshold (optional)"
                value={newMin}
                onChange={(e) => setNewMin(e.target.value)}
                className="w-full rounded-xl bg-background px-3.5 py-2.5 text-sm font-medium outline-none placeholder:text-muted-foreground"
                style={{ boxShadow: INSET_SM }}
              />
            </div>
          </div>
          <button
            type="button"
            disabled={!newName.trim() || saving}
            onClick={handleAdd}
            className="w-full rounded-xl py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-50"
            style={{ background: "var(--primary)", boxShadow: ACCENT_GLOW_SM }}
          >
            {saving ? "Adding…" : "Add ingredient"}
          </button>
        </div>
      )}

      {/* Ingredient list */}
      {ingredients.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-14 text-center">
          <div
            className="flex size-12 items-center justify-center rounded-[14px]"
            style={{ boxShadow: INSET_SM }}
          >
            <Package className="size-5 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-semibold text-muted-foreground">
            No ingredients tracked yet.<br />Add your kitchen staples above.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {ingredients.map((ingredient) => {
            const isLow = ingredient.minStock > 0 && ingredient.currentStock <= ingredient.minStock;
            const isEditing = editingId === ingredient.id;

            return (
              <div
                key={ingredient.id}
                className="flex flex-col gap-3 rounded-2xl bg-background p-4"
                style={{ boxShadow: RAISED_SM }}
              >
                {isEditing ? (
                  /* Edit mode */
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={editDraft.name}
                          onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
                          className="w-full rounded-xl bg-background px-3.5 py-2.5 text-sm font-medium outline-none"
                          style={{ boxShadow: INSET_SM }}
                          autoFocus
                        />
                      </div>
                      <select
                        value={editDraft.unit}
                        onChange={(e) => setEditDraft((d) => ({ ...d, unit: e.target.value }))}
                        className="rounded-xl bg-background px-3 py-2.5 text-sm font-medium outline-none"
                        style={{ boxShadow: INSET_SM }}
                      >
                        {UNITS.map((u) => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="0"
                        placeholder="Current stock"
                        value={editDraft.currentStock}
                        onChange={(e) =>
                          setEditDraft((d) => ({ ...d, currentStock: parseFloat(e.target.value) || 0 }))
                        }
                        className="rounded-xl bg-background px-3.5 py-2.5 text-sm font-medium outline-none"
                        style={{ boxShadow: INSET_SM }}
                      />
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="0"
                          placeholder="Min stock threshold"
                          value={editDraft.minStock}
                          onChange={(e) =>
                            setEditDraft((d) => ({ ...d, minStock: parseFloat(e.target.value) || 0 }))
                          }
                          className="w-full rounded-xl bg-background px-3.5 py-2.5 text-sm font-medium outline-none"
                          style={{ boxShadow: INSET_SM }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="flex-1 rounded-xl py-2 text-sm font-bold text-muted-foreground"
                        style={{ boxShadow: RAISED_SM }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => handleSaveEdit(ingredient.id)}
                        className="flex-1 rounded-xl py-2 text-sm font-bold text-primary-foreground disabled:opacity-50"
                        style={{ background: "var(--primary)", boxShadow: ACCENT_GLOW_SM }}
                      >
                        {saving ? "Saving…" : "Save"}
                      </button>
                    </div>
                  </>
                ) : (
                  /* View mode */
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-condensed text-[15px] font-bold text-[oklch(0.26_0.02_60)]">
                            {ingredient.name}
                          </span>
                          {isLow && (
                            <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-[var(--nonveg)]"
                              style={{ boxShadow: INSET_SM }}>
                              <AlertTriangle className="size-2.5" strokeWidth={2.5} />
                              Low
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground">
                          {ingredient.currentStock} {ingredient.unit}
                          {ingredient.minStock > 0 && (
                            <span className="opacity-60"> · min {ingredient.minStock}</span>
                          )}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => startEdit(ingredient)}
                          className="flex size-[30px] items-center justify-center rounded-[9px]"
                          style={{ boxShadow: RAISED_SM }}
                        >
                          <Pencil className="size-3 text-muted-foreground" strokeWidth={2} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(ingredient)}
                          className="flex size-[30px] items-center justify-center rounded-[9px]"
                          style={{ boxShadow: RAISED_SM }}
                        >
                          <Trash2 className="size-3 text-muted-foreground" strokeWidth={2} />
                        </button>
                      </div>
                    </div>

                    <StockBar current={ingredient.currentStock} min={ingredient.minStock} />

                    {/* Stock adjustment */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold tracking-[0.4px] text-muted-foreground uppercase">
                        Adjust stock
                      </span>
                      <div className="flex items-center gap-1.5">
                        {[-10, -1].map((d) => (
                          <button
                            key={d}
                            type="button"
                            disabled={ingredient.currentStock <= 0}
                            onClick={() => handleStockAdjust(ingredient, d)}
                            className="flex size-[30px] items-center justify-center rounded-[9px] text-xs font-bold text-muted-foreground disabled:opacity-30"
                            style={{ boxShadow: RAISED_SM }}
                          >
                            {d}
                          </button>
                        ))}
                        <div
                          className="flex min-w-[48px] items-center justify-center rounded-[9px] py-1.5 font-condensed text-sm font-bold text-[oklch(0.26_0.02_60)]"
                          style={{ boxShadow: INSET_SM }}
                        >
                          {ingredient.currentStock}
                        </div>
                        {[+1, +10].map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => handleStockAdjust(ingredient, d)}
                            className="flex size-[30px] items-center justify-center rounded-[9px] text-xs font-bold text-[oklch(0.4_0.12_150)]"
                            style={{ boxShadow: RAISED_SM }}
                          >
                            +{d}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
