/**
 * OYİ GLOBAL — Dergi logosu.
 * Olay Yeri İnceleme ruhunu taşır: büyüteç içinde parmak izi,
 * matbaa mührünü andıran koyu mürekkep rozeti + kehribar halka.
 * Tek SVG tasarımı hem koyu üstbilgi hem krem kâğıt üzerinde çalışır.
 */

export function OyiMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 72 72"
      role="img"
      aria-label="OYİ GLOBAL logosu — büyüteç içinde parmak izi rozeti"
      className={className}
    >
      {/* Mühür diski + çift halka */}
      <circle cx="36" cy="36" r="35" fill="#141210" />
      <circle cx="36" cy="36" r="34" fill="none" stroke="#f5efe2" strokeOpacity="0.9" strokeWidth="1.4" />
      <circle cx="36" cy="36" r="30.5" fill="none" stroke="#d97706" strokeWidth="1.7" />

      {/* Parmak izi — kırık sırt yayları */}
      <g transform="translate(31.2, 30.8)" fill="none" stroke="#f5efe2" strokeLinecap="round">
        <circle r="11" pathLength="100" strokeDasharray="56 44" strokeDashoffset="-14" strokeWidth="1.9" strokeOpacity="0.95" />
        <circle r="8.4" pathLength="100" strokeDasharray="72 28" strokeDashoffset="-48" strokeWidth="1.8" strokeOpacity="0.9" />
        <circle r="5.8" pathLength="100" strokeDasharray="58 42" strokeDashoffset="-12" strokeWidth="1.7" />
        <circle r="3.2" pathLength="100" strokeDasharray="76 24" strokeDashoffset="-32" strokeWidth="1.6" />
        <circle r="0.9" fill="#f5efe2" stroke="none" />
      </g>

      {/* Büyüteç — lens + sap */}
      <circle
        cx="31.2"
        cy="30.8"
        r="14.6"
        fill="#141210"
        fillOpacity="0.42"
        stroke="#f59e0b"
        strokeWidth="2.7"
      />
      <line
        x1="41.6"
        y1="41.2"
        x2="52.2"
        y2="51.8"
        stroke="#f59e0b"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Lens parlaması */}
      <path
        d="M 22.5 24.5 A 11 11 0 0 1 28 20.5"
        fill="none"
        stroke="#fde68a"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeOpacity="0.9"
      />

      {/* Kuzey yıldızı — küresel izleme vurgusu */}
      <path
        d="M56.5 13.5 l1.15 2.85 2.85 1.15 -2.85 1.15 -1.15 2.85 -1.15 -2.85 -2.85 -1.15 2.85 -1.15 z"
        fill="#fbbf24"
      />
    </svg>
  );
}

/**
 * Yatay kilit — üstbilgi ve admin paneli için.
 * tone: "dark" (koyu zemin) | "paper" (krem kâğıt)
 */
export function OyiLogo({
  tone = "dark",
  markClassName = "h-10 w-10",
  titleClassName = "text-base sm:text-lg",
  subtitle,
}: {
  tone?: "dark" | "paper";
  markClassName?: string;
  titleClassName?: string;
  subtitle?: string;
}) {
  const nameColor = tone === "dark" ? "text-slate-50" : "text-stone-900";
  const accent = tone === "dark" ? "text-amber-400" : "text-amber-700";
  const subColor = tone === "dark" ? "text-slate-400" : "text-stone-600";

  return (
    <span className="flex items-center gap-2.5 min-w-0">
      <OyiMark className={`${markClassName} shrink-0`} />
      <span className="min-w-0">
        <span className={`mag-serif block font-black leading-tight tracking-tight ${nameColor} ${titleClassName}`}>
          OYİ <span className={accent}>GLOBAL</span>
        </span>
        {subtitle && (
          <span className={`block truncate text-[11px] leading-tight ${subColor}`}>{subtitle}</span>
        )}
      </span>
    </span>
  );
}
