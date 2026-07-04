import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ═══════════════════════════════════════════════════════════════════
//  WHITE SAAS DESIGN SYSTEM
// ═══════════════════════════════════════════════════════════════════
const Theme = {
  bg: "#ffffff",
  bgSubtle: "#f8fbff",
  bgGlow: "#f3f7ff",
  textPrimary: "#0f172a",
  textSecondary: "#475569",
  textMuted: "#94a3b8",
  accentCyan: "#06b6d4",
  accentBlue: "#3b82f6",
  accentPurple: "#8b5cf6",
  accentPink: "#ec4899",
  border: "rgba(15, 23, 42, 0.08)",
  shadowSubtle: "0 4px 20px rgba(0, 0, 0, 0.04)",
  shadowFloat: "0 20px 40px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15,23,42,0.02)",
  radius: "24px",
  font: "'Inter', sans-serif"
};

// ═══════════════════════════════════════════════════════════════════
//  CURSOR PARTICLES (Google Antigravity style)
// ═══════════════════════════════════════════════════════════════════
const CursorParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(max-width: 768px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationFrameId;
    let mouse = { x: -1000, y: -1000, active: false };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
      
      // Add particle on move
      if (Math.random() > 0.4) {
        const colors = [Theme.accentCyan, Theme.accentBlue, Theme.accentPurple, Theme.accentPink];
        particles.push({
          x: mouse.x + (Math.random() - 0.5) * 30,
          y: mouse.y + (Math.random() - 0.5) * 30,
          size: Math.random() * 3 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedX: (Math.random() - 0.5) * 1.5,
          speedY: (Math.random() - 0.5) * 1.5,
          life: 1
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
        p.life -= 0.02; // fade out speed
        
        if (p.life <= 0) {
          particles.splice(i, 1);
          i--;
          continue;
        }
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life * 0.5; // max 50% opacity for subtlety
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
        pointerEvents: "none", zIndex: 0
      }} 
    />
  );
};

