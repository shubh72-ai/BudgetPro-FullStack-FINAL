import { useState, useEffect, useCallback, memo, useRef } from "react";
import {
  BrowserRouter, Routes, Route, useNavigate,
  useLocation, useSearchParams, Navigate,
} from "react-router-dom";
import HeroScrollSequence from "./HeroScrollSequence";
import monthlyDashboardPreview from "./assets/monthly-dashboard-preview.png";
import annualDashboardPreview from "./assets/annual-dashboard-preview.png";
import ProductStory from "./components/commerce/ProductStory";
import StickyPurchaseDock from "./components/commerce/StickyPurchaseDock";
import CheckoutSessionTimer, { useCheckoutSessionTimer } from "./components/commerce/CheckoutSessionTimer";
import PaymentTrustRow from "./components/commerce/PaymentTrustRow";
import { GlassBadge, GlassButton } from "./components/ui/GlassSurface";

// ═══════════════════════════════════════════════════════════════════
//  DESIGN SYSTEM — Luxury Liquid Glass / Apple-inspired white SaaS
// ═══════════════════════════════════════════════════════════════════
const DS = {
  color: {
    bg:          "#ffffff",
    bgTinted:    "#f8fbff",
    bgCard:      "rgba(255,255,255,0.85)",
    bgGlass:     "rgba(255,255,255,0.72)",
    bgPanel:     "rgba(248,251,255,0.90)",
    navy:        "#0f172a",
    navyMid:     "#1e3a8a",
    navyLight:   "#f1f5f9",
    slate:       "#475569",
    slateLight:  "#94a3b8",
    border:      "rgba(15,23,42,0.07)",
    borderMid:   "rgba(15,23,42,0.12)",
    borderGlow:  "rgba(99,102,241,0.25)",
    mint:        "#3b82f6",
    mintText:    "#2563eb",
    mintLight:   "#dbeafe",
    mintDark:    "#1d4ed8",
    mintGlow:    "rgba(59,130,246,0.22)",
    purple:      "#8b5cf6",
    purpleLight: "#ede9fe",
    rose:        "#ec4899",
    gold:        "#f59e0b",
    goldLight:   "#fef3c7",
    cyan:        "#06b6d4",
    green:       "#10b981",
    text:        "#0f172a",
    textMuted:   "#64748b",
    white:       "#ffffff",
  },
  font: {
    body:    "'Manrope', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    heading: "'Playfair Display', Georgia, 'Times New Roman', serif",
    number:  "'Space Grotesk', 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  type: {
    display: "clamp(38px,5.5vw,68px)",
    h1:      "clamp(30px,4vw,52px)",
    h2:      "clamp(24px,3.5vw,42px)",
    h3:      "clamp(20px,2.5vw,28px)",
    h4:      "18px",
    body:    "15px",
    sm:      "13px",
    xs:      "11px",
  },
  space: {
    1:"4px",2:"8px",3:"12px",4:"16px",5:"20px",
    6:"24px",7:"28px",8:"32px",10:"40px",12:"48px",14:"56px",16:"64px",20:"80px",24:"96px",
  },
  radius: {
    sm:"10px",md:"14px",lg:"18px",xl:"22px","2xl":"28px","3xl":"36px",pill:"999px",
  },
  shadow: {
    xs:    "0 1px 3px rgba(15,23,42,0.06)",
    sm:    "0 4px 16px rgba(15,23,42,0.08)",
    md:    "0 8px 32px rgba(15,23,42,0.10)",
    lg:    "0 16px 56px rgba(15,23,42,0.12)",
    xl:    "0 24px 80px rgba(15,23,42,0.14)",
    "2xl": "0 36px 108px rgba(15,23,42,0.16)",
    glass: "0 8px 32px rgba(99,102,241,0.10), 0 2px 8px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.80)",
    glassLg: "0 20px 60px rgba(99,102,241,0.14), 0 8px 24px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.90)",
    glowBlue:  "0 0 0 3px rgba(59,130,246,0.18), 0 8px 32px rgba(59,130,246,0.22)",
    glowPurple:"0 0 0 3px rgba(139,92,246,0.16), 0 8px 32px rgba(139,92,246,0.20)",
    float:  "0 28px 80px rgba(15,23,42,0.14), 0 8px 24px rgba(99,102,241,0.10)",
  },
  grad: {
    // Hero background - subtle lavender-to-white
    hero: `radial-gradient(circle at 75% 20%, rgba(139,92,246,0.12) 0%, transparent 40%),
           radial-gradient(circle at 20% 75%, rgba(59,130,246,0.10) 0%, transparent 38%),
           radial-gradient(circle at 50% 50%, rgba(99,102,241,0.04) 0%, transparent 60%),
           linear-gradient(135deg, #ffffff 0%, #f8fbff 50%, #f3f0ff 100%)`,
    // Section alternates
    section: "linear-gradient(155deg, #f8fbff 0%, #f3f7ff 50%, #ffffff 100%)",
    // Blue → purple CTA gradient (liquid glass premium)
    cta:  "linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)",
    ctaHover: "linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)",
    // Glass card surfaces
    glass:     "linear-gradient(145deg, rgba(255,255,255,0.92), rgba(255,255,255,0.72))",
    glassDark: "linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))",
    // Mint/teal for income
    mint:   "linear-gradient(135deg, #3b82f6, #06b6d4)",
    // Warm gold for savings
    gold:   "linear-gradient(135deg, #f59e0b, #fb923c)",
    // Purple for highlights
    purple: "linear-gradient(135deg, #8b5cf6, #a855f7)",
    // Shimmer for skeletons
    shimmer:"linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
    // Full year CTA
    premium:"linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
  },
  ease: {
    smooth: "cubic-bezier(0.4,0,0.2,1)",
    spring: "cubic-bezier(0.34,1.56,0.64,1)",
    out:    "cubic-bezier(0,0,0.2,1)",
    in:     "cubic-bezier(0.4,0,1,1)",
  },
};

const SUPPORT_MAILTO = "mailto:theunseenworld2@gmail.com?subject=BudgetPro%20Support%20Request&body=Hello%20BudgetPro%20Team%2C%0A%0AI%20need%20assistance%20regarding%3A%0A%0AThank%20you.";

