// Light colour themes for blog data panels and cover images. Each post gets
// one automatically (picked from its slug), so consecutive posts look
// different. Site rule: never a black or dark background.
export type PanelTheme = {
  name: string;
  surface: string; // panel background (always light)
  frame: string; // border colour
  headerFrom: string; // title bar gradient (white text on top)
  headerTo: string;
  accent: string; // section titles
  bar: string; // main bar colour
  track: string; // empty part of a bar
  headBg: string; // table header
  headInk: string;
  coverFrom: string; // cover image background gradient
  coverTo: string;
};

export const PANEL_THEMES: PanelTheme[] = [
  { name: "sky", surface: "#F0F9FF", frame: "#14B8A6", headerFrom: "#0D9488", headerTo: "#14B8A6", accent: "#0F766E", bar: "#2563EB", track: "#DBEAFE", headBg: "#CCFBF1", headInk: "#115E59", coverFrom: "#E0F2FE", coverTo: "#CCFBF1" },
  { name: "mint", surface: "#F0FDF4", frame: "#22C55E", headerFrom: "#15803D", headerTo: "#22C55E", accent: "#15803D", bar: "#0284C7", track: "#DCFCE7", headBg: "#DCFCE7", headInk: "#14532D", coverFrom: "#F0FDF4", coverTo: "#D1FAE5" },
  { name: "white", surface: "#FFFFFF", frame: "#3B82F6", headerFrom: "#1D4ED8", headerTo: "#3B82F6", accent: "#1D4ED8", bar: "#2563EB", track: "#EFF6FF", headBg: "#DBEAFE", headInk: "#1E3A8A", coverFrom: "#FFFFFF", coverTo: "#E0EAFF" },
  { name: "lavender", surface: "#F5F3FF", frame: "#8B5CF6", headerFrom: "#6D28D9", headerTo: "#8B5CF6", accent: "#6D28D9", bar: "#7C3AED", track: "#EDE9FE", headBg: "#EDE9FE", headInk: "#4C1D95", coverFrom: "#F5F3FF", coverTo: "#E0E7FF" },
  { name: "peach", surface: "#FFF7ED", frame: "#F97316", headerFrom: "#C2410C", headerTo: "#F97316", accent: "#C2410C", bar: "#2563EB", track: "#FFEDD5", headBg: "#FFEDD5", headInk: "#7C2D12", coverFrom: "#FFF7ED", coverTo: "#FEF3C7" },
];

export function themeFor(slug: string): PanelTheme {
  let h = 0;
  for (let i = 0; i < slug.length; i += 1) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return PANEL_THEMES[h % PANEL_THEMES.length];
}

// Fixed meaning colours, the same in every theme.
export const RISING = "#16A34A";
export const DECLINING = "#DC2626";
export const UP = "#2563EB";
export const DOWN = "#DC2626";