// ═══════════════════════════════════════════════════════════════════
//  DASHBOARD PREVIEW (Light Theme based on image)
// ═══════════════════════════════════════════════════════════════════
const DashboardLightPreview = () => {
  return (
    <div style={{ background: "#f8fafc", padding: "10px", fontFamily: "sans-serif", fontSize: "9px", color: Theme.textPrimary }}>
      {/* Top Header */}
      <div style={{ background: "#c4b5fd", padding: "8px 12px", borderRadius: "6px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <div style={{ fontSize: "14px", fontWeight: "bold" }}>JUNE 2026<br/><span style={{ fontSize: "8px", fontWeight: "normal" }}>BUDGET TRACKER</span></div>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ background: "rgba(255,255,255,0.2)", padding: "4px 8px", borderRadius: "4px" }}>June</div>
          <div style={{ background: "rgba(255,255,255,0.2)", padding: "4px 8px", borderRadius: "4px" }}>2026</div>
          <div style={{ background: "rgba(255,255,255,0.2)", padding: "4px 8px", borderRadius: "4px" }}>₹ INR</div>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "6px", marginBottom: "10px" }}>
        {[
          { l: "TOTAL INCOME BUDGET", v: "₹100,000" },
          { l: "TOTAL INCOME ACTUAL", v: "₹92,400" },
          { l: "SALARY / MAIN INCOME", v: "₹83,200" },
          { l: "TOTAL BILLS", v: "₹29,998" },
          { l: "TOTAL EXPENSES", v: "₹16,420" },
          { l: "LEFT TO SPEND", v: "₹8,682" },
        ].map((k, i) => (
          <div key={i} style={{ background: "#fff", border: `1px solid ${Theme.border}`, padding: "6px", borderRadius: "4px", textAlign: "center" }}>
            <div style={{ fontSize: "6px", color: Theme.textSecondary, marginBottom: "2px" }}>{k.l}</div>
            <div style={{ fontSize: "10px", fontWeight: "bold", color: Theme.textPrimary }}>{k.v}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1fr 1fr 1fr", gap: "8px", marginBottom: "10px", height: "120px" }}>
        {/* Left To Spend Donut */}
        <div style={{ background: "#fff", border: `1px solid ${Theme.border}`, borderRadius: "6px", padding: "8px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: "7px", fontWeight: "bold", color: Theme.textSecondary, marginBottom: "8px" }}>AMOUNT LEFT TO SPEND</div>
          <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "conic-gradient(#f97316 89%, #22c55e 11%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#fff" }} />
          </div>
          <div style={{ fontSize: "8px", fontWeight: "bold", marginTop: "8px" }}>₹8,682 LEFT</div>
        </div>

        {/* Budget vs Actual Bar */}
        <div style={{ background: "#fff", border: `1px solid ${Theme.border}`, borderRadius: "6px", padding: "8px" }}>
          <div style={{ fontSize: "7px", fontWeight: "bold", color: Theme.textSecondary, marginBottom: "8px", textAlign: "center" }}>BUDGET VS ACTUAL</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[{ a: "80%", b: "100%" }, { a: "60%", b: "70%" }, { a: "90%", b: "90%" }].map((bar, i) => (
              <div key={i} style={{ display: "flex", gap: "2px", flexDirection: "column" }}>
                <div style={{ height: "6px", background: Theme.accentBlue, width: bar.a, borderRadius: "2px" }} />
                <div style={{ height: "6px", background: "#cbd5e1", width: bar.b, borderRadius: "2px" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Allocation Pie */}
        <div style={{ background: "#fff", border: `1px solid ${Theme.border}`, borderRadius: "6px", padding: "8px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: "7px", fontWeight: "bold", color: Theme.textSecondary, marginBottom: "8px" }}>ALLOCATION SUMMARY</div>
          <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "conic-gradient(#ec4899 29%, #3b82f6 36%, #8b5cf6 20%, #22c55e 15%)" }} />
        </div>
        
        {/* Expense Breakdown Pie */}
        <div style={{ background: "#fff", border: `1px solid ${Theme.border}`, borderRadius: "6px", padding: "8px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: "7px", fontWeight: "bold", color: Theme.textSecondary, marginBottom: "8px" }}>EXPENSE BREAKDOWN</div>
          <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "conic-gradient(#f43f5e 25%, #f59e0b 20%, #10b981 15%, #06b6d4 25%, #6366f1 15%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#fff" }} />
          </div>
        </div>

        {/* Calendar */}
        <div style={{ background: "#fff", border: `1px solid ${Theme.border}`, borderRadius: "6px", padding: "8px" }}>
          <div style={{ fontSize: "7px", fontWeight: "bold", color: Theme.textSecondary, marginBottom: "6px", textAlign: "center" }}>MONTHLY CALENDAR</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", fontSize: "6px", textAlign: "center", color: Theme.textMuted }}>
            {['S','M','T','W','T','F','S'].map(d => <div key={d}>{d}</div>)}
            {Array.from({length: 30}).map((_, i) => <div key={i} style={{ color: Theme.textPrimary }}>{i+1}</div>)}
          </div>
        </div>
      </div>

      {/* Bottom Lists */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px" }}>
        {['BILL TRACKER', 'EXPENSES SUMMARY', 'SAVINGS TRACKER', 'DEBT TRACKER'].map(title => (
          <div key={title} style={{ background: "#fff", border: `1px solid ${Theme.border}`, borderRadius: "6px" }}>
            <div style={{ background: "#c4b5fd", color: "#fff", fontSize: "7px", padding: "4px 8px", fontWeight: "bold", borderRadius: "5px 5px 0 0" }}>{title}</div>
            <div style={{ padding: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "6px", borderBottom: `1px solid #f1f5f9`, paddingBottom: "2px" }}>
                  <span style={{ color: Theme.textSecondary }}>Item {i}</span>
                  <span style={{ fontWeight: "bold" }}>₹{(i * 1200).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
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
      padding: "120px 20px 100px",
      minHeight: "860px",
      overflow: "hidden",
      display: "flex",
      alignItems: "center"
    }}>
      {/* Background Soft Gradients */}
      <div style={{ position: "absolute", top: -200, right: "-10%", width: 800, height: 800, background: `radial-gradient(circle, ${Theme.bgGlow} 0%, rgba(255,255,255,0) 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -200, left: "-10%", width: 600, height: 600, background: `radial-gradient(circle, #f0fdfa 0%, rgba(255,255,255,0) 70%)`, pointerEvents: "none" }} />
      
      {/* Interactive Cursor Effect */}
      <CursorParticles />

      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "64px" }}>
          
          {/* ── LEFT COLUMN: COPY & CTA ── */}
          <div style={{ flex: "1 1 45%", minWidth: "320px", position: "relative", zIndex: 2 }}>
            <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
              <div style={{ background: "#fff", border: `1px solid ${Theme.border}`, padding: "6px 14px", borderRadius: "100px", fontSize: "13px", fontWeight: "600", color: Theme.accentPink, boxShadow: Theme.shadowSubtle, display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: Theme.accentPink, animation: "pulse 2s infinite" }} />
                Limited-time Pricing
              </div>
              <div style={{ background: "#fff", border: `1px solid ${Theme.border}`, padding: "6px 14px", borderRadius: "100px", fontSize: "13px", fontWeight: "600", color: "#eab308", boxShadow: Theme.shadowSubtle }}>
                ★ 4.9 Rating · 5,000+ Buyers
              </div>
            </div>

            <h1 style={{ fontSize: "clamp(40px, 5vw, 64px)", fontWeight: "800", lineHeight: "1.1", marginBottom: "24px", letterSpacing: "-0.03em", color: Theme.textPrimary }}>
              Your money isn’t disappearing — <br/>
              <span style={{ background: `linear-gradient(135deg, ${Theme.accentBlue}, ${Theme.accentCyan})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                it’s just untracked.
              </span>
            </h1>

            <p style={{ fontSize: "18px", color: Theme.textSecondary, lineHeight: "1.6", marginBottom: "32px", maxWidth: "540px" }}>
              Meet Smart Expense Tracker — a premium Excel dashboard that shows exactly where every rupee goes, how much you save, and what you can control every month.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "40px" }}>
              {[
                "Track every rupee with clarity",
                "Monthly and yearly expense views",
                "Premium dashboard visuals",
                "One-time purchase, lifetime use"
              ].map((pill, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f8fafc", padding: "12px 16px", borderRadius: "12px", border: `1px solid ${Theme.border}` }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={Theme.accentBlue} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: Theme.textPrimary }}>{pill}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <button 
                onClick={() => navigate("/checkout?plan=monthly")}
                style={{ background: `linear-gradient(135deg, #0ea5e9, #2563eb)`, color: "#fff", border: "none", padding: "16px 32px", borderRadius: "100px", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: "0 10px 25px rgba(37, 99, 235, 0.3)", transition: "all 0.2s" }}
                onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 15px 35px rgba(37, 99, 235, 0.4)"; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 25px rgba(37, 99, 235, 0.3)"; }}
              >
                Start Tracking for ₹19
              </button>
              <button 
                style={{ background: "#fff", color: Theme.textPrimary, border: `1px solid #cbd5e1`, padding: "16px 32px", borderRadius: "100px", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: Theme.shadowSubtle, transition: "all 0.2s" }}
                onMouseOver={(e) => { e.currentTarget.style.background = "#f8fafc"; }}
                onMouseOut={(e) => { e.currentTarget.style.background = "#fff"; }}
              >
                Download Preview
              </button>
            </div>
          </div>

          {/* ── RIGHT COLUMN: VISUALS ── */}
          <div style={{ flex: "1 1 50%", display: "flex", justifyContent: "center", position: "relative" }}>
            
            {/* Soft Glow Behind Laptop */}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "80%", height: "80%", background: `radial-gradient(circle, rgba(14,165,233,0.15) 0%, rgba(255,255,255,0) 70%)`, filter: "blur(40px)", zIndex: 0 }} />

            {/* Laptop Mockup */}
            <div style={{ width: "100%", maxWidth: "600px", position: "relative", zIndex: 1, animation: "floatSlow 8s ease-in-out infinite" }}>
              
              {/* Laptop Screen Frame */}
              <div style={{ background: "#e2e8f0", padding: "12px 12px 16px", borderRadius: "24px 24px 0 0", border: `1px solid #cbd5e1`, borderBottom: "none", boxShadow: Theme.shadowFloat }}>
                {/* Screen Inner */}
                <div style={{ background: "#fff", borderRadius: "12px", overflow: "hidden", border: `2px solid #0f172a`, aspectRatio: "16/10", position: "relative" }}>
                  <DashboardLightPreview />
                </div>
              </div>
              
              {/* Laptop Base */}
              <div style={{ background: "#cbd5e1", height: "14px", borderRadius: "0 0 24px 24px", border: `1px solid #94a3b8`, position: "relative", display: "flex", justifyContent: "center" }}>
                <div style={{ width: "80px", height: "4px", background: "#94a3b8", borderRadius: "0 0 4px 4px" }} />
              </div>

            </div>

            {/* Floating Mobile Mockup */}
            <div style={{ position: "absolute", bottom: "-20px", left: "-20px", width: "140px", height: "280px", background: "#fff", borderRadius: "24px", border: "4px solid #0f172a", boxShadow: Theme.shadowFloat, zIndex: 3, animation: "float 6s ease-in-out infinite 1s", overflow: "hidden" }}>
              <div style={{ width: "60px", height: "16px", background: "#0f172a", margin: "0 auto", borderRadius: "0 0 8px 8px" }} />
              <div style={{ transform: "scale(0.8) origin-top-left", width: "125%", height: "125%", transformOrigin: "top left" }}>
                 <DashboardLightPreview />
              </div>
            </div>

            {/* Floating Glass Dialog */}
            <div style={{ position: "absolute", bottom: "40px", right: "-30px", background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(16px)", padding: "20px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.4)", boxShadow: Theme.shadowFloat, zIndex: 4, width: "260px", animation: "floatSlow 7s ease-in-out infinite 0.5s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `linear-gradient(135deg, ${Theme.accentBlue}, ${Theme.accentCyan})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <div style={{ color: Theme.textMuted, cursor: "pointer" }}>✕</div>
              </div>
              <h4 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "4px", color: Theme.textPrimary }}>Smart Expense Tracker</h4>
              <p style={{ fontSize: "12px", color: Theme.textSecondary, marginBottom: "12px" }}>Take control of your money today.</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px 0", fontSize: "11px", color: Theme.textSecondary, display: "flex", flexDirection: "column", gap: "6px" }}>
                {["Track income, expenses & savings", "Auto charts and smart insights", "Monthly calendar view", "Bills, savings & debt tracker"].map((b, i) => (
                   <li key={i} style={{ display: "flex", gap: "6px" }}><span style={{ color: Theme.accentCyan }}>✓</span> {b}</li>
                ))}
              </ul>
              <button 
                onClick={() => navigate("/checkout?plan=monthly")}
                style={{ width: "100%", background: "#0f172a", color: "#fff", border: "none", padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
              >
                Start for ₹19
              </button>
            </div>

          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.2); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes floatSlow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        
        @media (max-width: 768px) {
          .white-saas-hero-container { padding: 80px 16px 60px !important; }
          .white-saas-hero-right { display: none !important; } /* Hide complex visuals on very small mobile if needed, or adjust sizes */
        }
      `}</style>
    </section>
  );
};
