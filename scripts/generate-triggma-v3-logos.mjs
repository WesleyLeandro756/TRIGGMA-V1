import fs from "fs";
import path from "path";

const outDir = "/workspace/branding/v3";

const concepts = [
  {
    id: "01-nova-minimal",
    subtitle: "NOVA MINIMAL",
    bg: "#06080D",
    text: "#F8FAFC",
    subText: "#94A3B8",
    iconBg: "#0B1220",
    colors: ["#2DD4BF", "#2563EB", "#7C3AED"],
    motif: "pulse",
  },
  {
    id: "02-signal-grid",
    subtitle: "SIGNAL GRID",
    bg: "#FFFFFF",
    text: "#0B1220",
    subText: "#6B7280",
    iconBg: "#0B1220",
    colors: ["#22C55E", "#14B8A6", "#0EA5E9"],
    motif: "ring",
  },
  {
    id: "03-hyper-growth",
    subtitle: "HYPER GROWTH",
    bg: "#0E0A17",
    text: "#FFFFFF",
    subText: "#C4B5FD",
    iconBg: "#1A1030",
    colors: ["#F97316", "#EF4444", "#A855F7"],
    motif: "impact",
  },
  {
    id: "04-atlas-tech",
    subtitle: "ATLAS TECH",
    bg: "#F8FAFC",
    text: "#0F172A",
    subText: "#64748B",
    iconBg: "#0F172A",
    colors: ["#06B6D4", "#3B82F6", "#8B5CF6"],
    motif: "bars",
  },
  {
    id: "05-momentum-x",
    subtitle: "MOMENTUM X",
    bg: "#090B12",
    text: "#F9FAFB",
    subText: "#9CA3AF",
    iconBg: "#111827",
    colors: ["#10B981", "#22C55E", "#84CC16"],
    motif: "diagonal",
  },
  {
    id: "06-quantum-link",
    subtitle: "QUANTUM LINK",
    bg: "#FFFFFF",
    text: "#111827",
    subText: "#6B7280",
    iconBg: "#111827",
    colors: ["#0EA5E9", "#2563EB", "#6366F1"],
    motif: "nodes",
  },
  {
    id: "07-prime-network",
    subtitle: "PRIME NETWORK",
    bg: "#0A0E1A",
    text: "#FFFFFF",
    subText: "#A5B4FC",
    iconBg: "#10172A",
    colors: ["#38BDF8", "#818CF8", "#E879F9"],
    motif: "ring",
  },
  {
    id: "08-vector-core",
    subtitle: "VECTOR CORE",
    bg: "#F8FAFC",
    text: "#0B1220",
    subText: "#475569",
    iconBg: "#0B1220",
    colors: ["#14B8A6", "#22C55E", "#0EA5E9"],
    motif: "pulse",
  },
  {
    id: "09-carbon-flow",
    subtitle: "CARBON FLOW",
    bg: "#05070D",
    text: "#E5E7EB",
    subText: "#9CA3AF",
    iconBg: "#0F172A",
    colors: ["#34D399", "#2DD4BF", "#06B6D4"],
    motif: "bars",
  },
  {
    id: "10-aurora-stack",
    subtitle: "AURORA STACK",
    bg: "#FFFFFF",
    text: "#111827",
    subText: "#64748B",
    iconBg: "#111827",
    colors: ["#60A5FA", "#A78BFA", "#F472B6"],
    motif: "impact",
  },
];

function gradient(id, colors) {
  return `
  <defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${colors[0]}"/>
      <stop offset="0.55" stop-color="${colors[1]}"/>
      <stop offset="1" stop-color="${colors[2]}"/>
    </linearGradient>
  </defs>`;
}

