const DEFAULTS = {
  accent:    '#C8A96E',
  secondary: '#F0EDE6',
  highlight: '#C8A96E',
} as const;

export function isValidHex(value: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value);
}

export function safeColor(
  value: string | undefined,
  key: keyof typeof DEFAULTS
): string {
  const fallback = DEFAULTS[key];
  const trimmed = value?.trim().replace(/^["']|["']$/g, '');
  if (!trimmed || !isValidHex(trimmed)) {
    if (process.env.NODE_ENV === 'development' && value) {
      console.warn(`[Bella] Invalid color for ${key}: "${value}" — using default ${fallback}`);
    }
    return fallback;
  }
  return trimmed;
}

export function getThemeColors(): { accent: string; secondary: string; highlight: string } {
  return {
    accent:    safeColor(process.env.NEXT_PUBLIC_COLOR_ACCENT,    'accent'),
    secondary: safeColor(process.env.NEXT_PUBLIC_COLOR_SECONDARY, 'secondary'),
    highlight: safeColor(process.env.NEXT_PUBLIC_COLOR_HIGHLIGHT, 'highlight'),
  };
}
