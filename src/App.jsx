import { useState, useEffect, useCallback, memo } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  useSearchParams,
  Navigate,
} from "react-router-dom";

// ═══════════════════════════════════════════════════════════════════
//  DESIGN SYSTEM — Single source of truth for every visual decision
// ═══════════════════════════════════════════════════════════════════
const DS = {
  // Liquid glass color palette
  color: {
    mint:        "#5FFFE1",
    mintLight:   "rgba(95,255,225,0.12)",
    mintDark:    "#A8FFF0",
    mintGlow:    "rgba(95,255,225,0.22)",
    emerald:     "#10D48A",
    navy:        "#F7FAFC",
    navyMid:     "#0B0B0E",
    navyLight:   "#18181C",
    navyGlass:   "rgba(5,5,6,0.82)",
    slate:       "#D3D8E4",
    slateLight:  "#8D95A7",
    bg:          "#050506",
    bgCard:      "rgba(17,17,20,0.76)",
    bgGlass:     "rgba(255,255,255,0.08)",
    border:      "rgba(255,255,255,0.12)",
    borderGlow:  "rgba(95,255,225,0.34)",
    gold:        "#E7C36A",
    goldDark:    "#A97024",
    bronze:      "#B67A43",
    rose:        "#FF6B8A",
    purple:      "#9B7CFF",
    purpleLight: "rgba(155,124,255,0.14)",
    blue:        "#6AB8FF",
    text:        "#F7FAFC",
    textMuted:   "#A1A8B8",
    surface:     "#0A0A0C",
    input:       "rgba(255,255,255,0.07)",
    inputBorder: "rgba(255,255,255,0.14)",
    white:       "#FFFFFF",
  },

  // Typography scale
  type: {
    display: "clamp(36px,5.5vw,72px)",
    h1:      "clamp(28px,4vw,52px)",
    h2:      "clamp(24px,3.5vw,44px)",
    h3:      "clamp(20px,2.5vw,28px)",
    h4:      "18px",
    body:    "15px",
    sm:      "13px",
    xs:      "11px",
  },

  font: {
    body: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    heading: "'Sora', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    number: "'Space Grotesk', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  // Spacing scale (multiples of 4px)
  space: {
    1: "4px",  2: "8px",  3: "12px", 4: "16px",  5: "20px",
    6: "24px", 7: "28px", 8: "32px", 9: "36px",  10: "40px",
    12: "48px", 14: "56px", 16: "64px", 20: "80px", 24: "96px",
  },

  // Border radius scale
  radius: {
    sm: "8px", md: "12px", lg: "16px", xl: "20px",
    "2xl": "24px", "3xl": "32px", pill: "999px",
  },

  // Shadow scale
  shadow: {
    xs:  "0 1px 3px rgba(0,0,0,0.24)",
    sm:  "0 8px 24px rgba(0,0,0,0.24)",
    md:  "0 16px 44px rgba(0,0,0,0.28)",
    lg:  "0 24px 70px rgba(0,0,0,0.36)",
    xl:  "0 32px 96px rgba(0,0,0,0.44)",
    "2xl":"0 44px 120px rgba(0,0,0,0.56)",
    glow: "0 0 28px rgba(95,255,225,0.22)",
    glowLg: "0 0 54px rgba(95,255,225,0.30), 0 20px 60px rgba(0,0,0,0.36)",
    gold: "0 0 44px rgba(231,195,106,0.28), 0 18px 48px rgba(0,0,0,0.32)",
    navy: "0 18px 60px rgba(0,0,0,0.45)",
  },

  // Gradient system
  grad: {
    mint:   "linear-gradient(135deg, #5FFFE1 0%, #10D48A 58%, #0A8F72 100%)",
    navy:   "linear-gradient(155deg, #050506 0%, #0A0A0C 48%, #141418 100%)",
    navyMid:"linear-gradient(155deg, rgba(24,24,28,0.96) 0%, rgba(8,8,10,0.98) 100%)",
    gold:   "linear-gradient(135deg, #F6E7A6 0%, #E7C36A 52%, #B67A43 100%)",
    glass:  "linear-gradient(145deg, rgba(255,255,255,0.14), rgba(255,255,255,0.035))",
    surface:"linear-gradient(155deg, #050506 0%, #0A0A0C 48%, #111114 100%)",
    hero:   "radial-gradient(circle at 18% 18%, rgba(95,255,225,0.18), transparent 32%), radial-gradient(circle at 78% 20%, rgba(155,124,255,0.20), transparent 34%), radial-gradient(circle at 70% 78%, rgba(231,195,106,0.11), transparent 30%), linear-gradient(155deg, #050506 0%, #08080A 48%, #101014 100%)",
    aurora: "linear-gradient(135deg, rgba(95,255,225,0.12) 0%, rgba(106,184,255,0.10) 38%, rgba(155,124,255,0.10) 68%, rgba(231,195,106,0.09) 100%)",
    purple: "linear-gradient(135deg, #9B7CFF, #5A42D6)",
    bronze: "linear-gradient(135deg, #E7C36A, #B67A43)",
  },

  // Animation timing
  ease: {
    smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    out:    "cubic-bezier(0, 0, 0.2, 1)",
    in:     "cubic-bezier(0.4, 0, 1, 1)",
  },
};

const SUPPORT_MAILTO = "mailto:theunseenworld2@gmail.com?subject=BudgetPro%20Support%20Request&body=Hello%20BudgetPro%20Team%2C%0A%0AI%20need%20assistance%20regarding%3A%0A%0AThank%20you.";

// ═══════════════════════════════════════════════════════════════════
//  GLOBAL STYLES
// ═══════════════════════════════════════════════════════════════════
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html { scroll-behavior: smooth; background: ${DS.color.bg}; }

    body {
      background: ${DS.color.bg};
      font-family: ${DS.font.body};
      color: ${DS.color.text};
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      min-height: 100vh;
    }

    h1, h2, h3, h4, .heading-font {
      font-family: ${DS.font.heading};
    }

    .number-font,
    .price-font,
    .kpi-number {
      font-family: ${DS.font.number};
      font-variant-numeric: tabular-nums;
    }

    body::before {
      content: '';
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: -2;
      background:
        radial-gradient(circle at 12% 8%, rgba(95,255,225,0.12), transparent 32%),
        radial-gradient(circle at 82% 12%, rgba(155,124,255,0.14), transparent 34%),
        radial-gradient(circle at 72% 84%, rgba(231,195,106,0.08), transparent 30%),
        ${DS.grad.surface};
    }

    button, input, select, textarea { font: inherit; }
    button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible {
      outline: 2px solid ${DS.color.mint};
      outline-offset: 3px;
    }

    /* ── Keyframes ── */
    @keyframes spin        { to { transform: rotate(360deg); } }
    @keyframes fadeInUp    { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn      { from { opacity:0; } to { opacity:1; } }
    @keyframes scaleIn     { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }
    @keyframes slideDown   { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }
    @keyframes pulse       { 0%,100% { box-shadow: 0 0 0 0 rgba(95,255,225,0.34); } 50% { box-shadow: 0 0 0 11px rgba(95,255,225,0); } }
    @keyframes shimmer     { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }
    @keyframes float       { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
    @keyframes floatSlow   { 0%,100% { transform:translateY(0) rotate(0deg); } 50% { transform:translateY(-14px) rotate(1deg); } }
    @keyframes countUp     { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
    @keyframes orb         { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(30px,-20px) scale(1.05); } 66% { transform:translate(-20px,15px) scale(0.97); } }
    @keyframes gradShift   { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
    @keyframes barGrow     { from { height:0; } to { height:var(--h); } }
    @keyframes shine       { from { transform:translateX(-130%) rotate(12deg); } to { transform:translateX(170%) rotate(12deg); } }
    @keyframes chartReveal { from { transform:scaleY(0.2); opacity:0.25; } to { transform:scaleY(1); opacity:1; } }

    /* ── Utility classes ── */
    .fade-in-up   { animation: fadeInUp 0.6s ${DS.ease.out} both; }
    .fade-in      { animation: fadeIn 0.5s ${DS.ease.out} both; }
    .scale-in     { animation: scaleIn 0.45s ${DS.ease.spring} both; }
    .skeleton     {
      background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.13) 50%, rgba(255,255,255,0.06) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.6s infinite;
      border-radius: ${DS.radius.md};
    }

    .liquid-card,
    .glass-panel,
    .dashboard-glass {
      position: relative;
      background: linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.045));
      border: 1px solid ${DS.color.border};
      box-shadow: ${DS.shadow.md};
      backdrop-filter: blur(26px) saturate(150%);
      -webkit-backdrop-filter: blur(26px) saturate(150%);
    }

    .liquid-card::after,
    .glass-panel::after,
    .dashboard-glass::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      background:
        linear-gradient(115deg, rgba(255,255,255,0.18), transparent 28%),
        radial-gradient(circle at 20% 0%, rgba(255,255,255,0.12), transparent 34%);
      opacity: 0.32;
      mix-blend-mode: screen;
    }

    .premium-button {
      position: relative;
      overflow: hidden;
      isolation: isolate;
    }

    .premium-button::before {
      content: '';
      position: absolute;
      top: -50%;
      bottom: -50%;
      width: 42%;
      left: -55%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.34), transparent);
      transform: rotate(12deg);
      opacity: 0;
      transition: opacity 0.24s ${DS.ease.smooth};
      z-index: -1;
    }

    .premium-button:hover::before { opacity: 1; animation: shine 0.9s ${DS.ease.out}; }
    .floating-card { animation: floatSlow 10s ease-in-out infinite; }
    .chart-bar { transform-origin: bottom; animation: chartReveal 0.7s ${DS.ease.spring} both; }

    .hero-orb {
      position: absolute;
      border-radius: 999px;
      filter: blur(4px);
      pointer-events: none;
      opacity: 0.5;
      animation: orb 15s ease-in-out infinite;
    }

    .noise-overlay {
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: 0.36;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E");
    }

    /* ── Interactive states ── */
    .btn-primary {
      transition: all 0.22s ${DS.ease.smooth};
    }
    .btn-primary:hover {
      filter: brightness(1.1);
      transform: translateY(-2px);
      box-shadow: ${DS.shadow.glowLg} !important;
    }
    .btn-primary:active { transform: translateY(0); }

    .btn-gold {
      transition: all 0.22s ${DS.ease.smooth};
    }
    .btn-gold:hover {
      filter: brightness(1.08);
      transform: translateY(-2px);
      box-shadow: ${DS.shadow.gold} !important;
    }
    .btn-gold:active { transform: translateY(0); }

    .card-lift {
      transition: all 0.28s ${DS.ease.smooth};
    }
    .card-lift:hover {
      transform: translateY(-5px);
      box-shadow: ${DS.shadow["2xl"]} !important;
    }

    .nav-item {
      transition: all 0.2s ${DS.ease.smooth};
      position: relative;
    }
    .nav-item::after {
      content: '';
      position: absolute;
      bottom: -2px; left: 50%; right: 50%;
      height: 2px;
      background: ${DS.color.mint};
      border-radius: 2px;
      transition: all 0.25s ${DS.ease.smooth};
    }
    .nav-item:hover::after,
    .nav-item.active::after {
      left: 8px; right: 8px;
    }
    .nav-item:hover { color: ${DS.color.navy} !important; background: ${DS.color.bgGlass} !important; }
    .nav-item.active { color: ${DS.color.mintDark} !important; background: ${DS.color.mintLight} !important; }

    /* ── Form focus ── */
    input:focus, select:focus, textarea:focus {
      border-color: ${DS.color.mint} !important;
      outline: none;
      box-shadow: 0 0 0 3px ${DS.color.mintGlow} !important;
    }

    input::placeholder, textarea::placeholder { color: rgba(211,216,228,0.42); }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      .hero-grid       { grid-template-columns: 1fr !important; }
      .pricing-grid    { grid-template-columns: 1fr !important; }
      .benefits-grid   { grid-template-columns: 1fr 1fr !important; }
      .checkout-grid   { grid-template-columns: 1fr !important; }
      .footer-grid     { grid-template-columns: 1fr 1fr !important; }
      .stats-row       { gap: 20px !important; flex-wrap: wrap; }
      .sticky-cta      { display: flex !important; }
      .mobile-hide     { display: none !important; }
      .nav-desktop     { display: none !important; }
      .mobile-nav-btn  { display: flex !important; }
      .product-grid    { grid-template-columns: 1fr !important; }
      .admin-pricing-grid { grid-template-columns: 1fr !important; }
      .admin-nav       { flex-direction: column !important; height: auto !important; align-items: stretch !important; gap: 14px !important; padding: 16px 20px !important; }
      .admin-tabs      { overflow-x: auto; padding-bottom: 4px; }
      .hero-actions    { width: 100%; }
      .hero-actions button { width: 100%; }
    }
    @media (max-width: 480px) {
      .benefits-grid   { grid-template-columns: 1fr !important; }
      .footer-grid     { grid-template-columns: 1fr !important; }
      .checkout-grid   { gap: 18px !important; }
      .stats-row       { display: grid !important; grid-template-columns: 1fr 1fr !important; }
      .sticky-cta      { padding: 12px !important; gap: 10px !important; }
      .sticky-cta button { padding-left: 12px !important; padding-right: 12px !important; }
    }

    /* ── Reduced motion ── */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }

    /* ── Custom scrollbar ── */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: ${DS.color.bg}; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.18); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: ${DS.color.slateLight}; }

    /* ── Noise texture overlay for cards ── */
    .noise::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none;
      border-radius: inherit;
      opacity: 0.4;
    }

    /* ── Glow border effect ── */
    .glow-border {
      position: relative;
    }
    .glow-border::before {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: inherit;
      background: linear-gradient(135deg, ${DS.color.mint}77, ${DS.color.blue}44, ${DS.color.purple}44, ${DS.color.gold}33);
      z-index: -1;
      opacity: 0.18;
      transition: opacity 0.3s ease;
      filter: blur(2px);
    }
    .glow-border:hover::before { opacity: 0.85; }
  `}</style>
);

// ═══════════════════════════════════════════════════════════════════
//  ICONS — Inline SVG system
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
  grid:       "M10 3H3v7h7V3zM21 3h-7v7h7V3zM21 14h-7v7h7v-7zM10 14H3v7h7v-7z",
  close:      "M18 6L6 18M6 6l12 12",
  menu:       "M3 12h18M3 6h18M3 18h18",
  arrowRight: "M5 12h14M12 5l7 7-7 7",
  phone:      "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
  creditCard: "M1 4h22v16H1zM1 10h22",
  building:   "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10",
  bag:        "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0",
  link:       "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
  calendar:   "M3 4h18v18H3V4zM16 2v4M8 2v4M3 10h18",
  piggyBank:  "M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4.5c2.5-1.3 3-3 3-5.5 0-4.5-4-4.5-4-4.5s-.5 0-1-2zM8 11a1 1 0 100-2 1 1 0 000 2z",
  sparkle:    "M12 3l1.5 5h5l-4 3 1.5 5-4-3-4 3 1.5-5-4-3h5z",
  rupee:      "M6 3h12M6 8h12M15 21L9 3M9 14h3a4 4 0 000-8H9v11",
  chevronDown:"M6 9l6 6 6-6",
};

const Icon = memo(({ name, size = 20, color = "currentColor", style = {}, filled = false }) => (
  <svg
    width={size} height={size}
    viewBox="0 0 24 24"
    fill={filled ? color : "none"}
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    aria-hidden="true"
  >
    <path d={ICON_PATHS[name] || ""} />
  </svg>
));

// ═══════════════════════════════════════════════════════════════════
//  PRIMITIVE UI COMPONENTS
// ═══════════════════════════════════════════════════════════════════

// ── Button ──────────────────────────────────────────────────────────
const BUTTON_VARIANTS = {
  primary: {
    background: DS.grad.mint,
    color: "#041210",
    border: "none",
    boxShadow: DS.shadow.glow,
    className: "btn-primary premium-button",
  },
  outline: {
    background: "rgba(255,255,255,0.035)",
    color: DS.color.mint,
    border: `1px solid ${DS.color.borderGlow}`,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
    className: "btn-primary premium-button",
  },
  navy: {
    background: DS.grad.navyMid,
    color: "#fff",
    border: `1px solid ${DS.color.border}`,
    boxShadow: DS.shadow.navy,
    className: "btn-primary premium-button",
  },
  ghost: {
    background: "transparent",
    color: DS.color.slate,
    border: "none",
    className: "",
  },
  danger: {
    background: "linear-gradient(135deg, #E53E3E, #C53030)",
    color: "#fff",
    border: "none",
    className: "btn-primary premium-button",
  },
  gold: {
    background: DS.grad.gold,
    color: "#1A1203",
    border: "none",
    boxShadow: DS.shadow.gold,
    className: "btn-gold premium-button",
  },
  glass: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(18px) saturate(140%)",
    WebkitBackdropFilter: "blur(18px) saturate(140%)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.16)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16), 0 14px 42px rgba(0,0,0,0.28)",
    className: "btn-primary premium-button",
  },
};

const BUTTON_SIZES = {
  sm: { padding: "8px 18px",  fontSize: DS.type.sm,  borderRadius: DS.radius.md, gap: "6px" },
  md: { padding: "13px 28px", fontSize: DS.type.body, borderRadius: DS.radius.lg, gap: "8px" },
  lg: { padding: "16px 36px", fontSize: "16px",       borderRadius: DS.radius.xl, gap: "10px" },
};

const Btn = memo(({ children, onClick, variant = "primary", size = "md", style = {}, disabled = false, className = "", ariaLabel }) => {
  const v = BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary;
  const s = BUTTON_SIZES[size];
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`${v.className} ${className}`}
      aria-label={ariaLabel}
      style={{
        ...s,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        fontWeight: 800,
        letterSpacing: 0,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition: `all 0.22s ${DS.ease.smooth}`,
        fontFamily: "inherit",
        ...v,
        ...style,
      }}
    >
      {children}
    </button>
  );
});

// ── Badge ────────────────────────────────────────────────────────────
const Badge = memo(({ children, color = DS.color.mintLight, text = DS.color.mintDark, style = {} }) => (
  <span style={{
    background: color,
    color: text,
    borderRadius: DS.radius.pill,
    padding: "5px 14px",
    fontSize: DS.type.xs,
    fontWeight: 800,
    letterSpacing: 0,
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    border: `1px solid ${DS.color.border}`,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
    ...style,
  }}>
    {children}
  </span>
));

// ── Card ─────────────────────────────────────────────────────────────
const Card = memo(({ children, style = {}, className = "", glass = false }) => (
  <div
    className={`liquid-card ${className}`.trim()}
    style={{
      background: glass
        ? DS.color.bgGlass
        : DS.color.bgCard,
      backdropFilter: "blur(24px) saturate(150%)",
      WebkitBackdropFilter: "blur(24px) saturate(150%)",
      border: glass
        ? "1px solid rgba(255,255,255,0.18)"
        : `1px solid ${DS.color.border}`,
      borderRadius: DS.radius["2xl"],
      padding: DS.space[6],
      boxShadow: DS.shadow.md,
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
));

// ── Skeleton ──────────────────────────────────────────────────────────
const Skeleton = ({ width = "100%", height = 20, style = {} }) => (
  <div className="skeleton" style={{ width, height, borderRadius: DS.radius.md, ...style }} />
);

// ── Divider ───────────────────────────────────────────────────────────
const Divider = ({ style = {} }) => (
  <div style={{ height: 1, background: DS.color.border, ...style }} />
);

// ═══════════════════════════════════════════════════════════════════
//  DASHBOARD DATA & PREVIEW COMPONENT
// ═══════════════════════════════════════════════════════════════════
const MONTH_DATA = {
  Jan: { income: 45000, expenses: 32000, cats: [{ cat: "Housing", pct: 42 }, { cat: "Food", pct: 28 }, { cat: "Transport", pct: 15 }, { cat: "Other", pct: 15 }] },
  Feb: { income: 48000, expenses: 35000, cats: [{ cat: "Housing", pct: 40 }, { cat: "Food", pct: 30 }, { cat: "Transport", pct: 14 }, { cat: "Other", pct: 16 }] },
  Mar: { income: 46000, expenses: 30000, cats: [{ cat: "Housing", pct: 40 }, { cat: "Food", pct: 25 }, { cat: "Transport", pct: 13 }, { cat: "Other", pct: 22 }] },
  Apr: { income: 52000, expenses: 38000, cats: [{ cat: "Housing", pct: 38 }, { cat: "Food", pct: 26 }, { cat: "Transport", pct: 18 }, { cat: "Other", pct: 18 }] },
  May: { income: 50000, expenses: 33000, cats: [{ cat: "Housing", pct: 41 }, { cat: "Food", pct: 24 }, { cat: "Transport", pct: 16 }, { cat: "Other", pct: 19 }] },
  Jun: { income: 55000, expenses: 36000, cats: [{ cat: "Housing", pct: 40 }, { cat: "Food", pct: 25 }, { cat: "Transport", pct: 15 }, { cat: "Other", pct: 20 }] },
  Jul: { income: 53000, expenses: 40000, cats: [{ cat: "Housing", pct: 38 }, { cat: "Food", pct: 28 }, { cat: "Transport", pct: 17 }, { cat: "Other", pct: 17 }] },
  Aug: { income: 58000, expenses: 37000, cats: [{ cat: "Housing", pct: 39 }, { cat: "Food", pct: 26 }, { cat: "Transport", pct: 14 }, { cat: "Other", pct: 21 }] },
  Sep: { income: 56000, expenses: 34000, cats: [{ cat: "Housing", pct: 41 }, { cat: "Food", pct: 23 }, { cat: "Transport", pct: 16 }, { cat: "Other", pct: 20 }] },
  Oct: { income: 60000, expenses: 41000, cats: [{ cat: "Housing", pct: 37 }, { cat: "Food", pct: 29 }, { cat: "Transport", pct: 18 }, { cat: "Other", pct: 16 }] },
  Nov: { income: 62000, expenses: 45000, cats: [{ cat: "Housing", pct: 36 }, { cat: "Food", pct: 31 }, { cat: "Transport", pct: 17 }, { cat: "Other", pct: 16 }] },
  Dec: { income: 70000, expenses: 55000, cats: [{ cat: "Housing", pct: 35 }, { cat: "Food", pct: 33 }, { cat: "Transport", pct: 16 }, { cat: "Other", pct: 16 }] },
};
const CHART_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CAT_COLORS   = [DS.color.purple, DS.color.gold, DS.color.mint, DS.color.rose];

const DashboardSkeleton = () => (
  <div className="dashboard-glass" style={{ padding: 20, background: DS.color.bgCard, borderRadius: DS.radius.xl, border: `1px solid ${DS.color.border}` }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
      <div><Skeleton width={160} height={22} style={{ marginBottom: 8 }} /><Skeleton width={80} height={14} /></div>
      <Skeleton width={90} height={28} style={{ borderRadius: DS.radius.pill }} />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
      {[1,2,3].map(i => (
        <div key={i} style={{ background: DS.color.bgGlass, borderRadius: DS.radius.lg, padding: 14, border: `1px solid ${DS.color.border}` }}>
          <Skeleton height={12} style={{ marginBottom: 8 }} /><Skeleton height={28} />
        </div>
      ))}
    </div>
    <Skeleton height={120} style={{ borderRadius: DS.radius.lg, marginBottom: 12 }} />
    <Skeleton height={100} style={{ borderRadius: DS.radius.lg }} />
  </div>
);

const DashboardPreview = memo(({ selectedMonth = "Jun", onMonthChange }) => {
  const data      = MONTH_DATA[selectedMonth];
  const savings   = data.income - data.expenses;
  const savingsPct = Math.round((savings / data.income) * 100);
  const maxVal    = 75000;
  const [animated, setAnimated] = useState(false);
  const fmt = (v) => `₹${v.toLocaleString("en-IN")}`;
  const activity = [
    { label: "Salary credited", value: `+${fmt(Math.round(data.income * 0.74))}`, color: DS.color.mint },
    { label: "Groceries budget", value: `${data.cats[1].pct}% used`, color: DS.color.gold },
    { label: "Savings runway", value: `${savingsPct}% saved`, color: DS.color.purple },
  ];

  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(t);
  }, [selectedMonth]);

  return (
    <div className="dashboard-glass" style={{
      background: "linear-gradient(145deg, rgba(17,17,20,0.92), rgba(8,8,10,0.98))",
      borderRadius: DS.radius["2xl"],
      padding: 18,
      fontFamily: DS.font.body,
      transition: `all 0.3s ${DS.ease.smooth}`,
      border: `1px solid ${DS.color.border}`,
      boxShadow: `${DS.shadow["2xl"]}, inset 0 1px 0 rgba(255,255,255,0.10)`,
      position: "relative",
      overflow: "hidden",
      isolation: "isolate",
    }}>
      <div style={{ position: "absolute", inset: 0, background: DS.grad.aurora, opacity: 0.42, pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 220, height: 220, borderRadius: "50%", right: -90, top: -100, background: DS.color.mint, opacity: 0.10, filter: "blur(32px)", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div className="heading-font" style={{ fontSize: 15, fontWeight: 900, color: DS.color.navy, letterSpacing: 0 }}>Smart Expense Tracker</div>
          <div style={{ fontSize: 11, color: DS.color.slateLight, marginTop: 2 }}>{selectedMonth} 2026 · Income, expenses, savings</div>
        </div>
        {onMonthChange ? (
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            style={{
              background: "rgba(255,255,255,0.08)",
              color: DS.color.navy,
              border: `1px solid ${DS.color.border}`,
              borderRadius: DS.radius.pill,
              padding: "5px 14px",
              fontSize: DS.type.xs,
              fontWeight: 700,
              cursor: "pointer",
              appearance: "none",
              WebkitAppearance: "none",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
            }}
          >
            {CHART_MONTHS.map(m => <option key={m} value={m}>{m} 2026</option>)}
          </select>
        ) : (
          <Badge>{selectedMonth} 2026</Badge>
        )}
      </div>

      {/* KPI Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 14 }}>
        {[
          { l: "Income",   v: fmt(data.income),   c: DS.color.mint,   icon: "↑", bg: DS.color.mintLight },
          { l: "Expenses", v: fmt(data.expenses),  c: DS.color.rose,   icon: "↓", bg: "rgba(255,107,138,0.12)" },
          { l: "Savings",  v: fmt(savings),        c: DS.color.purple, icon: `${savingsPct}%`, bg: DS.color.purpleLight },
        ].map((m) => (
          <div key={m.l} style={{
            background: DS.color.bgGlass,
            borderRadius: DS.radius.lg,
            padding: "12px 10px",
            border: `1px solid ${DS.color.border}`,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            transition: `all 0.3s ${DS.ease.smooth}`,
            animation: animated ? "countUp 0.4s ease" : "none",
          }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 24, height: 24,
              borderRadius: DS.radius.md,
              background: m.bg,
              marginBottom: 6,
            }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: m.c }}>{m.icon}</span>
            </div>
            <div style={{ fontSize: 10, color: DS.color.slateLight, fontWeight: 600 }}>{m.l}</div>
            <div className="kpi-number" style={{ fontSize: 15, fontWeight: 900, color: m.c, marginTop: 2, letterSpacing: 0 }}>{m.v}</div>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div style={{
        background: DS.color.bgGlass,
        borderRadius: DS.radius.lg,
        padding: "14px 12px",
        border: `1px solid ${DS.color.border}`,
        marginBottom: 10,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: DS.color.slate, marginBottom: 10, letterSpacing: 0, textTransform: "uppercase" }}>
          Income vs Expenses · All Months
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 72 }}>
          {CHART_MONTHS.map((m) => {
            const d = MONTH_DATA[m];
            const iH = animated ? `${(d.income / maxVal) * 72}px` : "0px";
            const eH = animated ? `${(d.expenses / maxVal) * 72}px` : "0px";
            const isSel = m === selectedMonth;
            return (
              <div key={m} style={{ flex: 1, display: "flex", gap: 1.5, alignItems: "flex-end", cursor: "pointer" }} onClick={() => onMonthChange && onMonthChange(m)}>
                <div className="chart-bar" style={{ flex: 1, background: isSel ? DS.color.mint : `${DS.color.mint}55`, borderRadius: "3px 3px 0 0", height: iH, transition: `height 0.55s ${DS.ease.spring}`, minHeight: 2, boxShadow: isSel ? `0 0 16px ${DS.color.mintGlow}` : "none" }} />
                <div className="chart-bar" style={{ flex: 1, background: isSel ? DS.color.rose : `${DS.color.rose}55`, borderRadius: "3px 3px 0 0", height: eH, transition: `height 0.55s ${DS.ease.spring} 0.1s`, minHeight: 2, boxShadow: isSel ? "0 0 16px rgba(255,107,138,0.28)" : "none" }} />
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 5 }}>
          {CHART_MONTHS.map((m) => (
            <div key={m} style={{ flex: 1, fontSize: 7.5, color: m === selectedMonth ? DS.color.navy : DS.color.slateLight, textAlign: "center", fontWeight: m === selectedMonth ? 800 : 400, transition: "all 0.2s" }}>
              {m}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          {[{ c: DS.color.mint, l: "Income" }, { c: DS.color.rose, l: "Expenses" }].map(x => (
            <div key={x.l} style={{ display: "flex", gap: 5, alignItems: "center" }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: x.c }} />
              <span style={{ fontSize: 9, color: DS.color.slateLight, fontWeight: 600 }}>{x.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div style={{ background: DS.color.bgGlass, borderRadius: DS.radius.lg, padding: "14px 12px", border: `1px solid ${DS.color.border}`, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: DS.color.slate, marginBottom: 10, letterSpacing: 0, textTransform: "uppercase" }}>Spending Breakdown</div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {/* Mini donut visualization */}
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: `conic-gradient(${data.cats.map((c, i) => `${CAT_COLORS[i]} ${i === 0 ? 0 : data.cats.slice(0, i).reduce((a, b) => a + b.pct, 0)}% ${data.cats.slice(0, i + 1).reduce((a, b) => a + b.pct, 0)}%`).join(", ")})`, flexShrink: 0 }} />
          <div style={{ flex: 1, display: "grid", gap: 4 }}>
            {data.cats.map((c, i) => (
              <div key={c.cat} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                  <div style={{ width: 6, height: 6, borderRadius: 2, background: CAT_COLORS[i], flexShrink: 0 }} />
                  <span style={{ fontSize: 9, color: DS.color.slateLight }}>{c.cat}</span>
                </div>
                <span className="number-font" style={{ fontSize: 9, fontWeight: 700, color: DS.color.navy }}>{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
        {activity.map((item, index) => (
          <div key={item.label} style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            padding: "9px 11px",
            borderRadius: DS.radius.md,
            background: "rgba(255,255,255,0.055)",
            border: `1px solid ${DS.color.border}`,
            animation: animated ? `fadeInUp 0.45s ${DS.ease.out} ${index * 0.06}s both` : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: item.color, boxShadow: `0 0 14px ${item.color}` }} />
              <span style={{ fontSize: 10, color: DS.color.slateLight, fontWeight: 700 }}>{item.label}</span>
            </div>
            <span className="number-font" style={{ fontSize: 11, color: item.color, fontWeight: 900 }}>{item.value}</span>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════
//  STICKY CTA
// ═══════════════════════════════════════════════════════════════════
const StickyCTA = memo(({ visible }) => {
  const navigate = useNavigate();
  const goTo = (path) => { navigate(path); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return (
    <div className="sticky-cta" style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
      display: visible ? "flex" : "none",
      background: DS.color.navyGlass,
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      padding: "14px 24px",
      gap: 12,
      alignItems: "center",
      justifyContent: "space-between",
      borderTop: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 -8px 40px rgba(0,0,0,0.35)",
      animation: "slideDown 0.3s ease",
    }}>
      <div>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 14, letterSpacing: 0 }}>🎯 BudgetPro Smart Expense Tracker</div>
        <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 2 }}>Starting at just ₹19 · One-time purchase</div>
      </div>
      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
        <Btn size="sm" variant="glass" onClick={() => goTo("/checkout?plan=monthly")}>Start Tracking for ₹19</Btn>
        <Btn size="sm" variant="gold" onClick={() => goTo("/checkout?plan=yearly")} style={{ animation: "pulse 2s infinite" }}>
          Download Full Year — ₹49
        </Btn>
      </div>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════
//  PRICING CARD
// ═══════════════════════════════════════════════════════════════════
const PricingCard = memo(({ plan }) => {
  const navigate = useNavigate();
  const goTo = (path) => { navigate(path); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const isHighlighted = plan.highlight;

  return (
    <div
      className={`card-lift glow-border ${isHighlighted ? "scale-in" : ""}`}
      style={{
        background: isHighlighted ? DS.grad.navyMid : DS.color.bgCard,
        border: isHighlighted ? `2px solid ${DS.color.mint}` : `1px solid ${DS.color.border}`,
        borderRadius: DS.radius["3xl"],
        padding: "40px 36px",
        position: "relative",
        overflow: "hidden",
        boxShadow: isHighlighted ? `${DS.shadow["2xl"]}, 0 0 60px rgba(0,200,150,0.18)` : DS.shadow.lg,
        transform: isHighlighted ? "scale(1.03)" : "scale(1)",
      }}
    >
      {/* Orb decorations on highlighted card */}
      {isHighlighted && (
        <>
          <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: DS.color.mint, opacity: 0.07, animation: "orb 12s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: -40, left: -40, width: 140, height: 140, borderRadius: "50%", background: DS.color.purple, opacity: 0.09, animation: "orb 9s ease-in-out infinite reverse" }} />
          <div style={{ position: "absolute", top: "40%", right: "10%", width: 80, height: 80, borderRadius: "50%", background: DS.color.gold, opacity: 0.06 }} />
        </>
      )}

      {/* Best Value tag */}
      {isHighlighted && (
        <div style={{
          position: "absolute", top: -1, right: 28,
          background: DS.grad.gold,
          color: "#fff",
          fontSize: 10,
          fontWeight: 800,
          padding: "5px 16px 9px",
          borderRadius: "0 0 14px 14px",
          boxShadow: DS.shadow.gold,
          letterSpacing: 0,
        }}>
          ⭐ BEST VALUE
        </div>
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
        <Badge
          color={isHighlighted ? "rgba(0,200,150,0.15)" : DS.color.mintLight}
          text={isHighlighted ? DS.color.mint : DS.color.mintDark}
        >
          {plan.badge}
        </Badge>

        <h3 style={{
          fontSize: DS.type.h4,
          fontWeight: 800,
          color: isHighlighted ? "#fff" : DS.color.navy,
          marginTop: 14,
          marginBottom: 4,
          letterSpacing: 0,
        }}>
          {plan.name}
        </h3>
        <p style={{
          fontSize: DS.type.sm,
          color: isHighlighted ? "rgba(255,255,255,0.6)" : DS.color.slateLight,
          marginBottom: 24,
          lineHeight: 1.6,
        }}>
          {plan.desc}
        </p>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 6 }}>
          <span className="price-font" style={{
            fontSize: 56,
            fontWeight: 900,
            color: isHighlighted ? "#fff" : DS.color.navy,
            lineHeight: 1,
            letterSpacing: 0,
          }}>
            ₹{plan.price}
          </span>
          <div style={{ paddingBottom: 10 }}>
            <div className="price-font" style={{
              color: isHighlighted ? "rgba(255,255,255,0.35)" : DS.color.slateLight,
              textDecoration: "line-through",
              fontSize: 18,
              fontWeight: 600,
            }}>
              ₹{plan.original}
            </div>
            <Badge color="rgba(252,129,129,0.15)" text={DS.color.rose}>{plan.discount} OFF</Badge>
          </div>
        </div>

        <div style={{
          fontSize: DS.type.xs,
          color: isHighlighted ? "rgba(255,255,255,0.45)" : DS.color.slateLight,
          marginBottom: 28,
          letterSpacing: 0,
        }}>
          One-time payment · Instant download
        </div>

        <ul style={{ listStyle: "none", marginBottom: 32, display: "grid", gap: 12 }}>
          {plan.features.map((f) => (
            <li key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{
                background: isHighlighted ? "rgba(0,200,150,0.18)" : DS.color.mintLight,
                borderRadius: "50%",
                width: 22, height: 22,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginTop: 1,
                boxShadow: isHighlighted ? "0 2px 8px rgba(0,200,150,0.3)" : "none",
              }}>
                <Icon name="check" size={11} color={DS.color.mint} />
              </div>
              <span style={{
                color: isHighlighted ? "rgba(255,255,255,0.85)" : DS.color.slate,
                fontSize: DS.type.sm,
                lineHeight: 1.6,
              }}>
                {f}
              </span>
            </li>
          ))}
        </ul>

        <Btn
          size="lg"
          variant={isHighlighted ? "primary" : "outline"}
          onClick={() => goTo(`/checkout?plan=${plan.id}`)}
          style={{
            width: "100%",
            justifyContent: "center",
            boxShadow: isHighlighted ? DS.shadow.glowLg : "none",
          }}
        >
          <Icon name={isHighlighted ? "bag" : "download"} size={18} color={isHighlighted ? "#fff" : DS.color.mint} />
          {plan.cta}
        </Btn>
      </div>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════
//  TESTIMONIAL CARD
// ═══════════════════════════════════════════════════════════════════
const TestimonialCard = memo(({ t }) => (
  <Card className="card-lift" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map((s) => (
        <Icon key={s} name="star" size={14} color={DS.color.gold} filled />
      ))}
    </div>
    <p style={{
      color: DS.color.slate,
      fontSize: DS.type.sm,
      lineHeight: 1.8,
      fontStyle: "italic",
      flex: 1,
    }}>
      "{t.text}"
    </p>
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      paddingTop: 14,
      borderTop: `1px solid ${DS.color.border}`,
    }}>
      <div style={{
        width: 44, height: 44,
        borderRadius: "50%",
        background: DS.grad.navyMid,
        color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 800,
        flexShrink: 0,
        boxShadow: DS.shadow.md,
      }}>
        {t.avatar}
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: DS.color.navy }}>{t.name}</div>
        <div style={{ fontSize: DS.type.xs, color: DS.color.slateLight, marginTop: 1 }}>{t.role}</div>
      </div>
    </div>
  </Card>
));

// ═══════════════════════════════════════════════════════════════════
//  HOME PAGE
// ═══════════════════════════════════════════════════════════════════
const HomePage = memo(() => {
  const navigate = useNavigate();
  const goTo = (path) => { navigate(path); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const [selectedMonth, setSelectedMonth]   = useState("Jun");
  const [stickyVisible, setStickyVisible]   = useState(false);
  const [previewLoaded, setPreviewLoaded]   = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPreviewLoaded(true), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fn = () => setStickyVisible(window.scrollY > 500);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const testimonials = [
    { name: "Priya Sharma",  role: "Homemaker, Mumbai",              text: "This dashboard changed how I manage our family budget. I finally know where every rupee goes. Worth 10x the price!", avatar: "PS" },
    { name: "Rahul Verma",   role: "Software Engineer, Bangalore",   text: "Worth every rupee. My savings went from 8% to 31% in just 4 months. Smart Expense Tracker is a game changer.", avatar: "RV" },
    { name: "Ananya Patel",  role: "Freelancer, Ahmedabad",          text: "Finally an expense tracker that doesn't feel overwhelming. I set it up in 10 minutes and I've been using it every day.", avatar: "AP" },
    { name: "Deepak Singh",  role: "Teacher, Delhi",                 text: "My savings rate went from 10% to 28% in 3 months! I could finally afford my dream vacation.", avatar: "DS" },
  ];

  const benefits = [
    { icon: "trending", title: "Track Every Rupee",       desc: "See exactly where your money goes with automatic categorization. No more month-end surprises." },
    { icon: "zap",      title: "Instant Visual Insights", desc: "Beautiful charts that make your finances crystal clear. Understand your money in seconds." },
    { icon: "shield",   title: "100% Private & Secure",   desc: "Your data stays on your device. No cloud, no subscriptions, no data selling. Ever." },
    { icon: "star",     title: "Beginner Friendly",       desc: "No finance degree needed. If you can open Excel, you can master your budget." },
    { icon: "download", title: "Instant Download",        desc: "Pay once, download immediately. No waiting, no signup, no monthly fees." },
    { icon: "check",    title: "Lifetime Access",         desc: "Buy once, use forever. Free updates whenever we improve Smart Expense Tracker." },
  ];

  const plans = [
    {
      id: "monthly", name: "Monthly Smart Expense Tracker", badge: "Perfect for Beginners", price: 19, original: 299, discount: "94%",
      desc: "Single-month expense tracking — the fastest way to see where your money goes.",
      cta: "Start Tracking for ₹19", highlight: false,
      features: ["1 Month Smart Expense Tracker", "Income & Expense Tracking", "Category Breakdown Charts", "Savings Goal Tracker", "Works on Excel + Google Sheets", "Instant Download"],
    },
    {
      id: "yearly", name: "Full Year Smart Expense Tracker", badge: "12 Months + Yearly View", price: 49, original: 999, discount: "95%",
      desc: "Complete annual expense tracking with yearly overview — best for serious savers.",
      cta: "Download Full Year — ₹49", highlight: true,
      features: ["All 12 Months Included", "Annual Smart Expense Overview", "Year-on-Year Comparison", "Better Savings Tracking", "Category Trend Analysis", "Priority Email Support", "Free Future Updates", "Instant Download"],
    },
  ];

  const trustBadges = [
    { icon: "🔒", text: "256-bit SSL" },
    { icon: "⚡", text: "Instant Download" },
    { icon: "♾️", text: "Lifetime Access" },
    { icon: "💳", text: "Razorpay Secured" },
    { icon: "📱", text: "Works on Mobile" },
  ];

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <StickyCTA visible={stickyVisible} />

      {/* ══════════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════════ */}
      <section style={{
        background: DS.grad.hero,
        padding: "100px 20px 90px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Ambient orbs */}
        <div style={{ position: "absolute", top: -150, right: -100, width: 600, height: 600, borderRadius: "50%", background: DS.color.mint, opacity: 0.04, animation: "orb 14s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: -100, left: -100, width: 500, height: 500, borderRadius: "50%", background: DS.color.purple, opacity: 0.05, animation: "orb 11s ease-in-out infinite reverse" }} />
        <div style={{ position: "absolute", top: "35%", left: "18%", width: 250, height: 250, borderRadius: "50%", background: DS.color.gold, opacity: 0.03, animation: "float 9s ease-in-out infinite" }} />

        {/* Noise texture */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.08fr", gap: 64, alignItems: "center" }}>

            {/* ── Left: Copy ── */}
            <div className="fade-in-up">
              <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
                <Badge color="rgba(0,200,150,0.14)" text={DS.color.mint} style={{ animation: "pulse 3s infinite" }}>
                  🎯 Limited-time Pricing
                </Badge>
                <Badge color="rgba(246,173,85,0.14)" text={DS.color.gold}>
                  ⭐ 4.9 Rating · 5,000+ Buyers
                </Badge>
              </div>

              <h1 className="heading-font" style={{
                fontSize: DS.type.h1,
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1.1,
                marginBottom: 22,
                letterSpacing: 0,
              }}>
                Your money isn’t disappearing —<br />
                <span style={{ color: DS.color.mint }}>it’s just untracked.</span>
              </h1>

              <p style={{
                fontSize: 17,
                color: "rgba(255,255,255,0.7)",
                marginBottom: 32,
                lineHeight: 1.8,
                maxWidth: 480,
              }}>
                Meet Smart Expense Tracker — a premium Excel dashboard that shows exactly where every rupee goes, how much you save, and what you can control every month.
              </p>

              {/* Reasons grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 36 }}>
                {[
                  { emoji: "₹", text: "Track every rupee with clarity" },
                  { emoji: "📊", text: "Monthly and yearly expense views" },
                  { emoji: "💎", text: "Premium dashboard visuals" },
                  { emoji: "♾️", text: "One-time purchase, lifetime use" },
                ].map((r) => (
                  <div key={r.text} style={{
                    display: "flex", gap: 10, alignItems: "center",
                    background: "rgba(255,255,255,0.07)",
                    borderRadius: DS.radius.lg,
                    padding: "10px 14px",
                    backdropFilter: "blur(6px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}>
                    <span style={{ fontSize: 16 }}>{r.emoji}</span>
                    <span style={{ color: "rgba(255,255,255,0.85)", fontSize: DS.type.sm, fontWeight: 600, lineHeight: 1.4 }}>{r.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="hero-actions" style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 40 }}>
                <Btn size="lg" onClick={() => goTo("/checkout?plan=monthly")} style={{ boxShadow: DS.shadow.glowLg }}>
                  <Icon name="download" size={20} color="#fff" />
                  Start Tracking for ₹19
                </Btn>
                <Btn size="lg" variant="gold" onClick={() => goTo("/checkout?plan=yearly")} style={{ boxShadow: DS.shadow.gold }}>
                  Download Instantly
                </Btn>
              </div>

              {/* Stats row */}
              <div className="stats-row" style={{ display: "flex", gap: 36 }}>
                {[
                  { v: "5,000+", l: "Happy Users" },
                  { v: "4.9★",   l: "Average Rating" },
                  { v: "₹19",    l: "Starting Price" },
                  { v: "< 2min", l: "Setup Time" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="number-font" style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: 0 }}>{s.v}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 3, fontWeight: 500, letterSpacing: 0, textTransform: "uppercase" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Interactive Preview ── */}
            <div className="fade-in-up" style={{ animationDelay: "0.15s" }}>
              <div style={{
                background: "rgba(255,255,255,0.05)",
                borderRadius: DS.radius["3xl"],
                padding: 3,
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(12px)",
                boxShadow: `${DS.shadow["2xl"]}, 0 0 80px rgba(0,0,0,0.5)`,
                animation: "floatSlow 10s ease-in-out infinite",
              }}>
                {/* Browser chrome */}
                <div style={{
                  background: "rgba(255,255,255,0.07)",
                  borderRadius: `${DS.radius["3xl"]} ${DS.radius["3xl"]} 0 0`,
                  padding: "12px 16px",
                  display: "flex", gap: 8, alignItems: "center",
                }}>
                  {["#FC8181","#F6AD55","#68D391"].map((c) => (
                    <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
                  ))}
                  <div style={{
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: DS.radius.md,
                    padding: "4px 20px",
                    fontSize: 10,
                    color: "rgba(255,255,255,0.45)",
                    marginLeft: 8,
                    flex: 1,
                  }}>
                    smart-expense-tracker.xlsx · Live Preview
                  </div>
                </div>
                <div style={{ padding: "0 3px 3px", borderRadius: `0 0 ${DS.radius["3xl"]} ${DS.radius["3xl"]}`, overflow: "hidden" }}>
                  {previewLoaded ? (
                    <DashboardPreview selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
                  ) : (
                    <DashboardSkeleton />
                  )}
                </div>
              </div>
              <div style={{ textAlign: "center", marginTop: 14 }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: DS.type.xs }}>
                  👆 Click any month bar or use the dropdown to explore
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          URGENCY STRIP
      ══════════════════════════════════════════════════════════ */}
      <div style={{
        background: "linear-gradient(90deg, #7C3AED, #EC4899, #7C3AED)",
        backgroundSize: "200% 100%",
        animation: "gradShift 6s ease infinite",
        padding: "13px 20px",
        textAlign: "center",
      }}>
        <span style={{ color: "#fff", fontSize: DS.type.sm, fontWeight: 600 }}>
          ⚡ <strong>Limited-time pricing</strong> — save up to 95% today. Price going up soon!
        </span>
      </div>

      {/* ══════════════════════════════════════════════════════════
          PRICING SECTION
      ══════════════════════════════════════════════════════════ */}
      <section id="pricing" style={{ padding: "96px 20px", background: DS.color.bg }}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <Badge style={{ marginBottom: 16 }}>Choose Your Plan</Badge>
            <h2 style={{
              fontSize: DS.type.h2,
              fontWeight: 900,
              color: DS.color.navy,
              lineHeight: 1.12,
              marginBottom: 16,
              letterSpacing: 0,
            }}>
              Feels like a <span style={{ color: DS.color.mint }}>₹999 product.</span><br />
              Priced for everyone.
            </h2>
            <p style={{ color: DS.color.slateLight, fontSize: 17, maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
              Pick the plan that fits your goals. Both include instant download and lifetime access.
            </p>
          </div>

          <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, alignItems: "center" }}>
            {plans.map((plan) => <PricingCard key={plan.id} plan={plan} />)}
          </div>

          {/* Trust badges */}
          <div style={{ display: "flex", justifyContent: "center", gap: 36, marginTop: 52, flexWrap: "wrap" }}>
            {trustBadges.map((b) => (
              <div key={b.text} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ fontSize: 16 }}>{b.icon}</span>
                <span style={{ fontSize: DS.type.sm, color: DS.color.slateLight, fontWeight: 600 }}>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          LIVE DEMO SECTION
      ══════════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 20px", background: DS.color.bgCard }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <Badge style={{ marginBottom: 16 }}>Live Demo</Badge>
            <h2 style={{ fontSize: DS.type.h2, fontWeight: 900, color: DS.color.navy, marginBottom: 12, letterSpacing: 0 }}>
              See It In Action
            </h2>
            <p style={{ color: DS.color.slateLight, fontSize: 16, lineHeight: 1.7 }}>
              Switch months to simulate real usage — this is exactly what Smart Expense Tracker shows you
            </p>
          </div>

          <div style={{
            boxShadow: DS.shadow["2xl"],
            borderRadius: DS.radius["2xl"],
            overflow: "hidden",
            border: `1px solid ${DS.color.border}`,
          }}>
            {/* Browser chrome */}
            <div style={{
              background: DS.color.bgCard,
              padding: "12px 18px",
              display: "flex",
              gap: 8, alignItems: "center",
              borderBottom: `1px solid ${DS.color.border}`,
            }}>
              {["#FC8181","#F6AD55","#68D391"].map((c) => (
                <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
              ))}
              <div style={{ background: DS.color.bgGlass, borderRadius: DS.radius.md, padding: "4px 22px", fontSize: 11, color: DS.color.slateLight, marginLeft: 8 }}>
                smart-expense-tracker.xlsx
              </div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 5, flexWrap: "wrap" }}>
                {CHART_MONTHS.map(m => (
                  <button key={m} onClick={() => setSelectedMonth(m)} style={{
                    padding: "3px 8px",
                    borderRadius: DS.radius.sm,
                    border: `1px solid ${selectedMonth === m ? DS.color.mint : DS.color.border}`,
                    background: selectedMonth === m ? DS.color.mintLight : "transparent",
                    color: selectedMonth === m ? DS.color.mintDark : DS.color.slateLight,
                    fontSize: 10,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: `all 0.2s ${DS.ease.smooth}`,
                  }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ padding: 24, background: DS.color.surface }}>
              <DashboardPreview selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          BENEFITS SECTION
      ══════════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 20px", background: DS.color.bg }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <Badge style={{ marginBottom: 16 }}>Why BudgetPro</Badge>
            <h2 style={{ fontSize: DS.type.h2, fontWeight: 900, color: DS.color.navy, letterSpacing: 0, marginBottom: 12 }}>
              Everything You Need to Win With Money
            </h2>
            <p style={{ color: DS.color.slateLight, fontSize: 16, lineHeight: 1.7 }}>
              Built for Indians who want to get serious about their finances
            </p>
          </div>

          <div className="benefits-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {benefits.map((b, i) => (
              <Card key={b.title} className="card-lift" style={{
                display: "flex", gap: 16, alignItems: "flex-start",
                animation: `fadeInUp 0.5s ${DS.ease.out} ${i * 0.08}s both`,
              }}>
                <div style={{
                  background: `linear-gradient(135deg, ${DS.color.mintLight}, rgba(0,200,150,0.12))`,
                  borderRadius: DS.radius.lg,
                  padding: 14,
                  flexShrink: 0,
                  border: `1px solid ${DS.color.mint}18`,
                }}>
                  <Icon name={b.icon} size={22} color={DS.color.mint} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: DS.color.navy, marginBottom: 6, fontSize: 15, letterSpacing: 0 }}>
                    {b.title}
                  </div>
                  <div style={{ color: DS.color.slateLight, fontSize: DS.type.sm, lineHeight: 1.7 }}>
                    {b.desc}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 20px", background: DS.color.bgCard }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <Badge style={{ marginBottom: 16 }}>Real Reviews</Badge>
            <h2 style={{ fontSize: DS.type.h2, fontWeight: 900, color: DS.color.navy, letterSpacing: 0, marginBottom: 8 }}>
              Loved by Thousands of Indians
            </h2>
            <p style={{ color: DS.color.slateLight, fontSize: 16 }}>
              People just like you who took control of their money
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24 }}>
            {testimonials.map((t) => <TestimonialCard key={t.name} t={t} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════ */}
      <section style={{
        background: DS.grad.hero,
        padding: "96px 20px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 450, height: 450, borderRadius: "50%", background: DS.color.mint, opacity: 0.04, animation: "orb 13s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 350, height: 350, borderRadius: "50%", background: DS.color.purple, opacity: 0.05, animation: "orb 10s ease-in-out infinite reverse" }} />

        <div style={{ maxWidth: 640, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 52, marginBottom: 24, animation: "float 4s ease-in-out infinite" }}>💰</div>
          <h2 style={{
            fontSize: DS.type.h2,
            fontWeight: 900,
            color: "#fff",
            marginBottom: 18,
            letterSpacing: 0,
            lineHeight: 1.15,
          }}>
            Ready to <span style={{ color: DS.color.mint }}>transform your finances</span>?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 17, marginBottom: 44, lineHeight: 1.75 }}>
            Join 5,000+ Indians already using BudgetPro Smart Expense Tracker to save more, spend smarter, and stress less about money.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn size="lg" variant="glass" onClick={() => goTo("/checkout?plan=monthly")}>
              Take Control of My Money
            </Btn>
            <Btn size="lg" variant="gold" onClick={() => goTo("/checkout?plan=yearly")} style={{ animation: "pulse 2s infinite", boxShadow: DS.shadow.gold }}>
              Download Full Year — ₹49
            </Btn>
          </div>
          <div style={{ marginTop: 28, color: "rgba(255,255,255,0.4)", fontSize: DS.type.sm }}>
            🔒 Secure payment · Instant download · 100% satisfaction
          </div>
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
  const goTo = (path) => { navigate(path); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const [activeTab, setActiveTab]     = useState("features");
  const [selectedMonth, setSelectedMonth] = useState("Jun");
  const [selectedPlan, setSelectedPlan]   = useState("yearly");

  const features = [
    "Monthly income & expense tracker", "Income vs Savings visualization charts",
    "Category-wise expense breakdown",  "Savings goal progress tracker",
    "Annual expense summary (Full Year only)", "Beginner-friendly, no macros needed",
    "Works on Excel 2016+ and Google Sheets",    "Indian Rupee (₹) formatted throughout",
    "12-month rolling expense view (Full Year)", "Print-ready monthly reports",
  ];

  const specs = [
    ["Format",        "Excel (.xlsx) + Google Sheets link"],
    ["Compatibility", "Excel 2016, 2019, 2021, 365, Google Sheets"],
    ["File Size",     "~2.4 MB (Monthly) / ~4.1 MB (Full Year)"],
    ["Currency",      "Indian Rupee (₹)"],
    ["Language",      "English"],
    ["Macros",        "No macros — 100% safe to open"],
    ["Updates",       "Free lifetime updates"],
    ["Support",       "Email support included"],
  ];

  return (
    <div style={{ background: DS.color.bg, minHeight: "100vh", padding: "60px 20px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="product-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 52, alignItems: "start" }}>

          {/* Left: Preview */}
          <div>
            <div style={{
              boxShadow: DS.shadow["2xl"],
              borderRadius: DS.radius["2xl"],
              overflow: "hidden",
              border: `1px solid ${DS.color.border}`,
            }}>
              <div style={{ background: DS.color.bgCard, padding: "12px 18px", display: "flex", gap: 8, alignItems: "center" }}>
                {["#FC8181","#F6AD55","#68D391"].map((c) => (
                  <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                ))}
                <div style={{ background: DS.color.bgGlass, borderRadius: DS.radius.md, padding: "4px 16px", fontSize: 11, color: DS.color.slateLight, marginLeft: 6 }}>
                  Live Preview
                </div>
              </div>
              <div style={{ padding: 16, background: DS.color.surface }}>
                <DashboardPreview selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 16 }}>
              {[
                { icon: "shield",   text: "Secure Payment" },
                { icon: "zap",      text: "Instant Download" },
                { icon: "check",    text: "Lifetime Access" },
              ].map((b) => (
                <div key={b.text} style={{
                  background: DS.color.bgCard,
                  border: `1px solid ${DS.color.border}`,
                  borderRadius: DS.radius.lg,
                  padding: "14px 10px",
                  textAlign: "center",
                  boxShadow: DS.shadow.sm,
                }}>
                  <Icon name={b.icon} size={20} color={DS.color.mint} />
                  <div style={{ fontSize: 11, color: DS.color.slate, marginTop: 7, fontWeight: 700 }}>{b.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div>
            <Badge style={{ marginBottom: 12 }}>⭐ Best Seller</Badge>
            <h1 style={{
              fontSize: DS.type.h1,
              fontWeight: 900,
              color: DS.color.navy,
              margin: "14px 0 10px",
              lineHeight: 1.15,
              letterSpacing: 0,
            }}>
              BudgetPro Smart Expense Tracker
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
              <div style={{ display: "flex", gap: 2 }}>
                {[1,2,3,4,5].map((s) => <Icon key={s} name="star" size={16} color={DS.color.gold} filled />)}
              </div>
              <span style={{ color: DS.color.slateLight, fontSize: 14, fontWeight: 600 }}>4.9 · 312 verified reviews</span>
            </div>

            <p style={{ color: DS.color.slate, lineHeight: 1.8, marginBottom: 28, fontSize: DS.type.body }}>
              A professionally designed Excel and Google Sheets dashboard that makes expense tracking simple, beautiful, and actually useful. Track every rupee, visualize your savings journey, and finally understand where your money goes.
            </p>

            {/* Plan selector */}
            <div style={{
              background: DS.color.surface,
              borderRadius: DS.radius.xl,
              padding: 4,
              display: "flex", gap: 4,
              marginBottom: 22,
            }}>
              {[
                { id: "monthly", label: "Monthly", price: "₹19" },
                { id: "yearly",  label: "Full Year", price: "₹49" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  style={{
                    flex: 1, padding: "12px 16px",
                    borderRadius: DS.radius.lg,
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: 14,
                    background: selectedPlan === p.id ? DS.color.bgGlass : "transparent",
                    border: selectedPlan === p.id ? `1px solid ${DS.color.border}` : "1px solid transparent",
                    color: selectedPlan === p.id ? DS.color.navy : DS.color.slateLight,
                    boxShadow: selectedPlan === p.id ? DS.shadow.md : "none",
                    transition: `all 0.2s ${DS.ease.smooth}`,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                >
                  {p.label}
                  <span className="price-font" style={{ color: selectedPlan === p.id ? DS.color.mint : DS.color.slateLight, fontWeight: 900 }}>
                    {p.price}
                  </span>
                  {p.id === "yearly" && (
                    <Badge color="rgba(246,173,85,0.15)" text={DS.color.gold} style={{ fontSize: 10, padding: "2px 8px" }}>
                      Best Value
                    </Badge>
                  )}
                </button>
              ))}
            </div>

            {/* Price Box */}
            <Card style={{
              marginBottom: 24,
              background: DS.grad.navyMid,
              border: "none",
              boxShadow: `${DS.shadow.xl}, 0 0 40px rgba(0,200,150,0.1)`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 22 }}>
                <div className="price-font" style={{ fontSize: 58, fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: 0 }}>
                  {selectedPlan === "monthly" ? "₹19" : "₹49"}
                </div>
                <div>
                  <div className="price-font" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "line-through", fontSize: 20, fontWeight: 600 }}>
                    {selectedPlan === "monthly" ? "₹299" : "₹999"}
                  </div>
                  <Badge color="rgba(252,129,129,0.2)" text={DS.color.rose}>
                    {selectedPlan === "monthly" ? "94% OFF" : "95% OFF"}
                  </Badge>
                  {selectedPlan === "yearly" && (
                    <div style={{ color: DS.color.gold, fontSize: DS.type.xs, fontWeight: 700, marginTop: 5 }}>
                      ⭐ Best Value — Save ₹30 vs Monthly × 12
                    </div>
                  )}
                </div>
              </div>
              <Btn
                size="lg"
                onClick={() => goTo(`/checkout?plan=${selectedPlan}`)}
                style={{ width: "100%", justifyContent: "center", boxShadow: DS.shadow.glowLg }}
              >
                <Icon name="bag" size={20} color="#fff" />
                {selectedPlan === "monthly" ? "Start Tracking for ₹19" : "Download Full Year — ₹49"}
              </Btn>
              <div style={{ textAlign: "center", marginTop: 12, color: "rgba(255,255,255,0.4)", fontSize: DS.type.xs }}>
                🔒 256-bit SSL · Instant delivery · Razorpay secured
              </div>
            </Card>

            {/* Tabs */}
            <div style={{
              display: "flex", gap: 4,
              marginBottom: 20,
              background: DS.color.surface,
              borderRadius: DS.radius.lg, padding: 4,
            }}>
              {["features", "specs"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  style={{
                    flex: 1, padding: "10px 16px",
                    borderRadius: DS.radius.md,
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: 14,
                    background: activeTab === t ? DS.color.bgGlass : "transparent",
                    border: activeTab === t ? `1px solid ${DS.color.border}` : "1px solid transparent",
                    color: activeTab === t ? DS.color.navy : DS.color.slateLight,
                    boxShadow: activeTab === t ? DS.shadow.sm : "none",
                    transition: `all 0.2s ${DS.ease.smooth}`,
                    textTransform: "capitalize",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            {activeTab === "features" && (
              <div style={{ display: "grid", gap: 10 }}>
                {features.map((f) => (
                  <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{
                      background: DS.color.mintLight,
                      borderRadius: "50%",
                      width: 22, height: 22,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginTop: 1,
                    }}>
                      <Icon name="check" size={12} color={DS.color.mint} />
                    </div>
                    <span style={{ color: DS.color.slate, fontSize: DS.type.sm, lineHeight: 1.6 }}>{f}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "specs" && (
              <div style={{ display: "grid", gap: 0 }}>
                {specs.map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: `1px solid ${DS.color.border}` }}>
                    <span style={{ color: DS.color.slateLight, fontSize: DS.type.sm }}>{k}</span>
                    <span style={{ color: DS.color.navy, fontSize: DS.type.sm, fontWeight: 700, textAlign: "right", maxWidth: "60%" }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════
//  RAZORPAY SCRIPT LOADER
// ═══════════════════════════════════════════════════════════════════
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }

    const scriptSrc = "https://checkout.razorpay.com/v1/checkout.js";
    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true), { once: true });
      existingScript.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// ═══════════════════════════════════════════════════════════════════
//  CHECKOUT PAGE
// ═══════════════════════════════════════════════════════════════════
const CheckoutPage = memo(() => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const planFromURL = searchParams.get("plan") === "monthly" ? "monthly" : "yearly";

  const [form, setForm]               = useState({ name: "", email: "", phone: "" });
  const [selectedPlan, setSelectedPlan] = useState(planFromURL);
  const [payMethod, setPayMethod]     = useState("upi");
  const [upiApp, setUpiApp]           = useState("googlepay");
  const [loading, setLoading]         = useState(false);
  const [errors, setErrors]           = useState({});
  const [livePrices, setLivePrices]   = useState({
    monthly: { price: 19, original: 299, discount: "94% OFF", desc: "Single-month expense tracking", label: "Monthly Smart Expense Tracker" },
    yearly:  { price: 49, original: 999, discount: "95% OFF", desc: "12 months + yearly expense overview", label: "Full Year Smart Expense Tracker" },
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setLivePrices((prev) => ({
          monthly: { ...prev.monthly, price: data?.monthly?.price ?? prev.monthly.price },
          yearly:  { ...prev.yearly,  price: data?.yearly?.price  ?? prev.yearly.price },
        }));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setSearchParams({ plan: selectedPlan }, { replace: true });
  }, [selectedPlan, setSearchParams]);

  const plan = livePrices[selectedPlan];

  const handlePay = useCallback(() => {
    const e = {};
    const cleanForm = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    };

    if (!cleanForm.name)                         e.name  = "Full name is required";
    if (!cleanForm.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = "Valid email is required";
    if (!cleanForm.phone.match(/^\d{10}$/))     e.phone = "10-digit mobile number required";
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    (async () => {
      try {
        const orderRes = await fetch("/api/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...cleanForm, plan: selectedPlan }),
        });

        const order = await orderRes.json().catch(() => ({}));

        if (!orderRes.ok || order.error) {
          throw new Error(order.error || order.details || "Could not create order");
        }

        // Supports both backend response formats:
        // { keyId, razorpayOrderId } and { key, orderId }
        const razorpayKey = order.keyId || order.key;
        const razorpayOrderId = order.razorpayOrderId || order.orderId || order.id;

        if (!razorpayKey || !razorpayOrderId) {
          throw new Error("Payment order was created but Razorpay key/order ID is missing. Please check /api/create-order response.");
        }

        const options = {
          key: razorpayKey,
          amount: order.amount,
          currency: order.currency || "INR",
          name: "BudgetPro",
          description: plan.label,
          order_id: razorpayOrderId,
          prefill: { name: cleanForm.name, email: cleanForm.email, contact: cleanForm.phone },
          theme: { color: DS.color.mint },
          handler: async function (response) {
            try {
              const verifyRes = await fetch("/api/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id:   response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature:  response.razorpay_signature,
                }),
              });

              const result = await verifyRes.json().catch(() => ({}));

              if (!verifyRes.ok || result.error) {
                throw new Error(result.error || result.details || "Payment verification failed");
              }

              if (result.success) {
                navigate("/success", {
                  state: {
                    name: result.customerName || cleanForm.name,
                    email: result.customerEmail || cleanForm.email,
                    plan: result.plan || selectedPlan,
                    token: result.downloadToken || result.token,
                  },
                });
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                alert("Payment verification failed. If money was deducted, contact support with your payment ID: " + response.razorpay_payment_id);
              }
            } catch (verifyErr) {
              alert((verifyErr && verifyErr.message) || "Payment verification failed. Please contact support.");
            } finally {
              setLoading(false);
            }
          },
          modal: { ondismiss: function () { setLoading(false); } },
        };

        const razorpayLoaded = await loadRazorpayScript();

        if (!razorpayLoaded || !window.Razorpay) {
          throw new Error("Payment system failed to load. Please refresh and try again.");
        }

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        alert((err && err.message) || "Something went wrong. Please try again.");
        setLoading(false);
      }
    })();
  }, [form, selectedPlan, plan, navigate]);

  const inputStyle = (field) => ({
    width: "100%",
    padding: "13px 16px",
    borderRadius: DS.radius.lg,
    border: `1.5px solid ${errors[field] ? "#E53E3E" : DS.color.border}`,
    fontSize: DS.type.body,
    color: DS.color.navy,
    background: DS.color.bgCard,
    transition: `all 0.2s ${DS.ease.smooth}`,
    fontFamily: "inherit",
  });

  const payMethods = [
    { id: "upi",        label: "UPI",          icon: "phone" },
    { id: "card",       label: "Card",          icon: "creditCard" },
    { id: "netbanking", label: "Net Banking",   icon: "building" },
  ];

  const upiApps = [
    { id: "googlepay", label: "Google Pay" },
    { id: "phonepe",   label: "PhonePe" },
    { id: "paytm",     label: "Paytm" },
    { id: "bhim",      label: "BHIM UPI" },
  ];

  return (
    <div style={{ background: DS.color.bg, minHeight: "100vh" }}>
      {/* Checkout header */}
      <div style={{
        background: DS.grad.navyMid,
        padding: "20px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>📊</span>
            <span style={{ fontWeight: 900, fontSize: 18, color: "#fff", letterSpacing: 0 }}>
              Budget<span style={{ color: DS.color.mint }}>Pro</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="lock" size={14} color={DS.color.mint} />
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: DS.type.sm }}>Secure Checkout · Powered by Razorpay</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Badge style={{ marginBottom: 14 }}>Secure Purchase</Badge>
          <h1 style={{ fontSize: DS.type.h2, fontWeight: 900, color: DS.color.navy, marginBottom: 10, letterSpacing: 0 }}>
            Get Smart Expense Tracker
          </h1>
          <p style={{ color: DS.color.slateLight, fontSize: DS.type.body, lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>
            Start tracking every rupee with a premium Excel dashboard delivered instantly after payment.
          </p>
        </div>

        {/* Plan Toggle */}
        <div style={{ background: DS.color.bgCard, borderRadius: DS.radius.xl, padding: 4, display: "flex", gap: 4, marginBottom: 32, maxWidth: 400, border: `1px solid ${DS.color.border}` }}>
          {[
            { id: "monthly", label: "Monthly",  price: "₹19" },
            { id: "yearly",  label: "Full Year", price: "₹49" },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPlan(p.id)}
              style={{
                flex: 1, padding: "11px 14px",
                borderRadius: DS.radius.lg,
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: DS.type.sm,
                background: selectedPlan === p.id ? DS.grad.navyMid : "transparent",
                color: selectedPlan === p.id ? "#fff" : DS.color.slateLight,
                boxShadow: selectedPlan === p.id ? DS.shadow.navy : "none",
                transition: `all 0.22s ${DS.ease.smooth}`,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
            >
              {p.label}
              <span className="price-font" style={{ color: selectedPlan === p.id ? DS.color.mint : DS.color.slateLight, fontWeight: 900 }}>
                {p.price}
              </span>
            </button>
          ))}
        </div>

        <div className="checkout-grid" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 28 }}>
          {/* Left: Form */}
          <div style={{ display: "grid", gap: 20 }}>
            {/* Personal Info */}
            <Card style={{ boxShadow: DS.shadow.md }}>
              <h3 style={{ fontWeight: 800, color: DS.color.navy, marginBottom: 20, fontSize: DS.type.h4, letterSpacing: 0 }}>
                Personal Information
              </h3>
              <div style={{ display: "grid", gap: 18 }}>
                {[
                  { key: "name",  label: "Full Name",      placeholder: "Rahul Sharma",   hint: null,                              maxLength: 60 },
                  { key: "email", label: "Email Address",  placeholder: "rahul@email.com", hint: "Your download link will be sent here", maxLength: 100 },
                  { key: "phone", label: "Mobile Number",  placeholder: "9876543210",      hint: null,                              maxLength: 10 },
                ].map(({ key, label, placeholder, hint, maxLength }) => (
                  <div key={key}>
                    <label style={{ fontSize: DS.type.sm, fontWeight: 700, color: DS.color.slate, display: "block", marginBottom: 7 }}>
                      {label}
                    </label>
                    <input
                      style={inputStyle(key)}
                      placeholder={placeholder}
                      value={form[key]}
                      maxLength={maxLength}
                      onChange={(e) => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: null }); }}
                    />
                    {errors[key] && (
                      <div style={{ color: "#E53E3E", fontSize: DS.type.xs, marginTop: 5, fontWeight: 600, display: "flex", gap: 5, alignItems: "center" }}>
                        ⚠ {errors[key]}
                      </div>
                    )}
                    {hint && <div style={{ fontSize: DS.type.xs, color: DS.color.slateLight, marginTop: 5 }}>{hint}</div>}
                  </div>
                ))}
              </div>
            </Card>

            {/* Payment Method */}
            <Card style={{ boxShadow: DS.shadow.md }}>
              <h3 style={{ fontWeight: 800, color: DS.color.navy, marginBottom: 20, fontSize: DS.type.h4, letterSpacing: 0 }}>
                Payment Method
              </h3>
              <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                {payMethods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPayMethod(m.id)}
                    style={{
                      flex: 1, padding: "14px 10px",
                      borderRadius: DS.radius.lg,
                      border: `2px solid ${payMethod === m.id ? DS.color.mint : DS.color.border}`,
                      background: payMethod === m.id ? DS.color.mintLight : DS.color.bgGlass,
                      cursor: "pointer",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                      transition: `all 0.2s ${DS.ease.smooth}`,
                    }}
                  >
                    <Icon name={m.icon} size={22} color={payMethod === m.id ? DS.color.mint : DS.color.slateLight} />
                    <span style={{ fontSize: DS.type.xs, fontWeight: 700, color: payMethod === m.id ? DS.color.mintDark : DS.color.slateLight }}>
                      {m.label}
                    </span>
                  </button>
                ))}
              </div>

              {payMethod === "upi" && (
                <div>
                  <label style={{ fontSize: DS.type.sm, fontWeight: 700, color: DS.color.slate, display: "block", marginBottom: 10 }}>
                    Select UPI App
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                    {upiApps.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => setUpiApp(a.id)}
                        style={{
                          padding: "12px 16px",
                          borderRadius: DS.radius.lg,
                          border: `1.5px solid ${upiApp === a.id ? DS.color.mint : DS.color.border}`,
                          background: upiApp === a.id ? DS.color.mintLight : DS.color.bgGlass,
                          cursor: "pointer",
                          fontWeight: 700,
                          fontSize: DS.type.sm,
                          color: upiApp === a.id ? DS.color.mintDark : DS.color.slate,
                          transition: `all 0.18s ${DS.ease.smooth}`,
                        }}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                  <input style={inputStyle("upi")} placeholder="yourname@upi" />
                  <div style={{ fontSize: DS.type.xs, color: DS.color.slateLight, marginTop: 6 }}>
                    Or enter your UPI ID above to pay instantly
                  </div>
                </div>
              )}

              {payMethod === "card" && (
                <div style={{ display: "grid", gap: 14 }}>
                  <div>
                    <label style={{ fontSize: DS.type.sm, fontWeight: 700, color: DS.color.slate, display: "block", marginBottom: 6 }}>Card Number</label>
                    <input style={inputStyle("card")} placeholder="1234 5678 9012 3456" maxLength={19} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <label style={{ fontSize: DS.type.sm, fontWeight: 700, color: DS.color.slate, display: "block", marginBottom: 6 }}>Expiry</label>
                      <input style={inputStyle("exp")} placeholder="MM / YY" maxLength={7} />
                    </div>
                    <div>
                      <label style={{ fontSize: DS.type.sm, fontWeight: 700, color: DS.color.slate, display: "block", marginBottom: 6 }}>CVV</label>
                      <input style={inputStyle("cvv")} placeholder="•••" maxLength={3} type="password" />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: DS.type.sm, fontWeight: 700, color: DS.color.slate, display: "block", marginBottom: 6 }}>Name on Card</label>
                    <input style={inputStyle("cardname")} placeholder="Rahul Sharma" />
                  </div>
                </div>
              )}

              {payMethod === "netbanking" && (
                <div>
                  <label style={{ fontSize: DS.type.sm, fontWeight: 700, color: DS.color.slate, display: "block", marginBottom: 10 }}>
                    Select Your Bank
                  </label>
                  <select style={{ ...inputStyle("bank"), cursor: "pointer" }}>
                    {["SBI", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Bank", "PNB", "Bank of Baroda", "Union Bank", "Canara Bank", "Other Banks"].map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </div>
              )}
            </Card>
          </div>

          {/* Right: Order Summary */}
          <div style={{ position: "sticky", top: 20 }}>
            <Card style={{ boxShadow: DS.shadow.xl }}>
              <h3 style={{ fontWeight: 800, color: DS.color.navy, marginBottom: 20, fontSize: DS.type.h4 }}>
                Order Summary
              </h3>

              {/* Product */}
              <div style={{
                display: "flex", gap: 12, alignItems: "center",
                padding: 14,
                background: DS.color.surface,
                borderRadius: DS.radius.lg,
                marginBottom: 18,
              }}>
                <div style={{
                  background: DS.grad.navyMid,
                  borderRadius: DS.radius.lg,
                  padding: "10px 14px",
                  color: "#fff",
                  fontSize: 22,
                }}>
                  📊
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: DS.color.navy, fontSize: 14 }}>{plan.label}</div>
                  <div style={{ color: DS.color.slateLight, fontSize: DS.type.xs, marginTop: 2 }}>{plan.desc}</div>
                  {selectedPlan === "yearly" && (
                    <div style={{ color: DS.color.gold, fontSize: DS.type.xs, fontWeight: 700, marginTop: 3 }}>⭐ Best Value</div>
                  )}
                </div>
              </div>

              {/* Price breakdown */}
              <div style={{ borderTop: `1px solid ${DS.color.border}`, paddingTop: 16, marginBottom: 22 }}>
                {[
                  ["Original Price",        `₹${plan.original}`,                          true,  null],
                  [`Discount (${plan.discount})`, `-₹${plan.original - plan.price}`,      false, DS.color.mintDark],
                  ["GST (18%)",             `₹${(plan.price * 0.18).toFixed(2)}`,         false, null],
                ].map(([l, v, strike, color]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ color: DS.color.slateLight, fontSize: DS.type.sm }}>{l}</span>
                    <span className="price-font" style={{
                      color: strike ? DS.color.slateLight : (color || DS.color.slate),
                      fontSize: DS.type.sm,
                      fontWeight: 600,
                      textDecoration: strike ? "line-through" : "none",
                    }}>
                      {v}
                    </span>
                  </div>
                ))}
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  borderTop: `1px solid ${DS.color.border}`,
                  paddingTop: 14, marginTop: 8,
                }}>
                  <span style={{ fontWeight: 800, color: DS.color.navy, fontSize: DS.type.h4 }}>Total</span>
                  <span className="price-font" style={{ fontWeight: 900, color: DS.color.mint, fontSize: 28, letterSpacing: 0 }}>₹{plan.price}</span>
                </div>
              </div>

              <Btn
                size="lg"
                onClick={handlePay}
                disabled={loading}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  boxShadow: !loading ? DS.shadow.glowLg : "none",
                  animation: !loading ? "pulse 2.5s infinite" : "none",
                }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      width: 17, height: 17,
                      border: "2.5px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                      display: "inline-block",
                    }} />
                    Processing...
                  </span>
                ) : (
                  <><Icon name="lock" size={18} color="#fff" /> Pay ₹{plan.price} Securely</>
                )}
              </Btn>

              <div style={{ textAlign: "center", marginTop: 12, color: DS.color.slateLight, fontSize: DS.type.xs }}>
                🔒 Powered by Razorpay · 256-bit SSL
              </div>

              {/* Payment logos */}
              <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                {["Visa","Mastercard","RuPay","UPI","Paytm"].map((p) => (
                  <span key={p} style={{
                    background: DS.color.surface,
                    border: `1px solid ${DS.color.border}`,
                    borderRadius: DS.radius.sm,
                    padding: "3px 10px",
                    fontSize: 10,
                    color: DS.color.slateLight,
                    fontWeight: 600,
                  }}>
                    {p}
                  </span>
                ))}
              </div>

              <div style={{
                marginTop: 16,
                background: "rgba(231,195,106,0.10)",
                borderRadius: DS.radius.lg,
                padding: "10px 14px",
                fontSize: DS.type.xs,
                color: DS.color.gold,
                fontWeight: 600,
                textAlign: "center",
                border: "1px solid rgba(231,195,106,0.28)",
              }}>
                ⚡ Limited-time pricing — don't miss out!
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════
//  SUCCESS PAGE
// ═══════════════════════════════════════════════════════════════════
const SuccessPage = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const data      = location.state || {};
  const goTo = (path, state = {}) => { navigate(path, { state }); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const [downloaded, setDownloaded] = useState(false);
  const isYearly = data.plan === "yearly";

  const handleDownload = useCallback(() => {
    if (!data.token) {
      alert("Download link not found. Please check your confirmation email, or contact support if you just paid.");
      return;
    }
    setDownloaded(true);
    window.location.href = `/api/download/${data.token}`;
  }, [data.token]);

  const steps = [
    "Open the file in Excel or upload to Google Sheets",
    "Go to the 'Setup' tab and enter your name & starting month",
    "Log your income sources in the 'Income' sheet",
    "Track daily expenses in the 'Expenses' sheet",
    "Watch your savings graph update automatically!",
  ];

  return (
    <div style={{ background: DS.color.bg, minHeight: "100vh", padding: "60px 20px" }}>
      <div style={{ maxWidth: 620, margin: "0 auto" }}>

        {/* Success header */}
        <div className="fade-in-up" style={{ textAlign: "center", marginBottom: 44 }}>
          <div style={{
            width: 110, height: 110,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${DS.color.mintLight}, rgba(0,200,150,0.2))`,
            margin: "0 auto 24px",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: `3px solid ${DS.color.mint}`,
            boxShadow: DS.shadow.glowLg,
            animation: "pulse 2s ease 3",
          }}>
            <span style={{ fontSize: 52 }}>🎉</span>
          </div>
          <h1 style={{
            fontSize: DS.type.h1,
            fontWeight: 900,
            color: DS.color.navy,
            marginBottom: 12,
            letterSpacing: 0,
          }}>
            Payment Successful!
          </h1>
          <p style={{ color: DS.color.slateLight, fontSize: 16, lineHeight: 1.7 }}>
            Thank you{data.name ? `, ${data.name}` : ""}! Your {isYearly ? "Full Year" : "Monthly"} Smart Expense Tracker is ready.<br />
            A download link has been sent to <strong style={{ color: DS.color.navy }}>{data.email || "your email"}</strong>.
          </p>
        </div>

        {/* Download CTA */}
        <Card className="fade-in-up" style={{
          marginBottom: 20,
          boxShadow: `${DS.shadow.xl}, 0 0 40px rgba(0,200,150,0.15)`,
          border: `2px solid rgba(0,200,150,0.25)`,
          animationDelay: "0.1s",
        }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 20 }}>
            <div style={{
              background: `linear-gradient(135deg, ${DS.color.mintLight}, rgba(0,200,150,0.15))`,
              borderRadius: DS.radius.lg,
              padding: 14,
              border: `1px solid rgba(0,200,150,0.2)`,
            }}>
              <Icon name="download" size={26} color={DS.color.mint} />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: DS.color.navy, fontSize: 16 }}>
                BudgetPro {isYearly ? "Full Year" : "Monthly"} Smart Expense Tracker
              </div>
              <div style={{ color: DS.color.slateLight, fontSize: DS.type.sm, marginTop: 2 }}>
                Excel (.xlsx) + Google Sheets link · {isYearly ? "~4.1 MB" : "~2.4 MB"}
              </div>
            </div>
          </div>
          <Btn
            size="lg"
            style={{ width: "100%", justifyContent: "center", boxShadow: DS.shadow.glowLg, animation: !downloaded ? "pulse 2s infinite" : "none" }}
            onClick={handleDownload}
          >
            <Icon name="download" size={20} color="#fff" />
            {downloaded ? "✓ Downloading... Check Your Folder" : "Download Instantly"}
          </Btn>
          <div style={{ textAlign: "center", marginTop: 10, color: DS.color.slateLight, fontSize: DS.type.xs }}>
            File size: {isYearly ? "4.1" : "2.4"} MB · Secure direct download
          </div>
        </Card>

        {/* Email confirmation */}
        <Card className="fade-in-up" style={{
          marginBottom: 20,
          background: "rgba(231,195,106,0.10)",
          border: `1px solid rgba(246,173,85,0.3)`,
          animationDelay: "0.2s",
        }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 22 }}>📧</span>
            <div>
              <div style={{ fontWeight: 800, color: DS.color.navy, marginBottom: 4 }}>Check Your Email</div>
              <div style={{ color: DS.color.slate, fontSize: DS.type.sm, lineHeight: 1.7 }}>
                We've sent the download link to <strong>{data.email || "your email"}</strong>. Check your spam folder if you don't see it within 2 minutes.
              </div>
            </div>
          </div>
        </Card>

        {/* Getting Started */}
        <Card className="fade-in-up" style={{ marginBottom: 20, animationDelay: "0.3s" }}>
          <div style={{ fontWeight: 800, color: DS.color.navy, marginBottom: 18, fontSize: 16, letterSpacing: 0 }}>
            🚀 Getting Started — 5 Simple Steps
          </div>
          {steps.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{
                background: DS.grad.mint,
                color: "#fff",
                borderRadius: "50%",
                width: 26, height: 26,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800,
                flexShrink: 0,
                boxShadow: DS.shadow.glow,
              }}>
                {i + 1}
              </div>
              <span style={{ color: DS.color.slate, fontSize: DS.type.sm, lineHeight: 1.6 }}>{step}</span>
            </div>
          ))}
        </Card>

        {/* Upsell (monthly only) */}
        {!isYearly && (
          <Card className="fade-in-up" style={{
            marginBottom: 20,
            background: DS.grad.navyMid,
            border: "none",
            animationDelay: "0.4s",
            boxShadow: `${DS.shadow["2xl"]}`,
          }}>
            <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
              {[1,2,3].map(i => <span key={i} style={{ fontSize: 14 }}>⭐</span>)}
            </div>
            <div style={{ fontWeight: 800, color: "#fff", fontSize: DS.type.h4, marginBottom: 8 }}>
              Upgrade to Full Year — Save More!
            </div>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: DS.type.sm, lineHeight: 1.7, marginBottom: 16 }}>
              You bought the monthly Smart Expense Tracker — great start! Upgrade to the Full Year bundle (all 12 months + yearly expense overview) for just <strong style={{ color: DS.color.gold }}>₹49</strong>. That's only ₹30 more for 12x the value.
            </p>
            <Btn
              size="md"
              variant="gold"
              onClick={() => goTo("/checkout?plan=yearly")}
              style={{ width: "100%", justifyContent: "center" }}
            >
              Upgrade to Full Year — ₹49 ↗
            </Btn>
          </Card>
        )}

        {/* Nav buttons */}
        <div className="fade-in-up" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, animationDelay: "0.5s" }}>
          <Btn variant="outline" onClick={() => goTo("/")} style={{ justifyContent: "center" }}>← Back to Home</Btn>
          <Btn variant="navy" onClick={() => { window.location.href = SUPPORT_MAILTO; }} style={{ justifyContent: "center" }}>Contact Support</Btn>
        </div>
      </div>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════
