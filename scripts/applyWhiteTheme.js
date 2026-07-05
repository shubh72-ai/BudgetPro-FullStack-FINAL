const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../src/App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

// 1. Update DS.color to White Theme
const oldDSColor = `  color: {
    mint:        "#A7F3FF",
    mintLight:   "rgba(167,243,255,0.14)",
    mintDark:    "#E9FBFF",
    mintGlow:    "rgba(167,243,255,0.24)",
    emerald:     "#7EE7C8",
    navy:        "#F8FAFF",
    navyMid:     "#101319",
    navyLight:   "#1A1F29",
    navyGlass:   "rgba(8,10,14,0.74)",
    slate:       "#DCE3EF",
    slateLight:  "#9DA8B8",
    bg:          "#07080B",
    bgCard:      "rgba(18,22,30,0.68)",
    bgGlass:     "rgba(255,255,255,0.105)",
    border:      "rgba(255,255,255,0.16)",
    borderGlow:  "rgba(167,243,255,0.36)",
    gold:        "#D8E3F2",
    goldDark:    "#8F9CB2",
    bronze:      "#B9C6D8",
    rose:        "#FF7A9E",
    purple:      "#9AA7FF",
    purpleLight: "rgba(154,167,255,0.14)",
    blue:        "#83B7FF",
    text:        "#F8FAFF",
    textMuted:   "#AAB4C4",
    surface:     "#0B0D12",
    input:       "rgba(255,255,255,0.08)",
    inputBorder: "rgba(255,255,255,0.16)",
    white:       "#FFFFFF",
  },`;

const newDSColor = `  color: {
    mint:        "#3b82f6",
    mintLight:   "#e0e7ff",
    mintDark:    "#1e3a8a",
    mintGlow:    "rgba(59, 130, 246, 0.2)",
    emerald:     "#06b6d4",
    navy:        "#0f172a",
    navyMid:     "#f8fbff",
    navyLight:   "#f1f5f9",
    navyGlass:   "rgba(255, 255, 255, 0.7)",
    slate:       "#475569",
    slateLight:  "#64748b",
    bg:          "#ffffff",
    bgCard:      "#ffffff",
    bgGlass:     "rgba(255, 255, 255, 0.8)",
    border:      "rgba(15, 23, 42, 0.08)",
    borderGlow:  "rgba(59, 130, 246, 0.2)",
    gold:        "#eab308",
    goldDark:    "#ca8a04",
    bronze:      "#b45309",
    rose:        "#ec4899",
    purple:      "#8b5cf6",
    purpleLight: "#ede9fe",
    blue:        "#3b82f6",
    text:        "#0f172a",
    textMuted:   "#94a3b8",
    surface:     "#f8fafc",
    input:       "#f1f5f9",
    inputBorder: "rgba(15, 23, 42, 0.1)",
    white:       "#ffffff",
  },`;

if (content.includes('mint:        "#A7F3FF"')) {
  content = content.replace(oldDSColor, newDSColor);
}

// 2. Hide global footer on homepage
content = content.replace(
  'const showFooter = !["/admin", "/dashboard", "/checkout", "/success"].includes(path);',
  'const showFooter = !["/", "/admin", "/dashboard", "/checkout", "/success"].includes(path);'
);

// 3. Change Route
content = content.replace(
  '<Route path="/"          element={<HomePage />} />',
  '<Route path="/"          element={<WhiteHomePage />} />'
);

// 4. Add Import
if (!content.includes('import { WhiteHomePage }')) {
  content = content.replace(
    'import { WhiteSaaSHero } from "./WhiteSaaSHero";',
    'import { WhiteSaaSHero } from "./WhiteSaaSHero";\nimport { WhiteHomePage } from "./WhiteHomePage";'
  );
}

fs.writeFileSync(appPath, content, 'utf8');
console.log("App.jsx updated with Global White Theme, new HomePage route, and hidden global footer on homepage.");
