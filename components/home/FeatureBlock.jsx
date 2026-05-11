import Link from 'next/link';

export default function FeatureBlock({
  badge,
  badgeColor = '#CCFF00',
  headlines = [],
  subtitle,
  buttons = [],
  children,
  reversed = false,
  className = '',
  extraContent,
}) {
  const btnStyles = {
    primary: { background: 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)', fontWeight: 700 },
    secondary: { border: '1px solid var(--border-default)', color: 'var(--text-primary)' },
    ghost: { color: 'var(--text-muted)' },
    teal: { backgroundColor: '#00c896', color: '#000', fontWeight: 700 },
  };

  return (
    <div className={`border rounded-[20px] p-8 mb-4 w-full ${className}`}
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
    >
      <div className={`flex flex-col lg:flex-row ${reversed ? 'lg:flex-row-reverse' : ''} gap-8 lg:gap-12 items-center`}>
        <div className="w-full lg:w-[40%] flex-shrink-0">
          {badge && (
            <span
              className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full mb-4"
              style={{ backgroundColor: `${badgeColor}26`, color: badgeColor }}
            >
              {badge}
            </span>
          )}
          {headlines.map((h, i) => (
            <p
              key={i}
              className="text-[clamp(22px,3vw,36px)] leading-tight"
              style={{ fontWeight: h.weight || 800, color: h.color || 'var(--text-primary)' }}
            >
              {h.text}
            </p>
          ))}
          {subtitle && (
            <p className="text-[14px] mt-3 max-w-[400px]" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
          )}
          {buttons.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-5">
              {buttons.map((btn, i) => {
                const style = btnStyles[btn.variant] || btnStyles.secondary;
                return (
                  <Link
                    key={i}
                    href={btn.href}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[13px] transition-all duration-200 hover:opacity-80"
                    style={style}
                  >
                    {btn.text}
                  </Link>
                );
              })}
            </div>
          )}
          {extraContent && <div className="mt-4">{extraContent}</div>}
        </div>
        <div className="w-full lg:w-[60%] flex-shrink-0">
          {children}
        </div>
      </div>
    </div>
  );
}
