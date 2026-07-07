import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Theme, GlassStyle, prefersReducedMotion, isCoarsePointer } from "./WhiteTheme";

// ═══════════════════════════════════════════════════════════════════
//  NOTE ON THIS FILE
//  WhiteHomePage.jsx imports { WhiteSaaSHero } from "./WhiteSaaSHero",
//  but WhiteSaaSHero.jsx itself was not included in the last upload, so
//  this is a full reconstruction built directly against your written
//  spec (exact headline copy, 42/58 layout split, glass orb background,
//  dashboard-preview-frame sizing, magnetic buttons, cursor particles).
//  If you have a real WhiteSaaSHero.jsx already in your repo, diff it
//  against this one before overwriting — this file assumes the "no
//  props" usage seen in WhiteHomePage.jsx (`<WhiteSaaSHero />`).
// ═══════════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────────
//  MAGNETIC HOVER — tiny reusable helper, no external library.
//  Spread the returned handlers onto any element to get a subtle
//  "pulled toward the cursor" feel on desktop only.
// ───────────────────────────────────────────────────────────────────
function useMagnetic(strength = 14) {
  const ref = useRef(null);
  const onMouseMove = useCallback((e) => {
    if (isCoarsePointer() || prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    const dx = Math.max(-strength, Math.min(strength, x / 6));
    const dy = Math.max(-strength, Math.min(strength, y / 6));
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  }, [strength]);
  const onMouseLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  }, []);
  return { ref, onMouseMove, onMouseLeave };
}

// ───────────────────────────────────────────────────────────────────
//  CURSOR PARTICLES — antigravity trail, desktop only, capped count,
//  respects prefers-reduced-motion, sits behind content (pointer-events none)
// ───────────────────────────────────────────────────────────────────
const CursorParticles = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (isCoarsePointer() || prefersReducedMotion()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let rafId;
    const colors = ["rgba(59,130,246,0.55)", "rgba(139,92,246,0.55)", "rgba(6,182,212,0.5)", "rgba(236,72,153,0.4)"];
    const resize = () => {
      canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > canvas.width || y > canvas.height) return;
      if (Math.random() > 0.4 && particles.length < 70) {
        particles.push({
          x: x + (Math.random() - 0.5) * 30,
          y: y + (Math.random() - 0.5) * 30,
          r: Math.random() * 2.4 + 0.8,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 1.8,
          vy: (Math.random() - 0.5) * 1.8 - 0.3,
          life: 1,
        });
      }
    };
    window.addEventListener("mousemove", onMove);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.life -= 0.013;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life * 0.6;
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
  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }}
    />
  );
};

