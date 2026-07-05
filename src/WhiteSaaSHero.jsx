import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Theme, GlassStyle, prefersReducedMotion } from "./WhiteTheme";

// ═══════════════════════════════════════════════════════════════════
//  REAL PRODUCT SCREENSHOT
//  Drop the actual tracker screenshot into your project's /public
//  folder using this exact filename (works unchanged on both CRA and
//  Vite — no import path or bundler config to fix). See delivery
//  notes for where this file comes from.
// ═══════════════════════════════════════════════════════════════════
const SCREENSHOT_SRC = "/tracker-screenshot.png";

const TrackerScreenshot = ({ fit = "contain", position = "center" }) => {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div style={{
        width: "100%", height: "100%",
        background: "linear-gradient(135deg,#f8fbff,#f3f0ff)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20, textAlign: "center", fontSize: 12, fontWeight: 600,
        color: Theme.textSecondary, lineHeight: 1.5,
      }}>
        Add your tracker screenshot as{" "}
        <code style={{ margin: "0 4px", background: "#fff", padding: "2px 6px", borderRadius: 6 }}>
          tracker-screenshot.png
        </code>{" "}
        to the /public folder
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%", background: "#ffffff" }}>
      <img
        src={SCREENSHOT_SRC}
        alt="Smart Expense Tracker — real Excel dashboard showing income, expenses, savings, bills and left-to-spend for the month"
        style={{ width: "100%", height: "100%", objectFit: fit, objectPosition: position, display: "block" }}
        loading="eager"
        onError={() => setErrored(true)}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
//  CURSOR PARTICLES (Antigravity-style, hero only)
// ═══════════════════════════════════════════════════════════════════
const CursorParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(max-width: 1024px)").matches) return;
    if (prefersReducedMotion()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationFrameId;
    let mouse = { x: -1000, y: -1000, active: false };

    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;

      // Scatter new particles (capped so long hover sessions can't leak memory / tank fps)
      if (Math.random() > 0.3 && particles.length < 140) {
        const colors = [Theme.accentCyan, Theme.accentBlue, Theme.accentPurple, Theme.accentPink];
        particles.push({
          x: mouse.x + (Math.random() - 0.5) * 40,
          y: mouse.y + (Math.random() - 0.5) * 40,
          size: Math.random() * 2.5 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedX: (Math.random() - 0.5) * 2,
          speedY: (Math.random() - 0.5) * 2 - 0.5,
          life: 1,
        });
      }
    };

    const handleMouseLeave = () => { mouse.active = false; };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.life -= 0.015;

        if (p.life <= 0) {
          particles.splice(i, 1);
          i--;
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life * 0.6;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 1,
      }}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════
