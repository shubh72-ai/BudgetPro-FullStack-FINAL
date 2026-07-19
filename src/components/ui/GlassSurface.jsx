import { forwardRef, memo } from "react";

export const GlassSurface = memo(({
  as: Tag = "div",
  children,
  className = "",
  variant = "surface",
  ...props
}) => (
  <Tag className={`bp-glass bp-glass--${variant} ${className}`.trim()} {...props}>
    {children}
  </Tag>
));

export const GlassPanel = memo(({ children, className = "", ...props }) => (
  <GlassSurface className={`bp-glass-panel ${className}`.trim()} {...props}>
    {children}
  </GlassSurface>
));

export const GlassBadge = memo(({ children, className = "", ...props }) => (
  <span className={`bp-glass-badge ${className}`.trim()} {...props}>
    {children}
  </span>
));

export const GlassSegment = memo(({ children, className = "", ...props }) => (
  <div className={`bp-glass-segment ${className}`.trim()} {...props}>
    {children}
  </div>
));

export const GlassButton = memo(forwardRef(function GlassButton({
  children,
  className = "",
  variant = "primary",
  type = "button",
  ...props
}, ref) {
  return (
  <button
    ref={ref}
    type={type}
    className={`bp-glass-button bp-glass-button--${variant} ${className}`.trim()}
    {...props}
  >
    {children}
  </button>
  );
}));

export const GlassIconButton = memo(forwardRef(function GlassIconButton({ children, className = "", label, type = "button", ...props }, ref) {
  return (
  <button
    ref={ref}
    type={type}
    aria-label={label}
    className={`bp-glass-icon-button ${className}`.trim()}
    {...props}
  >
    {children}
  </button>
  );
}));