//  LEGAL PAGES
// ═══════════════════════════════════════════════════════════════════
const TERMS_SECTIONS = [
  {
    title: "Use of BudgetPro",
    body: "BudgetPro provides Smart Expense Tracker and related digital materials for personal finance tracking. By using this website or purchasing a product, you agree to use the files lawfully and for your own personal or internal household purposes.",
  },
  {
    title: "Digital Delivery",
    body: "Products are delivered digitally after successful payment verification. Download links may be shown on the success page and sent to the email address provided during checkout. You are responsible for entering an accurate email address.",
  },
  {
    title: "Payments and Pricing",
    body: "Payments are processed through Razorpay. Prices are displayed in INR and may change without prior notice. A purchase is complete only after payment confirmation and successful order verification.",
  },
  {
    title: "License Restrictions",
    body: "Your purchase grants a limited, non-transferable license to use Smart Expense Tracker. You may not resell, redistribute, upload, sublicense, copy for commercial resale, or claim ownership of BudgetPro files or designs.",
  },
  {
    title: "No Financial Advice",
    body: "BudgetPro Smart Expense Tracker is an educational personal finance tool. It does not provide financial, investment, tax, legal, or accounting advice. You remain responsible for your financial decisions and should consult qualified professionals when needed.",
  },
  {
    title: "Refunds and Failed Delivery",
    body: "Because products are digital and available immediately after purchase, sales are generally final. If you were charged twice, did not receive access after successful payment, or believe there was a technical delivery issue, contact support with your order details.",
  },
  {
    title: "Limitation of Liability",
    body: "BudgetPro and Smart Expense Tracker are provided as is. To the maximum extent permitted by law, BudgetPro is not liable for indirect, incidental, special, consequential, or financial losses arising from use of the website or digital files.",
  },
  {
    title: "Contact",
    body: "For support, delivery issues, or questions about these terms, contact BudgetPro using the Contact Us link in the footer.",
  },
];

