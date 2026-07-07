import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WhiteSaaSHero } from "./WhiteSaaSHero";
import { Theme, GlassStyle, GlassStyleElevated } from "./WhiteTheme";

const footerLinkBtn = {
  background: "transparent",
  border: "none",
  color: Theme.textSecondary,
  fontWeight: 600,
  fontSize: 15,
  cursor: "pointer",
  padding: 0,
  fontFamily: "inherit",
};

const scrollToId = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

// ═══════════════════════════════════════════════════════════════════
//  ANNUAL DASHBOARD PREVIEW IMAGE — used by the new Product section below
// ═══════════════════════════════════════════════════════════════════
const AnnualDashboardPreview = () => {
  const [errored, setErrored] = useState(false);
  if (errored) {
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, color: Theme.textMuted, fontSize: 12, fontWeight: 600, background: "linear-gradient(135deg,#f8fbff,#f3f0ff)" }}>
        <span style={{ fontSize: 30 }}>📈</span>
        <span>Add <code style={{ background: "#fff", padding: "2px 6px", borderRadius: 6, border: `1px solid ${Theme.border}` }}>annual-dashboard-preview.png</code> to /public</span>
      </div>
    );
  }
  return (
    <img
      src="/annual-dashboard-preview.png"
      alt="Annual Expenses Dashboard preview"
      loading="lazy"
      onError={() => setErrored(true)}
      style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center top", display: "block" }}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════
//  PRODUCT SHOWCASE — "One Dashboard. Complete Financial Control."
//  New section: left copy + 6 glass feature cards, right = annual
//  dashboard preview in a large glass frame. This is the section the
//  Nav's "Product" link and "See It In Action" language refer to.
// ═══════════════════════════════════════════════════════════════════
const ProductShowcase = () => {
  const navigate = useNavigate();
  const goTo = (path) => { navigate(path); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const cards = [
    { i: "📈", t: "Annual Dashboard", d: "12-month overview with powerful insights" },
    { i: "📊", t: "Smart Charts", d: "Auto-updating charts that make sense" },
    { i: "🧾", t: "Expense Tracking", d: "Track every rupee and stay on budget" },
    { i: "🎯", t: "Budget Planning", d: "Plan better and achieve financial goals" },
    { i: "💳", t: "Debt Management", d: "Track EMIs, loans, and debt reduction" },
    { i: "🐷", t: "Savings Goals", d: "Set goals and grow money consistently" },
  ];

  return (
    <section id="product" style={{ padding: "104px 20px", background: Theme.bg, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "10%", right: "-8%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.08), transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="product-flex" style={{ display: "flex", gap: 56, alignItems: "center" }}>

          {/* Left — copy + 6 feature cards */}
          <div style={{ flex: "0 0 44%", minWidth: 0 }}>
            <span style={{ display: "inline-block", background: "rgba(59,130,246,0.10)", color: Theme.accentBlue, border: "1px solid rgba(59,130,246,0.18)", borderRadius: 999, padding: "6px 16px", fontSize: 12, fontWeight: 800, letterSpacing: "0.4px", marginBottom: 18 }}>
              PRODUCT
            </span>
            <h2 style={{ fontFamily: Theme.fontHeading, fontSize: "clamp(30px, 3.6vw, 44px)", fontWeight: 900, color: Theme.textPrimary, lineHeight: 1.14, letterSpacing: "-0.02em", marginBottom: 18 }}>
              One Dashboard.<br />Complete Financial Control.
            </h2>
            <p style={{ fontSize: 16, color: Theme.textSecondary, lineHeight: 1.75, marginBottom: 32, maxWidth: 480 }}>
              Smart Expense Tracker gives you a complete view of your finances — monthly tracking, yearly insights, savings goals, bills, debt, and spending patterns in one beautiful Excel dashboard.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 32 }}>
              {cards.map((c) => (
                <div key={c.t} style={{ ...GlassStyle, borderRadius: 18, padding: "18px 16px", display: "flex", flexDirection: "column", gap: 10, transition: "transform 0.25s ease, box-shadow 0.25s ease" }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 20px 50px rgba(99,102,241,0.16)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = GlassStyle.boxShadow; }}
                >
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "radial-gradient(circle at 32% 28%, #ffffff, #e0e7ff 55%, #c7d2fe 100%)", border: "1px solid rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>{c.i}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: Theme.textPrimary }}>{c.t}</div>
                  <div style={{ fontSize: 12.5, color: Theme.textSecondary, lineHeight: 1.5 }}>{c.d}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={() => scrollToId("inside")} style={{ background: "#fff", color: Theme.textPrimary, border: `2px solid #e2e8f0`, padding: "14px 26px", borderRadius: 999, fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
                Explore All Features
              </button>
              <button onClick={() => goTo("/checkout?plan=yearly")} style={{ background: Theme.gradPremium, color: "#fff", border: "none", padding: "14px 26px", borderRadius: 999, fontSize: 14, fontWeight: 800, cursor: "pointer", boxShadow: "0 12px 30px rgba(99,102,241,0.32)" }}>
                Get Full Year for ₹49
              </button>
            </div>
          </div>

          {/* Right — annual dashboard, large glass frame */}
          <div style={{ flex: "1 1 56%", position: "relative", display: "flex", justifyContent: "center" }}>
            <div style={{ position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)", zIndex: 10, background: "rgba(255,255,255,0.95)", border: "1px solid rgba(255,255,255,0.98)", padding: "7px 18px", borderRadius: 999, fontSize: 12.5, fontWeight: 700, color: Theme.accentPurple, boxShadow: "0 8px 24px rgba(15,23,42,0.10)", whiteSpace: "nowrap" }}>
              📊 Annual Dashboard Preview
            </div>
            <div className="annual-preview-frame">
              <div className="annual-preview-inner">
                <AnnualDashboardPreview />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .annual-preview-frame {
          position: relative;
          width: 100%;
          max-width: 760px;
          padding: 18px;
          border-radius: 32px;
          background: linear-gradient(145deg, rgba(255,255,255,0.78), rgba(255,255,255,0.42));
          border: 1px solid rgba(255,255,255,0.82);
          box-shadow: 0 30px 90px rgba(139,92,246,0.16), 0 12px 36px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.95);
          backdrop-filter: blur(26px) saturate(180%);
          -webkit-backdrop-filter: blur(26px) saturate(180%);
          animation: floatSlow2 9s ease-in-out infinite;
        }
        .annual-preview-inner {
          overflow: hidden;
          border-radius: 22px;
          background: #fff;
          border: 1px solid rgba(139,92,246,0.16);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.95), 0 16px 50px rgba(15,23,42,0.08);
          aspect-ratio: 1536 / 1024;
        }
        @keyframes floatSlow2 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @media (max-width: 980px) {
          .product-flex { flex-direction: column !important; }
          .product-flex > div { flex-basis: 100% !important; }
          .annual-preview-frame { max-width: 100%; margin-top: 40px; }
        }
      `}</style>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════
//  PRODUCT PRICING — the ₹19 monthly / ₹49 annual two-tier cards
// ═══════════════════════════════════════════════════════════════════
const ProductPricing = () => {
  const navigate = useNavigate();

  const monthly = {
    name: "Monthly Smart Expense Tracker",
    price: "₹19",
    subtitle: "Best for trying the tracker for one month.",
    benefits: [
      "1 monthly budget tracker",
      "Income and expense tracking",
      "Bills tracker",
      "Savings tracker",
      "Charts and monthly summary",
      "Instant download",
    ],
    cta: "Start Monthly for ₹19",
    path: "/checkout?plan=monthly",
  };

  const yearly = {
    name: "Annual Smart Expense Tracker",
    price: "₹49",
    badge: "Recommended · Best Value",
    subtitle: "Best for serious savings and full-year money control.",
    benefits: [
      "All 12 months included",
      "Annual expenses dashboard",
      "Month-wise comparison",
      "Yearly savings overview",
      "Bills, debt, subscriptions and goals tracking",
      "Better long-term insights",
      "Best value compared to buying monthly",
    ],
    cta: "Get Full Year for ₹49",
    path: "/checkout?plan=yearly",
  };

  return (
    <section id="pricing" style={{ padding: "100px 20px", background: Theme.bgSubtle, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)", width: "700px", maxWidth: "90vw", height: "460px", background: `radial-gradient(ellipse at center, rgba(139,92,246,0.08), rgba(255,255,255,0) 70%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 42px)", fontWeight: "800", color: Theme.textPrimary, marginBottom: "16px" }}>
            Choose your tracking plan
          </h2>
          <p style={{ fontSize: "17px", color: Theme.textSecondary, maxWidth: "640px", margin: "0 auto", lineHeight: "1.6" }}>
            Most users choose the ₹49 Annual Tracker because it gives complete yearly control, monthly comparison, annual savings insights, and better planning.
          </p>
        </div>

        <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.08fr", gap: "28px", alignItems: "stretch", marginTop: "48px" }}>

          {/* Monthly card */}
          <div
            style={{ ...GlassStyle, padding: "36px 30px", display: "flex", flexDirection: "column", transition: "transform 0.28s ease, box-shadow 0.28s ease" }}
            onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 30px 80px rgba(15,23,42,0.12)"; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = GlassStyle.boxShadow; }}
          >
            <div style={{ fontSize: "13px", fontWeight: 800, color: Theme.textSecondary, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Monthly</div>
            <h3 style={{ fontSize: "22px", fontWeight: 800, color: Theme.textPrimary, marginBottom: "6px" }}>{monthly.name}</h3>
            <p style={{ fontSize: "14px", color: Theme.textSecondary, marginBottom: "20px", lineHeight: 1.5 }}>{monthly.subtitle}</p>
            <div className="price-font" style={{ fontSize: "44px", fontWeight: 900, color: Theme.textPrimary, marginBottom: "24px" }}>
              {monthly.price}<span style={{ fontSize: 15, fontWeight: 600, color: Theme.textMuted }}> / month file</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
              {monthly.benefits.map((b, i) => (
                <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14px", color: Theme.textSecondary, fontWeight: 600 }}>
                  <span style={{ width: 18, height: 18, flexShrink: 0, borderRadius: "50%", background: "#e0e7ff", color: Theme.accentBlue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, marginTop: 2 }}>✓</span>
                  {b}
                </li>
              ))}
            </ul>
            <button onClick={() => navigate(monthly.path)} className="liquid-btn-white" style={{ background: "#fff", color: Theme.textPrimary, border: `2px solid #e2e8f0`, padding: "15px", borderRadius: "100px", fontSize: "15px", fontWeight: 800, cursor: "pointer", width: "100%" }}>
              {monthly.cta}
            </button>
          </div>

          {/* Annual card — highlighted / recommended */}
          <div
            style={{ ...GlassStyleElevated, padding: "42px 34px 34px", display: "flex", flexDirection: "column", position: "relative", transform: "translateY(-8px)", transition: "transform 0.28s ease, box-shadow 0.28s ease" }}
            onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-12px)"; e.currentTarget.style.boxShadow = "0 36px 100px rgba(99,102,241,0.22), 0 24px 80px rgba(15,23,42,0.10)"; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = GlassStyleElevated.boxShadow; }}
          >
            <div style={{ position: "absolute", top: "-16px", left: "50%", transform: "translateX(-50%)", background: Theme.gradPremium, color: "#fff", padding: "7px 20px", borderRadius: "100px", fontSize: "13px", fontWeight: 800, letterSpacing: "0.3px", boxShadow: "0 8px 20px rgba(99,102,241,0.35)", whiteSpace: "nowrap" }}>
              ⭐ {yearly.badge}
            </div>
            <div style={{ fontSize: "13px", fontWeight: 800, color: Theme.accentBlue, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", marginTop: 10 }}>Annual</div>
            <h3 style={{ fontSize: "24px", fontWeight: 800, color: Theme.textPrimary, marginBottom: "6px" }}>{yearly.name}</h3>
            <p style={{ fontSize: "14px", color: Theme.textSecondary, marginBottom: "20px", lineHeight: 1.5 }}>{yearly.subtitle}</p>
            <div className="price-font" style={{ fontSize: "48px", fontWeight: 900, color: Theme.textPrimary, marginBottom: "8px" }}>
              {yearly.price}<span style={{ fontSize: 15, fontWeight: 600, color: Theme.textMuted }}> / full year</span>
            </div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: Theme.accentPurple, marginBottom: "20px" }}>
              Recommended because it gives you 12 months + annual insights for only ₹30 more.
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
              {yearly.benefits.map((b, i) => (
                <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14px", color: Theme.textPrimary, fontWeight: 600 }}>
                  <span style={{ width: 18, height: 18, flexShrink: 0, borderRadius: "50%", background: Theme.gradPremium, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, marginTop: 2 }}>✓</span>
                  {b}
                </li>
              ))}
            </ul>
            <button onClick={() => navigate(yearly.path)} className="liquid-btn-premium" style={{ background: Theme.gradPremium, color: "#fff", border: "none", padding: "17px", borderRadius: "100px", fontSize: "16px", fontWeight: 800, cursor: "pointer", width: "100%", boxShadow: "0 14px 34px rgba(99,102,241,0.32)" }}>
              {yearly.cta}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .pricing-grid { grid-template-columns: 1fr !important; }
          .pricing-grid > div:nth-child(2) { order: -1; transform: none !important; margin-bottom: 8px; }
        }
      `}</style>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════
//  EXCEL PRIVACY SECTION — "Why Excel is better than finance apps"
// ═══════════════════════════════════════════════════════════════════
const ExcelPrivacy = () => {
  const cards = [
    { i: "🔐", t: "No bank login required", d: "You never connect a bank account or share login credentials — just fill in what you spend." },
    { i: "🚫", t: "No expense data shared with apps", d: "Your numbers stay in your own file. Nothing is uploaded to a third-party server." },
    { i: "📴", t: "Works offline in Excel", d: "The Excel version updates and calculates fully offline — no internet connection required." },
    { i: "🗂️", t: "You control your own file", d: "Back it up, rename it, or delete it whenever you want. It's yours, not a subscription." },
    { i: "☁️", t: "Optional Google Sheets use", d: "Prefer the cloud? Copy it into Google Sheets for convenient access across devices — Excel remains the more private, fully offline choice." },
    { i: "🌱", t: "Simple, private, and beginner-friendly", d: "No macros, no logins, no learning curve. Just open it and start tracking." },
  ];

  return (
    <section id="privacy" style={{ padding: "100px 20px", background: Theme.bg }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "44px" }}>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 42px)", fontWeight: "800", color: Theme.textPrimary, marginBottom: "16px" }}>
            Why Excel is better than finance apps
          </h2>
          <p style={{ fontSize: "17px", color: Theme.textSecondary, maxWidth: "680px", margin: "0 auto", lineHeight: "1.7" }}>
            Your expense data is personal. With Smart Expense Tracker, you do not need to connect your bank account, install another finance app, or share your spending details with any third-party platform. You can use the Excel file privately on your own device and stay in full control.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
          {cards.map((c, i) => (
            <div
              key={i}
              style={{ ...GlassStyle, padding: "26px 24px", display: "flex", flexDirection: "column", gap: "12px", transition: "transform 0.25s ease, box-shadow 0.25s ease" }}
              onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 26px 70px rgba(99,102,241,0.14)"; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = GlassStyle.boxShadow; }}
            >
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "radial-gradient(circle at 32% 28%, #ffffff, #e0e7ff 55%, #c7d2fe 100%)", border: "1px solid rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{c.i}</div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: Theme.textPrimary }}>{c.t}</h3>
              <p style={{ fontSize: 13.5, color: Theme.textSecondary, lineHeight: 1.6 }}>{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════
//  WHAT'S INSIDE SECTION
// ═══════════════════════════════════════════════════════════════════
const WhatsInside = () => {
  const features = [
    { i: "📊", title: "Smart Dashboard", desc: "Shows income, expenses, savings, bills, and left-to-spend balance." },
    { i: "⚙️", title: "Auto Calculations", desc: "Add your numbers once and totals update automatically." },
    { i: "⚖️", title: "Budget vs Actual", desc: "Compare planned spending with real spending." },
    { i: "📅", title: "Monthly Calendar", desc: "Track bills, dates, and monthly spending flow." },
    { i: "🎯", title: "Savings Goals", desc: "Plan emergency fund, SIP, vacation, and future goals." },
    { i: "💳", title: "Debt Tracker", desc: "Track EMI, credit card, loans, and pending dues." },
    { i: "🛒", title: "Category Budget", desc: "Manage groceries, rent, shopping, transport, subscriptions, and more." },
    { i: "📈", title: "Annual Dashboard", desc: "See your full-year money picture in one place." },
  ];

  return (
    <section id="inside" style={{ padding: "100px 20px", background: Theme.bgSubtle }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 42px)", fontWeight: "800", color: Theme.textPrimary, marginBottom: "16px" }}>
            What’s Inside the Smart Expense Tracker?
          </h2>
          <p style={{ fontSize: "18px", color: Theme.textSecondary, maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" }}>
            Everything you need to plan, track, and control your money throughout the month.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
          {features.map((f, i) => (
            <div
              key={i}
              style={{ ...GlassStyle, padding: "24px", display: "flex", flexDirection: "column", gap: "16px", transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
              onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 26px 70px rgba(99,102,241,0.14)"; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = GlassStyle.boxShadow; }}
            >
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "radial-gradient(circle at 32% 28%, #ffffff, #e0e7ff 55%, #c7d2fe 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "inset 0 1px 3px rgba(255,255,255,0.9), 0 4px 10px rgba(99,102,241,0.18)" }}>
                {f.i}
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: Theme.textPrimary, marginBottom: "8px" }}>{f.title}</h3>
                <p style={{ fontSize: "14px", color: Theme.textSecondary, lineHeight: "1.5" }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════
//  REVIEWS SECTION
//  NOTE: names/quotes below are placeholder copy carried over from the
//  original file — swap in real customer reviews before launch.
// ═══════════════════════════════════════════════════════════════════
const Reviews = () => {
  const reviews = [
    { name: "Rahul S.", text: "This tracker finally showed me where my salary was going every month." },
    { name: "Priya M.", text: "The charts make it so easy to understand expenses." },
    { name: "Vikram K.", text: "For ₹19, this feels like a premium finance dashboard." },
    { name: "Neha R.", text: "I use it every week to control bills and savings." },
  ];

  return (
    <section id="reviews" style={{ padding: "100px 20px", background: Theme.bg }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 42px)", fontWeight: "800", color: Theme.textPrimary }}>
            Loved by smart budgeters
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
          {reviews.map((r, i) => (
            <div
              key={i}
              style={{ ...GlassStyle, padding: "30px 24px", display: "flex", flexDirection: "column", gap: "16px", transition: "transform 0.25s ease, box-shadow 0.25s ease" }}
              onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 26px 70px rgba(99,102,241,0.14)"; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = GlassStyle.boxShadow; }}
            >
              <div style={{ display: "flex", gap: "4px" }}>
                {[1, 2, 3, 4, 5].map((s) => <span key={s} style={{ color: Theme.accentYellow, fontSize: "18px" }}>★</span>)}
              </div>
              <p style={{ fontSize: "15px", color: Theme.textPrimary, lineHeight: "1.6", fontWeight: "500", flex: 1 }}>"{r.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `linear-gradient(135deg, ${Theme.accentBlue}, ${Theme.accentPurple})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700" }}>
                  {r.name.charAt(0)}
                </div>
                <span style={{ fontSize: "14px", fontWeight: "700", color: Theme.textSecondary }}>{r.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════
//  FAQ SECTION
// ═══════════════════════════════════════════════════════════════════
const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(null);
  const questions = [
    { q: "What is included in the ₹19 monthly file?", a: "The monthly file includes one month's full budget tracker: income and expense tracking, a bill tracker, a savings tracker, charts, and a monthly summary — with instant download after payment." },
    { q: "What is included in the ₹49 annual file?", a: "The annual file includes all 12 months, plus the Annual Expenses Dashboard, month-wise comparison, yearly savings overview, and combined bills, debt, subscriptions and goals tracking." },
    { q: "Why is the ₹49 annual file recommended?", a: "It costs only ₹30 more than the monthly file but gives you full-year control, month-to-month comparison, and annual insights — better value if you're tracking beyond a single month." },
    { q: "Does it work in Excel?", a: "Yes. It's a fully functioning Microsoft Excel (.xlsx) file that works fully offline — no macros or add-ins needed." },
    { q: "Does it work in Google Sheets?", a: "Yes, optionally. You can copy the file into Google Sheets for cloud access across devices. Excel remains the more private, fully offline option." },
    { q: "Do I need to share my bank details?", a: "No. There is no bank connection or login of any kind. You simply type in your own numbers, and everything stays in your file." },
    { q: "How do I download after payment?", a: "Right after your Razorpay payment is confirmed, you'll get an instant secure download link on the success page, and the same link is emailed to you." },
  ];

  return (
    <section id="faq" style={{ padding: "100px 20px", background: Theme.bgSubtle }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 42px)", fontWeight: "800", color: Theme.textPrimary }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {questions.map((faq, i) => (
            <div
              key={i}
              style={{
                ...GlassStyle,
                padding: "0",
                overflow: "hidden",
                cursor: "pointer",
                border: openIdx === i ? "1px solid rgba(99,102,241,0.28)" : GlassStyle.border,
                boxShadow: openIdx === i ? "0 20px 60px rgba(99,102,241,0.14)" : GlassStyle.boxShadow,
                transition: "border 0.2s ease, box-shadow 0.2s ease",
              }}
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
            >
              <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "700", color: Theme.textPrimary, gap: 16 }}>
                {faq.q}
                <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: "50%", background: openIdx === i ? Theme.gradPremium : "rgba(59,130,246,0.10)", color: openIdx === i ? "#fff" : Theme.accentBlue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", transform: openIdx === i ? "rotate(45deg)" : "none", transition: "transform 0.2s ease, background 0.2s ease" }}>+</span>
              </div>
              {openIdx === i && (
                <div style={{ padding: "0 24px 20px", fontSize: "15px", color: Theme.textSecondary, lineHeight: "1.6" }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════
//  FINAL CTA SECTION
// ═══════════════════════════════════════════════════════════════════
const FinalCTA = () => {
  const navigate = useNavigate();
  return (
    <section style={{ padding: "120px 20px", background: Theme.bg, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", maxWidth: "800px", height: "100%", background: `radial-gradient(ellipse at center, ${Theme.bgGlow} 0%, rgba(255,255,255,0) 70%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: "clamp(36px, 5vw, 48px)", fontWeight: "800", color: Theme.textPrimary, marginBottom: "16px", lineHeight: "1.1" }}>
          Start tracking your money today
        </h2>
        <p style={{ fontSize: "18px", color: Theme.textSecondary, marginBottom: "36px", lineHeight: "1.6" }}>
          Get the Smart Expense Tracker instantly and take control of every rupee — this month, or all year.
        </p>

        <div style={{ ...GlassStyle, padding: "40px 30px", position: "relative" }}>
          <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg, ${Theme.accentPurple}, ${Theme.accentBlue})`, color: "#fff", padding: "6px 16px", borderRadius: "100px", fontSize: "13px", fontWeight: "800", letterSpacing: "1px", textTransform: "uppercase" }}>
            Limited-time Pricing
          </div>

          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", margin: "26px 0 24px" }}>
            <button onClick={() => navigate("/checkout?plan=monthly")} style={{ background: "#fff", color: Theme.textPrimary, border: `2px solid #e2e8f0`, padding: "16px 30px", borderRadius: "100px", fontSize: "15px", fontWeight: 800, cursor: "pointer" }}>
              Monthly ₹19
            </button>
            <div style={{ position: "relative", display: "inline-flex" }}>
              <span style={{ position: "absolute", top: "-10px", right: "8px", background: `linear-gradient(135deg,#f59e0b,${Theme.accentPink})`, color: "#fff", fontSize: 9, fontWeight: 800, letterSpacing: "0.5px", textTransform: "uppercase", padding: "3px 8px", borderRadius: "100px" }}>Recommended</span>
              <button onClick={() => navigate("/checkout?plan=yearly")} className="liquid-btn-premium" style={{ background: Theme.gradPremium, color: "#fff", border: "none", padding: "16px 30px", borderRadius: "100px", fontSize: "15px", fontWeight: 800, cursor: "pointer", boxShadow: "0 12px 30px rgba(99,102,241,0.32)" }}>
                Full Year ₹49
              </button>
            </div>
          </div>

          <ul style={{ listStyle: "none", padding: 0, margin: "0 auto", display: "inline-flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
            {["Secure payment", "Instant download", "No app login required"].map((f, i) => (
              <li key={i} style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "13px", color: Theme.textSecondary, fontWeight: 700 }}>
                <span style={{ width: 16, height: 16, borderRadius: "50%", background: "#e0e7ff", color: Theme.accentBlue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════
//  FOOTER SECTION
// ═══════════════════════════════════════════════════════════════════
const FooterWhite = () => {
  const navigate = useNavigate();

  const goToPage = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer style={{ background: Theme.bgSubtle, padding: "60px 20px 40px", borderTop: `1px solid ${Theme.border}` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "26px", textAlign: "center" }}>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ background: Theme.gradPrimary, borderRadius: "8px", padding: "6px 10px", color: "#fff", fontSize: "16px", boxShadow: "0 4px 10px rgba(6,182,212,0.3)" }}>
            📊
          </div>
          <span style={{ fontWeight: "900", fontSize: "22px", color: Theme.textPrimary }}>
            Budget<span style={{ color: Theme.accentBlue }}>Pro</span>
          </span>
        </div>

        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={() => scrollToId("product")} style={footerLinkBtn}>Product</button>
          <button onClick={() => scrollToId("pricing")} style={footerLinkBtn}>Pricing</button>
          <button onClick={() => scrollToId("inside")} style={footerLinkBtn}>What's Inside</button>
          <button onClick={() => scrollToId("reviews")} style={footerLinkBtn}>Reviews</button>
          <button onClick={() => scrollToId("faq")} style={footerLinkBtn}>FAQ</button>
          <button onClick={() => goToPage("/terms")} style={footerLinkBtn}>Terms</button>
          <button onClick={() => goToPage("/privacy")} style={footerLinkBtn}>Privacy</button>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={() => goToPage("/checkout?plan=monthly")} style={{ background: "#fff", color: Theme.textPrimary, border: `1px solid ${Theme.border}`, padding: "9px 18px", borderRadius: "100px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Monthly ₹19
          </button>
          <button onClick={() => goToPage("/checkout?plan=yearly")} className="liquid-btn-premium" style={{ background: Theme.gradPremium, color: "#fff", border: "none", padding: "9px 18px", borderRadius: "100px", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(99,102,241,0.32)" }}>
            Full Year ₹49
          </button>
        </div>

        <div style={{ fontSize: "13px", color: Theme.textMuted }}>
          Payments secured by <span style={{ color: Theme.accentBlue, fontWeight: 700 }}>Razorpay</span> · All prices in INR
        </div>

        <div style={{ fontSize: "14px", color: Theme.textMuted }}>
          © {new Date().getFullYear()} BudgetPro. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

// ═══════════════════════════════════════════════════════════════════
//  STICKY BUBBLE — small, bottom-right, only after scrolling past hero
//  (never shown in the hero itself, dismissible)
// ═══════════════════════════════════════════════════════════════════
const StickyBubble = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 720);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible || dismissed) return null;

  return (
    <div style={{ position: "fixed", bottom: "22px", right: "22px", zIndex: 400, ...GlassStyle, padding: "10px 12px 10px 14px", display: "flex", alignItems: "center", gap: "8px", animation: "fadeInUp 0.3s ease" }}>
      <button
        onClick={() => navigate("/checkout?plan=yearly")}
        className="liquid-btn-premium"
        style={{ background: Theme.gradPremium, color: "#fff", border: "none", padding: "10px 18px", borderRadius: "100px", fontSize: "13px", fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" }}
      >
        Get Full Year ₹49
      </button>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        style={{ background: "transparent", border: "none", color: Theme.textMuted, fontSize: "18px", cursor: "pointer", padding: "2px 4px", lineHeight: 1 }}
      >
        ×
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
//  MAIN WHITE HOMEPAGE
// ═══════════════════════════════════════════════════════════════════
export const WhiteHomePage = () => {
  return (
    <div style={{ background: Theme.bg, minHeight: "100vh", animation: "fadeIn 0.6s ease" }}>
      <WhiteSaaSHero />
      <ProductShowcase />
      <ProductPricing />
      <ExcelPrivacy />
      <WhatsInside />
      <Reviews />
      <FAQ />
      <FinalCTA />
      <FooterWhite />
      <StickyBubble />
    </div>
  );
};
