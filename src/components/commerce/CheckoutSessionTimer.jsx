import { memo, useCallback, useEffect, useMemo, useState } from "react";

export const SESSION_DURATION = 15 * 60 * 1000;
export const CHECKOUT_SESSION_KEY = "budgetpro_checkout_session_expires_at";

const readValidExpiry = () => {
  if (typeof window === "undefined") return null;
  const stored = Number(window.sessionStorage.getItem(CHECKOUT_SESSION_KEY));
  return Number.isFinite(stored) && stored > Date.now() ? stored : null;
};

const formatTime = (milliseconds) => {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export const useCheckoutSessionTimer = () => {
  const [expiry, setExpiry] = useState(null);
  const [now, setNow] = useState(() => Date.now());

  const createSession = useCallback(() => {
    const nextExpiry = Date.now() + SESSION_DURATION;
    window.sessionStorage.setItem(CHECKOUT_SESSION_KEY, String(nextExpiry));
    setExpiry(nextExpiry);
    setNow(Date.now());
  }, []);

  useEffect(() => {
    const validExpiry = readValidExpiry();
    if (validExpiry) {
      setExpiry(validExpiry);
    } else {
      createSession();
    }
  }, [createSession]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const remaining = expiry ? Math.max(0, expiry - now) : SESSION_DURATION;
  const expired = Boolean(expiry && remaining <= 0);

  return useMemo(() => ({
    expiry,
    remaining,
    formatted: formatTime(remaining),
    expired,
    isLow: remaining > 0 && remaining <= 2 * 60 * 1000,
    restart: createSession,
  }), [createSession, expired, expiry, remaining]);
};

const CheckoutSessionTimerView = memo(({ activeTimer }) => {
  return (
    <section
      className={`bp-session-timer ${activeTimer.isLow ? "is-low" : ""} ${activeTimer.expired ? "is-expired" : ""}`.trim()}
      aria-live="polite"
      aria-label="Secure checkout session timer"
    >
      <div className="bp-session-timer__icon" aria-hidden="true">◷</div>
      <div className="bp-session-timer__copy">
        {activeTimer.expired ? (
          <>
            <strong>Your secure checkout session has expired.</strong>
            <span>Refresh or start a new secure session before continuing.</span>
          </>
        ) : (
          <>
            <strong>Secure checkout session reserved for</strong>
            <span>Complete payment before this session expires.</span>
          </>
        )}
      </div>
      {activeTimer.expired ? (
        <button type="button" className="bp-session-timer__restart" onClick={activeTimer.restart}>
          Start a new secure session
        </button>
      ) : (
        <div className="bp-session-timer__time">{activeTimer.formatted}</div>
      )}
    </section>
  );
});

const CheckoutSessionTimerWithOwnHook = memo(() => {
  const activeTimer = useCheckoutSessionTimer();
  return <CheckoutSessionTimerView activeTimer={activeTimer} />;
});

const CheckoutSessionTimer = memo(({ timer }) => (
  timer ? <CheckoutSessionTimerView activeTimer={timer} /> : <CheckoutSessionTimerWithOwnHook />
));

export default CheckoutSessionTimer;