const PRIVACY_SECTIONS = [
  {
    title: "Information We Collect",
    body: "When you purchase BudgetPro, we may collect your name, email address, phone number, selected plan, payment status, order identifiers, download activity, and support messages you send to us.",
  },
  {
    title: "Payment Information",
    body: "Payments are handled by Razorpay. BudgetPro does not store your full card number, UPI credentials, bank login details, or sensitive payment credentials on this website.",
  },
  {
    title: "How We Use Information",
    body: "We use your information to process orders, verify payments, deliver download links, resend purchase emails, provide customer support, maintain admin records, prevent fraud, and improve the website.",
  },
  {
    title: "Service Providers",
    body: "We may use trusted providers such as Razorpay for payment processing, Resend for email delivery, MongoDB for order data storage, and Vercel for hosting and serverless APIs. These providers process data only as needed for their services.",
  },
  {
    title: "Data Retention",
    body: "Order and support records may be retained for business, tax, accounting, dispute resolution, and security purposes. We keep personal information only as long as reasonably necessary for these purposes.",
  },
  {
    title: "Security",
    body: "We use reasonable technical and organizational safeguards to protect order data. No internet service can guarantee absolute security, so please avoid sending sensitive financial information through support email.",
  },
  {
    title: "Cookies and Local Storage",
    body: "The website may use browser storage for normal app behavior, checkout flow, and admin authentication. You can clear browser storage through your browser settings, but some features may stop working.",
  },
  {
    title: "Your Choices",
    body: "You may contact us to request access, correction, or deletion of personal information where applicable. Some records may need to be retained where required for legal, tax, fraud prevention, or legitimate business reasons.",
  },
  {
    title: "Contact",
    body: "For privacy questions, contact BudgetPro using the Contact Us link in the footer.",
  },
];