// ───────────────────────────────────────────────────────────────────
//  DASHBOARD PREVIEW IMAGE — real screenshot, contain-fit, top-anchored
// ───────────────────────────────────────────────────────────────────
export const MonthlyDashboardPreview = () => {
  const [errored, setErrored] = useState(false);
  if (errored) {
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, color: Theme.textMuted, fontSize: 12, fontWeight: 600, background: "linear-gradient(135deg,#f8fbff,#f3f0ff)" }}>
        <span style={{ fontSize: 30 }}>📊</span>
        <span>Add <code style={{ background: "#fff", padding: "2px 6px", borderRadius: 6, border: `1px solid ${Theme.border}` }}>monthly-dashboard-preview.png</code> to /public</span>
      </div>
    );
  }
  return (
    <img
      src="/monthly-dashboard-preview.png"
      alt="Monthly Smart Expense Tracker dashboard preview"
      loading="eager"
      onError={() => setErrored(true)}
      style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center top", display: "block" }}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════
//  WHITE SAAS HERO
// ═══════════════════════════════════════════════════════════════════
export const WhiteSaaSHero = () => {
  const navigate = useNavigate();
  const goTo = (path) => { navigate(path); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const monthlyBtn = useMagnetic(10);
  const yearlyBtn = useMagnetic(12);
  const cardMagnets = [useMagnetic(8), useMagnetic(8), useMagnetic(8), useMagnetic(8)];

  const features = [
    { icon: "✓", label: "Track every rupee with clarity" },
    { icon: "📅", label: "Monthly & yearly expense views" },
    { icon: "📊", label: "Premium dashboard visuals" },
    { icon: "♾️", label: "One-time purchase, lifetime use" },
  ];

  return (
    <section
      style={{
        position: "relative",
        background: Theme.gradHero,
        padding: "84px 20px 72px",
        overflow: "hidden",
        minHeight: "94vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <CursorParticles />

      {/* ── Glass orbs — 4 large blurred droplets, positioned to never cover text/buttons ── */}
      <div className="glass-orb" style={{ top: "-90px", left: "-70px", width: 260, height: 260, animation: "orbFloat 16s ease-in-out infinite" }} />
      <div className="glass-orb" style={{ top: "18%", right: "2%", width: 340, height: 340, zIndex: 1, animation: "orbFloat 20s ease-in-out infinite reverse" }} />
      <div className="glass-orb" style={{ bottom: "-100px", left: "6%", width: 220, height: 220, animation: "orbFloat 13s ease-in-out infinite 1.5s" }} />
      <div className="glass-orb" style={{ top: "6%", right: "22%", width: 90, height: 90, animation: "orbFloat 11s ease-in-out infinite 0.6s" }} />

      <div style={{ maxWidth: 1440, margin: "0 auto", width: "100%", position: "relative", zIndex: 3 }}>
        <div className="hero-flex" style={{ display: "flex", gap: 56, alignItems: "center" }}>

          {/* ══════════ LEFT — 42% ══════════ */}
          <div className="hero-left" style={{ flexBasis: "42%", flexGrow: 0, flexShrink: 0, display: "flex", flexDirection: "column", gap: 22, minWidth: 0 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span style={{ background: "rgba(236,72,153,0.10)", color: "#db2777", border: "1px solid rgba(236,72,153,0.18)", borderRadius: 999, padding: "6px 14px", fontSize: 12, fontWeight: 800 }}>
                🔥 Limited-time Pricing
              </span>
              <span style={{ background: "rgba(234,179,8,0.10)", color: "#a16207", border: "1px solid rgba(234,179,8,0.20)", borderRadius: 999, padding: "6px 14px", fontSize: 12, fontWeight: 800 }}>
                ⭐ 4.9 Rating · 5,000+ Buyers
              </span>
            </div>

            <h1 style={{ fontFamily: Theme.fontHeading, fontSize: "clamp(36px, 4.4vw, 58px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.03em", color: Theme.textPrimary, margin: 0 }}>
              Your money<br />
              isn't disappearing —<br />
              <span style={{ background: "linear-gradient(135deg,#3b82f6 0%,#6366f1 45%,#8b5cf6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", display: "inline-block" }}>
                it's just untracked.
              </span>
            </h1>

            <p style={{ fontSize: 16.5, color: Theme.textSecondary, lineHeight: 1.7, maxWidth: 480, margin: 0 }}>
              Meet <strong style={{ color: Theme.textPrimary }}>Smart Expense Tracker</strong> — a premium Excel dashboard that shows exactly where every rupee goes, how much you save, and what you can control every month.
            </p>

            {/* Feature glass cards — magnetic, icon in circular 3D glass bubble */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {features.map((f, i) => (
                <div
                  key={f.label}
                  ref={cardMagnets[i].ref}
                  onMouseMove={cardMagnets[i].onMouseMove}
                  onMouseLeave={cardMagnets[i].onMouseLeave}
                  className="magnetic-card"
                  style={{ ...GlassStyle, borderRadius: 18, padding: "13px 14px", display: "flex", alignItems: "center", gap: 11, cursor: "default", transition: "transform 0.15s ease, box-shadow 0.25s ease" }}
                >
                  <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, background: "radial-gradient(circle at 32% 28%, #ffffff, #e0e7ff 55%, #c7d2fe 100%)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "inset 0 1px 3px rgba(255,255,255,0.9), 0 4px 10px rgba(99,102,241,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                    {f.icon}
                  </div>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: Theme.textPrimary, lineHeight: 1.35 }}>{f.label}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="hero-cta-row" style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", marginTop: 4 }}>
              <button
                ref={monthlyBtn.ref}
                onMouseMove={monthlyBtn.onMouseMove}
                onMouseLeave={monthlyBtn.onMouseLeave}
                onClick={() => goTo("/checkout?plan=monthly")}
                className="magnetic-btn liquid-btn-white"
                style={{ flex: "1 1 auto", minWidth: 190, justifyContent: "center", display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 28px", borderRadius: 999, fontSize: 15, fontWeight: 800, color: Theme.textPrimary, cursor: "pointer", border: "1px solid rgba(15,23,42,0.10)", background: "rgba(255,255,255,0.85)", boxShadow: "0 10px 30px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.9)" }}
              >
                Start Monthly for ₹19
              </button>

              <div style={{ position: "relative", flex: "1 1 auto", minWidth: 220 }}>
                <span style={{ position: "absolute", top: -13, right: 16, background: "linear-gradient(135deg,#f59e0b,#ec4899)", color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: "0.4px", textTransform: "uppercase", padding: "4px 11px", borderRadius: 999, boxShadow: "0 4px 12px rgba(236,72,153,0.35)", whiteSpace: "nowrap", zIndex: 2 }}>
                  Recommended
                </span>
                <button
                  ref={yearlyBtn.ref}
                  onMouseMove={yearlyBtn.onMouseMove}
                  onMouseLeave={yearlyBtn.onMouseLeave}
                  onClick={() => goTo("/checkout?plan=yearly")}
                  className="magnetic-btn liquid-btn-premium"
                  style={{ width: "100%", justifyContent: "center", display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 30px", borderRadius: 999, fontSize: 15, fontWeight: 800, color: "#fff", cursor: "pointer", border: "none", background: Theme.gradPremium, boxShadow: "0 12px 34px rgba(99,102,241,0.40), inset 0 1px 0 rgba(255,255,255,0.25)" }}
                >
                  Get Full Year for ₹49
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {[["🛡️", "Secure Payments"], ["⚡", "Instant Download"], ["🔁", "30-Day Support"]].map(([i, t]) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: Theme.textMuted, fontWeight: 600 }}>
                  <span>{i}</span><span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ══════════ RIGHT — 58%, large glass dashboard preview ══════════ */}
          <div className="hero-right" style={{ flexBasis: "58%", flexGrow: 1, position: "relative", display: "flex", justifyContent: "center" }}>
            <div style={{
              position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)", zIndex: 10,
              background: "rgba(255,255,255,0.95)", border: "1px solid rgba(255,255,255,0.98)",
              padding: "8px 20px", borderRadius: 999, fontSize: 13, fontWeight: 700, color: "#16a34a",
              boxShadow: "0 8px 24px rgba(15,23,42,0.10)", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a", boxShadow: "0 0 8px #16a34a" }} />
              Live Dashboard Preview
            </div>

            <div className="dashboard-preview-frame">
              <div className="dashboard-preview-inner">
                <MonthlyDashboardPreview />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scoped styles: glass orbs, floating anim, preview frame, magnetics, responsive ── */}
      <style>{`
        .glass-orb {
          position: absolute;
          border-radius: 999px;
          background:
            radial-gradient(circle at 30% 25%, rgba(255,255,255,0.95), rgba(255,255,255,0.25) 36%, rgba(139,92,246,0.18) 70%, rgba(59,130,246,0.10));
          border: 1px solid rgba(255,255,255,0.75);
          box-shadow:
            inset 0 1px 8px rgba(255,255,255,0.85),
            0 24px 70px rgba(99,102,241,0.18);
          backdrop-filter: blur(18px) saturate(160%);
          -webkit-backdrop-filter: blur(18px) saturate(160%);
          pointer-events: none;
        }
        @keyframes orbFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(14px,-16px) scale(1.03); }
        }
        @keyframes floatSlow {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-12px); }
        }
        .dashboard-preview-frame {
          position: relative;
          width: 100%;
          max-width: 920px;
          padding: 20px;
          border-radius: 34px;
          background: linear-gradient(145deg, rgba(255,255,255,0.78), rgba(255,255,255,0.42));
          border: 1px solid rgba(255,255,255,0.82);
          box-shadow:
            0 34px 100px rgba(99,102,241,0.18),
            0 14px 40px rgba(15,23,42,0.10),
            inset 0 1px 0 rgba(255,255,255,0.95);
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          animation: floatSlow 8s ease-in-out infinite;
          z-index: 4;
        }
        .dashboard-preview-inner {
          overflow: hidden;
          border-radius: 24px;
          background: #fff;
          border: 1px solid rgba(99,102,241,0.16);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.95),
            0 20px 60px rgba(15,23,42,0.08);
          aspect-ratio: 1536 / 1024;
        }
        .liquid-btn-white:hover { background: rgba(255,255,255,0.98); box-shadow: 0 14px 36px rgba(15,23,42,0.12), inset 0 1px 0 rgba(255,255,255,0.95); }
        .liquid-btn-premium { position: relative; overflow: hidden; isolation: isolate; }
        .liquid-btn-premium::after {
          content: '';
          position: absolute; top: -60%; bottom: -60%; width: 36%; left: -50%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.40), transparent);
          transform: rotate(14deg);
          opacity: 0; transition: opacity 0.2s;
        }
        .liquid-btn-premium:hover::after { opacity: 1; animation: shineSweep 0.7s ease-out; }
        .liquid-btn-premium:hover { filter: brightness(1.05); }
        @keyframes shineSweep { from { transform: translateX(-120%) rotate(14deg); } to { transform: translateX(180%) rotate(14deg); } }
        .magnetic-btn, .magnetic-card { transition: transform 0.15s ease-out; }
        .magnetic-card:hover { box-shadow: 0 16px 40px rgba(99,102,241,0.14) !important; }

        @media (max-width: 1024px) {
          .hero-flex { flex-direction: column !important; }
          .hero-left, .hero-right { flex-basis: 100% !important; }
          .hero-right { margin-top: 36px; }
          .dashboard-preview-frame { max-width: 100%; }
        }
        @media (max-width: 640px) {
          .hero-cta-row { flex-direction: column !important; }
          .hero-cta-row > button, .hero-cta-row > div { width: 100% !important; }
          .glass-orb { display: none; }
        }
      `}</style>
    </section>
  );
};
