import { memo, useEffect, useRef, useState } from "react";
import { GlassBadge, GlassButton } from "../ui/GlassSurface";
import VerifiedReviews from "./VerifiedReviews";

const storyItems = [
  {
    id: "income",
    title: "Track income and expenses",
    text: "Keep monthly money movement in one place, then review it without hunting through separate notes or apps.",
  },
  {
    id: "categories",
    title: "Understand category spending",
    text: "See the major spending groups clearly so decisions feel grounded instead of guessed.",
  },
  {
    id: "savings",
    title: "Follow monthly and annual savings",
    text: "Monthly snapshots and the annual view help you notice whether your plan is improving over time.",
  },
];

const monthlyFeatures = [
  "One monthly tracker",
  "Core income and expense view",
  "Category analysis",
  "Savings tracking",
];

const yearlyFeatures = [
  "All 12 months",
  "Annual dashboard",
  "Spending trends",
  "Yearly savings overview",
  "Better overall value",
];

const faqs = [
  {
    q: "Is this a subscription?",
    a: "No. BudgetPro is a one-time digital purchase with lifetime template access for the file you buy.",
  },
  {
    q: "Does it work in Google Sheets?",
    a: "Yes. The tracker is designed for Excel and Google Sheets, so you can use it in the spreadsheet tool you prefer.",
  },
  {
    q: "Is my financial information private?",
    a: "Yes. Your spending and income entries stay inside your own spreadsheet file. BudgetPro does not receive that financial data.",
  },
  {
    q: "What is included in the Full Year version?",
    a: "The Full Year plan includes 12 monthly trackers plus a complete annual dashboard for trends and yearly overview.",
  },
  {
    q: "When will I receive the file?",
    a: "After successful payment verification, the download is available immediately and a copy is sent by email.",
  },
  {
    q: "What happens if the download email does not arrive?",
    a: "Check spam first. If it still is not there, contact support with the purchase email so the link can be resent.",
  },
];

const ProductStory = memo(({
  previewSrc,
  previewAlt,
  plans,
  selectedPlan,
  onSelectPlan,
  onBuy,
}) => {
  const [activeStory, setActiveStory] = useState(storyItems[0].id);
  const itemRefs = useRef([]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveStory(entry.target.getAttribute("data-story-id") || storyItems[0].id);
        }
      });
    }, { rootMargin: "-35% 0px -45% 0px", threshold: 0.15 });

    itemRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className="bp-commerce-section bp-product-clarity">
        <div className="bp-story-grid">
          <div className="bp-story-preview">
            <div className="bp-story-preview__frame">
              <img src={previewSrc} alt={previewAlt} loading="lazy" />
              {storyItems.map((item, index) => (
                <span
                  key={item.id}
                  className={`bp-story-annotation bp-story-annotation--${index + 1} ${activeStory === item.id ? "is-active" : ""}`.trim()}
                  aria-hidden="true"
                />
              ))}
            </div>
            <p>{storyItems.find((item) => item.id === activeStory)?.title}</p>
          </div>

          <div className="bp-story-copy">
            <GlassBadge>Product clarity</GlassBadge>
            <h2>Everything important, visible at a glance.</h2>
            {storyItems.map((item, index) => (
              <article
                className={`bp-story-card ${activeStory === item.id ? "is-active" : ""}`.trim()}
                data-story-id={item.id}
                key={item.id}
                ref={(node) => { itemRefs.current[index] = node; }}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bp-commerce-section bp-comparison-section">
        <div className="bp-section-heading">
          <GlassBadge>Monthly vs Full Year</GlassBadge>
          <h2>Start small, or see the whole year.</h2>
          <p>Both plans are one-time purchases. Full Year is recommended when you want a complete annual view.</p>
        </div>

        <div className="bp-comparison-grid">
          {[
            { id: "monthly", features: monthlyFeatures },
            { id: "yearly", features: yearlyFeatures },
          ].map(({ id, features }) => (
            <article className={`bp-glass bp-compare-card ${id === "yearly" ? "is-recommended" : ""}`.trim()} key={id}>
              {id === "yearly" && <span className="bp-compare-card__ribbon">Recommended</span>}
              <div>
                <h3>{plans[id].label}</h3>
                <p>{plans[id].desc}</p>
              </div>
              <div className="bp-compare-card__price">₹{plans[id].price}</div>
              <ul>
                {features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <button
                type="button"
                className={`bp-glass-button ${selectedPlan === id ? "bp-glass-button--primary" : "bp-glass-button--secondary"}`}
                aria-pressed={selectedPlan === id}
                onClick={() => onSelectPlan(id)}
              >
                Choose {id === "yearly" ? "Full Year" : "Monthly"}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="bp-commerce-section bp-how-section">
        <div className="bp-section-heading">
          <GlassBadge>How it works</GlassBadge>
          <h2>From checkout to tracking in minutes.</h2>
        </div>
        <div className="bp-steps">
          {[
            ["Complete secure payment", "Continue to Razorpay and choose UPI, card, or net banking in the secure window."],
            ["Receive your download immediately", "After payment verification, the download appears on the success page and is sent by email."],
            ["Open the file and begin tracking", "Use the spreadsheet in Excel or Google Sheets and keep your financial entries private."],
          ].map(([title, text], index) => (
            <article className="bp-step-card" key={title}>
              <span>{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <VerifiedReviews />

      <section className="bp-commerce-section bp-faq-section">
        <div className="bp-section-heading">
          <GlassBadge>FAQ</GlassBadge>
          <h2>Questions before checkout.</h2>
        </div>
        <div className="bp-faq-list">
          {faqs.map((item) => (
            <details className="bp-glass bp-faq-item" key={item.q}>
              <summary>{item.q}<span aria-hidden="true">⌄</span></summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
        <div className="bp-faq-cta">
          <GlassButton onClick={onBuy}>Get the {selectedPlan === "yearly" ? "Full Year" : "Monthly"} Tracker</GlassButton>
        </div>
      </section>
    </>
  );
});

export default ProductStory;