const LegalPage = memo(({ title, intro, sections }) => (
  <main style={{ background: DS.color.bg, minHeight: "100vh", padding: "72px 20px" }}>
    <div style={{ maxWidth: 880, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <Badge style={{ marginBottom: 16 }}>Legal</Badge>
        <h1 style={{ fontSize: DS.type.h1, fontWeight: 900, color: DS.color.navy, marginBottom: 14, letterSpacing: 0 }}>
          {title}
        </h1>
        <p style={{ color: DS.color.slateLight, fontSize: 16, lineHeight: 1.7, maxWidth: 680, margin: "0 auto" }}>
          {intro}
        </p>
      </div>

      <Card style={{ boxShadow: DS.shadow.md }}>
        <p style={{ color: DS.color.slateLight, fontSize: DS.type.sm, marginBottom: 24 }}>
          Last updated: June 28, 2026
        </p>
        <div style={{ display: "grid", gap: 24 }}>
          {sections.map((section) => (
            <section key={section.title}>
              <h2 style={{ fontSize: DS.type.h4, fontWeight: 800, color: DS.color.navy, marginBottom: 8 }}>
                {section.title}
              </h2>
              <p style={{ color: DS.color.slate, fontSize: DS.type.body, lineHeight: 1.8 }}>
                {section.body}
              </p>
            </section>
          ))}
        </div>
        <Divider style={{ margin: "28px 0 20px" }} />
        <a
          href={SUPPORT_MAILTO}
          style={{ color: DS.color.mintDark, fontSize: DS.type.sm, fontWeight: 800, textDecoration: "none" }}
        >
          Contact BudgetPro Support
        </a>
      </Card>
    </div>
  </main>
));

const TermsPage = memo(() => (
  <LegalPage
    title="Terms of Service"
    intro="These terms govern your access to the BudgetPro website, checkout flow, downloads, and Smart Expense Tracker digital files."
    sections={TERMS_SECTIONS}
  />
));

const PrivacyPage = memo(() => (
  <LegalPage
    title="Privacy Policy"
    intro="This policy explains what information BudgetPro collects, why it is used, and how order and support data is handled."
    sections={PRIVACY_SECTIONS}
  />
));

const AdminLogin = memo(({ onLogin }) => {
  const [creds, setCreds]   = useState({ username: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(async () => {
    const loginPayload = {
      username: creds.username.trim(),
      password: creds.password,
    };

    if (!loginPayload.username || !loginPayload.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res  = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginPayload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        return;
      }

      if (data.token) {
        localStorage.setItem("budgetpro_admin_token", data.token);
        onLogin(data.token);
      } else {
        setError("Login API did not return a token");
      }
    } catch {
      setError("Server error. Please check /api/admin-login and Vercel environment variables.");
    } finally {
      setLoading(false);
    }
  }, [creds, onLogin]);

  return (
    <div style={{
      minHeight: "100vh",
      background: DS.grad.hero,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    }}>
      <Card className="scale-in" style={{ width: "100%", maxWidth: 400, boxShadow: DS.shadow["2xl"] }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>🔐</div>
          <h2 style={{ fontSize: DS.type.h3, fontWeight: 900, color: DS.color.navy, marginBottom: 6, letterSpacing: 0 }}>
            Admin Login
          </h2>
          <p style={{ color: DS.color.slateLight, fontSize: DS.type.sm }}>Access BudgetPro dashboard</p>
        </div>

        <div style={{ display: "grid", gap: 16, marginBottom: 24 }}>
          {[
            { key: "username", label: "Username", placeholder: "admin",    type: "text" },
            { key: "password", label: "Password", placeholder: "••••••••", type: "password" },
          ].map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label style={{ fontSize: DS.type.sm, fontWeight: 700, color: DS.color.slate, display: "block", marginBottom: 7 }}>
                {label}
              </label>
              <input
                type={type}
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  borderRadius: DS.radius.lg,
                  border: `1.5px solid ${error ? "#E53E3E" : DS.color.border}`,
                  fontSize: DS.type.body,
                  color: DS.color.navy,
                  fontFamily: "inherit",
                  transition: `all 0.2s ${DS.ease.smooth}`,
                }}
                placeholder={placeholder}
                value={creds[key]}
                onChange={(e) => { setCreds({ ...creds, [key]: e.target.value }); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
          ))}
        </div>

        {error && (
          <div style={{ color: "#E53E3E", fontSize: DS.type.sm, marginBottom: 16, textAlign: "center", fontWeight: 600 }}>
            ⚠ {error}
          </div>
        )}

        <Btn size="lg" onClick={handleLogin} disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
          {loading ? "Logging in..." : "Login to Admin"}
        </Btn>
      </Card>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════
//  ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════
const AdminDashboard = memo(({ onLogout, token }) => {
  const [activeTab, setActiveTab]   = useState("overview");
  const [stats, setStats]           = useState({ totalSales: 0, totalRevenue: 0, totalDownloads: 0, monthlySales: 0, yearlySales: 0, customers: [] });
  const [prices, setPrices]         = useState({ monthly: { price: 19 }, yearly: { price: 49 } });
  const [loadingData, setLoadingData] = useState(true);
  const [savingPlan, setSavingPlan]   = useState(null);

  const authedFetch = useCallback((url, opts = {}) =>
    fetch(url, { ...opts, headers: { ...(opts.headers || {}), Authorization: `Bearer ${token}` } }), [token]);

  const loadAll = useCallback(async () => {
    setLoadingData(true);
    try {
      const [statsRes, settingsRes] = await Promise.all([
        authedFetch("/api/admin-stats").then((r) => r.json()),
        fetch("/api/settings").then((r) => r.json()),
      ]);
      if (!statsRes.error) setStats(statsRes);
      if (settingsRes && !settingsRes.error) setPrices(settingsRes);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoadingData(false);
    }
  }, [authedFetch]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const savePrice = useCallback(async (plan) => {
    setSavingPlan(plan);
    try {
      const res  = await authedFetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, price: Number(prices[plan].price) }),
      });
      const data = await res.json();
      if (data.error) alert(data.error);
    } finally {
      setSavingPlan(null);
    }
  }, [authedFetch, prices]);

  const adminTabs = ["overview", "orders", "pricing"];

  return (
    <div style={{ background: DS.color.bg, minHeight: "100vh" }}>
      {/* Admin Nav */}
      <div className="admin-nav" style={{
        background: DS.grad.navyMid,
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 60,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>📊</span>
          <span style={{ fontWeight: 800, fontSize: 17, color: "#fff", letterSpacing: 0 }}>
            BudgetPro <span style={{ color: DS.color.mint }}>Admin</span>
          </span>
        </div>
        <div className="admin-tabs" style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {adminTabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                padding: "7px 16px",
                borderRadius: DS.radius.md,
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: DS.type.sm,
                background: activeTab === t ? "rgba(255,255,255,0.12)" : "transparent",
                color: activeTab === t ? "#fff" : "rgba(255,255,255,0.5)",
                textTransform: "capitalize",
                transition: `all 0.2s ${DS.ease.smooth}`,
                fontFamily: "inherit",
              }}
            >
              {t}
            </button>
          ))}
          <Btn
            size="sm"
            variant="ghost"
            onClick={onLogout}
            style={{ color: "rgba(255,255,255,0.5)", marginLeft: 12 }}
          >
            <Icon name="logout" size={15} color="rgba(255,255,255,0.5)" />
            Logout
          </Btn>
        </div>
      </div>

      <div style={{ padding: "36px 24px", maxWidth: 1100, margin: "0 auto" }}>
        {loadingData && (
          <div style={{ color: DS.color.slateLight, padding: 60, textAlign: "center", fontSize: 15 }}>
            Loading live data...
          </div>
        )}

        {/* ── Overview ── */}
        {!loadingData && activeTab === "overview" && (
          <div>
            <h2 style={{ fontSize: DS.type.h2, fontWeight: 900, color: DS.color.navy, marginBottom: 30, letterSpacing: 0 }}>
              Dashboard Overview
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 20, marginBottom: 32 }}>
              {[
                { label: "Total Revenue",    value: `₹${stats.totalRevenue}`, icon: "trending", color: DS.color.mint },
                { label: "Total Orders",     value: stats.totalSales,          icon: "bag",      color: DS.color.purple },
                { label: "Full Year Sales",  value: stats.yearlySales,         icon: "star",     color: DS.color.gold },
                { label: "Monthly Sales",    value: stats.monthlySales,        icon: "calendar", color: DS.color.rose },
              ].map((s) => (
                <Card key={s.label} className="card-lift" style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ background: `${s.color}18`, borderRadius: DS.radius.lg, padding: 14, flexShrink: 0 }}>
                    <Icon name={s.icon} size={22} color={s.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 26, fontWeight: 900, color: DS.color.navy, letterSpacing: 0 }}>{s.value}</div>
                    <div style={{ fontSize: DS.type.xs, color: DS.color.slateLight, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                  </div>
                </Card>
              ))}
            </div>

            <Card style={{ background: DS.grad.navyMid, border: "none", boxShadow: DS.shadow.xl }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: DS.radius.lg, padding: 14 }}>
                  <Icon name="upload" size={26} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, color: "#fff", fontSize: DS.type.h4, marginBottom: 6 }}>Product Files</div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: DS.type.sm, lineHeight: 1.7 }}>
                    Your Monthly and Yearly Smart Expense Tracker files are served from <code style={{ background: "rgba(255,255,255,0.12)", padding: "2px 6px", borderRadius: 4 }}>MONTHLY_FILE_URL</code> and{" "}
                    <code style={{ background: "rgba(255,255,255,0.12)", padding: "2px 6px", borderRadius: 4 }}>YEARLY_FILE_URL</code> environment variables. To change the file, upload a new one to your file host and update those env vars in Vercel — no code change needed.
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ── Orders ── */}
        {!loadingData && activeTab === "orders" && (
          <div>
            <h2 style={{ fontSize: DS.type.h2, fontWeight: 900, color: DS.color.navy, marginBottom: 30, letterSpacing: 0 }}>
              Recent Orders
            </h2>
            <div style={{ display: "grid", gap: 14 }}>
              {stats.customers.length === 0 && (
                <Card>
                  <div style={{ color: DS.color.slateLight, textAlign: "center", padding: "20px 0", lineHeight: 1.7 }}>
                    No completed orders yet. They'll show up here the moment your first sale comes in.
                  </div>
                </Card>
              )}
              {stats.customers.map((o) => (
                <Card key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <div style={{
                      background: DS.color.mintLight,
                      borderRadius: DS.radius.md,
                      padding: "8px 12px",
                      fontWeight: 800,
                      fontSize: DS.type.sm,
                      color: DS.color.mintDark,
                      fontFamily: "monospace",
                    }}>
                      #{o.id.slice(-6).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: DS.color.navy, fontSize: 15 }}>{o.name}</div>
                      <div style={{ color: DS.color.slateLight, fontSize: DS.type.xs, marginTop: 2 }}>
                        {o.email} · {new Date(o.date).toLocaleDateString("en-IN")}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <Badge
                      color={o.plan?.includes("Year") ? DS.color.purpleLight : DS.color.mintLight}
                      text={o.plan?.includes("Year") ? DS.color.purple : DS.color.mintDark}
                    >
                      {o.plan}
                    </Badge>
                    <span style={{ fontWeight: 900, color: DS.color.navy, fontSize: 17, letterSpacing: 0 }}>₹{o.amount}</span>
                    <Badge color={DS.color.mintLight} text={DS.color.mintDark}>✓ {o.downloads} download{o.downloads === 1 ? "" : "s"}</Badge>
                    <Btn size="sm" variant="ghost" onClick={async () => {
                      try {
                        const r = await authedFetch("/api/admin-resend", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ orderId: o.id }),
                        });
                        const d = await r.json();
                        alert(d.success ? `✅ Email resent to ${o.email}` : `❌ ${d.error}`);
                      } catch { alert("❌ Failed to resend email"); }
                    }}>
                      Resend Email
                    </Btn>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── Pricing ── */}
        {!loadingData && activeTab === "pricing" && (
          <div>
            <h2 style={{ fontSize: DS.type.h2, fontWeight: 900, color: DS.color.navy, marginBottom: 30, letterSpacing: 0 }}>
              Pricing
            </h2>
            <div className="admin-pricing-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {["monthly", "yearly"].map((plan) => (
                <Card key={plan} style={{ boxShadow: DS.shadow.md }}>
                  <div style={{ fontWeight: 800, color: DS.color.navy, fontSize: DS.type.h4, marginBottom: 4, textTransform: "capitalize" }}>
                    {plan} Smart Expense Tracker
                  </div>
                  <div style={{ color: DS.color.slateLight, fontSize: DS.type.sm, marginBottom: 18 }}>
                    Live price shown at checkout
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: DS.color.navy }}>₹</span>
                    <input
                      type="number"
                      value={prices[plan]?.price ?? ""}
                      onChange={(e) => setPrices({ ...prices, [plan]: { ...prices[plan], price: e.target.value } })}
                      style={{
                        flex: 1,
                        padding: "10px 14px",
                        borderRadius: DS.radius.lg,
                        border: `1.5px solid ${DS.color.border}`,
                        fontSize: 16,
                        fontWeight: 700,
                        color: DS.color.navy,
                        fontFamily: "inherit",
                      }}
                    />
                    <Btn size="sm" onClick={() => savePrice(plan)} disabled={savingPlan === plan}>
                      {savingPlan === plan ? "Saving..." : "Save"}
                    </Btn>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════
//  NAVIGATION
// ═══════════════════════════════════════════════════════════════════
const Nav = memo(() => {
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location]);

  const goTo = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { id: "/",         label: "Home" },
    { id: "/product",  label: "Product" },
  ];

  return (
    <>
      <nav style={{
        background: scrolled ? "rgba(5,5,6,0.86)" : "rgba(5,5,6,0.62)",
        borderBottom: `1px solid ${DS.color.border}`,
        position: "sticky",
        top: 0,
        zIndex: 150,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: scrolled ? "0 18px 56px rgba(0,0,0,0.36)" : "none",
        transition: `all 0.3s ${DS.ease.smooth}`,
      }}>
        <div style={{
          maxWidth: 1160,
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 66,
        }}>
          {/* Logo */}
          <button onClick={() => goTo("/")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, padding: 0 }}>
            <div style={{
              background: DS.grad.navyMid,
              borderRadius: DS.radius.md,
              padding: "7px 11px",
              color: "#fff",
              fontSize: 18,
              boxShadow: DS.shadow.md,
            }}>
              📊
            </div>
            <span style={{ fontWeight: 900, fontSize: 20, color: DS.color.navy, letterSpacing: 0 }}>
              Budget<span style={{ color: DS.color.mint }}>Pro</span>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="nav-desktop" style={{ display: "flex", gap: 2, alignItems: "center" }}>
            {navLinks.map((l) => {
              const isActive = l.id === "/" ? currentPath === "/" : currentPath.startsWith(l.id);
              return (
                <button
                  key={l.id}
                  onClick={() => goTo(l.id)}
                  className={`nav-item ${isActive ? "active" : ""}`}
                  style={{
                    background: isActive ? DS.color.mintLight : "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "8px 15px",
                    borderRadius: DS.radius.lg,
                    fontWeight: isActive ? 800 : 500,
                    color: isActive ? DS.color.mintDark : DS.color.slate,
                    fontSize: 14,
                    fontFamily: "inherit",
                  }}
                >
                  {l.label}
                </button>
              );
            })}
          </div>

          <div className="nav-desktop" style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ width: 1, height: 24, background: DS.color.border, margin: "0 4px" }} />
            <Btn size="sm" variant="outline" onClick={() => goTo("/product")}>Product</Btn>
            <Btn size="sm" variant="gold" onClick={() => goTo("/checkout?plan=monthly")}>Start for ₹19</Btn>
            <button
              onClick={() => goTo("/admin")}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: DS.color.slateLight, marginLeft: 2 }}
              title="Admin"
              aria-label="Admin panel"
            >
              <Icon name="settings" size={17} color={DS.color.slateLight} />
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="mobile-nav-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              borderRadius: DS.radius.md,
            }}
            aria-label="Toggle navigation"
          >
            <Icon name={mobileOpen ? "close" : "menu"} size={22} color={DS.color.navy} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div style={{
          position: "fixed",
          top: 66,
          left: 0, right: 0,
          background: "rgba(5,5,6,0.94)",
          backdropFilter: "blur(20px)",
          zIndex: 149,
          borderBottom: `1px solid ${DS.color.border}`,
          padding: "16px 20px",
          animation: "slideDown 0.25s ease",
          boxShadow: DS.shadow.xl,
        }}>
          {navLinks.map((l) => {
            const isActive = l.id === "/" ? currentPath === "/" : currentPath.startsWith(l.id);
            return (
              <button
                key={l.id}
                onClick={() => goTo(l.id)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  background: isActive ? DS.color.mintLight : "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "12px 16px",
                  borderRadius: DS.radius.lg,
                  fontWeight: isActive ? 800 : 500,
                  color: isActive ? DS.color.mintDark : DS.color.slate,
                  fontSize: 15,
                  marginBottom: 4,
                  fontFamily: "inherit",
                }}
              >
                {l.label}
              </button>
            );
          })}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
            <Btn variant="outline" onClick={() => goTo("/product")} style={{ justifyContent: "center" }}>View Product</Btn>
            <Btn variant="gold"    onClick={() => goTo("/checkout?plan=monthly")}  style={{ justifyContent: "center" }}>Start for ₹19</Btn>
          </div>
        </div>
      )}
    </>
  );
});