//  MAIN HERO COMPONENT
// ═══════════════════════════════════════════════════════════════════
export const WhiteSaaSHero = () => {
  const navigate = useNavigate();

  return (
    <section style={{
      position: "relative",
      background: Theme.bg,
      color: Theme.textPrimary,
      fontFamily: Theme.font,
      padding: "80px 20px 60px",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
    }}>
      {/* Background Soft Glows */}
      <div style={{ position: "absolute", top: -200, right: 0, width: 800, height: 800, background: `radial-gradient(circle, rgba(59,130,246,0.05) 0%, rgba(255,255,255,0) 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -200, left: "-10%", width: 600, height: 600, background: `radial-gradient(circle, rgba(139,92,246,0.04) 0%, rgba(255,255,255,0) 70%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 10 }}>

        {/* Interactive Cursor Effect (Behind Content) */}
        <CursorParticles />

        <div className="white-saas-hero-grid" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "40px", position: "relative", zIndex: 5 }}>

          {/* ── LEFT COLUMN: COPY & CTA (45%) ── */}
          <div className="white-saas-hero-left" style={{ flex: "1 1 45%", minWidth: "320px", display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Badges */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <div style={{ background: "#fff", border: `1px solid ${Theme.border}`, padding: "6px 14px", borderRadius: "100px", fontSize: "13px", fontWeight: "700", color: Theme.accentPink, boxShadow: Theme.shadowSubtle, display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: Theme.accentPink, animation: "pulse 2s infinite" }} />
                Limited-time Pricing
              </div>
              <div style={{ background: "#fff", border: `1px solid ${Theme.border}`, padding: "6px 14px", borderRadius: "100px", fontSize: "13px", fontWeight: "700", color: Theme.accentYellow, boxShadow: Theme.shadowSubtle }}>
                ★ 4.9 Rating · 5,000+ Buyers
              </div>
            </div>

            {/* Headline */}
            <h1 style={{ fontSize: "clamp(42px, 5vw, 56px)", fontWeight: "800", lineHeight: "1.1", letterSpacing: "-0.03em", color: Theme.textPrimary, margin: 0 }}>
              Your money isn’t disappearing — <br />
              <span style={{ background: Theme.gradPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                it’s just untracked.
              </span>
            </h1>

            {/* Subtext */}
            <p style={{ fontSize: "17px", color: Theme.textSecondary, lineHeight: "1.6", margin: 0, maxWidth: "500px", fontWeight: "500" }}>
              Meet Smart Expense Tracker — a premium Excel dashboard that shows exactly where every rupee goes, how much you save, and what you can control every month.
            </p>

            {/* Feature Pills */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", margin: "8px 0 16px" }}>
              {[
                { i: "✓", t: "Track every rupee with clarity" },
                { i: "📅", t: "Monthly and yearly expense views" },
                { i: "📊", t: "Premium dashboard visuals" },
                { i: "♾️", t: "One-time purchase, lifetime use" },
              ].map((pill, i) => (
                <div key={i} className="feature-pill" style={{ display: "flex", alignItems: "center", gap: "12px", background: "#fff", padding: "14px 16px", borderRadius: "16px", border: `1px solid ${Theme.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.02)", transition: "transform 0.2s" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: Theme.accentBlue }}>{pill.i}</div>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: Theme.textPrimary }}>{pill.t}</span>
                </div>
              ))}
            </div>

            {/* CTAs — Monthly (secondary) + Annual (recommended, primary) */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
              <button
                onClick={() => navigate("/checkout?plan=monthly")}
                style={{ background: "#fff", color: Theme.textPrimary, border: `2px solid #e2e8f0`, padding: "14px 32px", borderRadius: "100px", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: Theme.shadowSubtle, transition: "all 0.2s", display: "flex", alignItems: "center", gap: "8px" }}
                onMouseOver={(e) => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
                onMouseOut={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
              >
                Start Monthly for ₹19
              </button>

              <div style={{ position: "relative", display: "inline-flex" }}>
                <span style={{ position: "absolute", top: "-12px", right: "10px", background: `linear-gradient(135deg, #f59e0b, ${Theme.accentPink})`, color: "#fff", fontSize: "10px", fontWeight: 800, letterSpacing: "0.5px", textTransform: "uppercase", padding: "4px 10px", borderRadius: "100px", boxShadow: "0 4px 10px rgba(236,72,153,0.35)", zIndex: 2, whiteSpace: "nowrap" }}>
                  Recommended
                </span>
                <button
                  onClick={() => navigate("/checkout?plan=yearly")}
                  style={{ background: Theme.gradAccent, color: "#fff", border: "none", padding: "16px 36px", borderRadius: "100px", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: "0 12px 30px rgba(59, 130, 246, 0.3)", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "8px" }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 16px 35px rgba(59, 130, 246, 0.4)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(59, 130, 246, 0.3)"; }}
                >
                  Get Full Year for ₹49
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
              </div>
            </div>

            {/* Bottom Trust Row */}
            <div style={{ display: "flex", gap: "24px", marginTop: "8px", flexWrap: "wrap" }}>
              {[
                { i: "🛡️", t: "Secure Payment" },
                { i: "⚡", t: "Instant Download" },
                { i: "✅", t: "Works on Excel & Google Sheets" },
                { i: "🔒", t: "No app login required" },
              ].map((t) => (
                <div key={t.t} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: Theme.textSecondary, fontWeight: "600" }}>
                  <span>{t.i}</span> {t.t}
                </div>
              ))}
            </div>

          </div>

          {/* ── RIGHT COLUMN: VISUALS (55%) ── */}
          <div className="white-saas-hero-right" style={{ flex: "1 1 50%", display: "flex", justifyContent: "center", position: "relative" }}>

            <div style={{ position: "relative", width: "100%", maxWidth: "620px", display: "flex", justifyContent: "center" }}>

              {/* Premium floating glass frame + laptop mockup (real screenshot inside) */}
              <div className="hero-laptop-wrap" style={{ ...GlassStyle, width: "100%", padding: "38px 26px 30px", position: "relative", zIndex: 2, animation: "floatSlow 8s ease-in-out infinite" }}>

                {/* Live preview label */}
                <div style={{ position: "absolute", top: "-16px", left: "50%", transform: "translateX(-50%)", zIndex: 4, background: "#fff", border: `1px solid ${Theme.border}`, padding: "6px 16px", borderRadius: "100px", fontSize: "12px", fontWeight: 700, color: Theme.accentBlue, boxShadow: Theme.shadowSubtle, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: Theme.accentGreen }} />
                  Live Excel Dashboard Preview
                </div>

                {/* Laptop Screen */}
                <div style={{ background: "#e2e8f0", padding: "12px 12px 18px", borderRadius: "18px 18px 0 0", border: `1px solid #cbd5e1`, borderBottom: "none", boxShadow: Theme.shadowFloat }}>
                  <div style={{ background: "#fff", borderRadius: "10px", overflow: "hidden", border: `2px solid #0f172a`, aspectRatio: "1622 / 837", position: "relative" }}>
                    <TrackerScreenshot fit="contain" />
                  </div>
                </div>
                {/* Laptop Base */}
                <div style={{ background: "#cbd5e1", height: "16px", borderRadius: "0 0 18px 18px", border: `1px solid #94a3b8`, position: "relative", display: "flex", justifyContent: "center", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}>
                  <div style={{ width: "90px", height: "5px", background: "#94a3b8", borderRadius: "0 0 6px 6px" }} />
                </div>
              </div>

              {/* Mobile Mockup (accent preview) */}
              <div style={{ position: "absolute", bottom: "-30px", right: "-20px", width: "130px", height: "260px", background: "#fff", borderRadius: "24px", border: "5px solid #0f172a", boxShadow: Theme.shadowFloat, zIndex: 3, animation: "float 6s ease-in-out infinite 1s", overflow: "hidden" }}>
                <div style={{ width: "50px", height: "14px", background: "#0f172a", margin: "0 auto", borderRadius: "0 0 8px 8px" }} />
                <div style={{ width: "100%", height: "calc(100% - 14px)" }}>
                  <TrackerScreenshot fit="cover" position="top" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.2); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes floatSlow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        .feature-pill:hover { transform: translateY(-3px); }

        /* Soft lavender/blue glow behind the laptop frame — a pseudo-element so it
           never changes the DOM child count/order of .white-saas-hero-right > div
           (that order is relied on by the mobile-mockup hide rule below). */
        .hero-laptop-wrap::before {
          content: "";
          position: absolute;
          top: -70px;
          left: 50%;
          transform: translateX(-50%);
          width: 480px;
          height: 480px;
          background: radial-gradient(circle, rgba(139,92,246,0.16) 0%, rgba(59,130,246,0.10) 45%, rgba(255,255,255,0) 72%);
          filter: blur(6px);
          z-index: -1;
          pointer-events: none;
        }

        @media (max-width: 1024px) {
          .white-saas-hero-grid { flex-direction: column; text-align: center; }
          .white-saas-hero-left { align-items: center; }
          .white-saas-hero-left p { margin-left: auto; margin-right: auto; }
          .white-saas-hero-left > div:first-child { justify-content: center; }
          .white-saas-hero-left > div:nth-of-type(2) { text-align: left; max-width: 600px; margin: 20px auto; }
          .white-saas-hero-left > div:nth-of-type(3) { justify-content: center; width: 100%; }
          .white-saas-hero-left > div:nth-of-type(4) { justify-content: center; }
        }
        @media (max-width: 640px) {
          .white-saas-hero-left > div:nth-of-type(2) { grid-template-columns: 1fr; }
          .white-saas-hero-left button { width: 100%; justify-content: center; }
          .white-saas-hero-right { margin-top: 40px; }
          .white-saas-hero-right > div > div:nth-child(2) { display: none; }
        }
      `}</style>
    </section>
  );
};
