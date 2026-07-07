// ═══════════════════════════════════════════════════════════════════
//  WHITE LIQUID GLASS — shared design tokens for WhiteHomePage + WhiteSaaSHero
//  (Exports kept backward compatible: Theme / GlassStyle already existed
//   and are imported elsewhere — only their values were tightened here.
//   GlassStyleElevated / gradPrimary / gradAccent / prefersReducedMotion
//   already existed. NEW in this pass: gradHero, gradPremium, glassSurface,
//   glassBorder, radiusLarge, plus a couple of small helpers the new
//   Hero/Product sections use. Nothing removed, nothing renamed.)
// ═══════════════════════════════════════════════════════════════════

export const Theme = {
  bg: "#ffffff",
  bgSubtle: "#f8fbff",
  bgGlow: "#f3f7ff",

  textPrimary: "#0f172a",
  textSecondary: "#475569",
  textMuted: "#94a3b8",

  accentCyan: "#06b6d4",
  accentBlue: "#3b82f6",
  accentIndigo: "#6366f1",
  accentPurple: "#8b5cf6",
  accentPink: "#ec4899",
  accentYellow: "#eab308",
  accentGreen: "#10b981",

  border: "rgba(15, 23, 42, 0.08)",
  borderStrong: "rgba(15, 23, 42, 0.14)",

  shadowSubtle: "0 4px 20px rgba(0, 0, 0, 0.04)",
  shadowFloat: "0 24px 48px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(15,23,42,0.04)",
  shadowGlass: "0 24px 80px rgba(15, 23, 42, 0.08)",

  radius: "28px",
  radiusSm: "16px",
  radiusLarge: "34px",
  font: "'Inter', sans-serif",
  fontHeading: "'Sora', 'Plus Jakarta Sans', 'Inter', sans-serif",
  fontNumber: "'Space Grotesk', 'Inter', sans-serif",

  // Named gradients reused across hero, pricing, footer, CTAs
  gradPrimary: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)", // blue -> cyan (headline accent)
  gradAccent: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)", // blue -> purple ("recommended" CTA)

  // NEW — full page hero background wash (white + lilac + blue glass bubbles)
  gradHero:
    "radial-gradient(circle at 80% 15%, rgba(139,92,246,0.16), transparent 32%)," +
    "radial-gradient(circle at 20% 85%, rgba(59,130,246,0.12), transparent 34%)," +
    "linear-gradient(135deg, #ffffff 0%, #f8fbff 45%, #f3f0ff 100%)",

  // NEW — strongest gradient, reserved for the single "Full Year ₹49" premium CTA
  gradPremium: "linear-gradient(135deg, #3b82f6 0%, #6366f1 45%, #8b5cf6 100%)",
};

// Liquid glass surface — use for cards, navbar, product cards, pricing,
// dashboard preview, FAQ, and footer, per the brand spec.
export const GlassStyle = {
  background: "rgba(255,255,255,0.72)",
  backdropFilter: "blur(22px) saturate(160%)",
  WebkitBackdropFilter: "blur(22px) saturate(160%)",
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 24px 80px rgba(15,23,42,0.08)",
  borderRadius: "28px",
};

// Stronger variant for the one highlighted/"recommended" surface on the
// page (the ₹49 annual pricing card) — same glass language, just louder.
export const GlassStyleElevated = {
  ...GlassStyle,
  background: "rgba(255,255,255,0.86)",
  border: "1px solid rgba(59,130,246,0.22)",
  boxShadow: "0 30px 90px rgba(59,130,246,0.16), 0 24px 80px rgba(15,23,42,0.08)",
};

// NEW — raw surface/border strings (not a full style object) for places
// that need to compose glass into a custom style block, e.g. the hero
// dashboard-preview-frame which mixes glass with a floating animation.
export const glassSurface = "linear-gradient(145deg, rgba(255,255,255,0.78), rgba(255,255,255,0.42))";
export const glassBorder = "1px solid rgba(255,255,255,0.82)";

// Shared helper so every animated/particle component checks motion
// preference the same way.
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Shared helper so hero/product sections can agree on "is this a small
// screen" without each re-implementing a matchMedia check.
export const isCoarsePointer = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia &&
  (window.matchMedia("(max-width: 1024px)").matches || window.matchMedia("(pointer: coarse)").matches);