// ═══════════════════════════════════════════════════════════════════
//  FOOTER
// ═══════════════════════════════════════════════════════════════════
const Footer = memo(() => {
  const navigate = useNavigate();
  const goTo = (path) => {
    navigate(path);
    const hash = path.split("#")[1];
    if (hash) {
      setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }), 0);
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const openSupport = () => { window.location.href = SUPPORT_MAILTO; };

  return (
    <footer style={{
      background: DS.grad.hero,
      color: "rgba(255,255,255,0.5)",
      padding: "64px 20px 32px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Subtle orb */}
      <div style={{ position: "absolute", bottom: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: DS.color.mint, opacity: 0.03, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 44, marginBottom: 52 }}>

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 24 }}>📊</span>
              <span style={{ fontWeight: 900, fontSize: 20, color: "#fff", letterSpacing: 0 }}>
                Budget<span style={{ color: DS.color.mint }}>Pro</span>
              </span>
            </div>
            <p style={{ fontSize: DS.type.sm, lineHeight: 1.8, marginBottom: 24, maxWidth: 260, color: "rgba(255,255,255,0.5)" }}>
              BudgetPro Smart Expense Tracker helps Indians see every rupee clearly, save smarter, and take control of monthly spending.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn size="sm" variant="glass" onClick={() => goTo("/checkout?plan=monthly")}>Start for ₹19</Btn>
              <Btn size="sm" variant="gold"  onClick={() => goTo("/checkout?plan=yearly")}>Full Year ₹49</Btn>
            </div>
          </div>

          {/* Product links */}
          <div>
            <div style={{ fontWeight: 800, color: "#fff", marginBottom: 18, fontSize: 13, letterSpacing: 0, textTransform: "uppercase" }}>
              Product
            </div>
            {[["/","Home"],["/#pricing","Pricing"],["/product","Product"]].map(([path,label]) => (
              <button
                key={path}
                onClick={() => goTo(path)}
                style={{
                  display: "block",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: DS.type.sm,
                  padding: "5px 0",
                  textAlign: "left",
                  fontFamily: "inherit",
                  transition: `color 0.2s ${DS.ease.smooth}`,
                }}
                onMouseEnter={(e) => e.target.style.color = "#fff"}
                onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.5)"}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Support */}
          <div>
            <div style={{ fontWeight: 800, color: "#fff", marginBottom: 18, fontSize: 13, letterSpacing: 0, textTransform: "uppercase" }}>
              Support
            </div>
            {[["/terms", "Terms of Service"], ["/privacy", "Privacy Policy"]].map(([path, label]) => (
              <button
                key={path}
                onClick={() => goTo(path)}
                style={{
                  display: "block",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: DS.type.sm,
                  padding: "5px 0",
                  textAlign: "left",
                  fontFamily: "inherit",
                  transition: `color 0.2s ${DS.ease.smooth}`,
                }}
                onMouseEnter={(e) => e.target.style.color = "#fff"}
                onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.5)"}
              >
                {label}
              </button>
            ))}
            <button
              onClick={openSupport}
              style={{
                display: "block",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(255,255,255,0.5)",
                fontSize: DS.type.sm,
                padding: "5px 0",
                textAlign: "left",
                fontFamily: "inherit",
                transition: `color 0.2s ${DS.ease.smooth}`,
              }}
              onMouseEnter={(e) => e.target.style.color = "#fff"}
              onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.5)"}
            >
              Contact Us
            </button>
          </div>

          {/* Pricing */}
          <div>
            <div style={{ fontWeight: 800, color: "#fff", marginBottom: 18, fontSize: 13, letterSpacing: 0, textTransform: "uppercase" }}>
              Pricing
            </div>
            <div style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: DS.radius.xl,
              padding: 18,
              border: "1px solid rgba(255,255,255,0.07)",
            }}>
              <div className="price-font" style={{ fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 2, letterSpacing: 0 }}>₹19</div>
              <div style={{ fontSize: DS.type.xs, marginBottom: 14, color: "rgba(255,255,255,0.45)" }}>Monthly Smart Expense Tracker</div>
              <div className="price-font" style={{ fontSize: 26, fontWeight: 900, color: DS.color.gold, marginBottom: 2, letterSpacing: 0 }}>₹49</div>
              <div style={{ fontSize: DS.type.xs, color: "rgba(255,255,255,0.45)" }}>Full Year · Best Value ⭐</div>
            </div>
          </div>
        </div>

        <Divider style={{ background: "rgba(255,255,255,0.07)", marginBottom: 24 }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: DS.type.sm }}>© 2026 BudgetPro. Made with ❤️ in India.</div>
          <div style={{ fontSize: DS.type.sm }}>
            Payments secured by <span style={{ color: DS.color.mint, fontWeight: 700 }}>Razorpay</span> · All prices in INR · GST inclusive
          </div>
        </div>
      </div>
    </footer>
  );
});

