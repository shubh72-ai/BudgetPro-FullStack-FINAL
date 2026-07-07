import { useState, useEffect, useCallback, memo, useRef } from "react";
import {
  BrowserRouter, Routes, Route, useNavigate,
  useLocation, useSearchParams, Navigate,
} from "react-router-dom";

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
    body:    "'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    heading: "'Sora', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    number:  "'Space Grotesk', 'Inter', -apple-system, sans-serif",
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
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Sora:wght@500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background: #ffffff;
      font-family: ${DS.font.body};
      color: ${DS.color.text};
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      min-height: 100vh;
      overflow-x: hidden;
    }
    h1, h2, h3, h4 { font-family: ${DS.font.heading}; }
    .number-font, .price-font, .kpi-number { font-family: ${DS.font.number}; font-variant-numeric: tabular-nums; }

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
      transition: all 0.22s ${DS.ease.smooth};
    }
    .premium-btn::before {
      content: '';
      position: absolute;
      inset: 1px;
      border-radius: inherit;
      background: linear-gradient(180deg, rgba(255,255,255,0.38), rgba(255,255,255,0.08) 42%, rgba(255,255,255,0));
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
    .premium-btn:hover { transform: translateY(-2px); filter: brightness(1.06); }
    .premium-btn:active { transform: translateY(0); filter: brightness(0.98); }

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
    .nav-item { transition: all 0.18s ${DS.ease.smooth}; border-radius: ${DS.radius.pill} !important; }
    .nav-item:hover { background: rgba(99,102,241,0.07) !important; color: ${DS.color.navyMid} !important; }
    .nav-item.active { background: rgba(59,130,246,0.10) !important; color: ${DS.color.mintText} !important; font-weight: 700 !important; }

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
      .pricing-grid   { grid-template-columns: 1fr !important; }
      .benefits-grid  { grid-template-columns: 1fr 1fr !important; }
      .checkout-grid  { grid-template-columns: 1fr !important; }
      .footer-grid    { grid-template-columns: 1fr 1fr !important; }
      .product-grid   { grid-template-columns: 1fr !important; }
      .nav-desktop    { display: none !important; }
      .mobile-nav-btn { display: flex !important; }
      .hero-cta-row   { flex-direction: column !important; }
      .hero-cta-row button, .hero-cta-row > div { width: 100% !important; }
    }
    @media (max-width: 640px) {
      .hero-right { transform: none !important; }
      .glass-bubble { opacity: 0.25; }
    }
    @media (max-width: 480px) {
      .benefits-grid  { grid-template-columns: 1fr !important; }
      .footer-grid    { grid-template-columns: 1fr !important; }
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
      .glass-bubble { animation: none !important; }
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
const Badge = memo(({ children, color="rgba(99,102,241,0.10)", text="#4338ca", style={} }) => (
  <span style={{
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
      background: DS.grad.cta,
      color: "#fff",
      border: "none",
      boxShadow: "0 16px 38px rgba(99,102,241,0.36), inset 0 1px 0 rgba(255,255,255,0.42), inset 0 -10px 18px rgba(29,78,216,0.18)",
    },
    white: {
      background: "rgba(255,255,255,0.88)",
      color: DS.color.navy,
      border: "1.5px solid rgba(15,23,42,0.10)",
      boxShadow: DS.shadow.glass,
    },
    outline: {
      background: "rgba(255,255,255,0.70)",
      color: DS.color.mintText,
      border: `1.5px solid rgba(99,102,241,0.22)`,
      boxShadow: DS.shadow.sm,
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
      background: DS.grad.premium,
      color: "#fff",
      border: "none",
      boxShadow: "0 6px 24px rgba(139,92,246,0.38), inset 0 1px 0 rgba(255,255,255,0.22)",
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
const DashboardImage = memo(({ type = "monthly", loading = "eager", fit = "contain", position = "center top" }) => {
  const [errored, setErrored] = useState(false);
  const src = type === "annual" ? "/annual-dashboard-preview.png" : "/monthly-dashboard-preview.png";
  const label = type === "annual" ? "annual-dashboard-preview.png" : "monthly-dashboard-preview.png";
  const alt = type === "annual"
    ? "Annual expenses dashboard preview — 12-month income, expenses, savings and debt overview"
    : "Monthly budget tracker dashboard preview — income, expenses, savings and category breakdown";

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
        <span>Add <code style={{background:"#fff",padding:"2px 6px",borderRadius:6,border:"1px solid #e2e8f0"}}>{label}</code> to /public</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      onError={()=>setErrored(true)}
      style={{ width:"100%", height:"100%", objectFit:fit, objectPosition:position, display:"block" }}
    />
  );
});

// Kept as a thin backward-compatible alias — some older sections below
// referenced TrackerScreenshot directly; both names now point to the
// same real-image component so nothing breaks if either name is used.
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
//  HERO SECTION — Luxury Liquid Glass with real tracker image
// ═══════════════════════════════════════════════════════════════════
const HeroSection = memo(({ onNavigate }) => {
  const goTo = (path) => { onNavigate(path); };

  return (
    <section style={{
      position:"relative",
      background:DS.grad.hero,
      padding:"88px 20px 80px",
      overflow:"hidden",
      minHeight:"92vh",
      display:"flex",
      alignItems:"center",
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
        <div className="hero-grid" style={{display:"flex",gap:56,alignItems:"center",justifyContent:"space-between"}}>

          {/* ── LEFT: Copy — ~39% ── */}
          <div style={{flex:"0 0 39%",display:"flex",flexDirection:"column",gap:24,minWidth:0}}>
            {/* Badges */}
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <Badge color="rgba(239,68,68,0.10)" text="#dc2626" style={{border:"1px solid rgba(239,68,68,0.18)"}}>
                🔥 Limited-time Pricing
              </Badge>
              <Badge color="rgba(245,158,11,0.10)" text="#b45309" style={{border:"1px solid rgba(245,158,11,0.20)"}}>
                ⭐ 4.9 Rating · 5,000+ Buyers
              </Badge>
            </div>

            {/* Headline */}
            <div>
              <h1 style={{
                fontFamily:DS.font.heading,
                fontSize:"clamp(38px,4.8vw,62px)",
                fontWeight:900,
                lineHeight:1.08,
                letterSpacing:"-0.03em",
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
            <div className="floating" style={{
              width:"100%",
              maxWidth:960,
              padding:20,
              borderRadius:38,
              position:"relative",
              zIndex:4,
              background:"linear-gradient(145deg, rgba(255,255,255,0.78), rgba(255,255,255,0.38))",
              border:"1px solid rgba(255,255,255,0.88)",
              boxShadow:"0 38px 110px rgba(99,102,241,0.22), 0 18px 48px rgba(15,23,42,0.12), inset 0 1px 0 rgba(255,255,255,0.95)",
              backdropFilter:"blur(30px) saturate(180%)",
              WebkitBackdropFilter:"blur(30px) saturate(180%)",
              animation:"floatSlow 8s ease-in-out infinite",
            }}>
              <div style={{
                overflow:"hidden",
                borderRadius:26,
                background:"#fff",
                border:"1px solid rgba(99,102,241,0.16)",
                aspectRatio:"1536 / 1024",
                boxShadow:"inset 0 1px 0 rgba(255,255,255,0.95), 0 22px 70px rgba(15,23,42,0.08)",
              }}>
                <DashboardImage type="monthly" loading="eager" fit="contain" position="center top" />
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
          <div style={{fontFamily:DS.font.heading,fontSize:14,fontWeight:800,color:DS.color.navy,letterSpacing:"-0.01em"}}>Smart Expense Tracker</div>
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
  const navLinks=[{id:"/",label:"Home"},{id:"/product",label:"Product"},{id:"/#faq",label:"FAQ"}];

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
            <span style={{fontFamily:DS.font.heading,fontWeight:900,fontSize:20,color:DS.color.navy,letterSpacing:"-0.02em"}}>
              Budget<span style={{background:DS.grad.cta,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Pro</span>
            </span>
          </button>

          {/* Center nav pills */}
          <div className="nav-desktop" style={{display:"flex",gap:2,alignItems:"center",background:"rgba(248,251,255,0.80)",borderRadius:DS.radius.pill,padding:"4px",border:"1px solid rgba(15,23,42,0.07)",backdropFilter:"blur(12px)"}}>
            {navLinks.map(l=>{
              const isActive = l.id==="/"?path==="/":path.startsWith(l.id.split("#")[0]);
              return (
                <button key={l.id} onClick={()=>goTo(l.id)} className={`nav-item ${isActive?"active":""}`}
                  style={{background:"transparent",border:"none",cursor:"pointer",padding:"7px 16px",fontWeight:600,color:DS.color.slate,fontSize:14,fontFamily:"inherit"}}>
                  {l.label}
                </button>
              );
            })}
          </div>

          {/* Right CTAs */}
          <div className="nav-desktop" style={{display:"flex",gap:10,alignItems:"center"}}>
            <LiquidBtn variant="white" size="sm" onClick={()=>goTo("/checkout?plan=monthly")}>Monthly ₹19</LiquidBtn>
            <LiquidBtn variant="cta" size="sm" onClick={()=>goTo("/checkout?plan=yearly")}
              style={{boxShadow:"0 4px 16px rgba(99,102,241,0.35)"}}>Full Year ₹49</LiquidBtn>
            <button onClick={()=>goTo("/admin")} style={{background:"rgba(248,251,255,0.80)",border:"1px solid rgba(15,23,42,0.08)",borderRadius:"50%",cursor:"pointer",padding:"9px",color:DS.color.slate,display:"flex",alignItems:"center",backdropFilter:"blur(12px)"}}>
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
    <div style={{
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
        <Badge color={hl?"rgba(99,102,241,0.10)":"rgba(15,23,42,0.05)"} text={hl?"#4338ca":DS.color.slateLight}>{plan.badge}</Badge>
        <h3 style={{fontFamily:DS.font.heading,fontSize:DS.type.h4,fontWeight:800,color:DS.color.navy,margin:"14px 0 4px",letterSpacing:"-0.01em"}}>{plan.name}</h3>
        <p style={{fontSize:DS.type.sm,color:DS.color.slateLight,marginBottom:24,lineHeight:1.6}}>{plan.desc}</p>
        <div style={{display:"flex",alignItems:"flex-end",gap:10,marginBottom:6}}>
          <span style={{fontFamily:DS.font.number,fontSize:58,fontWeight:900,color:DS.color.navy,lineHeight:1,letterSpacing:"-0.03em"}}>₹{plan.price}</span>
          <div style={{paddingBottom:10}}>
            <div style={{fontFamily:DS.font.number,color:DS.color.slateLight,textDecoration:"line-through",fontSize:18,fontWeight:600}}>₹{plan.original}</div>
            <Badge color="rgba(239,68,68,0.08)" text="#dc2626">{plan.discount} OFF</Badge>
          </div>
        </div>
        <div style={{fontSize:DS.type.xs,color:DS.color.slateLight,marginBottom:28}}>One-time payment · Instant download</div>
        <ul style={{listStyle:"none",marginBottom:32,display:"grid",gap:11}}>
          {plan.features.map(f=>(
            <li key={f} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
              <div style={{background:"rgba(99,102,241,0.10)",borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                <Icon name="check" size={11} color="#4338ca"/>
              </div>
              <span style={{color:DS.color.slate,fontSize:DS.type.sm,lineHeight:1.6}}>{f}</span>
            </li>
          ))}
        </ul>
        <LiquidBtn variant={hl?"cta":"outline"} size="lg" onClick={()=>goTo(`/checkout?plan=${plan.id}`)}
          style={{width:"100%",justifyContent:"center",boxShadow:hl?"0 8px 32px rgba(99,102,241,0.35)":"none",animation:hl?"pulse 2.5s infinite":"none"}}>
          <Icon name={hl?"bag":"download"} size={18} color={hl?"#fff":"#4338ca"}/>
          {plan.cta}
        </LiquidBtn>
      </div>
    </div>
  );
});

// Testimonial
const TestimonialCard = memo(({ t }) => (
  <div className="glass-card card-lift" style={{borderRadius:DS.radius["2xl"],padding:24,display:"flex",flexDirection:"column",gap:14}}>
    <div style={{display:"flex",gap:2}}>{[1,2,3,4,5].map(s=><Icon key={s} name="star" size={14} color={DS.color.gold} filled/>)}</div>
    <p style={{color:DS.color.slate,fontSize:DS.type.sm,lineHeight:1.8,fontStyle:"italic",flex:1}}>"{t.text}"</p>
    <div style={{display:"flex",alignItems:"center",gap:12,paddingTop:14,borderTop:`1px solid ${DS.color.border}`}}>
      <div style={{width:44,height:44,borderRadius:"50%",background:DS.grad.cta,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,flexShrink:0,boxShadow:"0 4px 12px rgba(99,102,241,0.30)"}}>{t.avatar}</div>
      <div>
        <div style={{fontWeight:700,fontSize:14,color:DS.color.navy}}>{t.name}</div>
        <div style={{fontSize:DS.type.xs,color:DS.color.slateLight,marginTop:1}}>{t.role}</div>
      </div>
    </div>
  </div>
));

// ═══════════════════════════════════════════════════════════════════
//  HOME PAGE
// ═══════════════════════════════════════════════════════════════════
const HomePage = memo(() => {
  const navigate = useNavigate();
  const goTo = p => { navigate(p); window.scrollTo({top:0,behavior:"smooth"}); };
  const [stickyVisible,setStickyVisible] = useState(false);

  useEffect(()=>{
    const fn=()=>setStickyVisible(window.scrollY>500);
    window.addEventListener("scroll",fn,{passive:true});
    return()=>window.removeEventListener("scroll",fn);
  },[]);

  const testimonials=[
    {name:"Priya Sharma", role:"Homemaker, Mumbai",            text:"This dashboard changed how I manage our family budget. I finally know where every rupee goes. Worth 10x the price!",  avatar:"PS"},
    {name:"Rahul Verma",  role:"Software Engineer, Bangalore", text:"Worth every rupee. My savings went from 8% to 31% in just 4 months. Smart Expense Tracker is a game changer.",        avatar:"RV"},
    {name:"Ananya Patel", role:"Freelancer, Ahmedabad",        text:"Finally an expense tracker that doesn't feel overwhelming. Set it up in 10 minutes and I've been using it every day.", avatar:"AP"},
    {name:"Deepak Singh", role:"Teacher, Delhi",               text:"My savings rate went from 10% to 28% in 3 months! I could finally afford my dream vacation.",                          avatar:"DS"},
  ];

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
      <HeroSection onNavigate={p=>{navigate(p);window.scrollTo({top:0,behavior:"smooth"});}}/>

      {/* URGENCY STRIP */}
      <div style={{background:"linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899,#8b5cf6,#6366f1)",backgroundSize:"300% 100%",animation:"gradShift 5s ease infinite",padding:"13px 20px",textAlign:"center"}}>
        <span style={{color:"#fff",fontSize:DS.type.sm,fontWeight:700}}>⚡ <strong>Limited-time pricing</strong> — save up to 95% today. Price going up soon!</span>
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

      {/* LIVE DEMO — real Annual Dashboard preview, not the fake animated chart */}
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
            <div className="floating" style={{
              width:"100%",maxWidth:1040,padding:20,borderRadius:38,position:"relative",zIndex:2,
              background:"linear-gradient(145deg, rgba(255,255,255,0.78), rgba(255,255,255,0.38))",
              border:"1px solid rgba(255,255,255,0.88)",
              boxShadow:"0 38px 110px rgba(139,92,246,0.20), 0 18px 48px rgba(15,23,42,0.12), inset 0 1px 0 rgba(255,255,255,0.95)",
              backdropFilter:"blur(30px) saturate(180%)",
              WebkitBackdropFilter:"blur(30px) saturate(180%)",
              animation:"floatSlow 9s ease-in-out infinite",
            }}>
              <div style={{
                overflow:"hidden",borderRadius:26,background:"#fff",
                border:"1px solid rgba(139,92,246,0.16)",
                aspectRatio:"1536 / 1024",
                boxShadow:"inset 0 1px 0 rgba(255,255,255,0.95), 0 22px 70px rgba(15,23,42,0.08)",
              }}>
                <DashboardImage type="annual" loading="lazy" fit="contain" position="center top" />
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
      <section style={{padding:"80px 20px",background:"#ffffff"}}>
        <div style={{maxWidth:980,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:52}}>
            <Badge style={{marginBottom:16}}>Real Reviews</Badge>
            <h2 style={{fontFamily:DS.font.heading,fontSize:DS.type.h2,fontWeight:900,color:DS.color.navy,letterSpacing:"-0.02em",marginBottom:8}}>Loved by Thousands of Indians</h2>
            <p style={{color:DS.color.slateLight,fontSize:16}}>People just like you who took control of their money</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:22}}>
            {testimonials.map(t=><TestimonialCard key={t.name} t={t}/>)}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{padding:"80px 20px",background:DS.grad.section}}>
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
          <p style={{color:DS.color.slateLight,fontSize:17,marginBottom:44,lineHeight:1.75}}>Join 5,000+ Indians already using BudgetPro to save more, spend smarter, and stress less about money.</p>
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
  const goTo = p => { navigate(p); window.scrollTo({top:0,behavior:"smooth"}); };
  const [activeTab,setActiveTab] = useState("features");
  const [selectedPlan,setSelectedPlan] = useState("yearly");

  const features=["Monthly income & expense tracker","Income vs Savings visualization charts","Category-wise expense breakdown","Savings goal progress tracker","Annual expense summary (Full Year only)","Beginner-friendly, no macros needed","Works on Excel 2016+ and Google Sheets","Indian Rupee (₹) formatted throughout","12-month rolling expense view (Full Year)","Print-ready monthly reports"];
  const specs=[["Format","Excel (.xlsx) + Google Sheets link"],["Compatibility","Excel 2016, 2019, 2021, 365, Google Sheets"],["File Size","~2.4 MB (Monthly) / ~4.1 MB (Full Year)"],["Currency","Indian Rupee (₹)"],["Language","English"],["Macros","No macros — 100% safe"],["Updates","Free lifetime updates"],["Support","Email support included"]];

  return (
    <div style={{background:DS.grad.section,minHeight:"100vh",padding:"60px 20px",position:"relative",overflow:"hidden"}}>
      <GlassBubble size={130} style={{ top:"6%", right:"3%" }} />
      <GlassBubble size={60}  style={{ bottom:"6%", left:"3%", animationDelay:"2.4s" }} />
      <div style={{maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2}}>
        <div className="product-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:52,alignItems:"start"}}>
          <div>
            <div style={{boxShadow:DS.shadow.glassLg,borderRadius:DS.radius["2xl"],overflow:"hidden",border:"1px solid rgba(255,255,255,0.85)"}}>
              <div style={{background:"rgba(248,251,255,0.95)",padding:"11px 16px",display:"flex",gap:6,alignItems:"center",borderBottom:`1px solid ${DS.color.border}`}}>
                {["#ff5f57","#febc2e","#28c840"].map(c=><div key={c} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}
                <div style={{background:"rgba(15,23,42,0.05)",borderRadius:DS.radius.pill,padding:"3px 14px",fontSize:10,color:DS.color.slateLight,marginLeft:6}}>
                  {selectedPlan==="monthly"?"Monthly Dashboard Preview":"Annual Dashboard Preview"}
                </div>
              </div>
              <div style={{padding:14,background:DS.grad.section,aspectRatio:"1536 / 1024"}}>
                <div style={{width:"100%",height:"100%",borderRadius:DS.radius.lg,overflow:"hidden",background:"#fff",border:"1px solid rgba(99,102,241,0.12)"}}>
                  <DashboardImage type={selectedPlan==="monthly"?"monthly":"annual"} loading="eager" fit="contain" position="center top" />
                </div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginTop:14}}>
              {[{icon:"shield",text:"Secure Payment"},{icon:"zap",text:"Instant Download"},{icon:"check",text:"Lifetime Access"}].map(b=>(
                <div key={b.text} className="glass-card" style={{borderRadius:DS.radius.xl,padding:"14px 10px",textAlign:"center"}}>
                  <Icon name={b.icon} size={18} color="#4338ca"/><div style={{fontSize:11,color:DS.color.slateLight,marginTop:7,fontWeight:700}}>{b.text}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Badge style={{marginBottom:12}}>Best Seller</Badge>
            <h1 style={{fontFamily:DS.font.heading,fontSize:DS.type.h1,fontWeight:900,color:DS.color.navy,margin:"12px 0 10px",lineHeight:1.12,letterSpacing:"-0.02em"}}>Ultimate Budget Dashboard Template</h1>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
              <div style={{display:"flex",gap:2}}>{[1,2,3,4,5].map(s=><Icon key={s} name="star" size={14} color={DS.color.gold} filled/>)}</div>
              <span style={{color:DS.color.slateLight,fontSize:13}}>4.9 · 312 verified reviews</span>
            </div>
            <p style={{color:DS.color.slateLight,lineHeight:1.8,marginBottom:26,fontSize:DS.type.body}}>A professionally designed Excel & Google Sheets template that makes budgeting simple, beautiful, and actually useful.</p>

            {/* Plan selector */}
            <div className="glass-card" style={{borderRadius:DS.radius.xl,padding:4,display:"flex",gap:4,marginBottom:22}}>
              {[{id:"monthly",label:"Monthly",price:"₹19"},{id:"yearly",label:"Full Year",price:"₹49"}].map(p=>(
                <button key={p.id} onClick={()=>setSelectedPlan(p.id)} style={{
                  flex:1,padding:"11px 14px",borderRadius:DS.radius.lg,border:"none",cursor:"pointer",fontWeight:700,fontSize:DS.type.sm,fontFamily:"inherit",
                  background:selectedPlan===p.id?DS.grad.cta:"transparent",color:selectedPlan===p.id?"#fff":DS.color.slateLight,
                  boxShadow:selectedPlan===p.id?"0 4px 16px rgba(99,102,241,0.30)":"none",
                  transition:`all 0.2s ${DS.ease.smooth}`,display:"flex",alignItems:"center",justifyContent:"center",gap:6,
                }}>
                  {p.label}<span style={{fontFamily:DS.font.number,fontWeight:900}}>{p.price}</span>
                  {p.id==="yearly"&&<Badge color="rgba(245,158,11,0.15)" text="#b45309" style={{fontSize:9,padding:"1px 7px"}}>Best Value</Badge>}
                </button>
              ))}
            </div>

            <div className="glass-card" style={{borderRadius:DS.radius["2xl"],marginBottom:22,border:"1.5px solid rgba(99,102,241,0.18)"}}>
              <div style={{padding:"18px 20px"}}>
                <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
                  <span style={{fontFamily:DS.font.number,fontSize:56,fontWeight:900,color:DS.color.navy,lineHeight:1,letterSpacing:"-0.03em"}}>{selectedPlan==="monthly"?"₹19":"₹49"}</span>
                  <div>
                    <div style={{fontFamily:DS.font.number,color:DS.color.slateLight,textDecoration:"line-through",fontSize:18}}>{selectedPlan==="monthly"?"₹299":"₹999"}</div>
                    <Badge color="rgba(239,68,68,0.08)" text="#dc2626">{selectedPlan==="monthly"?"94% OFF":"95% OFF"}</Badge>
                    {selectedPlan==="yearly"&&<div style={{color:DS.color.gold,fontSize:DS.type.xs,fontWeight:700,marginTop:5}}>⭐ Save ₹30 vs Monthly × 12</div>}
                  </div>
                </div>
                <LiquidBtn variant="cta" size="lg" onClick={()=>goTo(`/checkout?plan=${selectedPlan}`)} style={{width:"100%",justifyContent:"center"}}>
                  <Icon name="bag" size={18} color="#fff"/>{selectedPlan==="monthly"?"Buy Monthly — ₹19":"Buy Full Year — ₹49"}
                </LiquidBtn>
                <div style={{textAlign:"center",marginTop:10,color:DS.color.slateLight,fontSize:DS.type.xs}}>Secure · Instant delivery · Razorpay</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="glass-card" style={{borderRadius:DS.radius.xl,padding:4,display:"flex",gap:4,marginBottom:18}}>
              {["features","specs"].map(t=>(
                <button key={t} onClick={()=>setActiveTab(t)} style={{
                  flex:1,padding:"9px 14px",borderRadius:DS.radius.lg,border:"none",cursor:"pointer",
                  fontWeight:700,fontSize:DS.type.sm,textTransform:"capitalize",fontFamily:"inherit",
                  background:activeTab===t?DS.grad.glass:"transparent",color:activeTab===t?DS.color.navy:DS.color.slateLight,
                  boxShadow:activeTab===t?DS.shadow.xs:"none",transition:`all 0.18s ${DS.ease.smooth}`,
                }}>{t}</button>
              ))}
            </div>
            {activeTab==="features"&&(
              <div style={{display:"grid",gap:8}}>
                {features.map(f=>(
                  <div key={f} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                    <div style={{background:"rgba(99,102,241,0.10)",borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}><Icon name="check" size={10} color="#4338ca"/></div>
                    <span style={{color:DS.color.slate,fontSize:DS.type.sm,lineHeight:1.6}}>{f}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab==="specs"&&(
              <div>{specs.map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${DS.color.border}`}}>
                  <span style={{color:DS.color.slateLight,fontSize:DS.type.sm}}>{k}</span>
                  <span style={{color:DS.color.navy,fontSize:DS.type.sm,fontWeight:700,textAlign:"right",maxWidth:"55%"}}>{v}</span>
                </div>
              ))}</div>
            )}
          </div>
        </div>
      </div>
    </div>
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
  const [form,setForm]             = useState({name:"",email:"",phone:""});
  const [selectedPlan,setSelectedPlan] = useState(planFromURL);
  const [payMethod,setPayMethod]   = useState("upi");
  const [upiApp,setUpiApp]         = useState("googlepay");
  const [loading,setLoading]       = useState(false);
  const [errors,setErrors]         = useState({});
  const [livePrices,setLivePrices] = useState({
    monthly:{price:19,original:299,discount:"94% OFF",desc:"Single-month expense tracking",label:"Monthly Smart Expense Tracker"},
    yearly: {price:49,original:999,discount:"95% OFF",desc:"12 months + yearly expense overview",label:"Full Year Smart Expense Tracker"},
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

  const handlePay = useCallback(()=>{
    const e={};
    const cf={name:form.name.trim(),email:form.email.trim(),phone:form.phone.trim()};
    if(!cf.name)                         e.name ="Full name is required";
    if(!cf.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email="Valid email is required";
    if(!cf.phone.match(/^\d{10}$/))     e.phone="10-digit mobile number required";
    if(Object.keys(e).length){setErrors(e);return;}
    setLoading(true);
    (async()=>{
      try{
        const orderRes=await fetch("/api/create-order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...cf,plan:selectedPlan})});
        const order=await orderRes.json().catch(()=>({}));
        if(!orderRes.ok||order.error) throw new Error(order.error||"Could not create order");
        const razorpayKey=order.keyId||order.key;
        const razorpayOrderId=order.razorpayOrderId||order.orderId||order.id;
        if(!razorpayKey||!razorpayOrderId) throw new Error("Payment order missing Razorpay key/order ID.");
        const options={
          key:razorpayKey,amount:order.amount,currency:order.currency||"INR",
          name:"BudgetPro",description:plan.label,order_id:razorpayOrderId,
          prefill:{name:cf.name,email:cf.email,contact:cf.phone},
          theme:{color:"#6366f1"},
          handler:async function(response){
            try{
              const vr=await fetch("/api/verify-payment",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({razorpay_order_id:response.razorpay_order_id,razorpay_payment_id:response.razorpay_payment_id,razorpay_signature:response.razorpay_signature})});
              const result=await vr.json().catch(()=>({}));
              if(!vr.ok||result.error) throw new Error(result.error||"Payment verification failed");
              if(result.success){navigate("/success",{state:{name:result.customerName||cf.name,email:result.customerEmail||cf.email,plan:result.plan||selectedPlan,token:result.downloadToken||result.token}});window.scrollTo({top:0,behavior:"smooth"});}
              else alert("Payment verification failed. Contact support with payment ID: "+response.razorpay_payment_id);
            }catch(ve){alert((ve&&ve.message)||"Verification failed. Please contact support.");}
            finally{setLoading(false);}
          },
          modal:{ondismiss(){setLoading(false);}},
        };
        const ok=await loadRazorpayScript();
        if(!ok||!window.Razorpay) throw new Error("Payment system failed to load. Please refresh.");
        new window.Razorpay(options).open();
      }catch(err){alert((err&&err.message)||"Something went wrong.");setLoading(false);}
    })();
  },[form,selectedPlan,plan,navigate]);

  const inp = field=>({width:"100%",padding:"13px 16px",borderRadius:DS.radius.lg,border:`1.5px solid ${errors[field]?"#ef4444":DS.color.border}`,fontSize:DS.type.body,color:DS.color.navy,background:"rgba(255,255,255,0.80)",transition:`all 0.2s ${DS.ease.smooth}`,fontFamily:"inherit",backdropFilter:"blur(8px)"});
  const payMethods=[{id:"upi",label:"UPI",icon:"phone"},{id:"card",label:"Card",icon:"creditCard"},{id:"netbanking",label:"Net Banking",icon:"building"}];
  const upiApps=[{id:"googlepay",label:"Google Pay"},{id:"phonepe",label:"PhonePe"},{id:"paytm",label:"Paytm"},{id:"bhim",label:"BHIM UPI"}];

  return (
    <div style={{background:DS.grad.section,minHeight:"100vh"}}>
      {/* Checkout header */}
      <div style={{background:DS.grad.cta,padding:"20px 24px",borderBottom:"1px solid rgba(255,255,255,0.15)"}}>
        <div style={{maxWidth:900,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:22}}>📊</span>
            <span style={{fontFamily:DS.font.heading,fontWeight:900,fontSize:18,color:"#fff"}}>Budget<span style={{color:"rgba(255,255,255,0.75)"}}>Pro</span></span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <Icon name="lock" size={14} color="rgba(255,255,255,0.80)"/>
            <span style={{color:"rgba(255,255,255,0.70)",fontSize:DS.type.sm}}>Secure Checkout · Powered by Razorpay</span>
          </div>
        </div>
      </div>

      <div style={{maxWidth:900,margin:"0 auto",padding:"40px 20px"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <Badge style={{marginBottom:14}}>Secure Purchase</Badge>
          <h1 style={{fontFamily:DS.font.heading,fontSize:DS.type.h2,fontWeight:900,color:DS.color.navy,marginBottom:10,letterSpacing:"-0.02em"}}>Get Smart Expense Tracker</h1>
          <p style={{color:DS.color.slateLight,fontSize:DS.type.body,lineHeight:1.7,maxWidth:560,margin:"0 auto"}}>Start tracking every rupee with a premium Excel dashboard delivered instantly after payment.</p>
        </div>

        {/* Plan toggle */}
        <div className="glass-card" style={{borderRadius:DS.radius.xl,padding:4,display:"flex",gap:4,marginBottom:32,maxWidth:400}}>
          {[{id:"monthly",label:"Monthly",price:"₹19"},{id:"yearly",label:"Full Year",price:"₹49"}].map(p=>(
            <button key={p.id} onClick={()=>setSelectedPlan(p.id)} style={{flex:1,padding:"11px 14px",borderRadius:DS.radius.lg,border:"none",cursor:"pointer",fontWeight:700,fontSize:DS.type.sm,fontFamily:"inherit",background:selectedPlan===p.id?DS.grad.cta:"transparent",color:selectedPlan===p.id?"#fff":DS.color.slateLight,boxShadow:selectedPlan===p.id?"0 4px 16px rgba(99,102,241,0.30)":"none",transition:`all 0.22s ${DS.ease.smooth}`,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              {p.label}<span style={{fontFamily:DS.font.number,fontWeight:900}}>{p.price}</span>
            </button>
          ))}
        </div>

        <div className="checkout-grid" style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:28}}>
          {/* Form */}
          <div style={{display:"grid",gap:20}}>
            <div className="glass-card" style={{borderRadius:DS.radius["2xl"],padding:"22px"}}>
              <h3 style={{fontFamily:DS.font.heading,fontWeight:800,color:DS.color.navy,marginBottom:20,fontSize:DS.type.h4}}>Personal Information</h3>
              <div style={{display:"grid",gap:18}}>
                {[{key:"name",label:"Full Name",placeholder:"Rahul Sharma",hint:null,maxLength:60},{key:"email",label:"Email Address",placeholder:"rahul@email.com",hint:"Your download link will be sent here",maxLength:100},{key:"phone",label:"Mobile Number",placeholder:"9876543210",hint:null,maxLength:10}].map(({key,label,placeholder,hint,maxLength})=>(
                  <div key={key}>
                    <label style={{fontSize:DS.type.sm,fontWeight:700,color:DS.color.slate,display:"block",marginBottom:7}}>{label}</label>
                    <input style={inp(key)} placeholder={placeholder} value={form[key]} maxLength={maxLength} onChange={e=>{setForm({...form,[key]:e.target.value});setErrors({...errors,[key]:null});}}/>
                    {errors[key]&&<div style={{color:"#ef4444",fontSize:DS.type.xs,marginTop:5,fontWeight:600}}>⚠ {errors[key]}</div>}
                    {hint&&<div style={{fontSize:DS.type.xs,color:DS.color.slateLight,marginTop:5}}>{hint}</div>}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card" style={{borderRadius:DS.radius["2xl"],padding:"22px"}}>
              <h3 style={{fontFamily:DS.font.heading,fontWeight:800,color:DS.color.navy,marginBottom:20,fontSize:DS.type.h4}}>Payment Method</h3>
              <div style={{display:"flex",gap:8,marginBottom:22}}>
                {payMethods.map(m=>(
                  <button key={m.id} onClick={()=>setPayMethod(m.id)} style={{flex:1,padding:"13px 10px",borderRadius:DS.radius.lg,border:`1.5px solid ${payMethod===m.id?"rgba(99,102,241,0.40)":DS.color.border}`,background:payMethod===m.id?"rgba(99,102,241,0.07)":"rgba(255,255,255,0.60)",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:7,transition:`all 0.2s ${DS.ease.smooth}`}}>
                    <Icon name={m.icon} size={20} color={payMethod===m.id?"#4338ca":DS.color.slateLight}/><span style={{fontSize:DS.type.xs,fontWeight:700,color:payMethod===m.id?"#4338ca":DS.color.slateLight}}>{m.label}</span>
                  </button>
                ))}
              </div>
              {payMethod==="upi"&&(
                <div>
                  <label style={{fontSize:DS.type.sm,fontWeight:700,color:DS.color.slate,display:"block",marginBottom:10}}>Select UPI App</label>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
                    {upiApps.map(a=>(
                      <button key={a.id} onClick={()=>setUpiApp(a.id)} style={{padding:"11px 14px",borderRadius:DS.radius.lg,border:`1.5px solid ${upiApp===a.id?"rgba(99,102,241,0.35)":DS.color.border}`,background:upiApp===a.id?"rgba(99,102,241,0.07)":"rgba(255,255,255,0.60)",cursor:"pointer",fontWeight:700,fontSize:DS.type.sm,fontFamily:"inherit",color:upiApp===a.id?"#4338ca":DS.color.slateLight,transition:`all 0.18s ${DS.ease.smooth}`}}>{a.label}</button>
                    ))}
                  </div>
                  <input style={inp("upi")} placeholder="yourname@upi"/>
                  <div style={{fontSize:DS.type.xs,color:DS.color.slateLight,marginTop:5}}>Or enter your UPI ID above</div>
                </div>
              )}
              {payMethod==="card"&&(
                <div style={{display:"grid",gap:14}}>
                  <div><label style={{fontSize:DS.type.sm,fontWeight:700,color:DS.color.slate,display:"block",marginBottom:6}}>Card Number</label><input style={inp("card")} placeholder="1234 5678 9012 3456" maxLength={19}/></div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                    <div><label style={{fontSize:DS.type.sm,fontWeight:700,color:DS.color.slate,display:"block",marginBottom:6}}>Expiry</label><input style={inp("exp")} placeholder="MM / YY" maxLength={7}/></div>
                    <div><label style={{fontSize:DS.type.sm,fontWeight:700,color:DS.color.slate,display:"block",marginBottom:6}}>CVV</label><input style={inp("cvv")} placeholder="•••" maxLength={3} type="password"/></div>
                  </div>
                  <div><label style={{fontSize:DS.type.sm,fontWeight:700,color:DS.color.slate,display:"block",marginBottom:6}}>Name on Card</label><input style={inp("cardname")} placeholder="Rahul Sharma"/></div>
                </div>
              )}
              {payMethod==="netbanking"&&(
                <div><label style={{fontSize:DS.type.sm,fontWeight:700,color:DS.color.slate,display:"block",marginBottom:10}}>Select Bank</label>
                  <select style={{...inp("bank"),cursor:"pointer"}}>
                    {["SBI","HDFC Bank","ICICI Bank","Axis Bank","Kotak Bank","PNB","Bank of Baroda","Union Bank","Canara Bank","Other Banks"].map(b=><option key={b}>{b}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Order summary */}
          <div style={{position:"sticky",top:20}}>
            <div className="glass-card" style={{borderRadius:DS.radius["2xl"],border:"1.5px solid rgba(99,102,241,0.18)"}}>
              <div style={{padding:"20px"}}>
                <h3 style={{fontFamily:DS.font.heading,fontWeight:800,color:DS.color.navy,marginBottom:20,fontSize:DS.type.h4}}>Order Summary</h3>
                <div style={{display:"flex",gap:12,alignItems:"center",padding:14,background:"rgba(99,102,241,0.05)",borderRadius:DS.radius.xl,marginBottom:18,border:"1px solid rgba(99,102,241,0.10)"}}>
                  <div style={{background:DS.grad.cta,borderRadius:DS.radius.lg,padding:"10px 14px",color:"#fff",fontSize:22}}>📊</div>
                  <div>
                    <div style={{fontWeight:800,color:DS.color.navy,fontSize:13}}>{plan.label}</div>
                    <div style={{color:DS.color.slateLight,fontSize:DS.type.xs,marginTop:2}}>{plan.desc}</div>
                    {selectedPlan==="yearly"&&<div style={{color:DS.color.gold,fontSize:DS.type.xs,fontWeight:700,marginTop:3}}>⭐ Best Value</div>}
                  </div>
                </div>
                <div style={{borderTop:`1px solid ${DS.color.border}`,paddingTop:16,marginBottom:22}}>
                  {[["Original Price",`₹${plan.original}`,true,null],[`Discount (${plan.discount})`,`-₹${plan.original-plan.price}`,false,"#16a34a"],["GST (18%)",`₹${(plan.price*0.18).toFixed(2)}`,false,null]].map(([l,v,strike,color])=>(
                    <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                      <span style={{color:DS.color.slateLight,fontSize:DS.type.sm}}>{l}</span>
                      <span style={{fontFamily:DS.font.number,color:strike?DS.color.slateLight:(color||DS.color.slate),fontSize:DS.type.sm,fontWeight:600,textDecoration:strike?"line-through":"none"}}>{v}</span>
                    </div>
                  ))}
                  <div style={{display:"flex",justifyContent:"space-between",borderTop:`1px solid ${DS.color.border}`,paddingTop:14,marginTop:8}}>
                    <span style={{fontWeight:800,color:DS.color.navy,fontSize:DS.type.h4}}>Total</span>
                    <span style={{fontFamily:DS.font.number,fontWeight:900,background:DS.grad.cta,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontSize:28}}>₹{plan.price}</span>
                  </div>
                </div>
                <LiquidBtn variant="cta" size="lg" onClick={handlePay} disabled={loading} style={{width:"100%",justifyContent:"center",animation:!loading?"pulse 2.5s infinite":"none"}}>
                  {loading?(
                    <span style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{width:17,height:17,border:"2.5px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.7s linear infinite",display:"inline-block"}}/>
                      Processing...
                    </span>
                  ):(<><Icon name="lock" size={18} color="#fff"/> Pay ₹{plan.price} Securely</>)}
                </LiquidBtn>
                <div style={{textAlign:"center",marginTop:12,color:DS.color.slateLight,fontSize:DS.type.xs}}>🔒 Powered by Razorpay · 256-bit SSL</div>
                <div style={{marginTop:14,display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center"}}>
                  {["Visa","Mastercard","RuPay","UPI","Paytm"].map(p=>(
                    <span key={p} style={{background:"rgba(15,23,42,0.04)",border:`1px solid ${DS.color.border}`,borderRadius:DS.radius.sm,padding:"3px 10px",fontSize:10,color:DS.color.slateLight,fontWeight:600}}>{p}</span>
                  ))}
                </div>
                <div style={{marginTop:16,background:"rgba(245,158,11,0.08)",borderRadius:DS.radius.lg,padding:"10px 14px",fontSize:DS.type.xs,color:"#b45309",fontWeight:600,textAlign:"center",border:"1px solid rgba(245,158,11,0.18)"}}>⚡ Limited-time pricing — don't miss out!</div>
              </div>
            </div>
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
        <div style={{display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:20}}>📊</span><span style={{fontFamily:DS.font.heading,fontWeight:800,fontSize:17,color:"#fff"}}>BudgetPro <span style={{color:"rgba(255,255,255,0.70)"}}>Admin</span></span></div>
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
              <span style={{fontFamily:DS.font.heading,fontWeight:900,fontSize:20,color:DS.color.navy}}>Budget<span style={{background:DS.grad.cta,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Pro</span></span>
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
          <div style={{fontSize:DS.type.sm,color:DS.color.slateLight}}>© 2026 BudgetPro. Made with ❤️ in India.</div>
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