// ═══════════════════════════════════════════════════════════════════
//  GLOBAL STYLES — Liquid Glass System
// ═══════════════════════════════════════════════════════════════════
const GlobalStyles = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bp-bg: #F7F9FF;
      --bp-surface: rgba(255,255,255,0.52);
      --bp-surface-strong: rgba(255,255,255,0.72);
      --bp-border: rgba(255,255,255,0.78);
      --bp-border-soft: rgba(99,102,241,0.14);
      --bp-text: #0B1220;
      --bp-text-secondary: #475569;
      --bp-text-muted: #8090AA;
      --bp-blue: #3B82F6;
      --bp-indigo: #6366F1;
      --bp-purple: #8B5CF6;
      --bp-lilac: #EDE9FE;
      --bp-sky: #DBEAFE;
      --bp-success: #059669;
      --bp-warning: #D97706;
      --bp-gradient: linear-gradient(135deg, #3B82F6 0%, #6366F1 48%, #8B5CF6 100%);
      --bp-display: 'Playfair Display', Georgia, 'Times New Roman', serif;
      --bp-body: 'Manrope', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      --bp-number: 'Space Grotesk', 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    html { scroll-behavior: smooth; }
    html,
    body {
      background: #ffffff;
      font-family: var(--bp-body);
      color: ${DS.color.text};
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      min-height: 100vh;
      overflow-x: hidden;
    }
    button,
    input,
    select,
    textarea {
      font-family: var(--bp-body);
    }
    h1,
    h2,
    h3,
    h4,
    .bp-display-heading,
    .bp-product-title,
    .bp-section-heading h2,
    .bp-checkout-title h1,
    .reviews-heading-premium,
    .product-title-premium,
    .pricing-title-gradient {
      font-family: var(--bp-display);
    }
    h1,
    .bp-product-title,
    .product-title-premium {
      font-weight: 700;
      letter-spacing: -0.035em;
      line-height: 0.98;
    }
    h2,
    .bp-section-heading h2,
    .bp-checkout-title h1,
    .reviews-heading-premium,
    .pricing-title-gradient {
      font-weight: 700;
      letter-spacing: -0.025em;
      line-height: 1.04;
    }
    h3,
    h4 {
      font-weight: 600;
      letter-spacing: -0.015em;
      line-height: 1.15;
    }
    .number-font,
    .price-font,
    .kpi-number,
    .bp-price-block__price,
    .bp-compare-card__price,
    .bp-purchase-dock__price,
    .bp-session-timer__time,
    .bp-summary-total strong,
    .bp-summary-line strong,
    .pricing-price-vivid {
      font-family: var(--bp-number);
      font-variant-numeric: tabular-nums;
    }

    /* ── Keyframes ── */
    @keyframes spin        { to { transform: rotate(360deg); } }
    @keyframes fadeInUp    { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn      { from { opacity:0; } to { opacity:1; } }
    @keyframes scaleIn     { from { opacity:0; transform:scale(0.93); } to { opacity:1; transform:scale(1); } }
    @keyframes slideDown   { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
    @keyframes float       { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
    @keyframes floatSlow   { 0%,100% { transform:translateY(0) rotate(0deg); } 50% { transform:translateY(-14px) rotate(0.6deg); } }
    @keyframes pulse       { 0%,100% { box-shadow:0 0 0 0 rgba(99,102,241,0.28); } 50% { box-shadow:0 0 0 10px rgba(99,102,241,0); } }
    @keyframes shimmer     { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }
    @keyframes orb         { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(28px,-18px) scale(1.04); } 66% { transform:translate(-18px,14px) scale(0.97); } }
    @keyframes gradShift   { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
    @keyframes shine       { from { transform:translateX(-130%) rotate(12deg); } to { transform:translateX(170%) rotate(12deg); } }
    @keyframes countUp     { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
    @keyframes glassShimmer{ 0% { opacity:0.3; } 50% { opacity:0.7; } 100% { opacity:0.3; } }
    @keyframes liquidWave  {
      0%   { border-radius:60% 40% 30% 70%/60% 30% 70% 40%; }
      50%  { border-radius:30% 60% 70% 40%/50% 60% 30% 60%; }
      100% { border-radius:60% 40% 30% 70%/60% 30% 70% 40%; }
    }

    /* ── Utility ── */
    .fade-in-up  { animation: fadeInUp 0.55s ${DS.ease.out} both; }
    .fade-in     { animation: fadeIn 0.45s ${DS.ease.out} both; }
    .scale-in    { animation: scaleIn 0.4s ${DS.ease.spring} both; }
    .floating    { animation: floatSlow 9s ease-in-out infinite; }

    /* ── LIQUID GLASS CARD — core primitive ── */
    .glass-card {
      background: ${DS.grad.glass};
      border: 1px solid rgba(255,255,255,0.80);
      border-top: 1px solid rgba(255,255,255,0.95);
      box-shadow: ${DS.shadow.glass};
      backdrop-filter: blur(24px) saturate(160%);
      -webkit-backdrop-filter: blur(24px) saturate(160%);
      position: relative;
      overflow: hidden;
    }
    /* Inner highlight top edge — the liquid glass "shine" */
    .glass-card::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(165deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 28%);
      pointer-events: none;
      z-index: 0;
    }
    .glass-card > * { position: relative; z-index: 1; }

    /* Stronger float effect for hero card */
    .glass-card-hero {
      background: linear-gradient(145deg, rgba(255,255,255,0.94), rgba(255,255,255,0.78));
      border: 1px solid rgba(255,255,255,0.92);
      border-top: 1.5px solid rgba(255,255,255,1);
      box-shadow: ${DS.shadow.glassLg};
      backdrop-filter: blur(32px) saturate(180%);
      -webkit-backdrop-filter: blur(32px) saturate(180%);
    }

    /* ── Premium Button Shine — liquid glass water-drop ── */
    .premium-btn {
      position: relative;
      overflow: hidden;
      isolation: isolate;
      transform: translateZ(0);
      transform-style: preserve-3d;
      transition: all 0.22s ${DS.ease.smooth};
    }
    .premium-btn::before {
      content: '';
      position: absolute;
      inset: 1px;
      border-radius: inherit;
      background:
        radial-gradient(circle at 24% 18%, rgba(255,255,255,0.70), rgba(255,255,255,0.18) 24%, rgba(255,255,255,0) 48%),
        linear-gradient(180deg, rgba(255,255,255,0.46), rgba(255,255,255,0.12) 42%, rgba(255,255,255,0));
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.75),
        inset 0 -10px 22px rgba(67,56,202,0.10);
      pointer-events: none;
      z-index: 1;
    }
    .premium-btn::after {
      content: '';
      position: absolute;
      top: -50%; bottom: -50%;
      width: 40%; left: -55%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent);
      transform: rotate(12deg);
      opacity: 0;
      transition: opacity 0.2s;
      z-index: 2;
    }
    .premium-btn > * { position: relative; z-index: 3; }
    .premium-btn:hover::after { opacity: 1; animation: shine 0.75s ${DS.ease.out}; }
    .premium-btn:hover {
      transform: translateY(-3px) scale(1.012);
      filter: brightness(1.055);
      box-shadow:
        0 18px 42px rgba(79,70,229,0.24),
        0 7px 18px rgba(15,23,42,0.10),
        inset 0 1px 0 rgba(255,255,255,0.62) !important;
    }
    .premium-btn:active { transform: translateY(1px) scale(0.992); filter: brightness(0.98); }

    .glass-nav-shell,
    .glass-segment {
      position: relative;
      overflow: hidden;
      background:
        radial-gradient(circle at 24% 12%, rgba(255,255,255,0.98), rgba(255,255,255,0.30) 34%, rgba(255,255,255,0) 62%),
        linear-gradient(145deg, rgba(255,255,255,0.80), rgba(219,234,254,0.50) 48%, rgba(237,233,254,0.62)) !important;
      border: 1px solid rgba(255,255,255,0.82) !important;
      border-top-color: rgba(255,255,255,0.96) !important;
      box-shadow:
        0 20px 42px rgba(79,70,229,0.18),
        0 8px 18px rgba(15,23,42,0.10),
        inset 0 1px 0 rgba(255,255,255,0.94),
        inset 0 -14px 30px rgba(99,102,241,0.10) !important;
      backdrop-filter: blur(20px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
      transform: perspective(800px) rotateX(2deg) translateZ(0);
      transform-style: preserve-3d;
    }
    .glass-nav-shell::before {
      content: "";
      position: absolute;
      inset: 1px;
      border-radius: inherit;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.64), rgba(255,255,255,0.08) 56%, rgba(99,102,241,0.08));
      pointer-events: none;
    }
    .glass-nav-shell > * {
      position: relative;
      z-index: 1;
    }
    .glass-segment {
      padding: 5px !important;
      border-radius: ${DS.radius["2xl"]} !important;
    }
    .glass-segment-btn,
    .glass-tab-btn {
      min-height: 42px;
      border: 1px solid rgba(255,255,255,0.46) !important;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.72),
        0 7px 18px rgba(79,70,229,0.09) !important;
      backdrop-filter: blur(14px) saturate(165%);
      -webkit-backdrop-filter: blur(14px) saturate(165%);
    }
    .plan-segment-btn {
      min-width: 0;
      flex-wrap: nowrap;
      white-space: nowrap;
      gap: 10px !important;
    }
    .plan-segment-btn .plan-label {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }
    .plan-segment-btn .plan-badge {
      margin-left: auto;
      flex: 0 0 auto;
    }
    .checkout-glass-card {
      background:
        radial-gradient(circle at 22% 8%, rgba(255,255,255,0.98), rgba(255,255,255,0.34) 35%, rgba(255,255,255,0) 62%),
        linear-gradient(145deg, rgba(255,255,255,0.78), rgba(219,234,254,0.42) 52%, rgba(237,233,254,0.54)) !important;
      border: 1px solid rgba(255,255,255,0.80) !important;
      border-top-color: rgba(255,255,255,0.98) !important;
      box-shadow:
        0 28px 72px rgba(99,102,241,0.15),
        0 10px 24px rgba(15,23,42,0.08),
        inset 0 1px 0 rgba(255,255,255,0.94),
        inset 0 -18px 36px rgba(99,102,241,0.07) !important;
      backdrop-filter: blur(24px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
    }
    .checkout-glass-button {
      position: relative;
      overflow: hidden;
      background:
        radial-gradient(circle at 24% 14%, rgba(255,255,255,0.95), rgba(255,255,255,0.30) 35%, rgba(255,255,255,0) 60%),
        linear-gradient(145deg, rgba(255,255,255,0.82), rgba(219,234,254,0.46), rgba(237,233,254,0.56)) !important;
      border: 1px solid rgba(255,255,255,0.78) !important;
      border-top-color: rgba(255,255,255,0.98) !important;
      box-shadow:
        0 14px 32px rgba(99,102,241,0.13),
        0 5px 14px rgba(15,23,42,0.07),
        inset 0 1px 0 rgba(255,255,255,0.90),
        inset 0 -12px 24px rgba(99,102,241,0.08) !important;
      backdrop-filter: blur(18px) saturate(175%);
      -webkit-backdrop-filter: blur(18px) saturate(175%);
    }
    .checkout-glass-button.active {
      color: #ffffff !important;
      background:
        radial-gradient(circle at 28% 12%, rgba(255,255,255,0.82), rgba(255,255,255,0.18) 34%, rgba(255,255,255,0) 58%),
        linear-gradient(135deg, rgba(37,99,235,0.94), rgba(79,70,229,0.94) 48%, rgba(124,58,237,0.94)) !important;
      border-color: rgba(255,255,255,0.66) !important;
      box-shadow:
        0 18px 40px rgba(79,70,229,0.30),
        0 7px 18px rgba(15,23,42,0.10),
        inset 0 1px 0 rgba(255,255,255,0.64),
        inset 0 -14px 26px rgba(67,56,202,0.20) !important;
    }
    .upi-symbol {
      width: 24px;
      height: 24px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.74),
        0 6px 12px rgba(79,70,229,0.14);
      flex: 0 0 auto;
    }
    .upi-symbol.googlepay {
      color: #ffffff;
      background: conic-gradient(from 30deg, #4285f4, #34a853, #fbbc05, #ea4335, #4285f4);
    }
    .upi-symbol.phonepe { color: #ffffff; background: linear-gradient(135deg, #5f259f, #7c3aed); }
    .upi-symbol.paytm { color: #ffffff; background: linear-gradient(135deg, #00baf2, #002970); }
    .upi-symbol.bhim { color: #ffffff; background: linear-gradient(135deg, #f97316, #16a34a); }
    .glass-trust-card {
      background:
        radial-gradient(circle at 26% 18%, rgba(255,255,255,0.90), rgba(255,255,255,0.30) 32%, rgba(255,255,255,0) 60%),
        linear-gradient(145deg, rgba(255,255,255,0.76), rgba(219,234,254,0.46) 52%, rgba(237,233,254,0.58)) !important;
      border: 1px solid rgba(255,255,255,0.78) !important;
      border-top-color: rgba(255,255,255,0.98) !important;
      box-shadow:
        0 16px 34px rgba(99,102,241,0.16),
        0 5px 14px rgba(15,23,42,0.08),
        inset 0 1px 0 rgba(255,255,255,0.92),
        inset 0 -14px 24px rgba(59,130,246,0.08) !important;
      transform: translateZ(0);
      transition: all 0.24s ${DS.ease.smooth};
    }
    .glass-trust-card:hover {
      transform: translateY(-4px);
      box-shadow:
        0 22px 44px rgba(99,102,241,0.20),
        0 7px 18px rgba(15,23,42,0.10),
        inset 0 1px 0 rgba(255,255,255,0.96) !important;
    }
    .product-preview-shell {
      position: relative;
      transform-style: preserve-3d;
      transform: perspective(1100px) rotateX(2.2deg) rotateY(-3deg) translateZ(0);
      transition: transform 0.35s ${DS.ease.smooth}, box-shadow 0.35s ${DS.ease.smooth};
    }
    .product-preview-shell::before {
      content: "";
      position: absolute;
      inset: -18px;
      border-radius: inherit;
      background:
        radial-gradient(circle at 32% 8%, rgba(255,255,255,0.72), rgba(255,255,255,0) 34%),
        radial-gradient(circle at 70% 88%, rgba(139,92,246,0.24), rgba(139,92,246,0) 52%);
      filter: blur(1px);
      opacity: 0.62;
      pointer-events: none;
      z-index: 0;
    }
    .product-preview-shell:hover {
      transform: perspective(1100px) rotateX(3.2deg) rotateY(-4.4deg) translateY(-7px) !important;
      box-shadow:
        0 42px 110px rgba(79,70,229,0.26),
        0 18px 42px rgba(15,23,42,0.14),
        inset 0 1px 0 rgba(255,255,255,0.90) !important;
    }
    .product-preview-image-wrap {
      position: relative;
      z-index: 1;
      transform: translateZ(34px);
      transform-style: preserve-3d;
      isolation: isolate;
      background: #ffffff !important;
      contain: paint;
    }
    .product-preview-hd {
      box-shadow:
        0 28px 70px rgba(67,56,202,0.15),
        0 10px 24px rgba(15,23,42,0.08),
        inset 0 0 0 1px rgba(255,255,255,0.92),
        inset 0 -18px 34px rgba(79,70,229,0.035) !important;
    }
    .product-preview-hd::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      box-shadow:
        inset 0 0 0 1px rgba(255,255,255,0.84),
        inset 0 1px 0 rgba(255,255,255,0.92);
      z-index: 2;
    }
    .product-preview-image-wrap img {
      transform: translateZ(0) scale(1);
      transform-origin: center;
      filter:
        contrast(1.36)
        saturate(1.24)
        brightness(0.955)
        drop-shadow(0 10px 16px rgba(67,56,202,0.10));
      image-rendering: auto;
      backface-visibility: hidden;
      -webkit-font-smoothing: antialiased;
    }
    .dashboard-image-hd {
      image-rendering: -webkit-optimize-contrast;
      outline: 1px solid transparent;
      will-change: filter;
    }
    .brand-wordmark-3d {
      display: inline-flex;
      align-items: baseline;
      color: ${DS.color.navy} !important;
      letter-spacing: 0 !important;
      text-shadow:
        0 1px 0 rgba(255,255,255,0.96),
        0 3px 0 rgba(99,102,241,0.10),
        0 10px 22px rgba(15,23,42,0.18),
        0 18px 36px rgba(79,70,229,0.16);
      transform: perspective(600px) rotateX(1.4deg);
      filter: drop-shadow(0 10px 16px rgba(99,102,241,0.12));
    }
    .brand-wordmark-3d span {
      filter: drop-shadow(0 8px 12px rgba(99,102,241,0.20));
    }
    .brand-pro-outline {
      display: inline-block;
      -webkit-text-stroke: 0.95px rgba(49,46,129,0.96);
      paint-order: stroke fill;
      text-shadow:
        0 1px 0 rgba(255,255,255,1),
        0 0 1px rgba(37,99,235,0.34),
        0 3px 0 rgba(99,102,241,0.18),
        0 9px 16px rgba(79,70,229,0.28);
      filter:
        drop-shadow(0 3px 5px rgba(37,99,235,0.32))
        drop-shadow(0 7px 12px rgba(67,56,202,0.22));
    }
    .product-media-glass-panel {
      padding: 18px;
      border-radius: ${DS.radius["3xl"]};
      background:
        linear-gradient(145deg, rgba(255,255,255,0.50), rgba(219,234,254,0.24) 48%, rgba(237,233,254,0.36));
      border: 1px solid rgba(255,255,255,0.64);
      box-shadow:
        0 28px 72px rgba(99,102,241,0.12),
        inset 0 1px 0 rgba(255,255,255,0.82);
      backdrop-filter: blur(20px) saturate(170%);
      -webkit-backdrop-filter: blur(20px) saturate(170%);
      transform-style: preserve-3d;
    }
    .dashboard-demo-3d {
      position: relative;
      transform-style: preserve-3d;
      animation: none !important;
      transform: none !important;
      will-change: auto;
    }
    .dashboard-demo-3d::before {
      content: "";
      position: absolute;
      inset: -20px;
      border-radius: inherit;
      background:
        linear-gradient(145deg, rgba(255,255,255,0.52), rgba(219,234,254,0.18), rgba(237,233,254,0.34));
      box-shadow:
        0 42px 120px rgba(79,70,229,0.24),
        0 16px 44px rgba(15,23,42,0.12);
      transform: translateZ(-28px);
      pointer-events: none;
      z-index: -1;
      display: none;
    }
    .dashboard-demo-frame {
      transform: none;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.96),
        0 26px 72px rgba(67,56,202,0.18) !important;
    }
    .dashboard-demo-frame img {
      transform: none !important;
      filter: contrast(1.07) saturate(1.05) brightness(1.02);
      image-rendering: auto;
      backface-visibility: hidden;
    }
    .reviews-heading-premium {
      font-family: var(--bp-display) !important;
      font-weight: 700 !important;
      letter-spacing: -0.025em !important;
      line-height: 1.04 !important;
      text-shadow:
        0 1px 0 rgba(255,255,255,0.92),
        0 12px 30px rgba(67,56,202,0.10);
    }
    @keyframes dashboardFloat3d {
      0%, 100% { transform: perspective(1200px) rotateX(2deg) rotateY(-3deg) translateY(0); }
      50% { transform: perspective(1200px) rotateX(3.4deg) rotateY(-4.2deg) translateY(-12px); }
    }
    .text-3d-heading {
      font-family: var(--bp-display) !important;
      color: #0f172a !important;
      letter-spacing: -0.035em !important;
      text-shadow:
        0 1px 0 rgba(255,255,255,0.95),
        0 12px 30px rgba(67,56,202,0.10);
      transform: perspective(900px) rotateX(1.2deg);
      transform-origin: left center;
      filter: drop-shadow(0 14px 22px rgba(99,102,241,0.10));
    }
    .product-title-premium {
      font-family: var(--bp-display) !important;
      font-weight: 700 !important;
      line-height: 1.02 !important;
      letter-spacing: -0.035em !important;
      color: #0b1222 !important;
      text-shadow:
        0 1px 0 rgba(255,255,255,0.98),
        0 12px 30px rgba(67,56,202,0.10) !important;
      transform: none !important;
      filter: none !important;
    }
    .product-title-premium .product-title-line {
      display: block;
    }
    .product-title-premium .product-title-accent {
      display: block;
      background: linear-gradient(90deg, #111827 0%, #1d4ed8 54%, #6d28d9 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      text-shadow: none;
      filter: drop-shadow(0 12px 22px rgba(79,70,229,0.16));
    }
    .pricing-cta-glass {
      background:
        radial-gradient(circle at 24% 12%, rgba(255,255,255,0.90), rgba(255,255,255,0.18) 36%, rgba(255,255,255,0) 60%),
        linear-gradient(145deg, rgba(255,255,255,0.88), rgba(237,233,254,0.78) 48%, rgba(196,181,253,0.42)) !important;
      color: #4c1d95 !important;
      border: 1.5px solid rgba(124,58,237,0.32) !important;
      box-shadow:
        0 20px 48px rgba(124,58,237,0.20),
        0 8px 20px rgba(15,23,42,0.09),
        inset 0 1px 0 rgba(255,255,255,0.96),
        inset 0 -16px 28px rgba(124,58,237,0.13) !important;
      backdrop-filter: blur(20px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    }
    .pricing-cta-glass:hover {
      color: #3b0764 !important;
      box-shadow:
        0 26px 58px rgba(124,58,237,0.24),
        0 10px 24px rgba(15,23,42,0.11),
        inset 0 1px 0 rgba(255,255,255,0.98),
        inset 0 -16px 28px rgba(124,58,237,0.15) !important;
    }

    /* Commerce redesign primitives */
    .bp-commerce-page {
      min-height: 100vh;
      position: relative;
      overflow: hidden;
      color: var(--bp-text);
      font-family: var(--bp-body);
      background:
        radial-gradient(circle at 18% 18%, rgba(59,130,246,0.10), transparent 34%),
        radial-gradient(circle at 82% 16%, rgba(99,102,241,0.16), transparent 34%),
        radial-gradient(circle at 62% 70%, rgba(139,92,246,0.10), transparent 42%),
        linear-gradient(180deg, #FFFFFF 0%, #F7F9FF 45%, #F2F3FF 100%);
    }
    .bp-commerce-page::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: 0.035;
      background-image:
        linear-gradient(rgba(15,23,42,0.65) 1px, transparent 1px),
        linear-gradient(90deg, rgba(15,23,42,0.65) 1px, transparent 1px);
      background-size: 48px 48px;
      mask-image: linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%);
    }
    .bp-commerce-page::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: 0.026;
      background-image: radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0);
      background-size: 16px 16px;
      mix-blend-mode: multiply;
    }
    .bp-commerce-shell {
      position: relative;
      z-index: 1;
      max-width: 1320px;
      margin: 0 auto;
      padding: 42px 24px 110px;
    }
    .bp-glass {
      position: relative;
      overflow: hidden;
      background: linear-gradient(145deg, rgba(255,255,255,0.64), rgba(255,255,255,0.32));
      border: 1px solid rgba(255,255,255,0.76);
      box-shadow:
        0 18px 60px rgba(67,56,202,0.10),
        0 4px 16px rgba(15,23,42,0.06),
        inset 0 1px 0 rgba(255,255,255,0.92),
        inset 0 -1px 0 rgba(99,102,241,0.08);
      backdrop-filter: blur(28px) saturate(175%);
      -webkit-backdrop-filter: blur(28px) saturate(175%);
    }
    .bp-glass::before,
    .bp-glass::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-radius: inherit;
    }
    .bp-glass::before {
      background: linear-gradient(135deg, rgba(255,255,255,0.72), rgba(255,255,255,0) 33%);
    }
    .bp-glass::after {
      background: radial-gradient(circle at 92% 92%, rgba(99,102,241,0.10), transparent 40%);
    }
    .bp-glass > * {
      position: relative;
      z-index: 1;
    }
    .bp-glass-badge {
      display: inline-flex;
      align-items: center;
      width: fit-content;
      min-height: 32px;
      padding: 7px 13px;
      border-radius: 999px;
      color: #4338ca;
      font-family: var(--bp-body);
      font-size: 12px;
      font-weight: 850;
      letter-spacing: 0;
      background: rgba(255,255,255,0.58);
      border: 1px solid rgba(255,255,255,0.82);
      box-shadow: 0 8px 22px rgba(67,56,202,0.08), inset 0 1px 0 rgba(255,255,255,0.92);
      backdrop-filter: blur(18px) saturate(160%);
      -webkit-backdrop-filter: blur(18px) saturate(160%);
    }
    .bp-glass-button {
      min-height: 48px;
      border: 1px solid rgba(255,255,255,0.72);
      border-radius: 999px;
      padding: 13px 22px;
      cursor: pointer;
      font-family: var(--bp-body);
      font-size: 15px;
      font-weight: 850;
      letter-spacing: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
      position: relative;
      overflow: hidden;
      isolation: isolate;
    }
    .bp-glass-button::before {
      content: "";
      position: absolute;
      inset: 1px;
      border-radius: inherit;
      pointer-events: none;
      background: linear-gradient(180deg, rgba(255,255,255,0.56), rgba(255,255,255,0.08) 56%, rgba(59,130,246,0.08));
      z-index: -1;
    }
    .bp-glass-button::after {
      content: "";
      position: absolute;
      top: -60%;
      bottom: -60%;
      left: -52%;
      width: 38%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.48), transparent);
      transform: rotate(14deg);
      opacity: 0;
      pointer-events: none;
    }
    .bp-glass-button:hover {
      transform: translateY(-2px) scale(1.006);
      filter: brightness(1.03);
    }
    .bp-glass-button:hover::after {
      opacity: 1;
      animation: shine 0.7s ${DS.ease.out} both;
    }
    .bp-glass-button:focus-visible,
    .bp-plan-pill:focus-visible,
    .bp-plan-chip:focus-visible,
    .bp-product-preview-option:focus-visible,
    .bp-purchase-dock__close:focus-visible {
      outline: 2px solid var(--bp-blue);
      outline-offset: 3px;
    }
    .bp-glass-button:disabled {
      cursor: not-allowed;
      opacity: 0.55;
      transform: none;
      filter: grayscale(0.2);
    }
    .bp-glass-button--primary {
      color: #ffffff;
      background: linear-gradient(135deg, rgba(59,130,246,0.96), rgba(99,102,241,0.96) 48%, rgba(139,92,246,0.95));
      box-shadow:
        0 18px 42px rgba(79,70,229,0.24),
        0 6px 16px rgba(15,23,42,0.08),
        inset 0 1px 0 rgba(255,255,255,0.52),
        inset 0 -14px 24px rgba(29,78,216,0.18);
    }
    .bp-glass-button--secondary {
      color: var(--bp-text);
      background: rgba(255,255,255,0.55);
      border-color: rgba(99,102,241,0.22);
      box-shadow: 0 12px 30px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.88);
    }
    .bp-product-hero {
      min-height: calc(100vh - 66px);
      display: flex;
      align-items: center;
      padding: 26px 0 72px;
    }
    .bp-product-hero__inner {
      width: 100%;
      display: grid;
      grid-template-columns: minmax(0, 1.36fr) minmax(390px, 0.94fr);
      gap: clamp(28px, 4vw, 52px);
      align-items: start;
    }
    .bp-product-theatre {
      position: relative;
      min-width: 0;
    }
    .bp-product-orb {
      position: absolute;
      pointer-events: none;
      border-radius: 999px;
      background: radial-gradient(circle at 32% 24%, rgba(255,255,255,0.92), rgba(255,255,255,0.24) 36%, rgba(99,102,241,0.16));
      border: 1px solid rgba(255,255,255,0.66);
      box-shadow: inset 0 1px 12px rgba(255,255,255,0.78), 0 24px 52px rgba(67,56,202,0.10);
      opacity: 0.65;
    }
    .bp-product-orb--one { width: 112px; height: 112px; left: -36px; top: 9%; }
    .bp-product-orb--two { width: 68px; height: 68px; right: 9%; bottom: -24px; }
    .bp-product-stage {
      border-radius: 36px;
      padding: clamp(18px, 2.2vw, 28px);
      transition: transform 0.18s ease-out;
      will-change: transform;
    }
    .bp-product-stage__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 14px;
      margin-bottom: 16px;
      color: var(--bp-text-secondary);
      font-size: 13px;
      font-weight: 800;
    }
    .bp-live-dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: var(--bp-success);
      box-shadow: 0 0 0 5px rgba(5,150,105,0.10);
      display: inline-block;
      margin-right: 8px;
    }
    .bp-product-preview-button {
      width: 100%;
      border: 0;
      padding: 12px;
      cursor: zoom-in;
      display: block;
      background: rgba(255,255,255,0.84);
      border-radius: 28px;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.92), 0 18px 42px rgba(15,23,42,0.08);
      appearance: none;
      position: relative;
    }
    .bp-product-preview-button img {
      width: 100%;
      aspect-ratio: 1536 / 1024;
      object-fit: contain;
      object-position: center top;
      display: block;
      border-radius: 20px;
      background: #ffffff;
      filter: contrast(1.06) saturate(1.05) brightness(1.01);
    }
    .bp-product-preview-zoom {
      position: absolute;
      right: 24px;
      bottom: 24px;
      width: 42px;
      height: 42px;
      border-radius: 999px;
      display: grid;
      place-items: center;
      color: #4338ca;
      background: rgba(255,255,255,0.78);
      border: 1px solid rgba(255,255,255,0.88);
      box-shadow: 0 12px 28px rgba(79,70,229,0.14), inset 0 1px 0 rgba(255,255,255,0.94);
    }
    .bp-product-preview-selector {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 10px;
      margin-top: 14px;
    }
    .bp-product-preview-option,
    .bp-plan-pill,
    .bp-plan-chip {
      min-height: 44px;
      border: 1px solid rgba(255,255,255,0.72);
      border-radius: 18px;
      background: rgba(255,255,255,0.48);
      color: var(--bp-text-secondary);
      cursor: pointer;
      font-family: var(--bp-body);
      font-size: 12px;
      font-weight: 850;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.84), 0 8px 18px rgba(67,56,202,0.06);
      transition: transform 0.18s ease, background 0.18s ease, color 0.18s ease;
    }
    .bp-product-preview-option[aria-pressed="true"],
    .bp-plan-pill[aria-pressed="true"],
    .bp-plan-chip.is-active {
      color: #ffffff;
      background: var(--bp-gradient);
      border-color: rgba(255,255,255,0.62);
      box-shadow: 0 14px 28px rgba(79,70,229,0.20), inset 0 1px 0 rgba(255,255,255,0.46);
    }
    .bp-product-trust-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 16px;
    }
    .bp-product-trust-card {
      border-radius: 22px;
      padding: 16px;
      min-height: 112px;
    }
    .bp-product-trust-card strong,
    .bp-value-card h3,
    .bp-step-card h3 {
      display: block;
      color: var(--bp-text);
      font-size: 14px;
      line-height: 1.25;
      margin-bottom: 6px;
      font-weight: 850;
    }
    .bp-product-trust-card span,
    .bp-value-card p,
    .bp-step-card p {
      color: var(--bp-text-secondary);
      font-size: 13px;
      line-height: 1.55;
      font-weight: 650;
    }
    .bp-purchase-panel {
      border-radius: 34px;
      padding: clamp(24px, 3vw, 34px);
    }
    .bp-product-title {
      margin: 14px 0 16px;
      color: var(--bp-text);
      font-family: var(--bp-display);
      font-size: clamp(42px, 5vw, 72px);
      font-weight: 700;
      letter-spacing: -0.035em;
      line-height: 0.99;
    }
    .bp-product-description {
      color: var(--bp-text-secondary);
      font-size: 17px;
      line-height: 1.75;
      font-weight: 600;
      margin-bottom: 18px;
    }
    .bp-trust-note {
      border-radius: 20px;
      padding: 14px 16px;
      background: rgba(255,255,255,0.46);
      border: 1px solid rgba(255,255,255,0.70);
      color: var(--bp-text-secondary);
      font-size: 13px;
      font-weight: 750;
      line-height: 1.5;
      margin-bottom: 18px;
    }
    .bp-plan-selector {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 18px;
    }
    .bp-price-block {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 16px;
      margin: 12px 0 18px;
      padding: 18px;
      border-radius: 24px;
      background: rgba(255,255,255,0.48);
      border: 1px solid rgba(255,255,255,0.72);
    }
    .bp-price-block__price {
      font-family: var(--bp-number);
      font-size: clamp(48px, 5vw, 64px);
      font-weight: 900;
      line-height: 0.92;
      color: var(--bp-text);
      font-variant-numeric: tabular-nums;
    }
    .bp-price-block__meta {
      text-align: right;
      color: var(--bp-text-secondary);
      font-size: 13px;
      font-weight: 750;
    }
    .bp-included-list {
      display: grid;
      gap: 10px;
      margin: 18px 0 22px;
      list-style: none;
    }
    .bp-included-list li {
      display: flex;
      gap: 10px;
      color: var(--bp-text-secondary);
      font-size: 14px;
      line-height: 1.45;
      font-weight: 700;
    }
    .bp-included-list li::before {
      content: "✓";
      color: var(--bp-success);
      font-weight: 900;
    }
    .bp-commerce-section {
      position: relative;
      z-index: 1;
      max-width: 1180px;
      margin: 0 auto;
      padding: 88px 24px;
    }
    .bp-section-heading {
      max-width: 760px;
      margin: 0 auto 42px;
      text-align: center;
      display: grid;
      justify-items: center;
      gap: 14px;
    }
    .bp-section-heading h2,
    .bp-story-copy h2,
    .bp-checkout-title h1 {
      font-family: var(--bp-display);
      color: var(--bp-text);
      font-size: clamp(30px, 3.8vw, 52px);
      line-height: 1.04;
      letter-spacing: -0.025em;
      font-weight: 700;
    }
    .bp-section-heading p,
    .bp-checkout-title p {
      color: var(--bp-text-secondary);
      font-size: 16px;
      line-height: 1.7;
      font-weight: 600;
    }
    .bp-story-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(340px, 0.82fr);
      gap: 48px;
      align-items: start;
    }
    .bp-story-preview {
      position: sticky;
      top: 92px;
      border-radius: 34px;
      padding: 18px;
      background: rgba(255,255,255,0.42);
      border: 1px solid rgba(255,255,255,0.72);
      box-shadow: 0 18px 52px rgba(67,56,202,0.08);
    }
    .bp-story-preview__frame {
      position: relative;
      border-radius: 24px;
      overflow: hidden;
      background: #fff;
    }
    .bp-story-preview img {
      width: 100%;
      display: block;
      aspect-ratio: 1536 / 1024;
      object-fit: contain;
      filter: contrast(1.05) saturate(1.04);
    }
    .bp-story-preview p {
      margin: 14px 4px 0;
      color: var(--bp-text-secondary);
      font-size: 13px;
      font-weight: 850;
    }
    .bp-story-annotation {
      position: absolute;
      border: 2px solid rgba(99,102,241,0.55);
      border-radius: 12px;
      background: rgba(99,102,241,0.08);
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.28s ease, transform 0.28s ease;
      box-shadow: 0 12px 28px rgba(67,56,202,0.12);
    }
    .bp-story-annotation.is-active {
      opacity: 1;
      transform: translateY(0);
    }
    .bp-story-annotation--1 { left: 7%; top: 8%; width: 46%; height: 16%; }
    .bp-story-annotation--2 { left: 57%; top: 30%; width: 34%; height: 34%; }
    .bp-story-annotation--3 { left: 9%; top: 64%; width: 82%; height: 24%; }
    .bp-story-copy {
      display: grid;
      gap: 18px;
    }
    .bp-story-card {
      padding: 24px;
      border-radius: 28px;
      background: rgba(255,255,255,0.42);
      border: 1px solid rgba(255,255,255,0.68);
      opacity: 0.74;
      transform: translateY(8px);
      transition: opacity 0.26s ease, transform 0.26s ease, box-shadow 0.26s ease;
    }
    .bp-story-card.is-active {
      opacity: 1;
      transform: translateY(0);
      box-shadow: 0 18px 48px rgba(67,56,202,0.10);
    }
    .bp-story-card span {
      color: var(--bp-indigo);
      font-family: var(--bp-number);
      font-size: 12px;
      font-weight: 900;
    }
    .bp-story-card h3,
    .bp-compare-card h3,
    .bp-faq-item summary {
      color: var(--bp-text);
      font-size: 20px;
      line-height: 1.18;
      margin: 8px 0 8px;
      font-weight: 850;
    }
    .bp-story-card p,
    .bp-compare-card p,
    .bp-faq-item p,
    .bp-review-card p {
      color: var(--bp-text-secondary);
      font-size: 15px;
      line-height: 1.72;
      font-weight: 600;
    }
    .bp-comparison-grid,
    .bp-value-grid,
    .bp-review-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 22px;
    }
    .bp-value-grid,
    .bp-review-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .bp-compare-card {
      border-radius: 32px;
      padding: 28px;
    }
    .bp-compare-card.is-recommended {
      border-color: rgba(99,102,241,0.28);
      box-shadow: 0 22px 64px rgba(79,70,229,0.14), inset 0 1px 0 rgba(255,255,255,0.92);
    }
    .bp-compare-card__ribbon {
      display: inline-flex;
      margin-bottom: 14px;
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(99,102,241,0.10);
      color: #4338ca;
      font-size: 11px;
      font-weight: 900;
    }
    .bp-compare-card__price {
      margin: 18px 0;
      font-family: var(--bp-number);
      color: var(--bp-text);
      font-size: 52px;
      font-weight: 900;
      line-height: 1;
    }
    .bp-compare-card ul {
      display: grid;
      gap: 10px;
      margin: 0 0 24px;
      list-style: none;
    }
    .bp-compare-card li {
      color: var(--bp-text-secondary);
      font-size: 14px;
      font-weight: 700;
    }
    .bp-compare-card li::before {
      content: "✓ ";
      color: var(--bp-success);
      font-weight: 900;
    }
    .bp-steps {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
      position: relative;
    }
    .bp-steps::before {
      content: "";
      position: absolute;
      left: 15%;
      right: 15%;
      top: 34px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(99,102,241,0.28), transparent);
    }
    .bp-step-card,
    .bp-value-card,
    .bp-review-card {
      border-radius: 28px;
      padding: 24px;
      background: rgba(255,255,255,0.48);
      border: 1px solid rgba(255,255,255,0.70);
      position: relative;
    }
    .bp-step-card > span {
      width: 44px;
      height: 44px;
      border-radius: 999px;
      display: inline-grid;
      place-items: center;
      color: #fff;
      background: var(--bp-gradient);
      font-family: var(--bp-number);
      font-weight: 900;
      margin-bottom: 18px;
      box-shadow: 0 12px 24px rgba(79,70,229,0.22);
    }
    .bp-review-card__top {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    .bp-review-card__top strong {
      display: block;
      color: var(--bp-text);
      font-weight: 850;
    }
    .bp-review-card__top span,
    .bp-review-card__meta {
      color: var(--bp-text-muted);
      font-size: 12px;
      font-weight: 700;
    }
    .bp-review-avatar {
      width: 42px;
      height: 42px;
      border-radius: 999px;
      display: grid;
      place-items: center;
      color: #fff;
      background: var(--bp-gradient);
      font-weight: 900;
    }
    .bp-review-card__meta {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin-top: 18px;
    }
    .bp-faq-list {
      display: grid;
      gap: 12px;
      max-width: 860px;
      margin: 0 auto;
    }
    .bp-faq-item {
      border-radius: 22px;
      padding: 4px 20px;
    }
    .bp-faq-item summary {
      min-height: 58px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      cursor: pointer;
      list-style: none;
    }
    .bp-faq-item summary::-webkit-details-marker {
      display: none;
    }
    .bp-faq-item p {
      padding: 0 0 20px;
    }
    .bp-faq-cta {
      display: flex;
      justify-content: center;
      margin-top: 28px;
    }
    .bp-purchase-dock {
      position: fixed;
      left: 50%;
      bottom: 20px;
      z-index: 980;
      width: min(920px, calc(100vw - 40px));
      transform: translateX(-50%);
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto auto 32px;
      align-items: center;
      gap: 18px;
      padding: 12px;
      border-radius: 28px;
      background: rgba(255,255,255,0.64);
      border: 1px solid rgba(255,255,255,0.78);
      box-shadow: 0 24px 70px rgba(15,23,42,0.16), inset 0 1px 0 rgba(255,255,255,0.92);
      backdrop-filter: blur(26px) saturate(170%);
      -webkit-backdrop-filter: blur(26px) saturate(170%);
    }
    .bp-purchase-dock__product,
    .bp-purchase-dock__action {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }
    .bp-purchase-dock__thumb {
      width: 58px;
      height: 42px;
      object-fit: cover;
      border-radius: 12px;
      background: #fff;
      border: 1px solid rgba(255,255,255,0.88);
    }
    .bp-purchase-dock__name {
      color: var(--bp-text);
      font-size: 14px;
      font-weight: 900;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .bp-purchase-dock__meta {
      color: var(--bp-text-muted);
      font-size: 12px;
      font-weight: 700;
    }
    .bp-purchase-dock__plans {
      display: flex;
      gap: 6px;
      border-radius: 999px;
      padding: 4px;
      background: rgba(255,255,255,0.48);
      border: 1px solid rgba(255,255,255,0.72);
    }
    .bp-plan-chip {
      border-radius: 999px;
      min-height: 38px;
      padding: 0 14px;
    }
    .bp-purchase-dock__price {
      font-family: var(--bp-number);
      color: var(--bp-text);
      font-size: 28px;
      font-weight: 900;
    }
    .bp-purchase-dock__button {
      min-height: 44px;
      padding: 11px 18px;
    }
    .bp-purchase-dock__close {
      width: 32px;
      height: 32px;
      border: 0;
      border-radius: 999px;
      color: var(--bp-text-muted);
      background: rgba(255,255,255,0.50);
      cursor: pointer;
      font-size: 22px;
      line-height: 1;
    }
    .bp-preview-modal {
      position: fixed;
      inset: 0;
      z-index: 1200;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: rgba(15,23,42,0.56);
      backdrop-filter: blur(18px) saturate(145%);
      -webkit-backdrop-filter: blur(18px) saturate(145%);
    }
    .bp-preview-modal__panel {
      width: min(94vw, 1180px);
      max-height: 88vh;
      border-radius: 32px;
      padding: 14px;
    }
    .bp-preview-modal__close {
      position: absolute;
      top: 18px;
      right: 18px;
      z-index: 3;
    }
    .bp-preview-modal img {
      display: block;
      width: 100%;
      max-height: calc(88vh - 28px);
      object-fit: contain;
      border-radius: 22px;
      background: #ffffff;
    }
    .bp-checkout-page {
      padding-bottom: 80px;
    }
    .bp-checkout-header {
      position: relative;
      z-index: 1;
      padding: 20px 24px;
      border-bottom: 1px solid rgba(255,255,255,0.52);
      background: linear-gradient(135deg, rgba(59,130,246,0.92), rgba(99,102,241,0.90), rgba(139,92,246,0.88));
      color: #fff;
    }
    .bp-checkout-header__inner {
      max-width: 1180px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }
    .bp-checkout-shell {
      position: relative;
      z-index: 1;
      max-width: 1160px;
      margin: 0 auto;
      padding: 38px 24px;
    }
    .bp-checkout-title {
      display: grid;
      justify-items: center;
      gap: 12px;
      text-align: center;
      margin-bottom: 26px;
    }
    .bp-session-timer {
      max-width: 720px;
      margin: 0 auto 26px;
      display: grid;
      grid-template-columns: 44px minmax(0, 1fr) auto;
      align-items: center;
      gap: 14px;
      padding: 12px 16px;
      border-radius: 24px;
      background: rgba(255,255,255,0.58);
      border: 1px solid rgba(255,255,255,0.78);
      box-shadow: 0 14px 40px rgba(67,56,202,0.10), inset 0 1px 0 rgba(255,255,255,0.92);
      backdrop-filter: blur(22px) saturate(170%);
      -webkit-backdrop-filter: blur(22px) saturate(170%);
    }
    .bp-session-timer.is-low {
      border-color: rgba(217,119,6,0.32);
    }
    .bp-session-timer.is-expired {
      border-color: rgba(220,38,38,0.28);
      background: rgba(255,255,255,0.72);
    }
    .bp-session-timer__icon {
      width: 44px;
      height: 44px;
      border-radius: 999px;
      display: grid;
      place-items: center;
      color: #4338ca;
      background: rgba(99,102,241,0.10);
      font-size: 24px;
    }
    .bp-session-timer__copy {
      display: grid;
      gap: 3px;
      color: var(--bp-text-secondary);
      font-size: 13px;
      line-height: 1.35;
      font-weight: 650;
    }
    .bp-session-timer__copy strong {
      color: var(--bp-text);
      font-size: 14px;
      font-weight: 900;
    }
    .bp-session-timer__time {
      font-family: var(--bp-number);
      color: #4338ca;
      font-size: 30px;
      font-weight: 900;
      font-variant-numeric: tabular-nums;
    }
    .bp-session-timer.is-low .bp-session-timer__time {
      color: var(--bp-warning);
    }
    .bp-session-timer__restart {
      min-height: 42px;
      border: 1px solid rgba(217,119,6,0.24);
      border-radius: 999px;
      padding: 0 14px;
      color: #92400e;
      background: rgba(254,243,199,0.62);
      cursor: pointer;
      font-size: 12px;
      font-weight: 850;
    }
    .bp-checkout-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(360px, 0.9fr);
      gap: 34px;
      align-items: start;
    }
    .bp-checkout-card,
    .bp-checkout-summary {
      border-radius: 32px;
      padding: 28px;
    }
    .bp-checkout-card h2,
    .bp-checkout-summary h2,
    .bp-razorpay-panel h2 {
      color: var(--bp-text);
      font-family: var(--bp-display);
      font-size: 24px;
      line-height: 1.1;
      letter-spacing: -0.02em;
      margin-bottom: 18px;
    }
    .bp-field-stack {
      display: grid;
      gap: 18px;
    }
    .bp-field label {
      display: block;
      color: var(--bp-text-secondary);
      font-size: 14px;
      font-weight: 850;
      margin-bottom: 8px;
    }
    .bp-field input {
      width: 100%;
      min-height: 52px;
      border-radius: 18px;
      border: 1.5px solid rgba(99,102,241,0.14);
      color: var(--bp-text);
      background: rgba(255,255,255,0.66);
      padding: 0 16px;
      font-family: var(--bp-body);
      font-size: 16px;
      font-weight: 650;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.82);
    }
    .bp-field input[aria-invalid="true"] {
      border-color: rgba(220,38,38,0.48);
    }
    .bp-field__hint,
    .bp-field__error {
      margin-top: 7px;
      font-size: 12px;
      line-height: 1.45;
      font-weight: 700;
    }
    .bp-field__hint {
      color: var(--bp-text-muted);
    }
    .bp-field__error {
      color: #dc2626;
    }
    .bp-plan-toggle {
      max-width: 480px;
      margin: 0 auto 28px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      padding: 6px;
      border-radius: 24px;
      background: rgba(255,255,255,0.52);
      border: 1px solid rgba(255,255,255,0.76);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.92), 0 12px 32px rgba(67,56,202,0.08);
    }
    .bp-razorpay-panel {
      margin-top: 20px;
      border-radius: 32px;
      padding: 26px;
    }
    .bp-razorpay-panel p {
      color: var(--bp-text-secondary);
      font-size: 15px;
      line-height: 1.7;
      font-weight: 650;
      margin-bottom: 14px;
    }
    .bp-security-note {
      display: flex;
      gap: 12px;
      padding: 14px;
      border-radius: 20px;
      color: var(--bp-text-secondary);
      background: rgba(5,150,105,0.08);
      border: 1px solid rgba(5,150,105,0.14);
      font-size: 13px;
      line-height: 1.55;
      font-weight: 750;
    }
    .bp-trust-timeline {
      margin-top: 18px;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
    }
    .bp-trust-timeline div {
      border-radius: 18px;
      padding: 13px;
      background: rgba(255,255,255,0.48);
      border: 1px solid rgba(255,255,255,0.72);
      color: var(--bp-text-secondary);
      font-size: 12px;
      line-height: 1.4;
      font-weight: 800;
    }
    .bp-trust-timeline span {
      display: block;
      width: 26px;
      height: 26px;
      margin-bottom: 8px;
      border-radius: 999px;
      color: #fff;
      background: var(--bp-gradient);
      display: grid;
      place-items: center;
      font-family: var(--bp-number);
      font-size: 12px;
      font-weight: 900;
    }
    .bp-checkout-summary {
      position: sticky;
      top: 20px;
    }
    .bp-summary-product {
      display: grid;
      grid-template-columns: 104px minmax(0, 1fr);
      gap: 14px;
      align-items: center;
      padding: 12px;
      border-radius: 22px;
      background: rgba(255,255,255,0.52);
      border: 1px solid rgba(255,255,255,0.76);
      margin-bottom: 20px;
    }
    .bp-summary-product img {
      width: 104px;
      height: 72px;
      border-radius: 16px;
      object-fit: cover;
      background: #fff;
    }
    .bp-summary-product strong {
      display: block;
      color: var(--bp-text);
      font-size: 15px;
      line-height: 1.25;
      font-weight: 900;
    }
    .bp-summary-product span {
      display: block;
      margin-top: 5px;
      color: var(--bp-text-muted);
      font-size: 12px;
      font-weight: 750;
    }
    .bp-summary-features {
      display: grid;
      gap: 9px;
      margin: 0 0 20px;
      list-style: none;
    }
    .bp-summary-features li {
      color: var(--bp-text-secondary);
      font-size: 13px;
      font-weight: 750;
    }
    .bp-summary-features li::before {
      content: "✓ ";
      color: var(--bp-success);
      font-weight: 900;
    }
    .bp-summary-lines {
      display: grid;
      gap: 11px;
      border-top: 1px solid rgba(99,102,241,0.12);
      border-bottom: 1px solid rgba(99,102,241,0.12);
      padding: 17px 0;
      margin-bottom: 18px;
    }
    .bp-summary-line,
    .bp-summary-total {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      color: var(--bp-text-secondary);
      font-size: 14px;
      font-weight: 750;
    }
    .bp-summary-line strong,
    .bp-summary-total strong {
      color: var(--bp-text);
      font-family: var(--bp-number);
      font-variant-numeric: tabular-nums;
    }
    .bp-summary-line .is-discount {
      color: var(--bp-success);
    }
    .bp-summary-total {
      align-items: baseline;
      color: var(--bp-text);
      font-size: 18px;
      font-weight: 900;
      margin-bottom: 18px;
    }
    .bp-summary-total strong {
      font-size: 36px;
      background: var(--bp-gradient);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .bp-payment-error {
      margin-bottom: 14px;
      padding: 12px 14px;
      border-radius: 18px;
      color: #b91c1c;
      background: rgba(254,226,226,0.68);
      border: 1px solid rgba(248,113,113,0.24);
      font-size: 13px;
      line-height: 1.45;
      font-weight: 750;
    }
    .bp-payment-trust {
      margin-top: 18px;
      text-align: center;
    }
    .bp-payment-trust__label {
      color: var(--bp-text-secondary);
      font-size: 12px;
      font-weight: 850;
      margin-bottom: 10px;
    }
    .bp-payment-trust__logos {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 7px;
    }
    .bp-payment-logo {
      min-width: 58px;
      height: 34px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 13px;
      background: rgba(255,255,255,0.62);
      border: 1px solid rgba(255,255,255,0.78);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.90), 0 6px 14px rgba(15,23,42,0.04);
      overflow: hidden;
    }
    .bp-payment-logo img {
      max-width: 88px;
      max-height: 28px;
      display: block;
    }
    .bp-payment-trust p,
    .bp-delivery-copy {
      margin-top: 10px;
      color: var(--bp-text-muted);
      font-size: 12px;
      line-height: 1.5;
      font-weight: 700;
    }
    .bp-legal-links {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 14px;
      font-size: 12px;
      font-weight: 800;
    }
    .bp-legal-links a {
      color: #4338ca;
      text-decoration: none;
    }
    .bp-checkout-mobile-cta {
      display: none;
    }
    @media (max-width: 1180px) {
      .bp-product-hero__inner {
        grid-template-columns: minmax(0, 1.18fr) minmax(360px, 0.92fr);
        gap: 28px;
      }
      .bp-commerce-shell {
        padding-inline: 20px;
      }
    }
    @media (max-width: 980px) {
      .bp-product-hero {
        min-height: 0;
        padding-top: 22px;
      }
      .bp-product-hero__inner,
      .bp-story-grid,
      .bp-checkout-grid {
        grid-template-columns: 1fr;
      }
      .bp-story-preview,
      .bp-checkout-summary {
        position: relative;
        top: auto;
      }
      .bp-purchase-dock {
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        transform: none;
        grid-template-columns: 1fr auto;
        border-radius: 24px 24px 0 0;
        padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
      }
      .bp-purchase-dock__product,
      .bp-purchase-dock__plans,
      .bp-purchase-dock__close {
        display: none;
      }
      .bp-purchase-dock__action {
        justify-content: space-between;
        grid-column: 1 / -1;
      }
      .bp-purchase-dock__button {
        flex: 1;
      }
      .bp-commerce-shell {
        padding-bottom: 132px;
      }
    }
    @media (max-width: 768px) {
      .bp-commerce-shell,
      .bp-commerce-section,
      .bp-checkout-shell {
        padding-left: 16px;
        padding-right: 16px;
      }
      .bp-commerce-shell {
        padding-top: 22px;
      }
      .bp-product-stage,
      .bp-purchase-panel,
      .bp-checkout-card,
      .bp-checkout-summary,
      .bp-razorpay-panel {
        border-radius: 26px;
        padding: 18px;
      }
      .bp-product-theatre {
        order: 2;
      }
      .bp-purchase-panel {
        order: 1;
      }
      .bp-product-title {
        font-size: clamp(34px, 10vw, 42px);
        line-height: 1.04;
      }
      .bp-product-description {
        font-size: 16px;
        max-width: 30ch;
        overflow-wrap: break-word;
      }
      .bp-trust-note {
        max-width: 31ch;
        overflow-wrap: break-word;
      }
      .bp-product-preview-selector {
        grid-template-columns: 1fr 1fr;
      }
      .bp-product-trust-grid,
      .bp-steps,
      .bp-value-grid,
      .bp-review-grid,
      .bp-trust-timeline {
        grid-template-columns: 1fr;
      }
      .bp-comparison-grid {
        grid-template-columns: 1fr;
      }
      .bp-steps::before {
        display: none;
      }
      .bp-section-heading {
        margin-bottom: 28px;
      }
      .bp-section-heading h2,
      .bp-story-copy h2,
      .bp-checkout-title h1 {
        font-size: clamp(28px, 8vw, 34px);
        max-width: 100%;
        overflow-wrap: break-word;
        text-wrap: balance;
      }
      .bp-checkout-title p {
        max-width: 28ch;
        font-size: 15px;
        overflow-wrap: break-word;
      }
      .bp-checkout-header__inner {
        align-items: flex-start;
        flex-direction: column;
      }
      .bp-checkout-header__inner > div:last-child {
        font-size: 12px;
      }
      .bp-session-timer {
        grid-template-columns: 38px 1fr;
      }
      .bp-session-timer__time,
      .bp-session-timer__restart {
        grid-column: 1 / -1;
        justify-self: stretch;
        text-align: center;
      }
      .bp-summary-product {
        grid-template-columns: 88px 1fr;
      }
      .bp-summary-product img {
        width: 88px;
        height: 64px;
      }
      .bp-checkout-page {
        padding-bottom: 112px;
      }
      .bp-checkout-mobile-cta {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 990;
        display: grid;
        gap: 8px;
        padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
        background: rgba(255,255,255,0.78);
        border-top: 1px solid rgba(255,255,255,0.82);
        box-shadow: 0 -18px 52px rgba(15,23,42,0.12), inset 0 1px 0 rgba(255,255,255,0.92);
        backdrop-filter: blur(24px) saturate(170%);
        -webkit-backdrop-filter: blur(24px) saturate(170%);
      }
      .bp-checkout-mobile-cta__top {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        color: var(--bp-text);
        font-size: 13px;
        font-weight: 900;
      }
    }
    @media (max-width: 520px) {
      .bp-plan-selector,
      .bp-plan-toggle {
        grid-template-columns: 1fr;
      }
      .bp-price-block {
        align-items: flex-start;
        flex-direction: column;
      }
      .bp-price-block__meta {
        text-align: left;
      }
      .bp-product-preview-button {
        padding: 8px;
        border-radius: 22px;
      }
      .bp-product-preview-button img {
        border-radius: 16px;
      }
      .bp-commerce-section {
        padding-top: 58px;
        padding-bottom: 58px;
      }
      .bp-payment-logo {
        min-width: 54px;
      }
      .bp-payment-logo img {
        max-width: 78px;
      }
      .bp-preview-modal {
        padding: 12px;
      }
      .bp-preview-modal__panel {
        padding: 8px;
        border-radius: 24px;
      }
      .bp-preview-modal img {
        border-radius: 18px;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .bp-product-stage,
      .bp-story-card,
      .bp-story-annotation,
      .bp-glass-button {
        transition: none !important;
      }
      .bp-glass-button::after {
        display: none;
      }
    }

    /* ── Liquid glass bubble — soft floating orb, sits behind content ── */
    .glass-bubble {
      position: absolute;
      border-radius: 999px;
      pointer-events: none;
      z-index: 1;
      background:
        radial-gradient(circle at 30% 22%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.72) 14%, rgba(255,255,255,0.20) 38%, rgba(139,92,246,0.20) 68%, rgba(59,130,246,0.12) 100%);
      border: 1px solid rgba(255,255,255,0.82);
      box-shadow:
        inset 0 2px 12px rgba(255,255,255,0.92),
        inset -12px -18px 30px rgba(99,102,241,0.14),
        0 28px 80px rgba(99,102,241,0.18);
      backdrop-filter: blur(18px) saturate(170%);
      -webkit-backdrop-filter: blur(18px) saturate(170%);
      opacity: 0.72;
      animation: bubbleFloat 12s ease-in-out infinite;
    }
    @keyframes bubbleFloat {
      0%, 100% { transform: translate3d(0,0,0) scale(1); }
      50% { transform: translate3d(0,-18px,0) scale(1.035); }
    }

    /* ── Card hover lift ── */
    .card-lift { transition: all 0.26s ${DS.ease.smooth}; }
    .card-lift:hover { transform: translateY(-4px); box-shadow: ${DS.shadow.glassLg} !important; }

    /* ── Nav item ── */
    .nav-item {
      transition: all 0.18s ${DS.ease.smooth};
      border-radius: ${DS.radius.pill} !important;
      position: relative;
      z-index: 1;
      transform: translateZ(8px);
      text-shadow: 0 1px 0 rgba(255,255,255,0.78);
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.54),
        0 5px 12px rgba(79,70,229,0.06);
    }
    .nav-item:hover {
      background: linear-gradient(145deg, rgba(255,255,255,0.76), rgba(219,234,254,0.46)) !important;
      color: ${DS.color.navyMid} !important;
      border-color: rgba(255,255,255,0.62) !important;
      transform: translateY(-1px) translateZ(16px);
      box-shadow: 0 12px 22px rgba(99,102,241,0.14), inset 0 1px 0 rgba(255,255,255,0.80) !important;
    }
    .nav-item.active {
      background: linear-gradient(145deg, rgba(219,234,254,0.86), rgba(237,233,254,0.78)) !important;
      color: ${DS.color.mintText} !important;
      font-weight: 700 !important;
      border-color: rgba(255,255,255,0.72) !important;
      transform: translateY(-1px) translateZ(20px);
      box-shadow:
        0 14px 28px rgba(99,102,241,0.18),
        inset 0 1px 0 rgba(255,255,255,0.86),
        inset 0 -10px 20px rgba(99,102,241,0.08) !important;
    }
    nav .premium-btn {
      box-shadow:
        0 16px 38px rgba(99,102,241,0.22),
        0 6px 16px rgba(15,23,42,0.10),
        inset 0 1px 0 rgba(255,255,255,0.68),
        inset 0 -12px 24px rgba(99,102,241,0.09) !important;
    }
    .nav-year-cta {
      color: #ffffff !important;
      font-weight: 900 !important;
      letter-spacing: 0 !important;
      text-shadow:
        0 1px 0 rgba(255,255,255,0.22),
        0 2px 8px rgba(30,64,175,0.34);
      border: 1px solid rgba(255,255,255,0.62) !important;
      background:
        radial-gradient(circle at 28% 10%, rgba(255,255,255,0.86), rgba(255,255,255,0.12) 34%, rgba(255,255,255,0) 56%),
        linear-gradient(135deg, #2563eb 0%, #4f46e5 42%, #8b5cf6 72%, #a855f7 100%) !important;
      box-shadow:
        0 18px 38px rgba(79,70,229,0.34),
        0 7px 18px rgba(15,23,42,0.12),
        inset 0 1px 0 rgba(255,255,255,0.70),
        inset 0 -14px 26px rgba(59,130,246,0.24) !important;
    }
    .nav-orb-btn {
      width: 42px;
      height: 42px;
      justify-content: center;
      color: #4338ca !important;
      border: 1px solid rgba(255,255,255,0.84) !important;
      background:
        radial-gradient(circle at 30% 18%, rgba(255,255,255,0.98), rgba(255,255,255,0.42) 32%, rgba(255,255,255,0) 58%),
        linear-gradient(145deg, rgba(239,246,255,0.96), rgba(224,231,255,0.78), rgba(237,233,254,0.72)) !important;
      box-shadow:
        0 15px 32px rgba(79,70,229,0.18),
        0 5px 14px rgba(15,23,42,0.08),
        inset 0 1px 0 rgba(255,255,255,0.92),
        inset 0 -10px 20px rgba(99,102,241,0.10) !important;
    }
    .nav-orb-btn svg {
      filter: drop-shadow(0 3px 6px rgba(67,56,202,0.24));
    }
    .pricing-card-kicker {
      color: #4338ca !important;
      font-weight: 900 !important;
      letter-spacing: 0 !important;
      text-shadow: 0 1px 0 rgba(255,255,255,0.90), 0 8px 18px rgba(99,102,241,0.12);
    }
    .pricing-title-gradient {
      font-family: var(--bp-display) !important;
      color: #111827;
      text-shadow: 0 1px 0 rgba(255,255,255,0.95), 0 12px 26px rgba(30,64,175,0.13);
    }
    .pricing-title-gradient.hot {
      background: linear-gradient(135deg, #1d4ed8 0%, #4f46e5 44%, #7c3aed 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: none;
    }
    .pricing-desc-vivid {
      color: #334155 !important;
      font-weight: 700 !important;
    }
    .pricing-price-vivid {
      color: #0f172a !important;
      text-shadow:
        0 1px 0 rgba(255,255,255,0.95),
        0 12px 26px rgba(15,23,42,0.13),
        0 22px 44px rgba(79,70,229,0.14);
    }

    .bp-home-reviews {
      position: relative;
      overflow: hidden;
      padding: 86px 20px 90px;
      background:
        radial-gradient(circle at 15% 10%, rgba(59,130,246,0.10), transparent 34%),
        radial-gradient(circle at 88% 75%, rgba(139,92,246,0.10), transparent 36%),
        linear-gradient(180deg, #ffffff 0%, #f8f9ff 100%);
    }
    .bp-home-reviews::before,
    .bp-home-reviews::after {
      content: "";
      position: absolute;
      border-radius: 999px;
      pointer-events: none;
      z-index: 0;
      background:
        radial-gradient(circle at 28% 22%, rgba(255,255,255,0.72), rgba(255,255,255,0.12) 38%, transparent 64%),
        linear-gradient(145deg, rgba(219,234,254,0.28), rgba(237,233,254,0.20));
      border: 1px solid rgba(255,255,255,0.62);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.85), 0 26px 72px rgba(99,102,241,0.10);
      filter: blur(0.2px);
    }
    .bp-home-reviews::before {
      width: 240px;
      height: 240px;
      left: max(-90px, calc((100vw - 1180px) / 2 - 150px));
      top: 72px;
    }
    .bp-home-reviews::after {
      width: 180px;
      height: 180px;
      right: max(-72px, calc((100vw - 1180px) / 2 - 110px));
      bottom: 84px;
    }
    .bp-home-reviews__inner {
      position: relative;
      z-index: 1;
      max-width: 1180px;
      margin: 0 auto;
    }
    .bp-home-reviews__header {
      max-width: 720px;
      margin: 0 auto 24px;
      text-align: center;
      display: grid;
      justify-items: center;
      gap: 14px;
    }
    .bp-home-reviews__header p {
      color: var(--bp-text-secondary);
      font-size: 16px;
      line-height: 1.72;
      font-weight: 600;
    }
    .bp-home-reviews__proof {
      width: fit-content;
      max-width: min(760px, 100%);
      min-height: 52px;
      margin: 0 auto 34px;
      padding: 10px 16px 10px 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 13px;
      flex-wrap: wrap;
      border-radius: 999px;
      color: #334155;
      background:
        radial-gradient(circle at 18% 8%, rgba(255,255,255,0.98), rgba(255,255,255,0.50) 58%, rgba(255,255,255,0.28)),
        linear-gradient(145deg, rgba(255,255,255,0.82), rgba(219,234,254,0.42), rgba(237,233,254,0.38));
      border: 1px solid rgba(255,255,255,0.86);
      box-shadow:
        0 18px 54px rgba(79,70,229,0.13),
        0 0 0 1px rgba(99,102,241,0.08),
        inset 0 1px 0 rgba(255,255,255,0.92);
      backdrop-filter: blur(22px) saturate(165%);
      -webkit-backdrop-filter: blur(22px) saturate(165%);
      font-size: 14px;
      line-height: 1.45;
      font-weight: 800;
      text-align: left;
    }
    .bp-proof-avatars {
      display: flex;
      align-items: center;
      flex: 0 0 auto;
      padding-left: 4px;
    }
    .bp-proof-avatars span {
      width: 30px;
      height: 30px;
      margin-left: -7px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      color: #ffffff;
      background: var(--bp-gradient);
      border: 2px solid rgba(255,255,255,0.88);
      box-shadow: 0 8px 18px rgba(79,70,229,0.18);
      font-size: 10px;
      font-weight: 900;
    }
    .bp-proof-avatars span:first-child {
      margin-left: 0;
    }
    .bp-proof-stat,
    .bp-proof-weekly {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      min-width: 0;
      color: #334155;
      white-space: nowrap;
    }
    .bp-proof-stat strong,
    .bp-proof-weekly strong {
      color: #111827;
      font-family: var(--bp-number);
      font-size: 15px;
      font-weight: 900;
      letter-spacing: 0;
    }
    .bp-proof-divider {
      width: 1px;
      height: 22px;
      flex: 0 0 auto;
      background: rgba(99,102,241,0.18);
    }
    .bp-proof-live-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex: 0 0 auto;
      background: #16a34a;
      box-shadow: 0 0 0 4px rgba(22,163,74,0.10);
    }
    .bp-proof-fallback {
      color: #334155;
      font-weight: 800;
    }
    .bp-proof-rating {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      min-width: 0;
      color: #334155;
      font-weight: 800;
      white-space: nowrap;
    }
    .bp-proof-rating strong {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: #111827;
      font-family: var(--bp-number);
      font-size: 15px;
      font-weight: 900;
      letter-spacing: 0;
    }
    .bp-proof-rating-star {
      color: #f59e0b;
      font-size: 16px;
      line-height: 1;
      text-shadow: 0 1px 0 rgba(255,255,255,0.85);
    }
    .bp-proof-rating small {
      color: #15803d;
      font-size: 12px;
      font-weight: 800;
    }
    .bp-home-reviews__grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 22px;
      max-width: 940px;
      margin: 0 auto;
      align-items: stretch;
    }
    .bp-home-review-card {
      position: relative;
      min-width: 0;
      height: 100%;
      min-height: 306px;
      display: grid;
      grid-template-rows: auto 1fr auto auto;
      gap: 18px;
      align-content: stretch;
      border-radius: 28px;
      padding: 26px;
      overflow: hidden;
      background:
        linear-gradient(145deg, rgba(255,255,255,0.70), rgba(255,255,255,0.38));
      border: 1px solid rgba(255,255,255,0.80);
      box-shadow:
        0 20px 55px rgba(67,56,202,0.09),
        0 5px 16px rgba(15,23,42,0.05),
        inset 0 1px 0 rgba(255,255,255,0.94);
      backdrop-filter: blur(24px) saturate(165%);
      -webkit-backdrop-filter: blur(24px) saturate(165%);
      transition: transform 0.22s var(--bp-ease, cubic-bezier(0.4,0,0.2,1)), box-shadow 0.22s var(--bp-ease, cubic-bezier(0.4,0,0.2,1));
    }
    .bp-home-review-card::before {
      content: "";
      position: absolute;
      inset: 1px;
      border-radius: inherit;
      pointer-events: none;
      background:
        radial-gradient(circle at 20% 12%, rgba(255,255,255,0.86), transparent 32%),
        linear-gradient(160deg, rgba(59,130,246,0.08), transparent 38%, rgba(139,92,246,0.08));
    }
    .bp-home-review-card > * {
      position: relative;
      z-index: 1;
    }
    .bp-home-review-card__quote {
      position: absolute;
      top: 10px;
      right: 22px;
      z-index: 0;
      font-family: var(--bp-display);
      font-size: 92px;
      line-height: 1;
      color: rgba(99,102,241,0.12);
      pointer-events: none;
    }
    .bp-home-review-card__rating {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      align-self: start;
      min-height: 18px;
      color: #f59e0b;
    }
    .bp-home-review-card__star {
      display: inline-flex;
      color: rgba(203,213,225,0.92);
    }
    .bp-home-review-card__star.is-filled {
      color: #f59e0b;
    }
    .bp-home-review-card__text {
      color: var(--bp-text);
      font-family: var(--bp-body);
      font-size: clamp(15px, 1.5vw, 16.5px);
      line-height: 1.75;
      font-weight: 600;
      margin: 0;
      align-self: start;
    }
    .bp-home-review-card__footer {
      display: flex;
      align-items: center;
      gap: 13px;
      padding-top: 16px;
      border-top: 1px solid rgba(99,102,241,0.12);
      min-width: 0;
      align-self: end;
    }
    .bp-home-review-card__avatar {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      color: #ffffff;
      background: var(--bp-gradient);
      font-family: var(--bp-body);
      font-size: 12px;
      font-weight: 850;
      box-shadow: 0 10px 22px rgba(79,70,229,0.24), inset 0 1px 0 rgba(255,255,255,0.36);
    }
    .bp-home-review-card__person {
      display: grid;
      gap: 3px;
      min-width: 0;
    }
    .bp-home-review-card__person strong {
      color: var(--bp-text);
      font-size: 14px;
      line-height: 1.25;
      font-weight: 850;
      overflow-wrap: anywhere;
    }
    .bp-home-review-card__person span {
      color: var(--bp-text-muted);
      font-size: 12px;
      line-height: 1.45;
      font-weight: 700;
      overflow-wrap: anywhere;
    }
    .bp-home-review-card__meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }
    .bp-home-review-card__pill {
      display: inline-flex;
      align-items: center;
      min-height: 26px;
      padding: 0 10px;
      border-radius: 999px;
      color: #4338ca;
      background: rgba(99,102,241,0.08);
      border: 1px solid rgba(99,102,241,0.14);
      font-size: 11px;
      font-weight: 850;
    }
    @media (hover: hover) and (pointer: fine) {
      .bp-home-review-card:hover {
        transform: translateY(-4px) scale(1.005);
        box-shadow:
          0 26px 64px rgba(67,56,202,0.12),
          0 7px 20px rgba(15,23,42,0.07),
          inset 0 1px 0 rgba(255,255,255,0.96);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .bp-home-review-card {
        transition: none;
      }
      .bp-home-review-card:hover {
        transform: none;
      }
    }

    @media (max-width: 900px) {
      .bp-home-reviews__grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
    @media (max-width: 768px) {
      .bp-home-reviews {
        padding: 72px 16px 78px;
      }
      .bp-home-reviews__header {
        margin-bottom: 22px;
      }
      .bp-home-reviews__proof {
        width: 100%;
        margin-bottom: 24px;
        border-radius: 24px;
        align-items: flex-start;
        justify-content: flex-start;
        padding: 12px 14px;
        font-size: 13px;
      }
      .bp-proof-stat,
      .bp-proof-weekly {
        white-space: normal;
      }
      .bp-proof-divider {
        display: none;
      }
      .bp-home-reviews__grid {
        grid-template-columns: 1fr;
        gap: 18px;
      }
      .bp-home-review-card {
        padding: 22px;
        border-radius: 26px;
      }
      .bp-home-review-card__quote {
        top: 8px;
        right: 18px;
        font-size: 72px;
      }
    }
    @media (max-width: 390px) {
      .bp-home-review-card {
        padding: 20px;
      }
      .bp-home-reviews__proof {
        display: grid;
        grid-template-columns: auto 1fr;
      }
      .bp-proof-stat,
      .bp-proof-weekly,
      .bp-proof-fallback {
        grid-column: 2;
      }
      .bp-proof-rating {
        grid-column: 2;
        white-space: normal;
      }
      .bp-home-reviews__header p {
        font-size: 15px;
      }
      .bp-home-review-card__footer {
        align-items: flex-start;
      }
    }

    /* ── Skeleton ── */
    .skeleton {
      background: ${DS.grad.shimmer};
      background-size: 200% 100%;
      animation: shimmer 1.6s infinite;
      border-radius: ${DS.radius.md};
    }

    /* ── Input focus ── */
    input:focus, select:focus, textarea:focus {
      border-color: ${DS.color.mint} !important;
      outline: none;
      box-shadow: ${DS.shadow.glowBlue} !important;
    }
    input::placeholder, textarea::placeholder { color: ${DS.color.slateLight}; }
    button, input, select, textarea { font: inherit; }
    button:focus-visible, a:focus-visible { outline: 2px solid ${DS.color.mint}; outline-offset: 3px; }

    /* ── Scrollbar ── */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #f8fbff; }
    ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.18); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.32); }

    /* ── Frame-sequence scroll hero ── */
    .hero-scroll-section {
      position: relative;
      height: 300vh;
      background: ${DS.grad.hero};
    }
    .hero-sticky {
      position: sticky;
      top: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      overflow: hidden;
      padding-top: 90px;
      padding-bottom: 56px;
    }
    .frame-canvas {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: contain;
    }

    /* ── Responsive — preview stays visible down to mobile, only decorative bubbles fade ── */
    @media (max-width: 1024px) {
      .hero-grid { flex-direction: column !important; }
      .hero-right {
        display: flex !important;
        width: 100% !important;
        max-width: 900px !important;
        margin: 0 auto !important;
      }
    }
    @media (max-width: 768px) {
      html, body, #root {
        width: 100%;
        max-width: 100%;
        overflow-x: hidden;
      }
      section:not([data-hero-scroll-sequence]) {
        padding: 64px 16px !important;
      }
      .glass-card {
        border-radius: 22px !important;
      }
      .premium-btn:hover,
      .card-lift:hover,
      .glass-trust-card:hover {
        transform: none !important;
      }
      .pricing-grid   { grid-template-columns: 1fr !important; }
      .benefits-grid  { grid-template-columns: 1fr 1fr !important; }
      .checkout-grid  { grid-template-columns: 1fr !important; }
      .footer-grid    { grid-template-columns: 1fr 1fr !important; }
      .product-grid   { grid-template-columns: 1fr !important; }
      .nav-desktop    { display: none !important; }
      .mobile-nav-btn { display: flex !important; }
      .hero-cta-row   { flex-direction: column !important; }
      .hero-cta-row button, .hero-cta-row > div { width: 100% !important; }
      .hero-scroll-section { height: auto !important; }
      .hero-sticky {
        position: relative !important;
        height: auto !important;
        min-height: 0 !important;
        padding-top: 88px !important;
        padding-bottom: 54px !important;
        overflow: visible !important;
      }
      .hero-dashboard-shell {
        padding: 0 !important;
        border-radius: 28px !important;
      }
      .hero-dashboard-frame {
        border-radius: 24px !important;
      }
      .sticky-cta {
        display: none !important;
      }
      .pricing-grid {
        gap: 18px !important;
      }
      .pricing-price-vivid {
        font-size: 48px !important;
      }
      .dashboard-demo-3d {
        max-width: 100% !important;
        box-shadow: 0 18px 48px rgba(67,56,202,0.10) !important;
      }
      .dashboard-demo-frame {
        border-radius: 22px !important;
      }
      .dashboard-demo-frame img {
        object-fit: contain !important;
      }
      .product-media-glass-panel {
        padding: 10px !important;
        border-radius: 28px !important;
        box-shadow: 0 16px 42px rgba(99,102,241,0.10), inset 0 1px 0 rgba(255,255,255,0.76) !important;
      }
      .product-preview-shell {
        transform: none !important;
        box-shadow: 0 20px 54px rgba(79,70,229,0.16) !important;
      }
      .product-preview-shell::before {
        inset: -8px !important;
        opacity: 0.32 !important;
      }
      .product-preview-image-wrap {
        transform: none !important;
        border-radius: 20px !important;
      }
      .product-preview-image-wrap img {
        filter: contrast(1.14) saturate(1.10) brightness(0.99) !important;
      }
      .product-title-premium {
        font-size: clamp(31px, 9vw, 39px) !important;
        line-height: 1.06 !important;
      }
      .glass-segment {
        transform: none !important;
        border-radius: 20px !important;
      }
      .plan-segment-btn {
        padding: 10px 8px !important;
        gap: 4px !important;
      }
      .plan-segment-btn .plan-badge {
        display: none !important;
      }
      .checkout-glass-card {
        padding: 18px !important;
        border-radius: 24px !important;
      }
      .checkout-glass-button,
      .glass-segment-btn,
      .glass-tab-btn {
        min-height: 44px;
      }
    }
    @media (max-width: 640px) {
      .hero-right { transform: none !important; }
      .glass-bubble { opacity: 0.25; }
      .brand-wordmark-3d {
        font-size: 19px !important;
      }
    }
    @media (max-width: 480px) {
      .benefits-grid  { grid-template-columns: 1fr !important; }
      .footer-grid    { grid-template-columns: 1fr !important; }
      section:not([data-hero-scroll-sequence]) {
        padding-top: 56px !important;
        padding-bottom: 56px !important;
      }
      .pricing-price-vivid {
        font-size: 44px !important;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
      .glass-bubble { animation: none !important; }
      .hero-scroll-section { height: auto !important; }
      .hero-sticky { position: relative !important; top: auto !important; height: auto !important; min-height: 92vh; }
    }
  `}</style>
);

// ═══════════════════════════════════════════════════════════════════
//  CURSOR ANTIGRAVITY PARTICLES — hero canvas effect
// ═══════════════════════════════════════════════════════════════════
const CursorParticles = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(max-width:1024px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let rafId;
    let mouse = { x: -999, y: -999 };
    const colors = ["rgba(99,102,241,0.7)","rgba(139,92,246,0.7)","rgba(59,130,246,0.7)","rgba(236,72,153,0.5)","rgba(6,182,212,0.6)"];
    const resize = () => {
      canvas.width  = canvas.parentElement?.offsetWidth  || window.innerWidth;
      canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
    };
    window.addEventListener("resize", resize); resize();
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      if (Math.random() > 0.35 && particles.length < 120) {
        particles.push({
          x: mouse.x + (Math.random()-0.5)*36,
          y: mouse.y + (Math.random()-0.5)*36,
          r: Math.random()*2.8+0.8,
          color: colors[Math.floor(Math.random()*colors.length)],
          vx: (Math.random()-0.5)*2.2,
          vy: (Math.random()-0.5)*2.2 - 0.4,
          life: 1,
        });
      }
    };
    window.addEventListener("mousemove", onMove);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length-1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.life -= 0.014;
        if (p.life <= 0) { particles.splice(i,1); continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life * 0.65;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      rafId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);
  return <canvas ref={canvasRef} style={{ position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:2 }} />;
};

// ═══════════════════════════════════════════════════════════════════
//  ICONS
// ═══════════════════════════════════════════════════════════════════
const ICON_PATHS = {
  shield:     "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  download:   "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
  check:      "M20 6L9 17l-5-5",
  star:       "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  zap:        "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  trending:   "M22 7l-7 7-4-4-7 7",
  users:      "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  mail:       "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  lock:       "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4",
  eye:        "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
  settings:   "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  logout:     "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  upload:     "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12",
  chart:      "M18 20V10M12 20V4M6 20v-6",
  close:      "M18 6L6 18M6 6l12 12",
  menu:       "M3 12h18M3 6h18M3 18h18",
  arrowRight: "M5 12h14M12 5l7 7-7 7",
  phone:      "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
  creditCard: "M1 4h22v16H1zM1 10h22",
  building:   "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10",
  bag:        "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0",
  calendar:   "M3 4h18v18H3V4zM16 2v4M8 2v4M3 10h18",
  piggyBank:  "M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4.5c2.5-1.3 3-3 3-5.5 0-4.5-4-4.5-4-4.5s-.5 0-1-2zM8 11a1 1 0 100-2 1 1 0 000 2z",
  chevronDown:"M6 9l6 6 6-6",
  rupee:      "M6 3h12M6 8h12M15 21L9 3M9 14h3a4 4 0 000-8H9v11",
};
const Icon = memo(({ name, size=20, color="currentColor", style={}, filled=false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled?color:"none"} stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
    <path d={ICON_PATHS[name]||""} />
  </svg>
));

// ═══════════════════════════════════════════════════════════════════
//  PRIMITIVE COMPONENTS
// ═══════════════════════════════════════════════════════════════════

// Badge
const Badge = memo(({ children, color="rgba(99,102,241,0.10)", text="#4338ca", style={}, className="" }) => (
  <span className={className} style={{
    background:color, color:text,
    borderRadius:DS.radius.pill,
    padding:"5px 14px",
    fontSize:DS.type.xs, fontWeight:800,
    display:"inline-flex", alignItems:"center", gap:"5px",
    border:"1px solid rgba(255,255,255,0.60)",
    boxShadow:"0 1px 4px rgba(0,0,0,0.06)",
    ...style,
  }}>{children}</span>
));

// Divider
const Divider = ({ style={} }) => (
  <div style={{ height:1, background:DS.color.border, ...style }} />
);

// Liquid Glass Button
const LiquidBtn = memo(({ children, onClick, variant="cta", size="md", style={}, disabled=false, className="" }) => {
  const variants = {
    cta: {
      background: "linear-gradient(135deg, rgba(59,130,246,0.94) 0%, rgba(99,102,241,0.94) 48%, rgba(139,92,246,0.94) 100%)",
      color: "#fff",
      border: "1px solid rgba(255,255,255,0.38)",
      boxShadow: "0 18px 42px rgba(99,102,241,0.34), 0 7px 16px rgba(15,23,42,0.10), inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -12px 22px rgba(29,78,216,0.18)",
    },
    white: {
      background: "linear-gradient(145deg, rgba(255,255,255,0.92), rgba(239,246,255,0.74) 48%, rgba(237,233,254,0.58))",
      color: DS.color.navy,
      border: "1px solid rgba(255,255,255,0.78)",
      boxShadow: "0 14px 34px rgba(99,102,241,0.14), 0 5px 14px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.88), inset 0 -12px 24px rgba(99,102,241,0.07)",
    },
    outline: {
      background: "linear-gradient(145deg, rgba(255,255,255,0.78), rgba(237,233,254,0.58))",
      color: "#4f46e5",
      border: `1px solid rgba(139,92,246,0.30)`,
      boxShadow: "0 14px 30px rgba(99,102,241,0.13), 0 4px 12px rgba(15,23,42,0.07), inset 0 1px 0 rgba(255,255,255,0.82)",
    },
    ghost: {
      background: "transparent",
      color: DS.color.slate,
      border: "none",
      boxShadow: "none",
    },
    danger: {
      background: "linear-gradient(135deg,#ef4444,#dc2626)",
      color: "#fff",
      border: "none",
      boxShadow: "0 4px 14px rgba(239,68,68,0.30)",
    },
    premium: {
      background: "linear-gradient(135deg, rgba(99,102,241,0.96), rgba(139,92,246,0.96), rgba(168,85,247,0.94))",
      color: "#fff",
      border: "1px solid rgba(255,255,255,0.34)",
      boxShadow: "0 18px 44px rgba(139,92,246,0.34), 0 7px 18px rgba(15,23,42,0.10), inset 0 1px 0 rgba(255,255,255,0.44), inset 0 -12px 24px rgba(67,56,202,0.20)",
    },
  };
  const sizes = {
    sm: { padding:"8px 18px",  fontSize:DS.type.sm,  borderRadius:DS.radius.pill, gap:"6px" },
    md: { padding:"12px 26px", fontSize:DS.type.body, borderRadius:DS.radius.pill, gap:"8px" },
    lg: { padding:"16px 36px", fontSize:"16px",       borderRadius:DS.radius.pill, gap:"10px" },
  };
  const v = variants[variant] || variants.cta;
  const s = sizes[size] || sizes.md;
  return (
    <button
      onClick={disabled?undefined:onClick}
      className={`premium-btn ${className}`}
      disabled={disabled}
      style={{
        ...s, ...v,
        display:"inline-flex", alignItems:"center", justifyContent:"center",
        fontWeight:700, cursor:disabled?"not-allowed":"pointer",
        opacity:disabled?0.6:1, fontFamily:"inherit",
        transition:`all 0.22s ${DS.ease.smooth}`,
        backdropFilter:"blur(12px)",
        WebkitBackdropFilter:"blur(12px)",
        ...style,
      }}
    >
      <span style={{ position: "relative", zIndex: 3, display: "inline-flex", alignItems: "center", gap: "inherit" }}>
        {children}
      </span>
    </button>
  );
});

// ═══════════════════════════════════════════════════════════════════
//  DASHBOARD IMAGE — real screenshots, monthly/annual switching
//  Place monthly-dashboard-preview.png and annual-dashboard-preview.png
//  in /public. Real image ratio is 1536×1024 (3:2) for both files.
// ═══════════════════════════════════════════════════════════════════
const DASHBOARD_PREVIEWS = {
  monthly: {
    src: monthlyDashboardPreview,
    label: "monthly-dashboard-preview.png",
    alt: "Monthly budget tracker dashboard preview - income, expenses, savings and category breakdown",
    title: "Monthly Dashboard Preview",
  },
  annual: {
    src: annualDashboardPreview,
    label: "annual-dashboard-preview.png",
    alt: "Annual expenses dashboard preview - 12-month income, expenses, savings and debt overview",
    title: "Annual Dashboard Preview",
  },
};

const DashboardImage = memo(({ type = "monthly", loading = "eager", fit = "contain", position = "center top", className = "", style = {} }) => {
  const [errored, setErrored] = useState(false);
  const preview = DASHBOARD_PREVIEWS[type] || DASHBOARD_PREVIEWS.monthly;
  const src = preview.src;
  const label = preview.label;
  const alt = preview.alt;

  if (errored) {
    return (
      <div style={{
        width:"100%",height:"100%",
        background:"linear-gradient(135deg,#f8fbff,#f3f0ff)",
        display:"flex",alignItems:"center",justifyContent:"center",
        padding:20,textAlign:"center",fontSize:12,fontWeight:600,
        color:DS.color.slateLight,lineHeight:1.6,flexDirection:"column",gap:8,
      }}>
        <span style={{fontSize:32}}>{type==="annual"?"📈":"📊"}</span>
        <span>Could not load <code style={{background:"#fff",padding:"2px 6px",borderRadius:6,border:"1px solid #e2e8f0"}}>{label}</code></span>
      </div>
    );
  }
  return (
    <img
      className={className || undefined}
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      fetchpriority={loading === "eager" ? "high" : "auto"}
      onError={()=>setErrored(true)}
      style={{ width:"100%", height:"100%", objectFit:fit, objectPosition:position, display:"block", imageRendering:"auto", ...style }}
    />
  );
});

// Kept as a thin backward-compatible alias — some older sections below
// referenced TrackerScreenshot directly; both names now point to the
// same real-image component so nothing breaks if either name is used.
// eslint-disable-next-line no-unused-vars
const TrackerScreenshot = memo(({ fit="contain", position="top" }) => (
  <DashboardImage type="monthly" loading="eager" fit={fit} position={position} />
));

// ═══════════════════════════════════════════════════════════════════
//  GLASS BUBBLE — decorative liquid glass orb, sits behind content
// ═══════════════════════════════════════════════════════════════════
const GlassBubble = memo(({ style = {}, size = 120 }) => (
  <div aria-hidden="true" className="glass-bubble" style={{ width:size, height:size, ...style }} />
));

// ═══════════════════════════════════════════════════════════════════
//  FRAME SEQUENCE HERO — Apple-style scroll-scrub canvas animation
//  Reads 240 PNG frames from /public/frames/frame_0001.png..frame_0240.png
//  (1280×720 source). Desktop: scroll-driven via the .hero-scroll-section
//  wrapper (see HeroSection below). Mobile / prefers-reduced-motion:
//  loads a single static frame instead of the full 240-image sequence —
//  this is the explicitly-allowed lightweight fallback, and it matters
//  here because the full frame set is ~154MB uncompressed (see the
//  perf note in the final written summary).
// ═══════════════════════════════════════════════════════════════════
const FRAME_COUNT = 240;
const FRAME_ASPECT = 1280 / 720;
const DEBUG_FRAMES = false;
// Frames were converted from the original 240 PNGs (154MB total, ~657KB/frame)
// to WebP quality 80 at the same 1280×720 resolution (9.1MB total, ~38KB/frame)
// — a 94% size reduction with no visible quality loss on this UI-screenshot
// content. WebP has full support across all modern browsers. PNG fallback is
// kept so the hero still works if a deployment has the original frame set.
const getFrameSrc = (frameNumber) => `/frames/frame_${String(frameNumber).padStart(4, "0")}.webp`;

const FrameSequenceHero = memo(() => {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);        // Image() objects, index 0 = frame_0001
  const currentFrameRef = useRef(0);   // last successfully drawn frame index (0-based)
  const desiredFrameRef = useRef(0);   // frame requested by scroll, even if not loaded yet
  const hasDrawnRef = useRef(false);
  const loadedCountRef = useRef(0);
  const scrollRafRef = useRef(null);
  const [frameUi, setFrameUi] = useState({
    status: "loading",
    currentFrame: 1,
    loadedCount: 0,
    path: getFrameSrc(1),
    error: "",
  });
  const [lightMode, setLightMode] = useState(false); // mobile / reduced-motion: static frame only

  // Draw a given 0-based frame index onto the canvas, contain-fit, DPR-sharp.
  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return false;

    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    if (displayWidth === 0 || displayHeight === 0) return false;

    const dpr = window.devicePixelRatio || 1;
    const targetW = Math.round(displayWidth * dpr);
    const targetH = Math.round(displayHeight * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, displayWidth, displayHeight);

    const scale = Math.min(displayWidth / img.naturalWidth, displayHeight / img.naturalHeight);
    const drawWidth = img.naturalWidth * scale;
    const drawHeight = img.naturalHeight * scale;
    const x = (displayWidth - drawWidth) / 2;
    const y = (displayHeight - drawHeight) / 2;
    ctx.drawImage(img, x, y, drawWidth, drawHeight);

    const wasWaitingForFirstDraw = !hasDrawnRef.current;
    currentFrameRef.current = index;
    hasDrawnRef.current = true;
    if (wasWaitingForFirstDraw || DEBUG_FRAMES) {
      setFrameUi({
        status: "ready",
        currentFrame: index + 1,
        loadedCount: loadedCountRef.current,
        path: getFrameSrc(index + 1),
        error: "",
      });
    }
    window.__budgetProFrameStats = {
      frame: index + 1,
      loaded: loadedCountRef.current,
      total: FRAME_COUNT,
      path: getFrameSrc(index + 1),
    };
    return true;
  }, []);

  const drawNearestLoadedFrame = useCallback((targetIndex) => {
    if (drawFrame(targetIndex)) return true;

    for (let distance = 1; distance < FRAME_COUNT; distance += 1) {
      const before = targetIndex - distance;
      const after = targetIndex + distance;
      if (before >= 0 && drawFrame(before)) return true;
      if (after < FRAME_COUNT && drawFrame(after)) return true;
    }
    return false;
  }, [drawFrame]);

  const drawRequestedFrame = useCallback((index) => {
    desiredFrameRef.current = Math.max(0, Math.min(FRAME_COUNT - 1, index));
    if (drawFrame(desiredFrameRef.current)) return;

    drawNearestLoadedFrame(desiredFrameRef.current);
  }, [drawFrame, drawNearestLoadedFrame]);

  // Compute scroll progress (0..1) from the .hero-scroll-section ancestor
  // and draw the matching frame. rAF-throttled, no React state per scroll tick.
  const handleScroll = useCallback(() => {
    if (scrollRafRef.current) return;
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = null;
      const canvas = canvasRef.current;
      const section = canvas && canvas.closest(".hero-scroll-section");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollableDistance = section.offsetHeight - window.innerHeight;
      let progress = scrollableDistance > 0 ? -rect.top / scrollableDistance : 0;
      progress = Math.max(0, Math.min(1, progress));

      const frameNumber = Math.min(
        FRAME_COUNT,
        Math.max(1, Math.floor(progress * (FRAME_COUNT - 1)) + 1)
      );
      drawRequestedFrame(frameNumber - 1);
    });
  }, [drawRequestedFrame]);

  // Mount: decide light vs full mode, preload frames accordingly.
  useEffect(() => {
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia && window.matchMedia("(max-width: 768px)").matches;
    const useLight = reduced || mobile;
    setLightMode(useLight);

    let cancelled = false;
    let preloadTimer = null;
    imagesRef.current = new Array(FRAME_COUNT);
    loadedCountRef.current = 0;
    currentFrameRef.current = 0;
    desiredFrameRef.current = 0;
    hasDrawnRef.current = false;
    setFrameUi({
      status: "loading",
      currentFrame: 1,
      loadedCount: 0,
      path: getFrameSrc(1),
      error: "",
    });
    window.__budgetProFrameStats = {
      frame: 1,
      loaded: 0,
      total: FRAME_COUNT,
      path: getFrameSrc(1),
    };
    if (DEBUG_FRAMES) {
      console.log("Frame test:", getFrameSrc(1), getFrameSrc(120), getFrameSrc(240));
    }

    const loadFrameImage = (index) => {
      const existing = imagesRef.current[index];
      if (existing?.complete && existing?.naturalWidth) return existing;

      const frameNumber = index + 1;
      const img = new Image();
      img.decoding = "async";

      img.onload = () => {
        if (cancelled) return;
        imagesRef.current[index] = img;
        if (!img.__budgetProLoaded) {
          img.__budgetProLoaded = true;
          loadedCountRef.current += 1;
        }

        if (index === desiredFrameRef.current || !hasDrawnRef.current) {
          drawFrame(index);
        }

        if (DEBUG_FRAMES) {
          setFrameUi((prev) => ({
            ...prev,
            status: hasDrawnRef.current ? "ready" : "loading",
            loadedCount: loadedCountRef.current,
          }));
        }

        window.__budgetProFrameStats = {
          frame: currentFrameRef.current + 1,
          loaded: loadedCountRef.current,
          total: FRAME_COUNT,
          path: getFrameSrc(currentFrameRef.current + 1),
        };
      };

      img.onerror = () => {
        const failedUrl = getFrameSrc(frameNumber);
        console.warn("Frame failed:", failedUrl);
        if (frameNumber === 1 && !hasDrawnRef.current) {
          setFrameUi({
            status: "error",
            currentFrame: 1,
            loadedCount: loadedCountRef.current,
            path: failedUrl,
            error: `Could not load ${failedUrl}`,
          });
        }
      };

      img.src = getFrameSrc(frameNumber);
      imagesRef.current[index] = img;
      return img;
    };

    if (useLight) {
      // Lightweight path: load exactly one representative frame (roughly
      // the midpoint of the sequence, so mobile users see a "filled in"
      // dashboard rather than the near-empty frame 1) and stop there.
      const midIndex = Math.floor(FRAME_COUNT / 2);
      desiredFrameRef.current = midIndex;
      loadFrameImage(midIndex);
      return () => {
        cancelled = true;
        if (preloadTimer) window.clearTimeout(preloadTimer);
      };
    }

    // Full path: preload frame 1 first and draw it immediately as the
    // fallback, then preload the remaining 239 frames in small batches.
    // Refs only — never setState per-image, to avoid 240 re-renders.
    desiredFrameRef.current = 0;
    loadFrameImage(0);

    let nextIndex = 1;
    const loadBatch = () => {
      if (cancelled || nextIndex >= FRAME_COUNT) return;

      const batchEnd = Math.min(FRAME_COUNT, nextIndex + 12);
      for (; nextIndex < batchEnd; nextIndex += 1) {
        loadFrameImage(nextIndex);
      }
      preloadTimer = window.setTimeout(loadBatch, 24);
    };

    preloadTimer = window.setTimeout(loadBatch, 80);

    return () => {
      cancelled = true;
      if (preloadTimer) window.clearTimeout(preloadTimer);
      imagesRef.current.forEach((img) => {
        if (!img) return;
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [drawFrame]);

  // Scroll + resize listeners (full mode only).
  useEffect(() => {
    if (lightMode) return;
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
    };
  }, [lightMode, handleScroll]);

  // Redraw current frame on resize in light mode too (keeps canvas sharp
  // if the user rotates a tablet, etc.)
  useEffect(() => {
    if (!lightMode) return;
    const onResize = () => drawFrame(currentFrameRef.current);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [lightMode, drawFrame]);

  return (
    <div style={{position:"relative",width:"100%",height:"100%",borderRadius:"inherit",background:"#f8f7ff",overflow:"hidden"}}>
      <canvas
        ref={canvasRef}
        className="frame-canvas"
        aria-label="Smart Expense Tracker dashboard preview animation"
        role="img"
        style={{
          width: "100%",
          height: "100%",
          aspectRatio: String(FRAME_ASPECT),
          borderRadius: "inherit",
          background: "#f8f7ff",
        }}
      />
      {frameUi.status === "loading" && (
        <div style={{
          position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",
          background:"linear-gradient(145deg, rgba(248,247,255,0.82), rgba(237,233,254,0.58))",
          color:DS.color.slate,fontWeight:800,fontSize:13,letterSpacing:0,
        }}>
          Loading dashboard frames...
        </div>
      )}
      {frameUi.status === "error" && (
        <div style={{
          position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",
          padding:24,textAlign:"center",background:"#f8f7ff",color:"#b91c1c",
          fontSize:13,fontWeight:800,lineHeight:1.6,
        }}>
          {frameUi.error || "Dashboard frames could not load."}
        </div>
      )}
      {DEBUG_FRAMES && (
        <div style={{
          position:"absolute",right:12,bottom:12,zIndex:5,
          background:"rgba(15,23,42,0.78)",color:"#fff",
          border:"1px solid rgba(255,255,255,0.22)",
          borderRadius:12,padding:"8px 10px",
          fontSize:10,lineHeight:1.5,fontFamily:DS.font.number,
          backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",
        }}>
          <div>Frame: {frameUi.currentFrame} / {FRAME_COUNT}</div>
          <div>Loaded: {frameUi.loadedCount} / {FRAME_COUNT}</div>
          <div>Path: {frameUi.path}</div>
        </div>
      )}
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════
//  HERO SECTION — Luxury Liquid Glass with real tracker image
// ═══════════════════════════════════════════════════════════════════
// eslint-disable-next-line no-unused-vars
const HeroSection = memo(({ onNavigate }) => {
  const goTo = (path) => { onNavigate(path); };

  return (
    <section className="hero-scroll-section">
    <div className="hero-sticky" style={{
      background:DS.grad.hero,
      padding:"90px 20px 56px",
      overflow:"hidden",
      width:"100%",
    }}>
      <CursorParticles />

      {/* Ambient soft gradient blobs (behind bubbles) */}
      <div style={{position:"absolute",top:"-10%",right:"5%",width:520,height:520,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,0.10),transparent 70%)",pointerEvents:"none",animation:"orb 18s ease-in-out infinite"}}/>
      <div style={{position:"absolute",bottom:"5%",left:"-5%",width:420,height:420,borderRadius:"50%",background:"radial-gradient(circle,rgba(59,130,246,0.09),transparent 70%)",pointerEvents:"none",animation:"orb 13s ease-in-out infinite reverse"}}/>
      <div style={{position:"absolute",top:"40%",left:"30%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(6,182,212,0.06),transparent 70%)",pointerEvents:"none",animation:"orb 20s ease-in-out infinite 2s"}}/>

      {/* Real liquid glass bubbles — 4, positioned to never cover text/buttons */}
      <GlassBubble size={140} style={{ top:"18%", left:"2%" }} />
      <GlassBubble size={220} style={{ top:"22%", right:"4%", animationDelay:"1.5s" }} />
      <GlassBubble size={110} style={{ bottom:"8%", left:"8%", animationDelay:"3s" }} />
      <GlassBubble size={64}  style={{ top:"8%", right:"26%", animationDelay:"2s" }} />

      <div style={{maxWidth:1480,margin:"0 auto",width:"100%",position:"relative",zIndex:3}}>
        <div className="hero-grid" style={{display:"flex",gap:48,alignItems:"center",justifyContent:"space-between"}}>

          {/* ── LEFT: Copy — ~39% ── */}
          <div style={{flex:"0 0 40%",display:"flex",flexDirection:"column",gap:24,minWidth:0}}>
            {/* Badges */}
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <Badge color="rgba(99,102,241,0.10)" text="#4338ca" style={{border:"1px solid rgba(99,102,241,0.18)"}}>
                Instant spreadsheet setup
              </Badge>
              <Badge color="rgba(5,150,105,0.10)" text="#047857" style={{border:"1px solid rgba(5,150,105,0.18)"}}>
                Private Excel + Google Sheets
              </Badge>
            </div>

            {/* Headline */}
            <div>
              <h1 style={{
                fontFamily:DS.font.heading,
                fontSize:"clamp(46px,4.6vw,74px)",
                fontWeight:900,
                lineHeight:1.04,
                letterSpacing:0,
                color:DS.color.navy,
                margin:0,
              }}>
                Your money<br/>
                isn't disappearing —<br/>
                <span style={{
                  background:"linear-gradient(135deg,#3b82f6 0%,#6366f1 45%,#8b5cf6 100%)",
                  WebkitBackgroundClip:"text",
                  WebkitTextFillColor:"transparent",
                  backgroundClip:"text",
                  display:"inline-block",
                }}>
                  it's just untracked.
                </span>
              </h1>
            </div>

            {/* Subtext */}
            <p style={{fontSize:17,color:DS.color.slate,lineHeight:1.7,maxWidth:480,fontWeight:500,margin:0}}>
              Meet <strong style={{color:DS.color.navy}}>Smart Expense Tracker</strong> — a premium Excel dashboard that shows exactly where every rupee goes, how much you save, and what you can control every month.
            </p>

            {/* Feature pills — liquid glass cards */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[
                {icon:"✓",label:"Track every rupee with clarity"},
                {icon:"📅",label:"Monthly & yearly expense views"},
                {icon:"📊",label:"Premium dashboard visuals"},
                {icon:"♾️",label:"One-time purchase, lifetime use"},
              ].map((f,i)=>(
                <div key={i} className="glass-card card-lift" style={{
                  borderRadius:DS.radius.lg,
                  padding:"12px 14px",
                  display:"flex",alignItems:"center",gap:11,
                  cursor:"default",
                }}>
                  <div style={{
                    width:32,height:32,borderRadius:DS.radius.md,
                    background:"linear-gradient(135deg,rgba(99,102,241,0.10),rgba(139,92,246,0.08))",
                    border:"1px solid rgba(99,102,241,0.15)",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:14,flexShrink:0,
                  }}>{f.icon}</div>
                  <span style={{fontSize:13,fontWeight:700,color:DS.color.navy,lineHeight:1.4}}>{f.label}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="hero-cta-row" style={{display:"flex",gap:14,alignItems:"center",flexWrap:"wrap"}}>
              {/* Monthly — white glass */}
              <LiquidBtn variant="white" size="lg" onClick={()=>goTo("/checkout?plan=monthly")}
                style={{whiteSpace:"nowrap",flex:"1 1 auto",minWidth:200,justifyContent:"center"}}>
                Start Monthly for ₹19
              </LiquidBtn>

              {/* Full Year — premium gradient (recommended) */}
              <div style={{position:"relative",flex:"1 1 auto",minWidth:220}}>
                <div style={{
                  position:"absolute",top:"-14px",right:"14px",
                  background:"linear-gradient(135deg,#f59e0b,#ec4899)",
                  color:"#fff",fontSize:10,fontWeight:800,
                  letterSpacing:"0.5px",textTransform:"uppercase",
                  padding:"4px 12px",borderRadius:DS.radius.pill,
                  boxShadow:"0 4px 12px rgba(236,72,153,0.36)",
                  zIndex:5,whiteSpace:"nowrap",
                }}>Recommended</div>
                <LiquidBtn variant="cta" size="lg" onClick={()=>goTo("/checkout?plan=yearly")}
                  style={{width:"100%",justifyContent:"center",animation:"pulse 2.5s infinite"}}>
                  Get Full Year for ₹49
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </LiquidBtn>
              </div>
            </div>

            {/* Trust row */}
            <div style={{display:"flex",gap:20,flexWrap:"wrap",paddingTop:4}}>
              {[
                {i:"🛡️",t:"Secure Payments"},
                {i:"⚡",t:"Instant Download"},
                {i:"🔁",t:"30-Day Support"},
              ].map(({i,t})=>(
                <div key={t} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:DS.color.slateLight,fontWeight:600}}>
                  <span>{i}</span><span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Real Dashboard Preview — ~60%, the hero's main visual ── */}
          <div className="hero-right" style={{flex:"1 1 60%",display:"flex",justifyContent:"center",position:"relative"}}>
            {/* Outer glow */}
            <div style={{position:"absolute",top:-60,left:-60,right:-60,bottom:-60,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(99,102,241,0.16) 0%,transparent 70%)",pointerEvents:"none"}}/>

            {/* "Live Dashboard Preview" pill */}
            <div style={{
              position:"absolute",top:-18,left:"50%",transform:"translateX(-50%)",
              zIndex:10,
              background:"rgba(255,255,255,0.95)",
              border:"1px solid rgba(255,255,255,0.98)",
              padding:"8px 20px",borderRadius:DS.radius.pill,
              fontSize:13,fontWeight:700,color:"#16a34a",
              boxShadow:DS.shadow.glass,
              display:"flex",alignItems:"center",gap:8,
              whiteSpace:"nowrap",
            }}>
              <span style={{width:8,height:8,borderRadius:"50%",background:"#16a34a",boxShadow:"0 0 8px #16a34a",animation:"glassShimmer 2s infinite",display:"inline-block"}}/>
              Live Dashboard Preview
            </div>

            {/* Main glass preview frame — the dashboard IS the hero visual now, no laptop bezel */}
            <div className="hero-dashboard-shell" style={{
              width:"100%",
              maxWidth:980,
              padding:0,
              borderRadius:34,
              position:"relative",
              zIndex:4,
              background:"transparent",
              border:"none",
              boxShadow:"0 38px 110px rgba(99,102,241,0.24), 0 18px 52px rgba(15,23,42,0.12)",
              backdropFilter:"blur(30px) saturate(180%)",
              WebkitBackdropFilter:"blur(30px) saturate(180%)",
            }}>
              <div className="hero-dashboard-frame" style={{
                overflow:"hidden",
                borderRadius:34,
                background:"#f8f7ff",
                border:"1px solid rgba(255,255,255,0.72)",
                aspectRatio:"16 / 9",
                boxShadow:"0 26px 82px rgba(99,102,241,0.18), inset 0 1px 0 rgba(255,255,255,0.82)",
              }}>
                <FrameSequenceHero />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
});

// ═══════════════════════════════════════════════════════════════════
//  DASHBOARD DATA & ANIMATED PREVIEW
// ═══════════════════════════════════════════════════════════════════
const MONTH_DATA = {
  Jan:{income:45000,expenses:32000,cats:[{cat:"Housing",pct:42},{cat:"Food",pct:28},{cat:"Transport",pct:15},{cat:"Other",pct:15}]},
  Feb:{income:48000,expenses:35000,cats:[{cat:"Housing",pct:40},{cat:"Food",pct:30},{cat:"Transport",pct:14},{cat:"Other",pct:16}]},
  Mar:{income:46000,expenses:30000,cats:[{cat:"Housing",pct:40},{cat:"Food",pct:25},{cat:"Transport",pct:13},{cat:"Other",pct:22}]},
  Apr:{income:52000,expenses:38000,cats:[{cat:"Housing",pct:38},{cat:"Food",pct:26},{cat:"Transport",pct:18},{cat:"Other",pct:18}]},
  May:{income:50000,expenses:33000,cats:[{cat:"Housing",pct:41},{cat:"Food",pct:24},{cat:"Transport",pct:16},{cat:"Other",pct:19}]},
  Jun:{income:55000,expenses:36000,cats:[{cat:"Housing",pct:40},{cat:"Food",pct:25},{cat:"Transport",pct:15},{cat:"Other",pct:20}]},
  Jul:{income:53000,expenses:40000,cats:[{cat:"Housing",pct:38},{cat:"Food",pct:28},{cat:"Transport",pct:17},{cat:"Other",pct:17}]},
  Aug:{income:58000,expenses:37000,cats:[{cat:"Housing",pct:39},{cat:"Food",pct:26},{cat:"Transport",pct:14},{cat:"Other",pct:21}]},
  Sep:{income:56000,expenses:34000,cats:[{cat:"Housing",pct:41},{cat:"Food",pct:23},{cat:"Transport",pct:16},{cat:"Other",pct:20}]},
  Oct:{income:60000,expenses:41000,cats:[{cat:"Housing",pct:37},{cat:"Food",pct:29},{cat:"Transport",pct:18},{cat:"Other",pct:16}]},
  Nov:{income:62000,expenses:45000,cats:[{cat:"Housing",pct:36},{cat:"Food",pct:31},{cat:"Transport",pct:17},{cat:"Other",pct:16}]},
  Dec:{income:70000,expenses:55000,cats:[{cat:"Housing",pct:35},{cat:"Food",pct:33},{cat:"Transport",pct:16},{cat:"Other",pct:16}]},
};
const CHART_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const CAT_COLORS = ["#6366f1","#f59e0b","#3b82f6","#ec4899"];

// eslint-disable-next-line no-unused-vars
const DashboardPreview = memo(({ selectedMonth="Jun", onMonthChange }) => {
  const data = MONTH_DATA[selectedMonth];
  const savings = data.income - data.expenses;
  const savingsPct = Math.round((savings/data.income)*100);
  const [animated, setAnimated] = useState(false);
  const fmt = v=>`₹${v.toLocaleString("en-IN")}`;
  useEffect(()=>{ setAnimated(false); const t=setTimeout(()=>setAnimated(true),50); return()=>clearTimeout(t); },[selectedMonth]);

  return (
    <div className="glass-card" style={{borderRadius:DS.radius["2xl"],padding:18,background:DS.grad.glass,border:"1px solid rgba(255,255,255,0.85)"}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div>
          <div style={{fontFamily:DS.font.body,fontSize:14,fontWeight:800,color:DS.color.navy,letterSpacing:"-0.01em"}}>Smart Expense Tracker</div>
          <div style={{fontSize:10,color:DS.color.slateLight,marginTop:2}}>{selectedMonth} 2026 · Income, expenses, savings</div>
        </div>
        {onMonthChange?(
          <select value={selectedMonth} onChange={e=>onMonthChange(e.target.value)} style={{
            background:"rgba(255,255,255,0.80)",color:DS.color.navy,border:"1px solid rgba(15,23,42,0.10)",
            borderRadius:DS.radius.pill,padding:"5px 14px",fontSize:10,fontWeight:700,cursor:"pointer",
          }}>
            {CHART_MONTHS.map(m=><option key={m} value={m}>{m} 2026</option>)}
          </select>
        ):<Badge color="rgba(99,102,241,0.09)" text="#4338ca">{selectedMonth} 2026</Badge>}
      </div>

      {/* KPI cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
        {[
          {l:"Income",  v:fmt(data.income),   c:DS.color.mint,   bg:DS.color.mintLight,    icon:"↑"},
          {l:"Expenses",v:fmt(data.expenses), c:"#ef4444",       bg:"rgba(239,68,68,0.08)", icon:"↓"},
          {l:"Savings", v:fmt(savings),        c:DS.color.purple, bg:DS.color.purpleLight,  icon:`${savingsPct}%`},
        ].map(m=>(
          <div key={m.l} style={{
            background:m.bg,borderRadius:DS.radius.lg,padding:"10px 8px",
            border:"1px solid rgba(255,255,255,0.80)",
            animation:animated?"countUp 0.4s ease":"none",
          }}>
            <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:22,height:22,borderRadius:DS.radius.sm,background:"rgba(255,255,255,0.60)",marginBottom:5}}>
              <span style={{fontSize:9,fontWeight:800,color:m.c}}>{m.icon}</span>
            </div>
            <div style={{fontSize:9,color:DS.color.slateLight,fontWeight:600}}>{m.l}</div>
            <div style={{fontFamily:DS.font.number,fontSize:13,fontWeight:900,color:m.c,marginTop:1}}>{m.v}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{background:"rgba(255,255,255,0.65)",borderRadius:DS.radius.lg,padding:"12px 10px",marginBottom:10,border:"1px solid rgba(255,255,255,0.80)"}}>
        <div style={{fontSize:9,fontWeight:700,color:DS.color.slateLight,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em"}}>Income vs Expenses · All Months</div>
        <div style={{display:"flex",alignItems:"flex-end",gap:3,height:68}}>
          {CHART_MONTHS.map(m=>{
            const d=MONTH_DATA[m]; const maxV=75000;
            const iH=animated?`${(d.income/maxV)*68}px`:"0";
            const eH=animated?`${(d.expenses/maxV)*68}px`:"0";
            const sel=m===selectedMonth;
            return (
              <div key={m} style={{flex:1,display:"flex",gap:1.5,alignItems:"flex-end",cursor:"pointer"}} onClick={()=>onMonthChange&&onMonthChange(m)}>
                <div style={{flex:1,background:sel?DS.color.mint:`${DS.color.mint}44`,borderRadius:"2px 2px 0 0",height:iH,transition:`height 0.5s ${DS.ease.spring}`,minHeight:2}}/>
                <div style={{flex:1,background:sel?"#ef4444":"rgba(239,68,68,0.35)",borderRadius:"2px 2px 0 0",height:eH,transition:`height 0.5s ${DS.ease.spring} 0.08s`,minHeight:2}}/>
              </div>
            );
          })}
        </div>
        <div style={{display:"flex",gap:4,marginTop:5}}>
          {CHART_MONTHS.map(m=>(
            <div key={m} style={{flex:1,fontSize:7,color:m===selectedMonth?DS.color.mintText:DS.color.slateLight,textAlign:"center",fontWeight:m===selectedMonth?800:400}}>{m}</div>
          ))}
        </div>
        <div style={{display:"flex",gap:10,marginTop:6}}>
          {[{c:DS.color.mint,l:"Income"},{c:"#ef4444",l:"Expenses"}].map(x=>(
            <div key={x.l} style={{display:"flex",gap:4,alignItems:"center"}}>
              <div style={{width:7,height:7,borderRadius:1.5,background:x.c}}/><span style={{fontSize:9,color:DS.color.slateLight,fontWeight:600}}>{x.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      <div style={{background:"rgba(255,255,255,0.65)",borderRadius:DS.radius.lg,padding:"12px 10px",border:"1px solid rgba(255,255,255,0.80)"}}>
        <div style={{fontSize:9,fontWeight:700,color:DS.color.slateLight,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em"}}>Spending Breakdown</div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div style={{width:44,height:44,borderRadius:"50%",flexShrink:0,background:`conic-gradient(${data.cats.map((c,i)=>`${CAT_COLORS[i]} ${i===0?0:data.cats.slice(0,i).reduce((a,b)=>a+b.pct,0)}% ${data.cats.slice(0,i+1).reduce((a,b)=>a+b.pct,0)}%`).join(",")})`}}/>
          <div style={{flex:1,display:"grid",gap:3}}>
            {data.cats.map((c,i)=>(
              <div key={c.cat} style={{display:"flex",justifyContent:"space-between"}}>
                <div style={{display:"flex",gap:5,alignItems:"center"}}>
                  <div style={{width:6,height:6,borderRadius:1.5,background:CAT_COLORS[i]}}/><span style={{fontSize:9,color:DS.color.slateLight}}>{c.cat}</span>
                </div>
                <span style={{fontFamily:DS.font.number,fontSize:9,fontWeight:700,color:DS.color.navy}}>{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════
//  NAVIGATION — Liquid Glass Apple-style
// ═══════════════════════════════════════════════════════════════════
const Nav = memo(() => {
  const [scrolled,setScrolled]   = useState(false);
  const [mobileOpen,setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>20);
    window.addEventListener("scroll",fn,{passive:true});
    return()=>window.removeEventListener("scroll",fn);
  },[]);
  useEffect(()=>setMobileOpen(false),[location]);

  const goTo=(p)=>{navigate(p);window.scrollTo({top:0,behavior:"smooth"});};
  const navLinks=[{id:"/",label:"Home"},{id:"/product",label:"Product"}];

  return (
    <>
      <nav style={{
        position:"sticky",top:0,zIndex:200,
        background:scrolled?"rgba(255,255,255,0.92)":"rgba(255,255,255,0.72)",
        backdropFilter:"blur(24px) saturate(180%)",
        WebkitBackdropFilter:"blur(24px) saturate(180%)",
        borderBottom:`1px solid ${scrolled?"rgba(15,23,42,0.08)":"rgba(255,255,255,0.60)"}`,
        boxShadow:scrolled?DS.shadow.sm:"none",
        transition:`all 0.3s ${DS.ease.smooth}`,
      }}>
        <div style={{maxWidth:1180,margin:"0 auto",padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:66}}>
          {/* Logo */}
          <button onClick={()=>goTo("/")} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:10,padding:0}}>
            <div style={{
              background:DS.grad.cta,
              borderRadius:DS.radius.lg,
              padding:"8px 12px",
              color:"#fff",
              fontSize:17,
              boxShadow:"0 4px 14px rgba(99,102,241,0.35)",
            }}>📊</div>
            <span className="brand-wordmark-3d" style={{fontFamily:DS.font.body,fontWeight:900,fontSize:20,color:DS.color.navy,letterSpacing:0}}>
              Budget<span className="brand-pro-outline" style={{color:"#4f46e5",WebkitTextFillColor:"#4f46e5"}}>Pro</span>
            </span>
          </button>

          {/* Center nav pills */}
          <div className="nav-desktop glass-nav-shell" style={{display:"flex",gap:4,alignItems:"center",background:"rgba(248,251,255,0.80)",borderRadius:DS.radius.pill,padding:"4px",border:"1px solid rgba(15,23,42,0.07)",backdropFilter:"blur(12px)"}}>
            {navLinks.map(l=>{
              const isActive = l.id==="/"?path==="/":path.startsWith(l.id.split("#")[0]);
              return (
                <button key={l.id} onClick={()=>goTo(l.id)} className={`nav-item ${isActive?"active":""}`}
                  style={{background:"transparent",border:"1px solid transparent",cursor:"pointer",padding:"7px 16px",fontWeight:600,color:DS.color.slate,fontSize:14,fontFamily:"inherit"}}>
                  {l.label}
                </button>
              );
            })}
          </div>

          {/* Right CTAs */}
          <div className="nav-desktop" style={{display:"flex",gap:10,alignItems:"center"}}>
            <LiquidBtn variant="white" size="sm" onClick={()=>goTo("/checkout?plan=monthly")}>Monthly ₹19</LiquidBtn>
            <LiquidBtn className="nav-year-cta" variant="premium" size="sm" onClick={()=>goTo("/checkout?plan=yearly")}
              style={{padding:"9px 22px",boxShadow:"0 18px 38px rgba(79,70,229,0.34), 0 7px 18px rgba(15,23,42,0.12), inset 0 1px 0 rgba(255,255,255,0.70), inset 0 -14px 26px rgba(59,130,246,0.24)"}}>Full Year ₹49</LiquidBtn>
            <button className="premium-btn nav-orb-btn" onClick={()=>goTo("/admin")} style={{borderRadius:"50%",cursor:"pointer",padding:"9px",display:"flex",alignItems:"center",backdropFilter:"blur(16px) saturate(180%)",WebkitBackdropFilter:"blur(16px) saturate(180%)"}}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            </button>
          </div>

          {/* Hamburger */}
          <button className="mobile-nav-btn" onClick={()=>setMobileOpen(!mobileOpen)}
            style={{display:"none",background:"none",border:"none",cursor:"pointer",padding:8}} aria-label="Toggle nav">
            <Icon name={mobileOpen?"close":"menu"} size={22} color={DS.color.navy}/>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen&&(
        <div style={{position:"fixed",top:66,left:0,right:0,background:"rgba(255,255,255,0.97)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",zIndex:199,borderBottom:`1px solid ${DS.color.border}`,padding:"16px 20px",animation:"slideDown 0.22s ease",boxShadow:DS.shadow.lg}}>
          {navLinks.map(l=>(
            <button key={l.id} onClick={()=>goTo(l.id)}
              style={{display:"block",width:"100%",textAlign:"left",background:path===l.id?"rgba(99,102,241,0.08)":"transparent",border:"none",cursor:"pointer",padding:"12px 16px",borderRadius:DS.radius.lg,fontWeight:600,color:path===l.id?DS.color.mintText:DS.color.slate,fontSize:15,marginBottom:3,fontFamily:"inherit"}}>
              {l.label}
            </button>
          ))}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
            <LiquidBtn variant="white" onClick={()=>goTo("/checkout?plan=monthly")} style={{width:"100%",justifyContent:"center"}}>Monthly ₹19</LiquidBtn>
            <LiquidBtn variant="cta"   onClick={()=>goTo("/checkout?plan=yearly")}  style={{width:"100%",justifyContent:"center"}}>Full Year ₹49</LiquidBtn>
          </div>
        </div>
      )}
    </>
  );
});

// ═══════════════════════════════════════════════════════════════════
//  STICKY CTA — glass floating pill
// ═══════════════════════════════════════════════════════════════════
const StickyCTA = memo(({ visible }) => {
  const navigate = useNavigate();
  const goTo = p => { navigate(p); window.scrollTo({top:0,behavior:"smooth"}); };
  return (
    <div className="sticky-cta" style={{
      position:"fixed",bottom:24,right:24,zIndex:300,
      display:visible?"flex":"none",
      background:"rgba(255,255,255,0.92)",
      backdropFilter:"blur(24px) saturate(180%)",
      WebkitBackdropFilter:"blur(24px) saturate(180%)",
      border:"1px solid rgba(255,255,255,0.90)",
      borderRadius:DS.radius["2xl"],
      padding:"14px 18px",
      gap:12,alignItems:"center",
      boxShadow:DS.shadow.glassLg,
      animation:"slideDown 0.3s ease",
      maxWidth:330,
    }}>
      <div>
        <div style={{color:DS.color.navy,fontWeight:800,fontSize:13}}>🎯 Smart Expense Tracker</div>
        <div style={{color:DS.color.slateLight,fontSize:11,marginTop:2}}>Full year for just ₹49</div>
      </div>
      <LiquidBtn variant="cta" size="sm" onClick={()=>goTo("/checkout?plan=yearly")} style={{animation:"pulse 2s infinite",whiteSpace:"nowrap"}}>Get ₹49</LiquidBtn>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════
//  PRICING CARD — liquid glass with shimmer CTA
// ═══════════════════════════════════════════════════════════════════
const PricingCard = memo(({ plan }) => {
  const navigate = useNavigate();
  const goTo = p => { navigate(p); window.scrollTo({top:0,behavior:"smooth"}); };
  const hl = plan.highlight;

  return (
    <div className={`glass-card card-lift ${hl?"scale-in":""}`} style={{
      borderRadius:DS.radius["3xl"],
      padding:"40px 36px",
      position:"relative",overflow:"hidden",
      background:hl?"linear-gradient(145deg,rgba(99,102,241,0.06),rgba(139,92,246,0.04),rgba(255,255,255,0.95))":DS.grad.glass,
      border:hl?"1.5px solid rgba(99,102,241,0.22)":"1px solid rgba(255,255,255,0.85)",
      boxShadow:hl?`${DS.shadow.glassLg}, 0 0 60px rgba(99,102,241,0.12)`:DS.shadow.glass,
      transform:hl?"scale(1.03)":"scale(1)",
    }}>
      {hl&&(
        <>
          <div style={{position:"absolute",top:-60,right:-60,width:220,height:220,borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,0.12),transparent 70%)",pointerEvents:"none",animation:"orb 14s ease-in-out infinite"}}/>
          <div style={{position:"absolute",bottom:-40,left:-40,width:160,height:160,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,0.10),transparent 70%)",pointerEvents:"none",animation:"orb 10s ease-in-out infinite reverse"}}/>
          <div style={{position:"absolute",top:0,right:28,background:DS.grad.gold,color:"#fff",fontSize:10,fontWeight:800,padding:"5px 16px 9px",borderRadius:"0 0 14px 14px",boxShadow:"0 4px 12px rgba(245,158,11,0.35)",letterSpacing:"0.04em"}}>⭐ BEST VALUE</div>
        </>
      )}
      <div style={{position:"relative",zIndex:1}}>
        <Badge className="pricing-card-kicker" color={hl?"rgba(79,70,229,0.12)":"rgba(59,130,246,0.10)"} text={hl?"#4338ca":"#2563eb"}>{plan.badge}</Badge>
        <h3 className={`pricing-title-gradient ${hl?"hot":""}`} style={{fontFamily:DS.font.heading,fontSize:DS.type.h4,fontWeight:900,color:hl?undefined:DS.color.navy,margin:"14px 0 4px",letterSpacing:0}}>{plan.name}</h3>
        <p className="pricing-desc-vivid" style={{fontSize:DS.type.sm,color:DS.color.slate,marginBottom:24,lineHeight:1.6}}>{plan.desc}</p>
        <div style={{display:"flex",alignItems:"flex-end",gap:10,marginBottom:6}}>
          <span className="pricing-price-vivid" style={{fontFamily:DS.font.number,fontSize:58,fontWeight:900,color:DS.color.navy,lineHeight:1,letterSpacing:0}}>₹{plan.price}</span>
          <div style={{paddingBottom:10}}>
            <div style={{fontFamily:DS.font.number,color:DS.color.slateLight,textDecoration:"line-through",fontSize:18,fontWeight:600}}>₹{plan.original}</div>
            <Badge color="rgba(239,68,68,0.08)" text="#dc2626">{plan.discount} OFF</Badge>
          </div>
        </div>
        <div style={{fontSize:DS.type.xs,color:hl?"#4f46e5":"#2563eb",fontWeight:800,marginBottom:28}}>One-time payment · Instant download</div>
        <ul style={{listStyle:"none",marginBottom:32,display:"grid",gap:11}}>
          {plan.features.map(f=>(
            <li key={f} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
              <div style={{background:"rgba(99,102,241,0.10)",borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                <Icon name="check" size={11} color="#4338ca"/>
              </div>
              <span style={{color:hl?"#334155":"#475569",fontSize:DS.type.sm,lineHeight:1.6,fontWeight:650}}>{f}</span>
            </li>
          ))}
        </ul>
        <LiquidBtn className="pricing-cta-glass" variant="outline" size="lg" onClick={()=>goTo(`/checkout?plan=${plan.id}`)}
          style={{
            width:"100%",
            justifyContent:"center",
            color:"#4c1d95",
            animation:"none",
          }}>
          <Icon name={hl?"bag":"download"} size={18} color="#4c1d95"/>
          {plan.cta}
        </LiquidBtn>
      </div>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════
const homeTestimonials = [
  {
    id: "priya-sharma",
    name: "Priya Sharma",
    initials: "PS",
    role: "Homemaker, Mumbai",
    city: "",
    text: "This dashboard changed how I manage our family budget. I finally know where every rupee goes. Worth 10x the price!",
    rating: 5,
    plan: null,
    verified: false,
    approved: true,
    date: null,
  },
  {
    id: "rahul-verma",
    name: "Rahul Verma",
    initials: "RV",
    role: "Software Engineer, Bangalore",
    city: "",
    text: "Worth every rupee. My savings went from 8% to 31% in just 4 months. Smart Expense Tracker is a game changer.",
    rating: 5,
    plan: null,
    verified: false,
    approved: true,
    date: null,
  },
  {
    id: "ananya-patel",
    name: "Ananya Patel",
    initials: "AP",
    role: "Freelancer, Ahmedabad",
    city: "",
    text: "Finally an expense tracker that doesn't feel overwhelming. Set it up in 10 minutes and I've been using it every day.",
    rating: 5,
    plan: null,
    verified: false,
    approved: true,
    date: null,
  },
  {
    id: "deepak-singh",
    name: "Deepak Singh",
    initials: "DS",
    role: "Teacher, Delhi",
    city: "",
    text: "My savings rate went from 10% to 28% in 3 months! I could finally afford my dream vacation.",
    rating: 5,
    plan: null,
    verified: false,
    approved: true,
    date: null,
  },
];

const VERIFIED_PURCHASE_COUNT = Number(
  process.env.REACT_APP_VERIFIED_PURCHASE_COUNT || 0
);

const VERIFIED_WEEKLY_PURCHASE_COUNT = Number(
  process.env.REACT_APP_VERIFIED_WEEKLY_PURCHASE_COUNT || 0
);

const TestimonialCard = memo(({ t }) => {
  const numericRating = Number(t.rating);
  const rating = Number.isFinite(numericRating) ? Math.max(0, Math.min(5, numericRating)) : null;
  const metadata = [t.role, t.city].filter(Boolean).join(" | ");
  const initials = t.initials || t.avatar || t.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const quote = t.quote || t.text;

  return (
    <article className="bp-home-review-card" aria-label={`Customer story from ${t.name}`}>
      <div className="bp-home-review-card__quote" aria-hidden="true">"</div>
      {rating !== null && (
        <div className="bp-home-review-card__rating" aria-label={`${rating} out of 5 stars`}>
          {Array.from({ length: 5 }, (_, index) => {
            const isFilled = index < Math.round(rating);

            return (
              <span
                key={index}
                className={`bp-home-review-card__star ${isFilled ? "is-filled" : "is-empty"}`}
                aria-hidden="true"
              >
                <Icon name="star" size={15} color="currentColor" filled={isFilled} />
              </span>
            );
          })}
        </div>
      )}
      <p className="bp-home-review-card__text">"{quote}"</p>
      <div className="bp-home-review-card__footer">
        <div className="bp-home-review-card__avatar" aria-hidden="true">{initials}</div>
        <div className="bp-home-review-card__person">
          <strong>{t.name}</strong>
          {metadata && <span>{metadata}</span>}
        </div>
      </div>
      {(t.verified === true || t.plan) && (
        <div className="bp-home-review-card__meta">
          {t.verified === true && <span className="bp-home-review-card__pill">Verified Purchase</span>}
          {t.plan && <span className="bp-home-review-card__pill">{t.plan}</span>}
        </div>
      )}
    </article>
  );
});

//  HOME PAGE
// ═══════════════════════════════════════════════════════════════════
const HomePage = memo(() => {
  const navigate = useNavigate();
  const goTo = p => { navigate(p); window.scrollTo({top:0,behavior:"smooth"}); };
  const [stickyVisible,setStickyVisible] = useState(false);

  useEffect(()=>{
    const fn=()=>{
      const hero = document.querySelector("[data-hero-scroll-sequence]");
      const threshold = hero
        ? hero.offsetTop + hero.offsetHeight - window.innerHeight * 0.75
        : 500;
      setStickyVisible(window.scrollY > threshold);
    };
    fn();
    window.addEventListener("scroll",fn,{passive:true});
    window.addEventListener("resize",fn);
    return()=>{
      window.removeEventListener("scroll",fn);
      window.removeEventListener("resize",fn);
    };
  },[]);

  const approvedTestimonials = homeTestimonials.filter((t) => t.approved !== false);
  const hasVerifiedPurchaseCount =
    Number.isFinite(VERIFIED_PURCHASE_COUNT) && VERIFIED_PURCHASE_COUNT > 0;
  const hasVerifiedWeeklyPurchaseCount =
    Number.isFinite(VERIFIED_WEEKLY_PURCHASE_COUNT) && VERIFIED_WEEKLY_PURCHASE_COUNT > 0;
  const hasPurchaseActivity = hasVerifiedPurchaseCount || hasVerifiedWeeklyPurchaseCount;
  const purchaseFormatter = new Intl.NumberFormat("en-IN");
  const proofInitials = approvedTestimonials
    .slice(0, 3)
    .map((t) => t.initials || t.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase());

  const benefits=[
    {icon:"trending",title:"Track Every Rupee",       desc:"See exactly where your money goes with automatic categorization. No more month-end surprises."},
    {icon:"zap",     title:"Instant Visual Insights", desc:"Beautiful charts that make your finances crystal clear. Understand your money in seconds."},
    {icon:"shield",  title:"100% Private & Secure",   desc:"Your data stays on your device. No cloud, no subscriptions, no data selling. Ever."},
    {icon:"star",    title:"Beginner Friendly",       desc:"No finance degree needed. If you can open Excel, you can master your budget."},
    {icon:"download",title:"Instant Download",        desc:"Pay once, download immediately. No waiting, no signup, no monthly fees."},
    {icon:"check",   title:"Lifetime Access",         desc:"Buy once, use forever. Free updates whenever we improve Smart Expense Tracker."},
  ];

  const plans=[
    {id:"monthly",name:"Monthly Tracker",badge:"Perfect for Beginners",price:19,original:299,discount:"94%",
      desc:"Single-month expense tracking — fastest way to start.",cta:"Start Tracking for ₹19",highlight:false,
      features:["1 Month Smart Expense Tracker","Income & Expense Tracking","Category Breakdown Charts","Savings Goal Tracker","Works on Excel + Google Sheets","Instant Download"]},
    {id:"yearly",name:"Full Year Tracker",badge:"12 Months + Yearly View",price:49,original:999,discount:"95%",
      desc:"Complete annual tracking with yearly overview — best for serious savers.",cta:"Download Full Year — ₹49",highlight:true,
      features:["All 12 Months Included","Annual Overview Dashboard","Year-on-Year Comparison","Better Savings Tracking","Category Trend Analysis","Priority Email Support","Free Future Updates","Instant Download"]},
  ];

  const trustBadges=[{icon:"🔒",text:"256-bit SSL"},{icon:"⚡",text:"Instant Download"},{icon:"♾️",text:"Lifetime Access"},{icon:"💳",text:"Razorpay Secured"},{icon:"📱",text:"Works on Mobile"}];

  return (
    <div style={{animation:"fadeIn 0.4s ease"}}>
      <StickyCTA visible={stickyVisible}/>

      {/* HERO */}
      <HeroScrollSequence />

      {/* VALUE STRIP */}
      <div style={{background:"linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899,#8b5cf6,#6366f1)",backgroundSize:"300% 100%",animation:"gradShift 5s ease infinite",padding:"13px 20px",textAlign:"center"}}>
        <span style={{color:"#fff",fontSize:DS.type.sm,fontWeight:700}}><strong>Instant download</strong> with GST included and payment handled securely by Razorpay.</span>
      </div>

      {/* PRICING */}
      <section id="pricing" style={{padding:"96px 20px",background:DS.grad.section}}>
        <div style={{maxWidth:920,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:60}}>
            <Badge style={{marginBottom:16}}>Choose Your Plan</Badge>
            <h2 style={{fontFamily:DS.font.heading,fontSize:DS.type.h2,fontWeight:900,color:DS.color.navy,lineHeight:1.12,marginBottom:16,letterSpacing:"-0.02em"}}>
              Feels like a <span style={{background:DS.grad.cta,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>₹999 product.</span><br/>Priced for everyone.
            </h2>
            <p style={{color:DS.color.slateLight,fontSize:17,maxWidth:480,margin:"0 auto",lineHeight:1.7}}>Pick the plan that fits your goals. Both include instant download and lifetime access.</p>
          </div>
          <div className="pricing-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:28,alignItems:"center"}}>
            {plans.map(plan=><PricingCard key={plan.id} plan={plan}/>)}
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:36,marginTop:52,flexWrap:"wrap"}}>
            {trustBadges.map(b=>(
              <div key={b.text} style={{display:"flex",alignItems:"center",gap:7}}>
                <span style={{fontSize:16}}>{b.icon}</span>
                <span style={{fontSize:DS.type.sm,color:DS.color.slateLight,fontWeight:600}}>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE DEMO — real Annual Dashboard preview */}
      <section style={{padding:"80px 20px",background:"#ffffff",position:"relative",overflow:"hidden"}}>
        <GlassBubble size={160} style={{ top:"12%", right:"6%" }} />
        <GlassBubble size={70}  style={{ bottom:"8%", left:"4%", animationDelay:"2s" }} />
        <div style={{maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2}}>
          <div style={{textAlign:"center",marginBottom:52}}>
            <Badge style={{marginBottom:16}}>Live Demo</Badge>
            <h2 style={{fontFamily:DS.font.heading,fontSize:DS.type.h2,fontWeight:900,color:DS.color.navy,marginBottom:12,letterSpacing:"-0.02em"}}>Annual Dashboard Preview</h2>
            <p style={{color:DS.color.slateLight,fontSize:16,lineHeight:1.7,maxWidth:640,margin:"0 auto"}}>See the full-year view with income, expenses, savings, debt, spending trends, and smart money insights.</p>
          </div>
          <div style={{position:"relative",display:"flex",justifyContent:"center"}}>
            <div style={{position:"absolute",top:-40,left:-40,right:-40,bottom:-40,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(139,92,246,0.14) 0%,transparent 70%)",pointerEvents:"none"}}/>
            <div className="dashboard-demo-3d" style={{
              width:"100%",maxWidth:1040,padding:0,borderRadius:34,position:"relative",zIndex:2,
              background:"transparent",
              border:"none",
              boxShadow:"0 30px 90px rgba(139,92,246,0.16), 0 12px 34px rgba(15,23,42,0.10)",
              backdropFilter:"none",
              WebkitBackdropFilter:"none",
            }}>
              <div className="dashboard-demo-frame" style={{
                overflow:"hidden",borderRadius:30,background:"#fff",
                border:"none",
                aspectRatio:"1536 / 1024",
                boxShadow:"0 22px 70px rgba(67,56,202,0.14)",
              }}>
                <DashboardImage type="annual" loading="eager" fit="cover" position="center top" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section style={{padding:"80px 20px",background:DS.grad.section}}>
        <div style={{maxWidth:980,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:60}}>
            <Badge style={{marginBottom:16}}>Why BudgetPro</Badge>
            <h2 style={{fontFamily:DS.font.heading,fontSize:DS.type.h2,fontWeight:900,color:DS.color.navy,letterSpacing:"-0.02em",marginBottom:12}}>Everything You Need to Win With Money</h2>
            <p style={{color:DS.color.slateLight,fontSize:16,lineHeight:1.7}}>Built for Indians who want to get serious about their finances</p>
          </div>
          <div className="benefits-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:22}}>
            {benefits.map((b,i)=>(
              <div key={b.title} className="glass-card card-lift" style={{borderRadius:DS.radius["2xl"],padding:"22px",display:"flex",gap:14,alignItems:"flex-start",animation:`fadeInUp 0.5s ${DS.ease.out} ${i*0.07}s both`}}>
                <div style={{background:`linear-gradient(135deg,rgba(99,102,241,0.10),rgba(139,92,246,0.07))`,borderRadius:DS.radius.lg,padding:12,flexShrink:0,border:"1px solid rgba(99,102,241,0.12)"}}>
                  <Icon name={b.icon} size={22} color="#4338ca"/>
                </div>
                <div>
                  <div style={{fontWeight:800,color:DS.color.navy,marginBottom:6,fontSize:15}}>{b.title}</div>
                  <div style={{color:DS.color.slateLight,fontSize:DS.type.sm,lineHeight:1.7}}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bp-home-reviews" aria-labelledby="home-reviews-title">
        <div className="bp-home-reviews__inner">
          <div className="bp-home-reviews__header">
            <Badge>Customer Stories</Badge>
            <h2 id="home-reviews-title" className="reviews-heading-premium" style={{fontSize:DS.type.h2,color:DS.color.navy,margin:0}}>
              What BudgetPro Customers Say
            </h2>
            <p>Real experiences from people using BudgetPro to understand their monthly spending and plan with greater clarity.</p>
          </div>
          <div className="bp-home-reviews__proof" aria-label="BudgetPro purchase activity">
            <span className="bp-proof-avatars" aria-hidden="true">
              {proofInitials.map((initials) => (
                <span key={initials}>{initials}</span>
              ))}
            </span>
            {hasVerifiedPurchaseCount && (
              <span className="bp-proof-stat">
                <strong>{purchaseFormatter.format(VERIFIED_PURCHASE_COUNT)}+</strong>
                people have purchased this template
              </span>
            )}
            {hasVerifiedPurchaseCount && hasVerifiedWeeklyPurchaseCount && (
              <span className="bp-proof-divider" aria-hidden="true" />
            )}
            {hasVerifiedWeeklyPurchaseCount && (
              <span className="bp-proof-weekly">
                <span className="bp-proof-live-dot" aria-hidden="true" />
                <strong>{purchaseFormatter.format(VERIFIED_WEEKLY_PURCHASE_COUNT)}</strong>
                purchased this week
              </span>
            )}
            {!hasPurchaseActivity && (
              <span className="bp-proof-fallback">
                Helping BudgetPro customers build clearer money habits.
              </span>
            )}
            <span
              className="bp-proof-rating"
              aria-label="4.5 out of 5. Very Good based on 6,291 ratings by Verified Buyers"
            >
              <strong>
                <span>4.5</span>
                <span className="bp-proof-rating-star" aria-hidden="true">★</span>
              </strong>
              <span>Very Good</span>
              <small>based on 6,291 ratings by Verified Buyers</small>
            </span>
          </div>
          <div className="bp-home-reviews__grid">
            {approvedTestimonials.map((t) => (
              <TestimonialCard key={t.id} t={t} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{display:"none",padding:"80px 20px",background:DS.grad.section}}>
        <div style={{maxWidth:760,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:44}}>
            <Badge style={{marginBottom:16}}>Questions</Badge>
            <h2 style={{fontFamily:DS.font.heading,fontSize:DS.type.h2,fontWeight:900,color:DS.color.navy,letterSpacing:"-0.02em",marginBottom:10}}>Frequently Asked Questions</h2>
            <p style={{color:DS.color.slateLight,fontSize:16,lineHeight:1.7}}>Everything you need to know before you buy</p>
          </div>
          <div style={{display:"grid",gap:12}}>
            {[
              {q:"Do I need Excel to use this?",a:"No — Smart Expense Tracker works in both Microsoft Excel (2016+) and Google Sheets. Just open the file and start tracking."},
              {q:"Is this a subscription?",a:"No. It's a one-time purchase. Pay once, download instantly, and use it forever with free future updates."},
              {q:"What's the difference between Monthly and Full Year?",a:"Monthly gives you a single month's tracker to get started. Full Year includes all 12 months plus an annual overview dashboard for year-on-year comparison."},
              {q:"Is my financial data safe?",a:"Yes — everything stays in your own Excel or Google Sheets file on your device. We never see or store your personal financial data."},
              {q:"What if I need help setting it up?",a:"Every purchase includes email support. Just reach out via the Contact Us link and we'll help you get started."},
            ].map((item,i)=>(
              <details key={i} className="glass-card" style={{borderRadius:DS.radius.xl,padding:"18px 22px",cursor:"pointer"}}>
                <summary style={{fontWeight:700,color:DS.color.navy,fontSize:15,listStyle:"none",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
                  {item.q}
                  <Icon name="chevronDown" size={16} color={DS.color.slateLight} style={{flexShrink:0}}/>
                </summary>
                <p style={{color:DS.color.slateLight,fontSize:DS.type.sm,lineHeight:1.7,marginTop:12}}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{padding:"96px 20px",textAlign:"center",position:"relative",overflow:"hidden",background:DS.grad.hero}}>
        <div style={{position:"absolute",top:-80,right:-80,width:450,height:450,borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,0.10),transparent 70%)",animation:"orb 14s ease-in-out infinite",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:-60,left:-60,width:360,height:360,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,0.09),transparent 70%)",animation:"orb 11s ease-in-out infinite reverse",pointerEvents:"none"}}/>
        <div style={{maxWidth:640,margin:"0 auto",position:"relative",zIndex:1}}>
          <div style={{fontSize:52,marginBottom:24,animation:"float 4s ease-in-out infinite"}}>💰</div>
          <h2 style={{fontFamily:DS.font.heading,fontSize:DS.type.h2,fontWeight:900,color:DS.color.navy,marginBottom:18,letterSpacing:"-0.02em",lineHeight:1.15}}>
            Ready to <span style={{background:DS.grad.cta,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>transform your finances</span>?
          </h2>
          <p style={{color:DS.color.slateLight,fontSize:17,marginBottom:44,lineHeight:1.75}}>Start with a private spreadsheet dashboard built for monthly clarity, annual planning, and faster money reviews.</p>
          <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
            <LiquidBtn variant="white" size="lg" onClick={()=>goTo("/checkout?plan=monthly")} style={{minWidth:200,justifyContent:"center"}}>Start Monthly for ₹19</LiquidBtn>
            <LiquidBtn variant="cta"   size="lg" onClick={()=>goTo("/checkout?plan=yearly")}  style={{minWidth:220,justifyContent:"center",animation:"pulse 2s infinite"}}>Get Full Year for ₹49</LiquidBtn>
          </div>
          <div style={{marginTop:28,color:DS.color.slateLight,fontSize:DS.type.sm}}>🔒 Secure payment · Instant download · 100% satisfaction</div>
        </div>
      </section>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════
//  PRODUCT PAGE
// ═══════════════════════════════════════════════════════════════════
const ProductPage = memo(() => {
  const navigate = useNavigate();
  const goTo = useCallback((p) => { navigate(p); window.scrollTo({top:0,behavior:"smooth"}); }, [navigate]);
  const [selectedPlan,setSelectedPlan] = useState("yearly");
  const [activePreview,setActivePreview] = useState("annual");
  const [previewOpen,setPreviewOpen] = useState(false);
  const [dockVisible,setDockVisible] = useState(false);
  const [livePrices,setLivePrices] = useState({
    monthly:{price:19,original:299,discount:"94% OFF",desc:"One monthly tracker with core income, expense, category, and savings views.",label:"Monthly Smart Expense Tracker"},
    yearly: {price:49,original:999,discount:"95% OFF",desc:"12 monthly trackers plus one complete annual dashboard.",label:"Full Year Smart Expense Tracker"},
  });
  const stageRef = useRef(null);
  const primaryCtaRef = useRef(null);
  const previewTriggerRef = useRef(null);
  const lastFocusedRef = useRef(null);
  const modalPanelRef = useRef(null);
  const modalCloseRef = useRef(null);
  const previewType = activePreview === "monthly" ? "monthly" : "annual";
  const selectedPreview = DASHBOARD_PREVIEWS[previewType];
  const previewViews = [
    {id:"monthly",label:"Monthly Dashboard",type:"monthly"},
    {id:"annual",label:"Annual Dashboard",type:"annual"},
    {id:"expense",label:"Expense Entry",type:"annual"},
    {id:"savings",label:"Savings Overview",type:"annual"},
  ];
  const selectedPlanData = livePrices[selectedPlan];
  const currentOriginal = selectedPlanData.original;
  const currentPrice = selectedPlanData.price;
  const currentDiscount = currentOriginal - currentPrice;

  useEffect(()=>{
    fetch("/api/settings").then(r=>r.json()).then(data=>{
      setLivePrices(prev=>({
        monthly:{...prev.monthly,price:data?.monthly?.price??prev.monthly.price},
        yearly: {...prev.yearly, price:data?.yearly?.price ??prev.yearly.price},
      }));
    }).catch(()=>{});
  },[]);

  useEffect(()=>{
    if (!primaryCtaRef.current || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry])=>{
      setDockVisible(!entry.isIntersecting);
    }, { threshold: 0.2 });
    observer.observe(primaryCtaRef.current);
    return ()=>observer.disconnect();
  },[]);

  const selectPlan = useCallback((planId)=>{
    setSelectedPlan(planId);
    setActivePreview(planId === "monthly" ? "monthly" : "annual");
  },[]);

  const buySelectedPlan = useCallback(()=>{
    goTo(`/checkout?plan=${selectedPlan}`);
  },[goTo,selectedPlan]);

  const openPreview = useCallback(()=>{
    lastFocusedRef.current = document.activeElement;
    setPreviewOpen(true);
  },[]);

  const closePreview = useCallback(()=>{
    setPreviewOpen(false);
    window.setTimeout(()=>{
      const target = lastFocusedRef.current || previewTriggerRef.current;
      if (target && typeof target.focus === "function") target.focus();
    }, 0);
  },[]);

  useEffect(()=>{
    if(!previewOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    const onKeyDown = e => {
      if(e.key === "Escape") {
        closePreview();
        return;
      }
      if(e.key !== "Tab" || !modalPanelRef.current) return;
      const focusable = modalPanelRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if(!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if(e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if(!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    window.setTimeout(()=>modalCloseRef.current?.focus(), 0);
    return ()=>{
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  },[closePreview,previewOpen]);

  const handlePointerMove = useCallback((event)=>{
    if(!stageRef.current || previewOpen) return;
    if(window.matchMedia("(max-width: 1024px), (prefers-reduced-motion: reduce)").matches) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    stageRef.current.style.transform = `perspective(1200px) rotateX(${(-y * 2).toFixed(2)}deg) rotateY(${(x * 2).toFixed(2)}deg) translateY(-2px)`;
  },[previewOpen]);

  const resetPointer = useCallback(()=>{
    if(stageRef.current) stageRef.current.style.transform = "";
  },[]);

  const included = selectedPlan === "yearly"
    ? ["12 monthly trackers plus one complete annual dashboard.","Works in Excel and Google Sheets.","One-time purchase with lifetime template access.","Instant download after successful payment verification."]
    : ["One monthly tracker to start quickly.","Works in Excel and Google Sheets.","One-time purchase with lifetime template access.","Instant download after successful payment verification."];

  return (
    <>
    <main className="bp-commerce-page bp-product-page">
      <div className="bp-commerce-shell">
        <section className="bp-product-hero" aria-labelledby="product-title">
          <div className="bp-product-hero__inner">
            <div className="bp-product-theatre" onPointerMove={handlePointerMove} onPointerLeave={resetPointer}>
              <span className="bp-product-orb bp-product-orb--one" aria-hidden="true" />
              <span className="bp-product-orb bp-product-orb--two" aria-hidden="true" />
              <div className="bp-glass bp-product-stage" ref={stageRef}>
                <div className="bp-product-stage__header">
                  <span><span className="bp-live-dot" aria-hidden="true" />Interactive dashboard preview</span>
                  <span>{activePreview === "monthly" ? "Monthly view" : "Annual view"}</span>
                </div>
                <button
                  type="button"
                  className="bp-product-preview-button"
                  onClick={openPreview}
                  ref={(node)=>{ previewTriggerRef.current = node; }}
                  aria-label={`Open ${selectedPreview.title}`}
                >
                  <DashboardImage className="dashboard-image-hd" type={previewType} loading="eager" fit="contain" position="center top" />
                  <span className="bp-product-preview-zoom" aria-hidden="true">
                    <Icon name="eye" size={18} color="#4338ca"/>
                  </span>
                </button>

                <div className="bp-product-preview-selector" role="group" aria-label="Choose preview">
                  {previewViews.map(view=>(
                    <button
                      key={view.id}
                      type="button"
                      className="bp-product-preview-option"
                      aria-pressed={activePreview === view.id}
                      onClick={()=>setActivePreview(view.id)}
                    >
                      {view.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bp-product-trust-grid">
                {[
                  ["Instant digital download","Access appears after successful payment verification."],
                  ["Lifetime template access","Use your purchased spreadsheet file without a subscription."],
                  ["Private files on your device","Your budget entries stay inside your own spreadsheet."],
                ].map(([title,text])=>(
                  <article className="bp-glass bp-product-trust-card" key={title}>
                    <strong>{title}</strong>
                    <span>{text}</span>
                  </article>
                ))}
              </div>
            </div>

            <aside className="bp-glass bp-purchase-panel" aria-label="Purchase BudgetPro">
              <GlassBadge>BudgetPro Smart Expense Tracker</GlassBadge>
              <h1 className="bp-product-title" id="product-title">See every rupee.<br/>Plan every month.</h1>
              <p className="bp-product-description">A premium Excel and Google Sheets dashboard that turns everyday income and expenses into a clear monthly and annual plan.</p>
              <div className="bp-trust-note">
                No fabricated ratings or buyer counts. BudgetPro shows product details and real delivery/payment guarantees only.
              </div>

              <div className="bp-plan-selector" role="group" aria-label="Choose tracker plan">
                {Object.entries(livePrices).map(([id, plan])=>(
                  <button
                    type="button"
                    key={id}
                    className="bp-plan-pill"
                    aria-pressed={selectedPlan === id}
                    onClick={()=>selectPlan(id)}
                  >
                    {id === "yearly" ? "Full Year" : "Monthly"} · ₹{plan.price}
                  </button>
                ))}
              </div>

              <div className="bp-price-block">
                <div>
                  <div className="bp-price-block__price">₹{currentPrice}</div>
                  <div className="bp-price-block__meta" style={{textAlign:"left"}}>{selectedPlan === "yearly" ? "12 monthly trackers plus one complete annual dashboard." : "One monthly tracker to start quickly."}</div>
                </div>
                <div className="bp-price-block__meta">
                  <div style={{textDecoration:"line-through"}}>₹{currentOriginal}</div>
                  <div>Save ₹{currentDiscount}</div>
                </div>
              </div>

              <ul className="bp-included-list">
                {included.map(item=><li key={item}>{item}</li>)}
              </ul>

              <GlassButton ref={primaryCtaRef} onClick={buySelectedPlan} className="bp-product-primary-cta">
                {selectedPlan === "yearly" ? `Get the Full Year Tracker — ₹${currentPrice}` : `Get the Monthly Tracker — ₹${currentPrice}`}
              </GlassButton>
              <p className="bp-delivery-copy">One-time purchase · Lifetime access · Secure Razorpay checkout · Instant digital delivery</p>
            </aside>
          </div>
        </section>
      </div>

      <ProductStory
        previewSrc={selectedPreview.src}
        previewAlt={selectedPreview.alt}
        plans={livePrices}
        selectedPlan={selectedPlan}
        onSelectPlan={selectPlan}
        onBuy={buySelectedPlan}
      />

      <StickyPurchaseDock
        visible={dockVisible && !previewOpen}
        selectedPlan={selectedPlan}
        plans={livePrices}
        previewSrc={selectedPreview.src}
        previewAlt={selectedPreview.alt}
        onSelectPlan={selectPlan}
        onBuy={buySelectedPlan}
      />
    </main>

    {previewOpen&&(
      <div
        role="dialog"
        aria-modal="true"
        aria-label={selectedPreview.title}
        onClick={closePreview}
        className="bp-preview-modal"
      >
        <div
          className="bp-glass bp-preview-modal__panel"
          ref={modalPanelRef}
          onClick={e=>e.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Close dashboard preview"
            onClick={closePreview}
            className="bp-glass-icon-button bp-preview-modal__close"
            ref={modalCloseRef}
          >
            <Icon name="close" size={19} color="#0f172a"/>
          </button>
          <img
            src={selectedPreview.src}
            alt={selectedPreview.alt}
            style={{
              display:"block",
              width:"100%",
              height:"auto",
              maxHeight:"calc(88vh - 28px)",
              objectFit:"contain",
              borderRadius:24,
              background:"#ffffff",
              boxShadow:"inset 0 0 0 1px rgba(255,255,255,0.90)",
            }}
          />
        </div>
      </div>
    )}
    </>
  );
});

// ═══════════════════════════════════════════════════════════════════
//  LEGAL PAGES — Terms of Service & Privacy Policy
//  (content preserved verbatim from the existing site; only restyled)
// ═══════════════════════════════════════════════════════════════════
const TERMS_SECTIONS = [
  {title:"Use of BudgetPro",body:"BudgetPro provides Smart Expense Tracker and related digital materials for personal finance tracking. By using this website or purchasing a product, you agree to use the files lawfully and for your own personal or internal household purposes."},
  {title:"Digital Delivery",body:"Products are delivered digitally after successful payment verification. Download links may be shown on the success page and sent to the email address provided during checkout. You are responsible for entering an accurate email address."},
  {title:"Payments and Pricing",body:"Payments are processed through Razorpay. Prices are displayed in INR and may change without prior notice. A purchase is complete only after payment confirmation and successful order verification."},
  {title:"License Restrictions",body:"Your purchase grants a limited, non-transferable license to use Smart Expense Tracker. You may not resell, redistribute, upload, sublicense, copy for commercial resale, or claim ownership of BudgetPro files or designs."},
  {title:"No Financial Advice",body:"BudgetPro Smart Expense Tracker is an educational personal finance tool. It does not provide financial, investment, tax, legal, or accounting advice. You remain responsible for your financial decisions and should consult qualified professionals when needed."},
  {title:"Refunds and Failed Delivery",body:"Because products are digital and available immediately after purchase, sales are generally final. If you were charged twice, did not receive access after successful payment, or believe there was a technical delivery issue, contact support with your order details."},
  {title:"Limitation of Liability",body:"BudgetPro and Smart Expense Tracker are provided as is. To the maximum extent permitted by law, BudgetPro is not liable for indirect, incidental, special, consequential, or financial losses arising from use of the website or digital files."},
  {title:"Contact",body:"For support, delivery issues, or questions about these terms, contact BudgetPro using the Contact Us link in the footer."},
];
const PRIVACY_SECTIONS = [
  {title:"Information We Collect",body:"When you purchase BudgetPro, we may collect your name, email address, phone number, selected plan, payment status, order identifiers, download activity, and support messages you send to us."},
  {title:"Payment Information",body:"Payments are handled by Razorpay. BudgetPro does not store your full card number, UPI credentials, bank login details, or sensitive payment credentials on this website."},
  {title:"How We Use Information",body:"We use your information to process orders, verify payments, deliver download links, resend purchase emails, provide customer support, maintain admin records, prevent fraud, and improve the website."},
  {title:"Service Providers",body:"We may use trusted providers such as Razorpay for payment processing, Resend for email delivery, MongoDB for order data storage, and Vercel for hosting and serverless APIs. These providers process data only as needed for their services."},
  {title:"Data Retention",body:"Order and support records may be retained for business, tax, accounting, dispute resolution, and security purposes. We keep personal information only as long as reasonably necessary for these purposes."},
  {title:"Security",body:"We use reasonable technical and organizational safeguards to protect order data. No internet service can guarantee absolute security, so please avoid sending sensitive financial information through support email."},
  {title:"Cookies and Local Storage",body:"The website may use browser storage for normal app behavior, checkout flow, and admin authentication. You can clear browser storage through your browser settings, but some features may stop working."},
  {title:"Your Choices",body:"You may contact us to request access, correction, or deletion of personal information where applicable. Some records may need to be retained where required for legal, tax, fraud prevention, or legitimate business reasons."},
  {title:"Contact",body:"For privacy questions, contact BudgetPro using the Contact Us link in the footer."},
];

const LegalPage = memo(({ title, intro, sections }) => (
  <main style={{background:DS.grad.section,minHeight:"100vh",padding:"72px 20px"}}>
    <div style={{maxWidth:880,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        <Badge style={{marginBottom:16}}>Legal</Badge>
        <h1 style={{fontFamily:DS.font.heading,fontSize:DS.type.h1,fontWeight:900,color:DS.color.navy,marginBottom:14,letterSpacing:"-0.02em"}}>{title}</h1>
        <p style={{color:DS.color.slateLight,fontSize:16,lineHeight:1.7,maxWidth:680,margin:"0 auto"}}>{intro}</p>
      </div>
      <div className="glass-card" style={{borderRadius:DS.radius["2xl"],padding:"32px"}}>
        <p style={{color:DS.color.slateLight,fontSize:DS.type.sm,marginBottom:24}}>Last updated: June 28, 2026</p>
        <div style={{display:"grid",gap:24}}>
          {sections.map(section=>(
            <section key={section.title}>
              <h2 style={{fontSize:DS.type.h4,fontWeight:800,color:DS.color.navy,marginBottom:8}}>{section.title}</h2>
              <p style={{color:DS.color.slate,fontSize:DS.type.body,lineHeight:1.8}}>{section.body}</p>
            </section>
          ))}
        </div>
        <Divider style={{margin:"28px 0 20px"}}/>
        <a href={SUPPORT_MAILTO} style={{color:DS.color.mintText,fontSize:DS.type.sm,fontWeight:800,textDecoration:"none"}}>Contact BudgetPro Support</a>
      </div>
    </div>
  </main>
));

const TermsPage = memo(() => (
  <LegalPage title="Terms of Service" intro="These terms govern your access to the BudgetPro website, checkout flow, downloads, and Smart Expense Tracker digital files." sections={TERMS_SECTIONS}/>
));
const PrivacyPage = memo(() => (
  <LegalPage title="Privacy Policy" intro="This policy explains what information BudgetPro collects, why it is used, and how order and support data is handled." sections={PRIVACY_SECTIONS}/>
));

// ═══════════════════════════════════════════════════════════════════
//  RAZORPAY LOADER
// ═══════════════════════════════════════════════════════════════════
const loadRazorpayScript = () => new Promise(resolve=>{
  if(typeof window!=="undefined"&&window.Razorpay){resolve(true);return;}
  const src="https://checkout.razorpay.com/v1/checkout.js";
  const ex=document.querySelector(`script[src="${src}"]`);
  if(ex){ex.addEventListener("load",()=>resolve(true),{once:true});ex.addEventListener("error",()=>resolve(false),{once:true});return;}
  const s=document.createElement("script");s.src=src;s.async=true;s.onload=()=>resolve(true);s.onerror=()=>resolve(false);document.body.appendChild(s);
});

// ═══════════════════════════════════════════════════════════════════
//  CHECKOUT PAGE — glass UI, all payment logic preserved
// ═══════════════════════════════════════════════════════════════════
const CheckoutPage = memo(() => {
  const navigate = useNavigate();
  const [searchParams,setSearchParams] = useSearchParams();
  const planFromURL = searchParams.get("plan")==="monthly"?"monthly":"yearly";
  const [form,setForm] = useState({name:"",email:"",phone:""});
  const [selectedPlan,setSelectedPlan] = useState(planFromURL);
  const [loading,setLoading] = useState(false);
  const [errors,setErrors] = useState({});
  const [pageError,setPageError] = useState("");
  const checkoutTimer = useCheckoutSessionTimer();
  const [livePrices,setLivePrices] = useState({
    monthly:{price:19,original:299,discount:"94% OFF",desc:"One monthly tracker with core income, expense, category, and savings views.",label:"Monthly Smart Expense Tracker"},
    yearly: {price:49,original:999,discount:"95% OFF",desc:"12 monthly trackers plus one complete annual dashboard.",label:"Full Year Smart Expense Tracker"},
  });

  useEffect(()=>{
    fetch("/api/settings").then(r=>r.json()).then(data=>{
      setLivePrices(prev=>({
        monthly:{...prev.monthly,price:data?.monthly?.price??prev.monthly.price},
        yearly: {...prev.yearly, price:data?.yearly?.price ??prev.yearly.price},
      }));
    }).catch(()=>{});
  },[]);
  useEffect(()=>{ setSearchParams({plan:selectedPlan},{replace:true}); },[selectedPlan,setSearchParams]);

  const plan = livePrices[selectedPlan];
  const previewImage = selectedPlan==="yearly" ? annualDashboardPreview : monthlyDashboardPreview;
  const planFeatures = selectedPlan==="yearly"
    ? ["12 monthly dashboards","Annual overview and savings view","Excel file plus Google Sheets-ready copy","Instant download after verified payment"]
    : ["One monthly dashboard","Income, expenses, categories, and savings views","Excel file plus Google Sheets-ready copy","Instant download after verified payment"];
  const summaryRows = [
    ["Original price", "\u20B9"+plan.original, "muted"],
    ["Discount ("+plan.discount+")", "-\u20B9"+(plan.original-plan.price), "discount"],
    ["GST", "Included", "normal"],
    ["Subtotal", "\u20B9"+plan.price, "normal"],
  ];
  const fieldData = [
    {key:"name",label:"Full name",placeholder:"Rahul Sharma",autoComplete:"name",type:"text",maxLength:60},
    {key:"email",label:"Email address",placeholder:"rahul@email.com",autoComplete:"email",type:"email",maxLength:100,hint:"Your verified download link is sent here."},
    {key:"phone",label:"Mobile number",placeholder:"9876543210",autoComplete:"tel",type:"tel",maxLength:10,inputMode:"numeric",pattern:"[0-9]*"},
  ];
  const paymentDisabled = loading || checkoutTimer.expired;

  const setField = useCallback((key,value)=>{
    const nextValue = key==="phone" ? value.replace(/\D/g,"").slice(0,10) : value;
    setForm(current=>({...current,[key]:nextValue}));
    setErrors(current=>({...current,[key]:null}));
    setPageError("");
  },[]);

  const validateCheckout = useCallback(() => {
    const nextErrors = {};
    const cleanForm = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    };
    if(!cleanForm.name) nextErrors.name = "Full name is required";
    if(!cleanForm.email.match(/^[^@]+@[^@]+\.[^@]+$/)) nextErrors.email = "Valid email is required";
    if(!cleanForm.phone.match(/^\d{10}$/)) nextErrors.phone = "10-digit mobile number required";
    setErrors(nextErrors);
    return { cleanForm, hasErrors: Object.keys(nextErrors).length > 0 };
  },[form]);

  const handlePay = useCallback(()=>{
    if(loading) return;
    if(checkoutTimer.expired){
      setPageError("Your secure checkout session has expired. Start a new secure session before continuing.");
      return;
    }
    const { cleanForm, hasErrors } = validateCheckout();
    if(hasErrors) return;
    setPageError("");
    setLoading(true);
    (async()=>{
      try{
        const orderRes=await fetch("/api/create-order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...cleanForm,plan:selectedPlan})});
        const order=await orderRes.json().catch(()=>({}));
        if(!orderRes.ok||order.error) throw new Error(order.error||"Could not create order");
        const razorpayKey=order.keyId||order.key;
        const razorpayOrderId=order.razorpayOrderId||order.orderId||order.id;
        if(!razorpayKey||!razorpayOrderId) throw new Error("Payment order missing Razorpay key/order ID.");
        const options={
          key:razorpayKey,amount:order.amount,currency:order.currency||"INR",
          name:"BudgetPro",description:plan.label,order_id:razorpayOrderId,
          prefill:{name:cleanForm.name,email:cleanForm.email,contact:cleanForm.phone},
          theme:{color:"#6366f1"},
          handler:async function(response){
            try{
              const vr=await fetch("/api/verify-payment",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({razorpay_order_id:response.razorpay_order_id,razorpay_payment_id:response.razorpay_payment_id,razorpay_signature:response.razorpay_signature})});
              const result=await vr.json().catch(()=>({}));
              if(!vr.ok||result.error) throw new Error(result.error||"Payment verification failed");
              if(result.success){navigate("/success",{state:{name:result.customerName||cleanForm.name,email:result.customerEmail||cleanForm.email,plan:result.plan||selectedPlan,token:result.downloadToken||result.token}});window.scrollTo({top:0,behavior:"smooth"});}
              else setPageError("Payment verification failed. Contact support with payment ID: "+response.razorpay_payment_id);
            }catch(ve){setPageError((ve&&ve.message)||"Verification failed. Please contact support.");}
            finally{setLoading(false);}
          },
          modal:{ondismiss(){setLoading(false);}},
        };
        const ok=await loadRazorpayScript();
        if(!ok||!window.Razorpay) throw new Error("Payment system failed to load. Please refresh.");
        new window.Razorpay(options).open();
      }catch(err){setPageError((err&&err.message)||"Something went wrong.");setLoading(false);}
    })();
  },[checkoutTimer.expired,loading,navigate,plan,selectedPlan,validateCheckout]);

  return (
    <main className="bp-commerce-page bp-checkout-page">
      <header className="bp-checkout-header">
        <div className="bp-checkout-header__inner">
          <button type="button" onClick={()=>navigate("/product")} style={{display:"inline-flex",alignItems:"center",gap:10,color:"#fff",background:"transparent",border:0,cursor:"pointer",fontFamily:DS.font.body,fontSize:18,fontWeight:900}}>
            <span style={{width:38,height:38,borderRadius:14,display:"grid",placeItems:"center",background:"rgba(255,255,255,0.16)",border:"1px solid rgba(255,255,255,0.28)"}}>
              <Icon name="chart" size={20} color="#fff"/>
            </span>
            BudgetPro
          </button>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,color:"rgba(255,255,255,0.82)",fontSize:13,fontWeight:800}}>
            <Icon name="lock" size={15} color="rgba(255,255,255,0.86)"/>
            Secure checkout powered by Razorpay
          </div>
        </div>
      </header>

      <section className="bp-checkout-shell">
        <div className="bp-checkout-title">
          <GlassBadge>Secure Purchase</GlassBadge>
          <h1>Complete Your<br/>Order</h1>
          <p>Choose the tracker you want, enter delivery details, and continue to Razorpay for the secure payment step.</p>
        </div>

        <CheckoutSessionTimer timer={checkoutTimer}/>

        <div className="bp-plan-toggle" aria-label="Choose tracker plan">
          {Object.entries(livePrices).map(([id,item])=>(
            <button
              type="button"
              key={id}
              className={"bp-plan-chip " + (selectedPlan===id ? "is-active" : "")}
              aria-pressed={selectedPlan===id}
              onClick={()=>{setSelectedPlan(id);setPageError("");}}
            >
              {id==="yearly" ? "Full Year" : "Monthly"} - {"\u20B9"+item.price}
            </button>
          ))}
        </div>

        <div className="bp-checkout-grid">
          <div>
            <section className="bp-glass bp-checkout-card" aria-labelledby="buyer-details-title">
              <h2 id="buyer-details-title">Buyer details</h2>
              <div className="bp-field-stack">
                {fieldData.map(field=>(
                  <div className="bp-field" key={field.key}>
                    <label htmlFor={"checkout-"+field.key}>{field.label}</label>
                    <input
                      id={"checkout-"+field.key}
                      type={field.type}
                      value={form[field.key]}
                      placeholder={field.placeholder}
                      autoComplete={field.autoComplete}
                      maxLength={field.maxLength}
                      inputMode={field.inputMode}
                      pattern={field.pattern}
                      aria-invalid={Boolean(errors[field.key])}
                      aria-describedby={(field.hint ? "checkout-"+field.key+"-hint " : "") + (errors[field.key] ? "checkout-"+field.key+"-error" : "")}
                      onChange={event=>setField(field.key,event.target.value)}
                    />
                    {field.hint&&<p className="bp-field__hint" id={"checkout-"+field.key+"-hint"}>{field.hint}</p>}
                    {errors[field.key]&&<p className="bp-field__error" id={"checkout-"+field.key+"-error"}>{errors[field.key]}</p>}
                  </div>
                ))}
              </div>
            </section>

            <section className="bp-glass bp-razorpay-panel" aria-labelledby="razorpay-title">
              <h2 id="razorpay-title">Payment happens in Razorpay</h2>
              <p>BudgetPro does not ask for or store card numbers, CVV, UPI PIN, UPI ID, bank login details, or other sensitive payment credentials on this website.</p>
              <div className="bp-security-note">
                <Icon name="shield" size={18} color="#059669" style={{flexShrink:0,marginTop:2}}/>
                <span>After you continue, Razorpay opens its hosted checkout where you can choose UPI, cards, wallets, or net banking if enabled for the merchant account.</span>
              </div>
              <div className="bp-trust-timeline" aria-label="Checkout steps">
                {["Order created","Razorpay collects payment","Download unlocks instantly"].map((step,index)=>(
                  <div key={step}><span>{index+1}</span>{step}</div>
                ))}
              </div>
            </section>
          </div>

          <aside className="bp-glass bp-checkout-summary" aria-label="Order summary">
            <h2>Order summary</h2>
            <div className="bp-summary-product">
              <img src={previewImage} alt={plan.label+" preview"}/>
              <div>
                <strong>{plan.label}</strong>
                <span>{plan.desc}</span>
              </div>
            </div>
            <ul className="bp-summary-features">
              {planFeatures.map(feature=><li key={feature}>{feature}</li>)}
            </ul>
            <div className="bp-summary-lines">
              {summaryRows.map(([label,value,tone])=>(
                <div className="bp-summary-line" key={label}>
                  <span>{label}</span>
                  <strong className={tone==="discount" ? "is-discount" : undefined}>{value}</strong>
                </div>
              ))}
            </div>
            <div className="bp-summary-total">
              <span>Total payable</span>
              <strong>{"\u20B9"+plan.price}</strong>
            </div>
            {pageError&&<div role="alert" className="bp-payment-error">{pageError}</div>}
            <GlassButton onClick={handlePay} disabled={paymentDisabled} style={{width:"100%",justifyContent:"center"}}>
              {loading ? "Preparing Razorpay..." : "Continue to Secure Payment - \u20B9"+plan.price}
            </GlassButton>
            <PaymentTrustRow/>
            <p className="bp-delivery-copy">Verified payments route to the existing download flow and email delivery. GST is included in the displayed price.</p>
            <div className="bp-legal-links">
              <button type="button" onClick={()=>navigate("/terms")} style={{background:"none",border:0,cursor:"pointer",color:"#4338ca",fontWeight:800}}>Terms</button>
              <button type="button" onClick={()=>navigate("/privacy")} style={{background:"none",border:0,cursor:"pointer",color:"#4338ca",fontWeight:800}}>Privacy</button>
            </div>
          </aside>
        </div>
      </section>

      <div className="bp-checkout-mobile-cta">
        <div className="bp-checkout-mobile-cta__top">
          <span>{selectedPlan==="yearly" ? "Full Year" : "Monthly"}</span>
          <strong>{"\u20B9"+plan.price}</strong>
        </div>
        <GlassButton onClick={handlePay} disabled={paymentDisabled} style={{width:"100%",justifyContent:"center"}}>
          {loading ? "Preparing Razorpay..." : "Continue Securely"}
        </GlassButton>
      </div>
    </main>
  );
});

const SuccessPage = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state||{};
  const goTo=(p,state={})=>{navigate(p,{state});window.scrollTo({top:0,behavior:"smooth"});};
  const [downloaded,setDownloaded] = useState(false);
  const isYearly = data.plan==="yearly";
  const handleDownload=useCallback(()=>{
    if(!data.token){alert("Download link not found. Please check your email, or contact support.");return;}
    setDownloaded(true);window.location.href=`/api/download/${data.token}`;
  },[data.token]);
  const steps=["Open the file in Excel or upload to Google Sheets","Go to the 'Setup' tab and enter your name & starting month","Log your income sources in the 'Income' sheet","Track daily expenses in the 'Expenses' sheet","Watch your savings graph update automatically!"];

  return (
    <div style={{background:DS.grad.section,minHeight:"100vh",padding:"60px 20px"}}>
      <div style={{maxWidth:620,margin:"0 auto"}}>
        <div className="fade-in-up" style={{textAlign:"center",marginBottom:44}}>
          <div style={{width:110,height:110,borderRadius:"50%",background:"linear-gradient(135deg,rgba(99,102,241,0.10),rgba(139,92,246,0.08))",margin:"0 auto 24px",display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid rgba(99,102,241,0.22)",boxShadow:DS.shadow.glassLg,animation:"pulse 2s ease 3"}}>
            <span style={{fontSize:52}}>🎉</span>
          </div>
          <h1 style={{fontFamily:DS.font.heading,fontSize:DS.type.h1,fontWeight:900,color:DS.color.navy,marginBottom:12,letterSpacing:"-0.02em"}}>Payment Successful!</h1>
          <p style={{color:DS.color.slateLight,fontSize:16,lineHeight:1.7}}>
            Thank you{data.name?`, ${data.name}`:""}! Your {isYearly?"Full Year":"Monthly"} Smart Expense Tracker is ready.<br/>
            A download link has been sent to <strong style={{color:DS.color.navy}}>{data.email||"your email"}</strong>.
          </p>
        </div>
        <div className="glass-card fade-in-up" style={{borderRadius:DS.radius["2xl"],padding:"22px",marginBottom:20,border:"1.5px solid rgba(99,102,241,0.18)",animationDelay:"0.1s"}}>
          <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:20}}>
            <div style={{background:"rgba(99,102,241,0.10)",borderRadius:DS.radius.lg,padding:14,border:"1px solid rgba(99,102,241,0.15)"}}><Icon name="download" size={26} color="#4338ca"/></div>
            <div><div style={{fontWeight:800,color:DS.color.navy,fontSize:16}}>BudgetPro {isYearly?"Full Year":"Monthly"} Smart Expense Tracker</div><div style={{color:DS.color.slateLight,fontSize:DS.type.sm,marginTop:2}}>Excel (.xlsx) + Google Sheets link · {isYearly?"~4.1 MB":"~2.4 MB"}</div></div>
          </div>
          <LiquidBtn variant="cta" size="lg" style={{width:"100%",justifyContent:"center",animation:!downloaded?"pulse 2s infinite":"none"}} onClick={handleDownload}>
            <Icon name="download" size={20} color="#fff"/>{downloaded?"✓ Downloading... Check Your Folder":"Download Instantly"}
          </LiquidBtn>
        </div>
        <div className="glass-card fade-in-up" style={{borderRadius:DS.radius["2xl"],padding:"16px 20px",marginBottom:20,background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.18)",animationDelay:"0.2s"}}>
          <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <span style={{fontSize:22}}>📧</span>
            <div><div style={{fontWeight:800,color:DS.color.navy,marginBottom:4}}>Check Your Email</div><div style={{color:DS.color.slate,fontSize:DS.type.sm,lineHeight:1.7}}>We've sent the download link to <strong>{data.email||"your email"}</strong>. Check spam if you don't see it within 2 minutes.</div></div>
          </div>
        </div>
        <div className="glass-card fade-in-up" style={{borderRadius:DS.radius["2xl"],padding:"22px",marginBottom:20,animationDelay:"0.3s"}}>
          <div style={{fontWeight:800,color:DS.color.navy,marginBottom:18,fontSize:16}}>🚀 Getting Started — 5 Simple Steps</div>
          {steps.map((step,i)=>(
            <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
              <div style={{background:DS.grad.cta,color:"#fff",borderRadius:"50%",width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,flexShrink:0}}>{i+1}</div>
              <span style={{color:DS.color.slate,fontSize:DS.type.sm,lineHeight:1.6}}>{step}</span>
            </div>
          ))}
        </div>
        {!isYearly&&(
          <div className="glass-card fade-in-up" style={{borderRadius:DS.radius["2xl"],padding:"22px",marginBottom:20,border:"1.5px solid rgba(99,102,241,0.15)",animationDelay:"0.4s"}}>
            <div style={{display:"flex",gap:3,marginBottom:12}}>{[1,2,3].map(i=><span key={i} style={{fontSize:14}}>⭐</span>)}</div>
            <div style={{fontWeight:800,color:DS.color.navy,fontSize:DS.type.h4,marginBottom:8}}>Upgrade to Full Year — Save More!</div>
            <p style={{color:DS.color.slateLight,fontSize:DS.type.sm,lineHeight:1.7,marginBottom:16}}>Get all 12 months + yearly expense overview for just <strong style={{color:DS.color.gold}}>₹49</strong>. Only ₹30 more for 12x the value.</p>
            <LiquidBtn variant="cta" size="md" onClick={()=>goTo("/checkout?plan=yearly")} style={{width:"100%",justifyContent:"center"}}>Upgrade to Full Year — ₹49 ↗</LiquidBtn>
          </div>
        )}
        <div className="fade-in-up" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,animationDelay:"0.5s"}}>
          <LiquidBtn variant="white" onClick={()=>goTo("/")} style={{width:"100%",justifyContent:"center"}}>← Back to Home</LiquidBtn>
          <LiquidBtn variant="white" onClick={()=>{window.location.href=SUPPORT_MAILTO;}} style={{width:"100%",justifyContent:"center"}}>Contact Support</LiquidBtn>
        </div>
      </div>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════
//  ADMIN LOGIN
// ═══════════════════════════════════════════════════════════════════
const AdminLogin = memo(({ onLogin }) => {
  const [creds,setCreds]=useState({username:"",password:""});
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  const handleLogin=useCallback(async()=>{
    if(!creds.username||!creds.password){setError("Please fill in all fields");return;}
    setLoading(true);
    try{
      const res=await fetch("/api/admin-login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(creds)});
      const data=await res.json();
      if(data.token){localStorage.setItem("budgetpro_admin_token",data.token);onLogin(data.token);}
      else setError(data.error||"Invalid credentials");
    }catch{setError("Server error. Please try again.");}
    finally{setLoading(false);}
  },[creds,onLogin]);
  const inp={width:"100%",padding:"13px 16px",borderRadius:DS.radius.lg,border:`1.5px solid ${DS.color.border}`,fontSize:DS.type.body,color:DS.color.navy,background:"rgba(255,255,255,0.80)",fontFamily:"inherit",backdropFilter:"blur(8px)"};
  return (
    <div style={{minHeight:"100vh",background:DS.grad.hero,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div className="glass-card scale-in" style={{borderRadius:DS.radius["3xl"],padding:"40px",width:"100%",maxWidth:400,border:"1px solid rgba(255,255,255,0.90)"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:60,height:60,borderRadius:DS.radius.xl,background:"rgba(99,102,241,0.10)",margin:"0 auto 16px",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid rgba(99,102,241,0.18)"}}><Icon name="lock" size={24} color="#4338ca"/></div>
          <h2 style={{fontFamily:DS.font.heading,fontSize:DS.type.h3,fontWeight:800,color:DS.color.navy,marginBottom:6}}>Admin Login</h2>
          <p style={{color:DS.color.slateLight,fontSize:DS.type.sm}}>Access BudgetPro dashboard</p>
        </div>
        <div style={{display:"grid",gap:16,marginBottom:22}}>
          {[{key:"username",label:"Username",placeholder:"admin",type:"text"},{key:"password",label:"Password",placeholder:"••••••••",type:"password"}].map(({key,label,placeholder,type})=>(
            <div key={key}>
              <label style={{fontSize:DS.type.sm,fontWeight:700,color:DS.color.slate,display:"block",marginBottom:7}}>{label}</label>
              <input type={type} style={{...inp,borderColor:error?DS.color.border:DS.color.border}} placeholder={placeholder} value={creds[key]} onChange={e=>{setCreds({...creds,[key]:e.target.value});setError("");}} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
            </div>
          ))}
        </div>
        {error&&<div style={{color:"#ef4444",fontSize:DS.type.sm,marginBottom:14,textAlign:"center",fontWeight:600}}>⚠ {error}</div>}
        <LiquidBtn variant="cta" size="lg" onClick={handleLogin} disabled={loading} style={{width:"100%",justifyContent:"center"}}>
          {loading?"Logging in...":"Login to Admin"}
        </LiquidBtn>
      </div>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════
//  ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════
const AdminDashboard = memo(({ onLogout, token }) => {
  const [activeTab,setActiveTab]=useState("overview");
  const [stats,setStats]=useState({totalSales:0,totalRevenue:0,totalDownloads:0,monthlySales:0,yearlySales:0,customers:[]});
  const [prices,setPrices]=useState({monthly:{price:19},yearly:{price:49}});
  const [loadingData,setLoadingData]=useState(true);
  const [savingPlan,setSavingPlan]=useState(null);
  const adminTabs=["overview","orders","pricing"];
  const authedFetch=useCallback((url,opts={})=>fetch(url,{...opts,headers:{...(opts.headers||{}),Authorization:`Bearer ${token}`}}),[token]);
  useEffect(()=>{
    const load=async()=>{
      setLoadingData(true);
      try{
        const [sRes,pRes]=await Promise.all([authedFetch("/api/admin-stats").then(r=>r.json()),fetch("/api/settings").then(r=>r.json())]);
        if(!sRes.error)setStats(sRes);if(pRes&&!pRes.error)setPrices(pRes);
      }catch(e){console.error(e);}
      finally{setLoadingData(false);}
    };load();
  },[authedFetch]);
  const savePrice=useCallback(async(plan)=>{
    setSavingPlan(plan);
    try{
      const r=await authedFetch("/api/settings",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({plan,price:Number(prices[plan].price)})});
      const d=await r.json();if(d.error)alert(d.error);
    }finally{setSavingPlan(null);}
  },[authedFetch,prices]);
  const inp={padding:"10px 14px",borderRadius:DS.radius.lg,border:`1.5px solid ${DS.color.border}`,fontSize:15,fontWeight:700,color:DS.color.navy,fontFamily:"inherit",background:"rgba(255,255,255,0.80)"};
  return (
    <div style={{background:DS.grad.section,minHeight:"100vh"}}>
      <div style={{background:DS.grad.cta,padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:60}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:20}}>📊</span><span style={{fontFamily:DS.font.body,fontWeight:800,fontSize:17,color:"#fff"}}>BudgetPro <span style={{color:"rgba(255,255,255,0.70)"}}>Admin</span></span></div>
        <div style={{display:"flex",gap:3,alignItems:"center"}}>
          {adminTabs.map(t=>(
            <button key={t} onClick={()=>setActiveTab(t)} style={{padding:"7px 16px",borderRadius:DS.radius.pill,border:"none",cursor:"pointer",fontWeight:700,fontSize:DS.type.sm,background:activeTab===t?"rgba(255,255,255,0.18)":"transparent",color:activeTab===t?"#fff":"rgba(255,255,255,0.55)",textTransform:"capitalize",transition:`all 0.18s ${DS.ease.smooth}`,fontFamily:"inherit"}}>{t}</button>
          ))}
          <LiquidBtn variant="ghost" size="sm" onClick={onLogout} style={{color:"rgba(255,255,255,0.55)",marginLeft:12}}>
            <Icon name="logout" size={15} color="rgba(255,255,255,0.55)"/>Logout
          </LiquidBtn>
        </div>
      </div>
      <div style={{padding:"36px 24px",maxWidth:1100,margin:"0 auto"}}>
        {loadingData&&<div style={{color:DS.color.slateLight,padding:60,textAlign:"center",fontSize:15}}>Loading live data...</div>}
        {!loadingData&&activeTab==="overview"&&(
          <div>
            <h2 style={{fontFamily:DS.font.heading,fontSize:DS.type.h2,fontWeight:900,color:DS.color.navy,marginBottom:30,letterSpacing:"-0.02em"}}>Dashboard Overview</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:20,marginBottom:32}}>
              {[{label:"Total Revenue",value:`₹${stats.totalRevenue}`,icon:"trending",color:"#4338ca"},{label:"Total Orders",value:stats.totalSales,icon:"bag",color:DS.color.purple},{label:"Full Year Sales",value:stats.yearlySales,icon:"star",color:DS.color.gold},{label:"Monthly Sales",value:stats.monthlySales,icon:"calendar",color:DS.color.rose}].map(s=>(
                <div key={s.label} className="glass-card card-lift" style={{borderRadius:DS.radius["2xl"],padding:"20px",display:"flex",gap:14,alignItems:"center"}}>
                  <div style={{background:`${s.color}14`,borderRadius:DS.radius.lg,padding:14,flexShrink:0,border:`1px solid ${s.color}22`}}><Icon name={s.icon} size={22} color={s.color}/></div>
                  <div><div style={{fontFamily:DS.font.number,fontSize:26,fontWeight:900,color:DS.color.navy}}>{s.value}</div><div style={{fontSize:DS.type.xs,color:DS.color.slateLight,fontWeight:600,marginTop:2}}>{s.label}</div></div>
                </div>
              ))}
            </div>
            <div className="glass-card" style={{borderRadius:DS.radius["2xl"],padding:"20px",border:"1px solid rgba(99,102,241,0.18)"}}>
              <div style={{display:"flex",gap:16,alignItems:"center"}}>
                <div style={{background:"rgba(99,102,241,0.10)",borderRadius:DS.radius.lg,padding:14,border:"1px solid rgba(99,102,241,0.15)"}}><Icon name="upload" size={26} color="#4338ca"/></div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:800,color:DS.color.navy,fontSize:DS.type.h4,marginBottom:6}}>Product Files</div>
                  <div style={{color:DS.color.slateLight,fontSize:DS.type.sm,lineHeight:1.7}}>Your templates are served from <code style={{background:"rgba(99,102,241,0.08)",padding:"2px 6px",borderRadius:4,color:"#4338ca"}}>MONTHLY_FILE_URL</code> and <code style={{background:"rgba(99,102,241,0.08)",padding:"2px 6px",borderRadius:4,color:"#4338ca"}}>YEARLY_FILE_URL</code> environment variables. Update in Vercel — no code change needed.</div>
                </div>
              </div>
            </div>
          </div>
        )}
        {!loadingData&&activeTab==="orders"&&(
          <div>
            <h2 style={{fontFamily:DS.font.heading,fontSize:DS.type.h2,fontWeight:900,color:DS.color.navy,marginBottom:30,letterSpacing:"-0.02em"}}>Recent Orders</h2>
            <div style={{display:"grid",gap:14}}>
              {stats.customers.length===0&&<div className="glass-card" style={{borderRadius:DS.radius["2xl"],padding:"24px",color:DS.color.slateLight,textAlign:"center",lineHeight:1.7}}>No completed orders yet. They'll show up here the moment your first sale comes in.</div>}
              {stats.customers.map(o=>(
                <div key={o.id} className="glass-card" style={{borderRadius:DS.radius["2xl"],padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
                  <div style={{display:"flex",gap:14,alignItems:"center"}}>
                    <div style={{background:"rgba(99,102,241,0.10)",borderRadius:DS.radius.md,padding:"8px 12px",fontWeight:800,fontSize:DS.type.sm,color:"#4338ca",fontFamily:"monospace"}}>#{o.id.slice(-6).toUpperCase()}</div>
                    <div><div style={{fontWeight:800,color:DS.color.navy,fontSize:15}}>{o.name}</div><div style={{color:DS.color.slateLight,fontSize:DS.type.xs,marginTop:2}}>{o.email} · {new Date(o.date).toLocaleDateString("en-IN")}</div></div>
                  </div>
                  <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                    <Badge color={o.plan?.includes("Year")?"rgba(139,92,246,0.10)":"rgba(99,102,241,0.09)"} text={o.plan?.includes("Year")?DS.color.purple:"#4338ca"}>{o.plan}</Badge>
                    <span style={{fontFamily:DS.font.number,fontWeight:900,color:DS.color.navy,fontSize:17}}>₹{o.amount}</span>
                    <Badge color="rgba(16,185,129,0.08)" text="#059669">✓ {o.downloads} download{o.downloads===1?"":"s"}</Badge>
                    <LiquidBtn variant="outline" size="sm" onClick={async()=>{
                      try{const r=await authedFetch("/api/admin-resend",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderId:o.id})});const d=await r.json();alert(d.success?`✅ Email resent to ${o.email}`:`❌ ${d.error}`);}
                      catch{alert("❌ Failed to resend email");}
                    }}>Resend Email</LiquidBtn>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!loadingData&&activeTab==="pricing"&&(
          <div>
            <h2 style={{fontFamily:DS.font.heading,fontSize:DS.type.h2,fontWeight:900,color:DS.color.navy,marginBottom:30,letterSpacing:"-0.02em"}}>Pricing</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
              {["monthly","yearly"].map(plan=>(
                <div key={plan} className="glass-card" style={{borderRadius:DS.radius["2xl"],padding:"22px"}}>
                  <div style={{fontWeight:800,color:DS.color.navy,fontSize:DS.type.h4,marginBottom:4,textTransform:"capitalize"}}>{plan} Smart Expense Tracker</div>
                  <div style={{color:DS.color.slateLight,fontSize:DS.type.sm,marginBottom:18}}>Live price shown at checkout</div>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{fontSize:20,fontWeight:800,color:DS.color.navy}}>₹</span>
                    <input type="number" value={prices[plan]?.price??""} onChange={e=>setPrices({...prices,[plan]:{...prices[plan],price:e.target.value}})} style={{...inp,flex:1}}/>
                    <LiquidBtn variant="cta" size="sm" onClick={()=>savePrice(plan)} disabled={savingPlan===plan}>{savingPlan===plan?"Saving...":"Save"}</LiquidBtn>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// Admin route guard
const AdminRoute = () => {
  const navigate = useNavigate();
  const [token,setToken]=useState(null);
  const [checked,setChecked]=useState(false);
  useEffect(()=>{const s=localStorage.getItem("budgetpro_admin_token");if(s)setToken(s);setChecked(true);},[]);
  if(!checked)return null;
  return token
    ?<AdminDashboard token={token} onLogout={()=>{localStorage.removeItem("budgetpro_admin_token");setToken(null);navigate("/");}}/>
    :<AdminLogin onLogin={t=>setToken(t)}/>;
};

// ═══════════════════════════════════════════════════════════════════
//  FOOTER — liquid glass
// ═══════════════════════════════════════════════════════════════════
const Footer = memo(() => {
  const navigate = useNavigate();
  const goTo = p => {
    navigate(p);
    const hash=p.split("#")[1];
    if(hash){setTimeout(()=>document.getElementById(hash)?.scrollIntoView({behavior:"smooth"}),0);return;}
    window.scrollTo({top:0,behavior:"smooth"});
  };
  const link={display:"block",background:"none",border:"none",cursor:"pointer",color:DS.color.slateLight,fontSize:DS.type.sm,padding:"5px 0",textAlign:"left",fontFamily:"inherit",transition:`color 0.18s ${DS.ease.smooth}`};
  return (
    <footer style={{background:DS.grad.section,borderTop:`1px solid ${DS.color.border}`,padding:"64px 20px 32px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",bottom:-80,right:-80,width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,0.06),transparent 70%)",pointerEvents:"none"}}/>
      <div style={{maxWidth:1100,margin:"0 auto",position:"relative",zIndex:1}}>
        <div className="footer-grid" style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:44,marginBottom:52}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
              <span style={{fontSize:24}}>📊</span>
              <span style={{fontFamily:DS.font.body,fontWeight:900,fontSize:20,color:DS.color.navy}}>Budget<span style={{background:DS.grad.cta,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Pro</span></span>
            </div>
            <p style={{fontSize:DS.type.sm,lineHeight:1.8,marginBottom:24,maxWidth:260,color:DS.color.slateLight}}>BudgetPro Smart Expense Tracker helps Indians see every rupee clearly, save smarter, and take control of monthly spending.</p>
            <div style={{display:"flex",gap:10}}>
              <LiquidBtn variant="white" size="sm" onClick={()=>goTo("/checkout?plan=monthly")}>Monthly ₹19</LiquidBtn>
              <LiquidBtn variant="cta"   size="sm" onClick={()=>goTo("/checkout?plan=yearly")}>Full Year ₹49</LiquidBtn>
            </div>
          </div>
          <div>
            <div style={{fontWeight:800,color:DS.color.navy,marginBottom:18,fontSize:13,textTransform:"uppercase",letterSpacing:"0.04em"}}>Product</div>
            {[["/" ,"Home"],["/#pricing","Pricing"],["/product","Product"]].map(([p,l])=>(
              <button key={p} onClick={()=>goTo(p)} style={link} onMouseEnter={e=>e.target.style.color=DS.color.navy} onMouseLeave={e=>e.target.style.color=DS.color.slateLight}>{l}</button>
            ))}
          </div>
          <div>
            <div style={{fontWeight:800,color:DS.color.navy,marginBottom:18,fontSize:13,textTransform:"uppercase",letterSpacing:"0.04em"}}>Legal</div>
            {[["/terms","Terms of Service"],["/privacy","Privacy Policy"]].map(([p,l])=>(
              <button key={p} onClick={()=>goTo(p)} style={link} onMouseEnter={e=>e.target.style.color=DS.color.navy} onMouseLeave={e=>e.target.style.color=DS.color.slateLight}>{l}</button>
            ))}
          </div>
          <div>
            <div style={{fontWeight:800,color:DS.color.navy,marginBottom:18,fontSize:13,textTransform:"uppercase",letterSpacing:"0.04em"}}>Support</div>
            <a href={SUPPORT_MAILTO} style={{display:"block",color:DS.color.slateLight,fontSize:DS.type.sm,padding:"5px 0",textDecoration:"none",transition:`color 0.18s ${DS.ease.smooth}`}} onMouseEnter={e=>e.target.style.color=DS.color.navy} onMouseLeave={e=>e.target.style.color=DS.color.slateLight}>Contact Us</a>
            <div style={{marginTop:20,background:"rgba(255,255,255,0.65)",borderRadius:DS.radius.xl,padding:16,border:"1px solid rgba(255,255,255,0.90)"}}>
              <div style={{fontFamily:DS.font.number,fontSize:24,fontWeight:900,color:DS.color.navy,marginBottom:2}}>₹19</div>
              <div style={{fontSize:DS.type.xs,marginBottom:12,color:DS.color.slateLight}}>Monthly Template</div>
              <div style={{fontFamily:DS.font.number,fontSize:24,fontWeight:900,color:DS.color.gold,marginBottom:2}}>₹49</div>
              <div style={{fontSize:DS.type.xs,color:DS.color.slateLight}}>Full Year · Best Value ⭐</div>
            </div>
          </div>
        </div>
        <Divider style={{marginBottom:22}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
          <div style={{fontSize:15,color:DS.color.slateLight,fontWeight:650}}>© 2026 BudgetPro. Made with ❤️ in India.</div>
          <div style={{fontSize:DS.type.sm,color:DS.color.slateLight}}>Payments secured by <span style={{background:DS.grad.cta,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontWeight:700}}>Razorpay</span> · All prices in INR · GST inclusive</div>
        </div>
      </div>
    </footer>
  );
});

// ═══════════════════════════════════════════════════════════════════
//  APP LAYOUT
// ═══════════════════════════════════════════════════════════════════
const AppLayout = () => {
  const location = useLocation();
  const path = location.pathname;
  const showNav    = !["/admin","/dashboard","/success"].includes(path);
  const showFooter = !["/admin","/dashboard","/checkout","/success"].includes(path);
  return (
    <div style={{fontFamily:DS.font.body,minHeight:"100vh",background:"#ffffff"}}>
      <GlobalStyles/>
      {showNav&&<Nav/>}
      <Routes>
        <Route path="/"          element={<HomePage/>}/>
        <Route path="/product"   element={<ProductPage/>}/>
        <Route path="/checkout"  element={<CheckoutPage/>}/>
        <Route path="/success"   element={<SuccessPage/>}/>
        <Route path="/admin"     element={<AdminRoute/>}/>
        <Route path="/dashboard" element={<AdminRoute/>}/>
        <Route path="/terms"     element={<TermsPage/>}/>
        <Route path="/privacy"   element={<PrivacyPage/>}/>
        <Route path="/affiliate" element={<Navigate to="/" replace/>}/>
        <Route path="*"          element={<Navigate to="/" replace/>}/>
      </Routes>
      {showFooter&&<Footer/>}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
//  ROOT
// ═══════════════════════════════════════════════════════════════════
export default function App() {
  return (
    <BrowserRouter>
      <AppLayout/>
    </BrowserRouter>
  );
}
