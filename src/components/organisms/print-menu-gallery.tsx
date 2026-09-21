"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { PlateNavbar } from "@/components/organisms/plate-navbar";
import { RAISED_SM, INSET, INSET_SM, ACCENT_GLOW_SM } from "@/lib/neu-shadows";
import type { MenuForSession } from "@/lib/menu-repo";
import type { Dish } from "@/lib/menu-seed";

type TemplateId = "classic" | "modern" | "rustic";

type ExportFormat = "pdf" | "png" | "jpeg" | "gif" | "cdr";

const FORMAT_OPTIONS: { value: ExportFormat; label: string }[] = [
  { value: "pdf",  label: "PDF — Print / Save as PDF" },
  { value: "png",  label: "PNG — High-res Image" },
  { value: "jpeg", label: "JPEG — Compressed Image" },
  { value: "gif",  label: "GIF — Web Image" },
  { value: "cdr",  label: "Corel Draw — SVG Vector" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

type Group = { section: string; dishes: Dish[] };

function groupBySection(dishes: Dish[]): Group[] {
  const map = new Map<string, Dish[]>();
  for (const d of dishes) {
    if (!map.has(d.section)) map.set(d.section, []);
    map.get(d.section)!.push(d);
  }
  return Array.from(map.entries()).map(([section, dishes]) => ({ section, dishes }));
}

/**
 * Splits sections into A4 page buckets based on estimated dish count.
 * First page has a smaller capacity because the restaurant header takes space.
 */
function paginateSections(groups: Group[]): Group[][] {
  const pages: Group[][] = [];
  let page: Group[] = [];
  let count = 0;

  for (const g of groups) {
    const capacity = pages.length === 0 ? 10 : 14;
    if (count > 0 && count + g.dishes.length > capacity) {
      pages.push(page);
      page = [];
      count = 0;
    }
    page.push(g);
    count += g.dishes.length;
  }
  if (page.length > 0) pages.push(page);
  return pages;
}

function priceLabel(dish: Dish): string {
  if (dish.fullPrice) return `₹${dish.halfPrice ?? ""}  /  ₹${dish.fullPrice}`;
  if (dish.smallPrice || dish.mediumPrice || dish.largePrice) {
    const parts = [
      dish.smallPrice  ? `S ₹${dish.smallPrice}`  : null,
      dish.mediumPrice ? `M ₹${dish.mediumPrice}` : null,
      dish.largePrice  ? `L ₹${dish.largePrice}`  : null,
    ].filter(Boolean);
    return parts.join("  /  ");
  }
  return `₹${dish.price}`;
}

// ─── CLASSIC TEMPLATE ─────────────────────────────────────────────────────────

function ClassicTemplate({ menu }: { menu: MenuForSession | null }) {
  const name   = menu?.restaurantName ?? "Your Restaurant";
  const tagline = menu?.description ?? "";
  const pages  = paginateSections(groupBySection(menu?.dishes ?? []));
  const total  = pages.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28, background: "#c8c8c8", padding: 28 }}>
      {pages.map((pageGroups, pageIdx) => (
        <div
          key={pageIdx}
          style={{
            background: "#fff",
            fontFamily: "'Georgia', 'Times New Roman', serif",
            color: "#1a1a1a",
            padding: "56px 64px 56px",
            width: 794,
            minHeight: 1123,
            boxSizing: "border-box",
            position: "relative",
          }}
        >
          {/* ── Full header (page 1 only) ── */}
          {pageIdx === 0 ? (
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div style={{ fontSize: 11, letterSpacing: "4px", textTransform: "uppercase", color: "#888", marginBottom: 12, fontFamily: "'Arial', sans-serif" }}>
                Est. Menu
              </div>
              <h1 style={{ fontSize: 40, fontWeight: 700, letterSpacing: "2px", margin: 0, lineHeight: 1.1, textTransform: "uppercase" }}>
                {name}
              </h1>
              {tagline && (
                <p style={{ fontSize: 14, fontStyle: "italic", color: "#666", marginTop: 10, marginBottom: 0 }}>
                  {tagline}
                </p>
              )}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 20 }}>
                <div style={{ height: 1, width: 60, background: "#ccc" }} />
                <span style={{ fontSize: 16, color: "#999" }}>✦</span>
                <div style={{ height: 1, width: 60, background: "#ccc" }} />
              </div>
            </div>
          ) : (
            /* ── Compact header (page 2+) ── */
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#333" }}>
                {name}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 8 }}>
                <div style={{ height: 1, width: 60, background: "#d0d0d0" }} />
                <span style={{ fontSize: 9, color: "#aaa", fontFamily: "'Arial', sans-serif", letterSpacing: "2.5px" }}>CONTINUED</span>
                <div style={{ height: 1, width: 60, background: "#d0d0d0" }} />
              </div>
            </div>
          )}

          {/* ── Sections ── */}
          {pageGroups.map(({ section, dishes }) => (
            <div key={section} style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ height: 1, flex: 1, background: "#d0d0d0" }} />
                <span style={{ fontSize: 10, letterSpacing: "3px", fontFamily: "'Arial', sans-serif", fontWeight: 700, textTransform: "uppercase", color: "#555" }}>
                  {section}
                </span>
                <div style={{ height: 1, flex: 1, background: "#d0d0d0" }} />
              </div>
              {dishes.map((dish) => (
                <div key={dish.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: 10, paddingBottom: 10, borderBottom: "1px dotted #e8e8e8" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 8, height: 8, borderRadius: 1, border: `1.5px solid ${dish.cat === "veg" ? "#2e7d32" : "#b71c1c"}`, flexShrink: 0 }}>
                        <span style={{ display: "block", width: 4, height: 4, borderRadius: "50%", background: dish.cat === "veg" ? "#2e7d32" : "#b71c1c" }} />
                      </span>
                      <span style={{ fontSize: 15, fontWeight: 600 }}>{dish.name}</span>
                    </div>
                    {dish.description && <p style={{ fontSize: 11.5, fontStyle: "italic", color: "#777", margin: "3px 0 0 16px" }}>{dish.description}</p>}
                    {dish.ingredients.length > 0 && <p style={{ fontSize: 10.5, color: "#999", margin: "2px 0 0 16px", fontFamily: "'Arial', sans-serif" }}>{dish.ingredients.join(", ")}</p>}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, whiteSpace: "nowrap", color: "#333", letterSpacing: "0.5px" }}>
                    {priceLabel(dish)}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* ── Page footer ── */}
          <div style={{ position: "absolute", bottom: 28, left: 64, right: 64, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ height: 1, width: 36, background: "#d0d0d0" }} />
              <span style={{ fontSize: 9, color: "#bbb", fontFamily: "'Arial', sans-serif", letterSpacing: "2px" }}>THANK YOU</span>
              <div style={{ height: 1, width: 36, background: "#d0d0d0" }} />
            </div>
            <span style={{ fontSize: 10, color: "#aaa", fontFamily: "'Arial', sans-serif", letterSpacing: "0.5px" }}>
              Page {pageIdx + 1} of {total}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── MODERN TEMPLATE ──────────────────────────────────────────────────────────