function motifPrimary(motif, gradId) {
  const common = `
    <rect x="62" y="60" width="116" height="24" rx="12" fill="url(#${gradId})"/>
    <rect x="108" y="60" width="24" height="120" rx="12" fill="url(#${gradId})"/>
    <path d="M64 176 L108 132 L140 164 L184 120" stroke="url(#${gradId})" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="64" cy="176" r="8" fill="${motif === "impact" ? "#FDBA74" : "#A7F3D0"}"/>
    <circle cx="108" cy="132" r="8" fill="${motif === "ring" ? "#93C5FD" : "#BFDBFE"}"/>
    <circle cx="140" cy="164" r="8" fill="${motif === "impact" ? "#F9A8D4" : "#C4B5FD"}"/>
    <circle cx="184" cy="120" r="8" fill="${motif === "nodes" ? "#67E8F9" : "#A7F3D0"}"/>`;

  if (motif === "ring") {
    return `
    <circle cx="120" cy="120" r="72" stroke="url(#${gradId})" stroke-width="12"/>
    ${common}`;
  }
  if (motif === "bars") {
    return `
    <rect x="54" y="148" width="20" height="36" rx="10" fill="url(#${gradId})"/>
    <rect x="82" y="136" width="20" height="48" rx="10" fill="url(#${gradId})"/>
    <rect x="110" y="122" width="20" height="62" rx="10" fill="url(#${gradId})"/>
    <rect x="138" y="108" width="20" height="76" rx="10" fill="url(#${gradId})"/>
    <rect x="166" y="94" width="20" height="90" rx="10" fill="url(#${gradId})"/>
    ${common}`;
  }
  if (motif === "diagonal") {
    return `
    <path d="M56 184 L184 56" stroke="url(#${gradId})" stroke-width="12" stroke-linecap="round"/>
    ${common}`;
  }
  if (motif === "nodes") {
    return `
    <path d="M66 174 C96 138, 126 170, 184 118" stroke="url(#${gradId})" stroke-width="12" fill="none" stroke-linecap="round"/>
    ${common}`;
  }
  if (motif === "impact") {
    return `
    <path d="M52 184 L112 124 L146 158 L188 116" stroke="url(#${gradId})" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M168 116 H188 V136" stroke="url(#${gradId})" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    ${common}`;
  }

  return common;
}

function motifIcon(motif, gradId) {
  const base = `
    <rect x="286" y="264" width="452" height="98" rx="49" fill="url(#${gradId})"/>
    <rect x="463" y="264" width="98" height="468" rx="49" fill="url(#${gradId})"/>
    <path d="M252 710 L422 540 L542 660 L742 460" stroke="url(#${gradId})" stroke-width="60" stroke-linecap="round" stroke-linejoin="round"/>`;

  if (motif === "ring") {
    return `
    <circle cx="512" cy="512" r="290" stroke="url(#${gradId})" stroke-width="48"/>
    ${base}`;
  }
  if (motif === "bars") {
    return `
    <rect x="210" y="680" width="60" height="80" rx="20" fill="url(#${gradId})"/>
    <rect x="286" y="640" width="60" height="120" rx="20" fill="url(#${gradId})"/>
    <rect x="362" y="590" width="60" height="170" rx="20" fill="url(#${gradId})"/>
    <rect x="438" y="540" width="60" height="220" rx="20" fill="url(#${gradId})"/>
    ${base}`;
  }
  if (motif === "diagonal") {
    return `
    <path d="M220 760 L760 220" stroke="url(#${gradId})" stroke-width="44" stroke-linecap="round"/>
    ${base}`;
  }
  if (motif === "nodes") {
    return `
    <path d="M238 730 C330 600, 430 700, 742 460" stroke="url(#${gradId})" stroke-width="44" fill="none" stroke-linecap="round"/>
    ${base}`;
  }
  if (motif === "impact") {
    return `
    <path d="M242 716 L422 536 L542 656 L742 456" stroke="url(#${gradId})" stroke-width="64" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M662 456 H742 V536" stroke="url(#${gradId})" stroke-width="42" stroke-linecap="round" stroke-linejoin="round"/>
    ${base}`;
  }
  return base;
}

function primarySvg(c) {
  const gradId = `grad-${c.id}`;
  return `<svg width="1200" height="320" viewBox="0 0 1200 320" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${gradient(gradId, c.colors)}
  <rect width="1200" height="320" fill="${c.bg}"/>
  <g transform="translate(40 40)">
    <rect x="0" y="0" width="240" height="240" rx="56" fill="${c.iconBg}"/>
    ${motifPrimary(c.motif, gradId)}
  </g>
  <text x="334" y="165" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="100" font-weight="800" fill="${c.text}" letter-spacing="1.8">TRIGGMA</text>
  <text x="338" y="210" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="30" font-weight="600" fill="${c.subText}" letter-spacing="3.8">${c.subtitle}</text>
</svg>`;
}

function iconSvg(c) {
  const gradId = `icon-grad-${c.id}`;
  return `<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${gradient(gradId, c.colors)}
  <rect x="72" y="72" width="880" height="880" rx="220" fill="${c.iconBg}"/>
  ${motifIcon(c.motif, gradId)}
</svg>`;
}

fs.mkdirSync(outDir, { recursive: true });

for (const c of concepts) {
  const primary = path.join(outDir, `triggma-v3-${c.id}-primary.svg`);
  const icon = path.join(outDir, `triggma-v3-${c.id}-icon.svg`);
  fs.writeFileSync(primary, primarySvg(c), "utf8");
  fs.writeFileSync(icon, iconSvg(c), "utf8");
}

console.log(`Generated ${concepts.length * 2} SVG files in ${outDir}`);