// ═══════════════════════════════════════════════════════════════════
//  ADMIN ROUTE (auth guard)
// ═══════════════════════════════════════════════════════════════════
const AdminRoute = () => {
  const navigate = useNavigate();
  const [token, setToken]   = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("budgetpro_admin_token");
    if (stored) setToken(stored);
    setChecked(true);
  }, []);

  if (!checked) return null;

  return token
    ? <AdminDashboard token={token} onLogout={() => {
        localStorage.removeItem("budgetpro_admin_token");
        setToken(null);
        navigate("/");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }} />
    : <AdminLogin onLogin={(t) => setToken(t)} />;
};

// ═══════════════════════════════════════════════════════════════════
//  APP LAYOUT
// ═══════════════════════════════════════════════════════════════════
const AppLayout = () => {
  const location = useLocation();
  const path     = location.pathname;

  const showNav    = !["/admin", "/dashboard", "/success"].includes(path);
  const showFooter = !["/admin", "/dashboard", "/checkout", "/success"].includes(path);

  return (
    <div style={{
      fontFamily: DS.font.body,
      minHeight: "100vh",
      background: DS.color.bg,
    }}>
      <GlobalStyles />
      {showNav && <Nav />}
      <Routes>
        <Route path="/"          element={<HomePage />} />
        <Route path="/product"   element={<ProductPage />} />
        <Route path="/checkout"  element={<CheckoutPage />} />
        <Route path="/success"   element={<SuccessPage />} />
        <Route path="/admin"     element={<AdminRoute />} />
        <Route path="/dashboard" element={<AdminRoute />} />
        <Route path="/terms"     element={<TermsPage />} />
        <Route path="/privacy"   element={<PrivacyPage />} />
        <Route path="/affiliate" element={<Navigate to="/" replace />} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
      {showFooter && <Footer />}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
//  ROOT APP
// ═══════════════════════════════════════════════════════════════════
export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
