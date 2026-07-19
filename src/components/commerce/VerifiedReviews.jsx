import { memo } from "react";
import { approvedReviews } from "../../data/reviews";
import { GlassBadge } from "../ui/GlassSurface";

const valueCards = [
  {
    title: "Clear money picture",
    text: "Income, expenses, savings, and category totals are visible without building formulas from scratch.",
  },
  {
    title: "Private by design",
    text: "Your budget stays inside your Excel or Google Sheets file on your own device or account.",
  },
  {
    title: "Simple to keep using",
    text: "The template is organized for repeat monthly tracking, not a one-time report you forget.",
  },
];

const VerifiedReviews = memo(() => {
  const realReviews = approvedReviews.filter((review) => review.approved);

  return (
    <section className="bp-commerce-section bp-proof-section">
      <div className="bp-section-heading">
        <GlassBadge>Customer proof</GlassBadge>
        <h2>{realReviews.length >= 3 ? "Real BudgetPro customer notes." : "Designed to make budgeting feel simpler."}</h2>
        <p>
          {realReviews.length >= 3
            ? "Only approved reviews are shown here. Verified badges appear only when backed by a paid order."
            : "We are not showing fabricated ratings or buyer counts. Until approved customer reviews are connected, this section focuses on what the product itself helps you do."}
        </p>
      </div>

      {realReviews.length > 0 ? (
        <div className="bp-review-grid">
          {realReviews.map((review) => (
            <article className="bp-glass bp-review-card" key={review.id}>
              <div className="bp-review-card__top">
                <div className="bp-review-avatar" aria-hidden="true">
                  {(review.name || "B").slice(0, 1)}
                </div>
                <div>
                  <strong>{review.name}</strong>
                  <span>{[review.city, review.role].filter(Boolean).join(" · ")}</span>
                </div>
              </div>
              <p>{review.text}</p>
              <div className="bp-review-card__meta">
                <span>{review.plan}</span>
                {review.verified && <span>Verified Purchase</span>}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="bp-value-grid">
          {valueCards.map((card) => (
            <article className="bp-glass bp-value-card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
});

export default VerifiedReviews;

