import { useState } from 'react';

const FONT_DISPLAY = "'Barlow Condensed', sans-serif";

const BADGE_COLORS = [
  ['#1E3A5F', '#4A90D9'],
  ['#1A3C2A', '#3DAA6A'],
  ['#3C1A1A', '#D94A4A'],
  ['#2D1A3C', '#9B4AD9'],
  ['#3C2D1A', '#D9924A'],
  ['#1A2D3C', '#4AB5D9'],
];

function badgePalette(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return BADGE_COLORS[Math.abs(hash) % BADGE_COLORS.length];
}

interface TeamBadgeProps {
  url?: string;
  name: string;
  size?: number;
}

export function TeamBadge({ url, name, size = 96 }: TeamBadgeProps) {
  const [failed, setFailed] = useState(false);
  const [bg, fg] = badgePalette(name || 'Unknown');
  const initials = (name || '???').substring(0, 3).toUpperCase();

  if (url && !failed) {
    return (
      <img
        src={url}
        alt={name}
        width={size}
        height={Math.round(size * 0.67)}
        className="w-full h-full object-contain"
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onError={() => setFailed(true)}
        loading="lazy"
      />
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: bg }}>
      <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: size * 0.28, color: fg, lineHeight: 1 }}>
        {initials}
      </span>
    </div>
  );
}
