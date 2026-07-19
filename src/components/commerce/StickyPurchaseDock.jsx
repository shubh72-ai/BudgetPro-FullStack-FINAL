import { memo, useEffect, useRef, useState } from "react";
import { GlassButton } from "../ui/GlassSurface";

const PLAN_LABELS = {
  monthly: "Monthly Tracker",
  yearly: "Full Year Tracker",
};

const PLAN_SHORT = {
  monthly: "Monthly",
  yearly: "Full Year",
};

const StickyPurchaseDock = memo(({
  visible,
  selectedPlan,
  plans,
  previewSrc,
  previewAlt,
  onSelectPlan,
  onBuy,
}) => {
  const [minimized, setMinimized] = useState(false);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    if (!visible) {
      setMinimized(false);
      lastScrollRef.current = typeof window !== "undefined" ? window.scrollY : 0;
      return undefined;
    }

    const onScroll = () => {
      const current = window.scrollY;
      if (Math.abs(current - lastScrollRef.current) > 260) {
        setMinimized(false);
        lastScrollRef.current = current;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [visible]);

  if (!visible || minimized) return null;

  const plan = plans[selectedPlan];

  return (
    <aside className="bp-purchase-dock" aria-label="Quick purchase bar">
      <div className="bp-purchase-dock__product">
        <img src={previewSrc} alt={previewAlt} className="bp-purchase-dock__thumb" />
        <div>
          <div className="bp-purchase-dock__name">{PLAN_LABELS[selectedPlan]}</div>
          <div className="bp-purchase-dock__meta">Instant digital delivery</div>
        </div>
      </div>

      <div className="bp-purchase-dock__plans" role="group" aria-label="Choose plan">
        {Object.keys(plans).map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={selectedPlan === id}
            className={`bp-plan-chip ${selectedPlan === id ? "is-active" : ""}`.trim()}
            onClick={() => onSelectPlan(id)}
          >
            {PLAN_SHORT[id]}
          </button>
        ))}
      </div>

      <div className="bp-purchase-dock__action">
        <div className="bp-purchase-dock__price">₹{plan.price}</div>
        <GlassButton onClick={onBuy} className="bp-purchase-dock__button">
          Buy Now
        </GlassButton>
      </div>

      <button
        type="button"
        className="bp-purchase-dock__close"
        aria-label="Minimize purchase bar"
        onClick={() => {
          lastScrollRef.current = window.scrollY;
          setMinimized(true);
        }}
      >
        ×
      </button>
    </aside>
  );
});

export default StickyPurchaseDock;