function ModernTemplate({ menu }: { menu: MenuForSession | null }) {
  const name    = menu?.restaurantName ?? "Your Restaurant";
  const tagline = menu?.description ?? "";
  const pages   = paginateSections(groupBySection(menu?.dishes ?? []));
  const total   = pages.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28, background: "#c8c8c8", padding: 28 }}>
      {pages.map((pageGroups, pageIdx) => (
        <div
          key={pageIdx}
          style={{
            background: "#fff",
            fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
            color: "#1a1a1a",
            minHeight: 1123,
            width: 794,
            boxSizing: "border-box",
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* ── Full header (page 1 only) ── */}
          {pageIdx === 0 ? (
            <div style={{ background: "#111827", color: "#fff", padding: "36px 60px 28px" }}>
              <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: "3px", textTransform: "uppercase", margin: 0, lineHeight: 1 }}>
                {name}
              </h1>
              {tagline && <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 8, marginBottom: 0, letterSpacing: "1px" }}>{tagline}</p>}
              <div style={{ width: 48, height: 3, background: "#f59e0b", marginTop: 14, borderRadius: 2 }} />
            </div>
          ) : (
            /* ── Compact header (page 2+) ── */
            <div style={{ background: "#111827", color: "#fff", padding: "16px 60px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase" }}>{name}</span>
              <span style={{ fontSize: 10, color: "#9ca3af", letterSpacing: "2px" }}>CONTINUED</span>
            </div>
          )}

          {/* ── Sections ── */}
          <div style={{ padding: "28px 60px 64px", flex: 1 }}>
            {pageGroups.map(({ section, dishes }) => (
              <div key={section} style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 4, height: 20, background: "#f59e0b", borderRadius: 2 }} />
                  <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase", color: "#111" }}>
                    {section}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }}>
                  {dishes.map((dish) => (
                    <div key={dish.id} style={{ padding: "12px 14px", background: "#f9fafb", borderRadius: 8, borderLeft: `3px solid ${dish.cat === "veg" ? "#16a34a" : "#dc2626"}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <span style={{ fontSize: 13.5, fontWeight: 700, flex: 1, lineHeight: 1.3 }}>{dish.name}</span>
                        <span style={{ fontSize: 13, fontWeight: 800, color: "#111", whiteSpace: "nowrap", marginLeft: 8 }}>{priceLabel(dish)}</span>
                      </div>
                      {dish.type && <span style={{ display: "inline-block", fontSize: 9.5, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#9ca3af", marginTop: 3 }}>{dish.type}</span>}
                      {dish.description && <p style={{ fontSize: 11, color: "#6b7280", marginTop: 4, marginBottom: 0, lineHeight: 1.4 }}>{dish.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── Page footer ── */}
          <div style={{ background: "#111827", padding: "12px 60px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
            <span style={{ fontSize: 10, color: "#6b7280", letterSpacing: "2px", textTransform: "uppercase" }}>{name}</span>
            <span style={{ fontSize: 10, color: "#6b7280", letterSpacing: "1px" }}>
              Page {pageIdx + 1} of {total}  ·  All prices include taxes
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── RUSTIC TEMPLATE ──────────────────────────────────────────────────────────

function RusticTemplate({ menu }: { menu: MenuForSession | null }) {
  const name    = menu?.restaurantName ?? "Your Restaurant";
  const tagline = menu?.description ?? "";
  const pages   = paginateSections(groupBySection(menu?.dishes ?? []));
  const total   = pages.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28, background: "#c8c8c8", padding: 28 }}>
      {pages.map((pageGroups, pageIdx) => (
        <div
          key={pageIdx}
          style={{
            background: "#fef6e4",
            fontFamily: "'Georgia', 'Times New Roman', serif",
            color: "#3b1f0e",
            padding: "48px 56px 56px",
            minHeight: 1123,
            width: 794,
            boxSizing: "border-box",
            position: "relative",
          }}
        >
          {/* Outer border */}
          <div style={{ border: "2px solid #c9a96e", padding: "36px 44px 44px", minHeight: 1007, position: "relative", boxSizing: "border-box" }}>
            {/* Corner diamonds */}
            {([["top", "left"], ["top", "right"], ["bottom", "left"], ["bottom", "right"]] as const).map(([v, h], i) => (
              <div key={i} style={{ position: "absolute", [v]: -6, [h]: -6, width: 10, height: 10, background: "#c9a96e", transform: "rotate(45deg)" }} />
            ))}

            {/* ── Full header (page 1 only) ── */}
            {pageIdx === 0 ? (
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div style={{ fontSize: 10, letterSpacing: "5px", textTransform: "uppercase", color: "#c9a96e", fontFamily: "'Arial', sans-serif", marginBottom: 10 }}>✦ ✦ ✦</div>
                <h1 style={{ fontSize: 38, fontWeight: 700, margin: 0, lineHeight: 1.1, color: "#3b1f0e", letterSpacing: "1.5px" }}>{name}</h1>
                {tagline && <p style={{ fontSize: 13, fontStyle: "italic", color: "#8b6340", marginTop: 8, marginBottom: 0 }}>~ {tagline} ~</p>}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 18 }}>
                  <div style={{ height: 1, width: 80, background: "#c9a96e" }} />
                  <span style={{ fontSize: 14, color: "#c9a96e" }}>❧</span>
                  <div style={{ height: 1, width: 80, background: "#c9a96e" }} />
                </div>
              </div>
            ) : (
              /* ── Compact header (page 2+) ── */
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#3b1f0e", letterSpacing: "1.5px" }}>{name}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8 }}>
                  <div style={{ height: 1, width: 60, background: "#c9a96e" }} />
                  <span style={{ fontSize: 9, color: "#c9a96e", fontFamily: "'Arial', sans-serif", letterSpacing: "3px" }}>CONTINUED</span>
                  <div style={{ height: 1, width: 60, background: "#c9a96e" }} />
                </div>
              </div>
            )}

            {/* ── Sections ── */}
            {pageGroups.map(({ section, dishes }) => (
              <div key={section} style={{ marginBottom: 24 }}>
                <div style={{ textAlign: "center", marginBottom: 12 }}>
                  <div style={{ height: 1, background: "#d9c4a0", marginBottom: 8 }} />
                  <span style={{ fontSize: 11, fontFamily: "'Arial', sans-serif", fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase", color: "#8b6340" }}>
                    {section}
                  </span>
                  <div style={{ height: 1, background: "#d9c4a0", marginTop: 8 }} />
                </div>
                {dishes.map((dish) => (
                  <div key={dish.id} style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <span style={{ fontSize: 15, color: dish.cat === "veg" ? "#2d6a2d" : "#8b1a1a", lineHeight: 1 }}>
                          {dish.cat === "veg" ? "◈" : "◆"}
                        </span>
                        <span style={{ fontSize: 14.5, fontWeight: 600 }}>{dish.name}</span>
                        {dish.type && <span style={{ fontSize: 10, fontStyle: "italic", color: "#a0805a", fontFamily: "'Arial', sans-serif" }}>({dish.type})</span>}
                      </div>
                      {dish.description && <p style={{ fontSize: 11, fontStyle: "italic", color: "#a0805a", margin: "2px 0 0 22px" }}>{dish.description}</p>}
                      {dish.ingredients.length > 0 && <p style={{ fontSize: 10, color: "#b59070", margin: "2px 0 0 22px", fontFamily: "'Arial', sans-serif" }}>{dish.ingredients.join(" · ")}</p>}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#5c3317", whiteSpace: "nowrap", paddingTop: 1 }}>
                      {priceLabel(dish)}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* ── Page footer ── */}
            <div style={{ position: "absolute", bottom: 28, left: 44, right: 44, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ height: 1, width: 36, background: "#c9a96e" }} />
                <span style={{ fontSize: 10, color: "#c9a96e" }}>✦</span>
                <div style={{ height: 1, width: 36, background: "#c9a96e" }} />
              </div>
              <span style={{ fontSize: 10, color: "#a0805a", fontFamily: "'Arial', sans-serif", letterSpacing: "0.5px" }}>
                Page {pageIdx + 1} of {total}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Print HTML helpers ────────────────────────────────────────────────────────

function buildPrintHTML(title: string, css: string, bodyHTML: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: A4; margin: 0; }
    body { background: #fff; }
    .page { page-break-after: always; width: 794px; min-height: 1123px; position: relative; }
    .page:last-child { page-break-after: auto; }
    ${css}
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>${bodyHTML}</body>
</html>`;
}

/** Opens a popup, renders via html2canvas CDN, triggers download. */
function buildImageExportHTML(
  title: string, css: string, bodyHTML: string,
  mimeType: "image/png" | "image/jpeg", filename: string,
): string {
  const quality = mimeType === "image/jpeg" ? "0.93" : "1.0";
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #c8c8c8; }
    .page { page-break-after: always; width: 794px; min-height: 1123px; position: relative; }
    .page:last-child { page-break-after: auto; }
    ${css}
  </style>
</head>
<body>
${bodyHTML}
<script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
<script>
window.addEventListener('load', function() {
  setTimeout(function() {
    html2canvas(document.body, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: null }).then(function(canvas) {
      var link = document.createElement('a');
      link.download = '${filename}';
      link.href = canvas.toDataURL('${mimeType}', ${quality});
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(function() { window.close(); }, 800);
    });
  }, 600);
});
</script>
</body>
</html>`;
}

/** Downloads an SVG with foreignObject wrapping the full print HTML — for Corel Draw. */
function exportAsSvg(printHTML: string, filename: string): void {
  const styleMatch = printHTML.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  const bodyMatch  = printHTML.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const css  = styleMatch?.[1] ?? "";
  const body = bodyMatch?.[1]  ?? "";

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="794" height="1123" viewBox="0 0 794 1123">
  <foreignObject width="794" height="1123">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head><meta charset="utf-8"/><style>${css}</style></head>
      <body>${body}</body>
    </html>
  </foreignObject>
</svg>`;

  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement("a"), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Dish rows HTML (for print/export) ───────────────────────────────────────

function dishRowsHTML(dishes: Dish[], template: TemplateId): string {
  return dishes.map((d) => {
    const price    = priceLabel(d);
    const vegColor = d.cat === "veg" ? "#2e7d32" : "#b71c1c";

    if (template === "classic") {
      return `<div class="dish">
        <div class="dish-left">
          <div class="dish-title">
            <span class="veg-box" style="border-color:${vegColor}"><span class="veg-dot" style="background:${vegColor}"></span></span>
            ${d.name}
          </div>
          ${d.description ? `<div class="dish-desc">${d.description}</div>` : ""}
          ${d.ingredients.length ? `<div class="dish-ing">${d.ingredients.join(", ")}</div>` : ""}
        </div>
        <div class="dish-price">${price}</div>
      </div>`;
    }

    if (template === "modern") {
      return `<div class="dish" style="border-left-color:${vegColor}">
        <div class="dish-header">
          <span class="dish-name">${d.name}</span>
          <span class="dish-price">${price}</span>
        </div>
        ${d.type ? `<span class="dish-type">${d.type}</span>` : ""}
        ${d.description ? `<div class="dish-desc">${d.description}</div>` : ""}
      </div>`;
    }

    // rustic
    const sym = d.cat === "veg" ? "◈" : "◆";
    return `<div class="dish">
      <div class="dish-left">
        <div class="dish-title">
          <span class="veg-sym" style="color:${vegColor}">${sym}</span>
          ${d.name}
          ${d.type ? `<span class="dish-type">(${d.type})</span>` : ""}
        </div>
        ${d.description ? `<div class="dish-desc">${d.description}</div>` : ""}
        ${d.ingredients.length ? `<div class="dish-ing">${d.ingredients.join(" · ")}</div>` : ""}
      </div>
      <div class="dish-price">${price}</div>
    </div>`;
  }).join("");
}

// ─── Print HTML page generators ───────────────────────────────────────────────

function classicPrintHTML(menu: MenuForSession | null): string {
  const name    = menu?.restaurantName ?? "Your Restaurant";
  const tagline = menu?.description ?? "";
  const pages   = paginateSections(groupBySection(menu?.dishes ?? []));
  const total   = pages.length;

  const css = `
    body { font-family: Georgia, 'Times New Roman', serif; color: #1a1a1a; }
    .page { padding: 56px 64px 56px; }
    h1 { font-size: 40px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; text-align: center; margin: 0; }
    .est { font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #888; text-align: center; margin-bottom: 12px; font-family: Arial, sans-serif; }
    .tagline { font-size: 14px; font-style: italic; color: #666; text-align: center; margin-top: 10px; }
    .divider { display: flex; align-items: center; justify-content: center; gap: 12px; margin: 20px 0; }
    .divider-line { height: 1px; width: 60px; background: #ccc; }
    .compact-header { text-align: center; font-size: 15px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #333; margin-bottom: 28px; }
    .compact-rule { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 8px; }
    .compact-rule-line { height: 1px; width: 60px; background: #d0d0d0; }
    .compact-rule-label { font-size: 9px; color: #aaa; font-family: Arial, sans-serif; letter-spacing: 2.5px; }
    .section { margin-bottom: 28px; }
    .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
    .section-header::before, .section-header::after { content: ''; flex: 1; height: 1px; background: #d0d0d0; }
    .section-header span { font-size: 10px; letter-spacing: 3px; font-family: Arial, sans-serif; font-weight: 700; text-transform: uppercase; color: #555; }
    .dish { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px dotted #e8e8e8; }
    .dish-left { flex: 1; }
    .dish-title { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; }
    .veg-box { display: inline-flex; align-items: center; justify-content: center; width: 8px; height: 8px; border-radius: 1px; border: 1.5px solid; flex-shrink: 0; }
    .veg-dot { width: 4px; height: 4px; border-radius: 50%; display: block; }
    .dish-desc { font-size: 11.5px; font-style: italic; color: #777; margin: 3px 0 0 16px; }
    .dish-ing { font-size: 10.5px; color: #999; margin: 2px 0 0 16px; font-family: Arial, sans-serif; }
    .dish-price { font-size: 14px; font-weight: 700; white-space: nowrap; color: #333; letter-spacing: 0.5px; }
    .page-footer { position: absolute; bottom: 28px; left: 64px; right: 64px; display: flex; justify-content: space-between; align-items: center; }
    .footer-rule { display: flex; align-items: center; gap: 8px; }
    .footer-rule-line { height: 1px; width: 36px; background: #d0d0d0; }
    .footer-rule-label { font-size: 9px; color: #bbb; font-family: Arial, sans-serif; letter-spacing: 2px; }
    .page-num { font-size: 10px; color: #aaa; font-family: Arial, sans-serif; }
  `;

  const pagesHTML = pages.map((pageGroups, i) => {
    const header = i === 0
      ? `<div class="est">Est. Menu</div>
         <h1>${name}</h1>
         ${tagline ? `<div class="tagline">${tagline}</div>` : ""}
         <div class="divider"><div class="divider-line"></div><span style="font-size:16px;color:#999">✦</span><div class="divider-line"></div></div>`
      : `<div class="compact-header">${name}
           <div class="compact-rule"><div class="compact-rule-line"></div><span class="compact-rule-label">CONTINUED</span><div class="compact-rule-line"></div></div>
         </div>`;

    const sections = pageGroups.map(({ section, dishes }) => `
      <div class="section">
        <div class="section-header"><span>${section}</span></div>
        ${dishRowsHTML(dishes, "classic")}
      </div>`).join("");

    return `<div class="page">
      ${header}
      ${sections}
      <div class="page-footer">
        <div class="footer-rule"><div class="footer-rule-line"></div><span class="footer-rule-label">THANK YOU</span><div class="footer-rule-line"></div></div>
        <span class="page-num">Page ${i + 1} of ${total}</span>
      </div>
    </div>`;
  }).join("\n");

  return buildPrintHTML(name, css, pagesHTML);
}

function modernPrintHTML(menu: MenuForSession | null): string {
  const name    = menu?.restaurantName ?? "Your Restaurant";
  const tagline = menu?.description ?? "";
  const pages   = paginateSections(groupBySection(menu?.dishes ?? []));
  const total   = pages.length;

  const css = `
    body { font-family: Arial, 'Helvetica Neue', sans-serif; color: #1a1a1a; }
    .page { display: flex; flex-direction: column; }
    .page-header-full { background: #111827; color: #fff; padding: 36px 60px 28px; }
    .page-header-full h1 { font-size: 36px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase; margin: 0; line-height: 1; }
    .page-header-full .tagline { font-size: 13px; color: #9ca3af; margin-top: 8px; letter-spacing: 1px; }
    .accent-bar { width: 48px; height: 3px; background: #f59e0b; margin-top: 14px; border-radius: 2px; }
    .page-header-compact { background: #111827; color: #fff; padding: 14px 60px; display: flex; justify-content: space-between; align-items: center; }
    .page-header-compact span:first-child { font-size: 14px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; }
    .page-header-compact span:last-child { font-size: 10px; color: #9ca3af; letter-spacing: 2px; }
    .content { padding: 28px 60px; flex: 1; }
    .section { margin-bottom: 28px; }
    .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
    .accent-left { width: 4px; height: 20px; background: #f59e0b; border-radius: 2px; }
    .section-header span { font-size: 12px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; color: #111; }
    .dish-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 24px; }
    .dish { padding: 12px 14px; background: #f9fafb; border-radius: 8px; border-left: 3px solid; }
    .dish-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .dish-name { font-size: 13.5px; font-weight: 700; flex: 1; line-height: 1.3; }
    .dish-price { font-size: 13px; font-weight: 800; color: #111; white-space: nowrap; margin-left: 8px; }
    .dish-type { display: inline-block; font-size: 9.5px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #9ca3af; margin-top: 3px; }
    .dish-desc { font-size: 11px; color: #6b7280; margin-top: 4px; line-height: 1.4; }
    .page-footer { background: #111827; padding: 12px 60px; display: flex; justify-content: space-between; align-items: center; }
    .page-footer span { font-size: 10px; color: #6b7280; letter-spacing: 1.5px; text-transform: uppercase; }
  `;

  const pagesHTML = pages.map((pageGroups, i) => {
    const header = i === 0
      ? `<div class="page-header-full">
           <h1>${name}</h1>
           ${tagline ? `<div class="tagline">${tagline}</div>` : ""}
           <div class="accent-bar"></div>
         </div>`
      : `<div class="page-header-compact">
           <span>${name}</span><span>CONTINUED</span>
         </div>`;

    const sections = pageGroups.map(({ section, dishes }) => `
      <div class="section">
        <div class="section-header"><div class="accent-left"></div><span>${section}</span></div>
        <div class="dish-grid">${dishRowsHTML(dishes, "modern")}</div>
      </div>`).join("");

    return `<div class="page">
      ${header}
      <div class="content">${sections}</div>
      <div class="page-footer">
        <span>${name}</span>
        <span>Page ${i + 1} of ${total} · All prices include taxes</span>
      </div>
    </div>`;
  }).join("\n");

  return buildPrintHTML(name, css, pagesHTML);
}

function rusticPrintHTML(menu: MenuForSession | null): string {
  const name    = menu?.restaurantName ?? "Your Restaurant";
  const tagline = menu?.description ?? "";
  const pages   = paginateSections(groupBySection(menu?.dishes ?? []));
  const total   = pages.length;

  const css = `
    body { font-family: Georgia, 'Times New Roman', serif; background: #fef6e4; color: #3b1f0e; }
    .page { padding: 48px 56px 56px; }
    .outer { border: 2px solid #c9a96e; padding: 36px 44px 52px; position: relative; min-height: 1011px; box-sizing: border-box; }
    h1 { font-size: 38px; font-weight: 700; letter-spacing: 1.5px; text-align: center; margin: 0; line-height: 1.1; color: #3b1f0e; }
    .ornament { text-align: center; font-size: 10px; letter-spacing: 5px; color: #c9a96e; font-family: Arial, sans-serif; margin-bottom: 10px; }
    .tagline { font-size: 13px; font-style: italic; color: #8b6340; text-align: center; margin-top: 8px; }
    .divider { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 18px 0; }
    .divider-line { height: 1px; flex: 1; max-width: 80px; background: #c9a96e; }
    .compact-header { text-align: center; font-size: 15px; font-weight: 700; color: #3b1f0e; letter-spacing: 1.5px; margin-bottom: 24px; }
    .compact-rule { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 8px; }
    .compact-rule-line { height: 1px; width: 60px; background: #c9a96e; }
    .compact-rule-label { font-size: 9px; color: #c9a96e; font-family: Arial, sans-serif; letter-spacing: 3px; }
    .section { margin-bottom: 24px; }
    .section-label-wrap { text-align: center; margin-bottom: 12px; }
    .section-rule { height: 1px; background: #d9c4a0; margin-bottom: 8px; }
    .section-label { font-size: 11px; font-family: Arial, sans-serif; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: #8b6340; }
    .dish { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
    .dish-left { flex: 1; }
    .dish-title { display: flex; align-items: center; gap: 7px; font-size: 14.5px; font-weight: 600; }
    .veg-sym { font-size: 15px; line-height: 1; }
    .dish-type { font-size: 10px; font-style: italic; color: #a0805a; font-family: Arial, sans-serif; }
    .dish-desc { font-size: 11px; font-style: italic; color: #a0805a; margin: 2px 0 0 22px; }
    .dish-ing { font-size: 10px; color: #b59070; margin: 2px 0 0 22px; font-family: Arial, sans-serif; }
    .dish-price { font-size: 14px; font-weight: 700; color: #5c3317; white-space: nowrap; padding-top: 1px; }
    .page-footer { position: absolute; bottom: 28px; left: 44px; right: 44px; display: flex; justify-content: space-between; align-items: center; }
    .footer-rule { display: flex; align-items: center; gap: 8px; }
    .footer-rule-line { height: 1px; width: 36px; background: #c9a96e; }
    .page-num { font-size: 10px; color: #a0805a; font-family: Arial, sans-serif; }
  `;

  const pagesHTML = pages.map((pageGroups, i) => {
    const header = i === 0
      ? `<div class="ornament">✦ ✦ ✦</div>
         <h1>${name}</h1>
         ${tagline ? `<div class="tagline">~ ${tagline} ~</div>` : ""}
         <div class="divider"><div class="divider-line"></div><span style="font-size:14px;color:#c9a96e">❧</span><div class="divider-line"></div></div>`
      : `<div class="compact-header">${name}
           <div class="compact-rule"><div class="compact-rule-line"></div><span class="compact-rule-label">CONTINUED</span><div class="compact-rule-line"></div></div>
         </div>`;

    const sections = pageGroups.map(({ section, dishes }) => `
      <div class="section">
        <div class="section-label-wrap">
          <div class="section-rule"></div>
          <span class="section-label">${section}</span>
          <div class="section-rule" style="margin-top:8px"></div>
        </div>
        ${dishRowsHTML(dishes, "rustic")}
      </div>`).join("");

    return `<div class="page">
      <div class="outer">
        ${header}
        ${sections}
        <div class="page-footer">
          <div class="footer-rule"><div class="footer-rule-line"></div><span style="font-size:12px;color:#c9a96e">✦</span><div class="footer-rule-line"></div></div>
          <span class="page-num">Page ${i + 1} of ${total}</span>
        </div>
      </div>
    </div>`;
  }).join("\n");

  return buildPrintHTML(name, css, pagesHTML);
}

// ─── Gallery component ─────────────────────────────────────────────────────────

const TEMPLATES: { id: TemplateId; label: string; description: string; accent: string }[] = [
  { id: "classic", label: "Classic",  description: "Timeless serif style with dot-ruled sections", accent: "#374151" },
  { id: "modern",  label: "Modern",   description: "Bold header with two-column dish grid",         accent: "#f59e0b" },
  { id: "rustic",  label: "Rustic",   description: "Warm parchment with ornamental borders",        accent: "#c9a96e" },
];

const printFns: Record<TemplateId, (menu: MenuForSession | null) => string> = {
  classic: classicPrintHTML,
  modern:  modernPrintHTML,
  rustic:  rusticPrintHTML,
};

export function PrintMenuGallery({
  session,
  menu,
}: {
  session: { name: string };
  menu: MenuForSession | null;
}) {
  const [selected, setSelected] = useState<TemplateId>("classic");
  const [format, setFormat]     = useState<ExportFormat>("pdf");

  const slug = menu?.restaurantName
    ? menu.restaurantName.toLowerCase().replace(/\s+/g, "-")
    : "menu";

  const handleExport = () => {
    const html = printFns[selected](menu);

    if (format === "pdf") {
      const w = window.open("", "_blank");
      if (!w) { alert("Allow pop-ups to open the print dialog."); return; }
      w.document.write(html);
      w.document.close();
      setTimeout(() => w.print(), 600);
      return;
    }

    if (format === "cdr") {
      exportAsSvg(html, `${slug}-menu.svg`);
      return;
    }

    const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
    const ext      = format === "gif" ? "gif" : format === "jpeg" ? "jpg" : "png";
    const filename = `${slug}-menu.${ext}`;

    const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    const bodyMatch  = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const css  = styleMatch?.[1] ?? "";
    const body = bodyMatch?.[1]  ?? "";

    const exportHTML = buildImageExportHTML(slug, css, body, mimeType, filename);
    const w = window.open("", "_blank");
    if (!w) { alert("Allow pop-ups to export this image."); return; }
    w.document.write(exportHTML);
    w.document.close();
  };

  const TemplatePreview =
    selected === "classic" ? ClassicTemplate
    : selected === "modern" ? ModernTemplate
    : RusticTemplate;

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-[oklch(0.28_0.02_60)]">
      <PlateNavbar session={session} />

      <div className="mx-auto w-full max-w-[1100px] px-6 py-8 pb-20 sm:px-10">
        {/* Breadcrumb */}
        <Link
          href="/admin"
          className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[oklch(0.52_0.03_60)] hover:text-[oklch(0.28_0.02_60)]"
        >
          <ArrowLeft className="size-3.5" strokeWidth={2.5} />
          Back to dashboard
        </Link>

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="font-display text-[28px] text-[oklch(0.24_0.02_60)]">
            Print Menu Designs
          </h1>
          <p className="mt-1.5 text-[14px] text-muted-foreground">
            Choose a design, pick a format — PDF, PNG, JPEG, GIF, or Corel Draw SVG — then export.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* ── Left: controls ── */}
          <div className="flex flex-col gap-3">
            <div className="text-[11px] font-bold uppercase tracking-[0.6px] text-[oklch(0.56_0.03_60)]">
              Choose a design
            </div>
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelected(t.id)}
                className="flex items-start gap-3.5 rounded-2xl bg-background p-4 text-left"
                style={{ boxShadow: selected === t.id ? INSET : RAISED_SM }}
              >
                <div className="mt-0.5 size-4 shrink-0 rounded-full" style={{ background: t.accent }} />
                <div>
                  <div
                    className="font-condensed text-[14px] font-bold tracking-[0.2px]"
                    style={{ color: selected === t.id ? "oklch(0.26 0.02 60)" : "oklch(0.46 0.02 60)" }}
                  >
                    {t.label}
                  </div>
                  <div className="mt-0.5 text-[12px] text-muted-foreground">{t.description}</div>
                </div>
              </button>
            ))}

            {/* Format selector */}
            <div className="mt-2">
              <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.6px] text-[oklch(0.56_0.03_60)]">
                Export format
              </div>
              <div className="relative">
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as ExportFormat)}
                  className="w-full appearance-none rounded-[13px] bg-background py-3 pl-4 pr-10 font-condensed text-[13.5px] font-bold text-[oklch(0.28_0.02_60)] outline-none"
                  style={{ boxShadow: INSET_SM }}
                >
                  {FORMAT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[oklch(0.55_0.03_60)]"
                  width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {/* Export button */}
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center justify-center gap-2 rounded-[13px] bg-primary px-5 py-3.5 font-condensed text-[14px] font-bold text-primary-foreground"
              style={{ boxShadow: ACCENT_GLOW_SM }}
            >
              {format === "pdf" ? <Printer className="size-4" strokeWidth={2.5} /> : <Download className="size-4" strokeWidth={2.5} />}
              {format === "pdf"  ? "Print / Save as PDF"
               : format === "png"  ? "Export as PNG"
               : format === "jpeg" ? "Export as JPEG"
               : format === "gif"  ? "Export as GIF"
               : "Export for Corel Draw"}
            </button>

            {!menu && (
              <p className="mt-1 rounded-xl p-3 text-[12px] text-muted-foreground" style={{ boxShadow: INSET_SM }}>
                No menu yet — templates show placeholder content.{" "}
                <Link href="/builder" className="font-bold text-primary underline-offset-2 hover:underline">
                  Build a menu
                </Link>{" "}
                first to print your actual dishes.
              </p>
            )}
          </div>

          {/* ── Right: paginated preview ── */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[11px] font-bold uppercase tracking-[0.6px] text-[oklch(0.56_0.03_60)]">
                Preview
              </div>
              <div className="rounded-full px-3 py-1 text-[11px] font-semibold text-muted-foreground" style={{ boxShadow: INSET_SM }}>
                Scroll to see all pages
              </div>
            </div>

            {/* Scrollable preview — shows all A4 pages stacked */}
            <div
              className="overflow-auto rounded-2xl"
              style={{ boxShadow: RAISED_SM, maxHeight: "80vh" }}
            >
              <TemplatePreview menu={menu} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
