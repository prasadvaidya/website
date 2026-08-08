import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";


const OUT = resolve(process.argv[2] ?? "./public/og");
mkdirSync(OUT, { recursive: true });

const BG = "#f7f5f0";
const INK = "#111111";
const BLUE = "#1a5ce0";
const LINE = "#c9c7c1";
const CARD = "#ffffff";
const EDGE = "#e3e1da";
const WARM = "#f6e6cf";
const COOL = "#dee4f6";
const FONT = "Helvetica Neue, Helvetica, Arial, sans-serif";

const sun = (cx, cy) => `
  <g stroke="#c9a86a" stroke-width="2.4" stroke-linecap="round" fill="none">
    <circle cx="${cx}" cy="${cy}" r="8"/>
    ${[0, 45, 90, 135, 180, 225, 270, 315]
      .map((deg) => {
        const r = (deg * Math.PI) / 180;
        return `<line x1="${cx + Math.cos(r) * 14}" y1="${cy + Math.sin(r) * 14}" x2="${
          cx + Math.cos(r) * 19
        }" y2="${cy + Math.sin(r) * 19}"/>`;
      })
      .join("")}
  </g>`;

const moon = (cx, cy) =>
  `<path d="M ${cx + 6} ${cy - 11} a 13 13 0 1 0 10 20 a 15 15 0 0 1 -10 -20 z" fill="#5b6b93"/>`;

const textLines = (x, y, lines, size, gap) =>
  lines
    .map(
      (line, i) =>
        `<text x="${x}" y="${y + i * gap}" fill="${INK}" font-family="${FONT}" font-size="${size}" font-weight="800" letter-spacing="-1.5">${line}</text>`
    )
    .join("");

const bar = (x, y, w, filled) => `
  <rect x="${x}" y="${y}" width="${w}" height="5" rx="2.5" fill="${LINE}"/>
  <rect x="${x}" y="${y}" width="${w * filled}" height="5" rx="2.5" fill="${BLUE}"/>`;

const noteCard = (x, y, w, h, lines = 4) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${CARD}" stroke="${EDGE}" stroke-width="1.5"/>
  <rect x="${x + 20}" y="${y + 20}" width="22" height="22" rx="5" fill="${BLUE}"/>
  <rect x="${x + 54}" y="${y + 29}" width="${w - 96}" height="5" rx="2.5" fill="${LINE}"/>
  ${Array.from({ length: lines }, (_, i) => {
    const width = i === lines - 1 ? (w - 40) * 0.55 : w - 40;
    return `<rect x="${x + 20}" y="${y + 62 + i * 15}" width="${width}" height="5" rx="2.5" fill="${LINE}" opacity="0.75"/>`;
  }).join("")}`;

const pauseBadge = (cx, cy) => `
  <circle cx="${cx}" cy="${cy}" r="17" fill="${BLUE}"/>
  <rect x="${cx - 6}" y="${cy - 7}" width="4" height="14" rx="1.5" fill="#fff"/>
  <rect x="${cx + 2}" y="${cy - 7}" width="4" height="14" rx="1.5" fill="#fff"/>`;

const playBadge = (cx, cy) => `
  <circle cx="${cx}" cy="${cy}" r="17" fill="${BLUE}"/>
  <path d="M ${cx - 5} ${cy - 8} L ${cx + 8} ${cy} L ${cx - 5} ${cy + 8} z" fill="#fff"/>`;

const divider = (x) =>
  `<line x1="${x}" y1="170" x2="${x}" y2="470" stroke="#cfcdc6" stroke-width="2" stroke-dasharray="5 9"/>`;

// --- one illustration per funnel page -------------------------------------

const handoffScene = `
  <ellipse cx="758" cy="318" rx="118" ry="98" fill="${WARM}" opacity="0.55"/>
  <ellipse cx="1046" cy="318" rx="118" ry="98" fill="${COOL}" opacity="0.6"/>
  ${sun(758, 212)}
  ${moon(1040, 212)}
  ${divider(902)}
  ${noteCard(662, 258, 192, 132, 3)}
  ${bar(682, 356, 96, 0.62)}
  ${pauseBadge(830, 358)}
  ${noteCard(950, 258, 192, 132, 3)}
  ${bar(970, 356, 96, 0.62)}
  ${playBadge(1118, 358)}
  <path d="M 854 358 C 880 358, 884 330, 902 330 C 920 330, 924 358, 950 358"
        fill="none" stroke="${BLUE}" stroke-width="2.5"/>
  <circle cx="902" cy="330" r="7" fill="${BG}" stroke="${BLUE}" stroke-width="2.5"/>`;

const lanesScene = `
  <ellipse cx="900" cy="320" rx="200" ry="150" fill="${COOL}" opacity="0.45"/>
  ${[228, 300, 372]
    .map((y, i) => {
      const active = i === 1;
      return `
    <rect x="712" y="${y}" width="376" height="46" rx="10" fill="${CARD}"
          stroke="${active ? BLUE : EDGE}" stroke-width="${active ? 2.5 : 1.5}"/>
    <rect x="732" y="${y + 20}" width="${active ? 150 : 118}" height="6" rx="3"
          fill="${active ? BLUE : LINE}"/>
    <rect x="${active ? 898 : 866}" y="${y + 20}" width="${active ? 86 : 118}" height="6" rx="3" fill="${LINE}" opacity="0.7"/>`;
    })
    .join("")}
  <line x1="700" y1="234" x2="700" y2="412" stroke="${LINE}" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M 1094 323 C 1130 323, 1130 395, 1094 395" fill="none" stroke="${BLUE}"
        stroke-width="2.5" stroke-dasharray="5 7"/>
  <path d="M 1101 388 L 1092 395 L 1101 402" fill="none" stroke="${BLUE}" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="700" cy="323" r="7" fill="${BLUE}"/>`;

const shutdownScene = `
  <ellipse cx="790" cy="316" rx="112" ry="96" fill="${WARM}" opacity="0.5"/>
  <ellipse cx="1046" cy="316" rx="96" ry="88" fill="${COOL}" opacity="0.6"/>
  ${sun(790, 206)}
  ${moon(1042, 206)}
  ${divider(924)}
  <rect x="690" y="248" width="204" height="176" rx="12" fill="${CARD}" stroke="${EDGE}" stroke-width="1.5"/>
  ${[0, 1, 2, 3].map((i) => {
    const y = 278 + i * 30;
    return `
    <rect x="712" y="${y}" width="15" height="15" rx="4" fill="none" stroke="${LINE}" stroke-width="2"/>
    <path d="M 715.5 ${y + 7.5} L 719 ${y + 11} L 724 ${y + 4}" fill="none" stroke="${BLUE}"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="738" y="${y + 5}" width="${i === 3 ? 88 : 134}" height="5" rx="2.5" fill="${LINE}" opacity="0.8"/>`;
  }).join("")}
  <rect x="712" y="398" width="160" height="6" rx="3" fill="${BLUE}"/>
  <rect x="962" y="286" width="164" height="100" rx="12" fill="${CARD}" stroke="${EDGE}" stroke-width="1.5"/>
  <rect x="984" y="316" width="120" height="6" rx="3" fill="${LINE}" opacity="0.7"/>
  <rect x="984" y="338" width="82" height="6" rx="3" fill="${LINE}" opacity="0.7"/>
  <rect x="984" y="360" width="104" height="6" rx="3" fill="${BLUE}" opacity="0.35"/>
  <path d="M 894 336 L 956 336" stroke="${BLUE}" stroke-width="2.5" stroke-dasharray="5 7"/>
  <path d="M 949 329 L 957 336 L 949 343" fill="none" stroke="${BLUE}" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round"/>`;

const sparkScene = `
  <ellipse cx="770" cy="318" rx="108" ry="104" fill="${WARM}" opacity="0.55"/>
  <ellipse cx="1046" cy="318" rx="118" ry="98" fill="${COOL}" opacity="0.55"/>
  ${divider(902)}
  ${[
    22, 44, 68, 96, 74, 52, 88, 116, 90, 60, 38, 66, 94, 70, 44, 26
  ]
    .map((h, i) => {
      const x = 682 + i * 11;
      return `<rect x="${x}" y="${318 - h / 2}" width="5" height="${h}" rx="2.5" fill="${BLUE}" opacity="${
        0.35 + (i % 5) * 0.13
      }"/>`;
    })
    .join("")}
  <path d="M 806 214 l 6 15 15 6 -15 6 -6 15 -6 -15 -15 -6 15 -6 z" fill="#c9a86a"/>
  <rect x="950" y="240" width="196" height="156" rx="12" fill="${CARD}" stroke="${EDGE}" stroke-width="1.5"/>
  ${[16, 30, 44, 34, 22, 40, 52, 36, 24, 14]
    .map((h, i) => {
      const x = 972 + i * 10;
      return `<rect x="${x}" y="${288 - h / 2}" width="4" height="${h}" rx="2" fill="${BLUE}" opacity="0.75"/>`;
    })
    .join("")}
  <rect x="972" y="326" width="152" height="5" rx="2.5" fill="${LINE}" opacity="0.8"/>
  <rect x="972" y="344" width="118" height="5" rx="2.5" fill="${LINE}" opacity="0.8"/>
  <rect x="972" y="362" width="86" height="5" rx="2.5" fill="${BLUE}" opacity="0.4"/>
  <path d="M 838 318 C 866 318, 874 300, 902 300 C 930 300, 926 318, 946 318"
        fill="none" stroke="${BLUE}" stroke-width="2.5"/>
  <circle cx="902" cy="300" r="7" fill="${BG}" stroke="${BLUE}" stroke-width="2.5"/>`;

const cards = [
  {
    file: "mental-offloading.png",
    eyebrow: "MENTAL OFFLOADING",
    lines: ["Put work down", "without losing", "your place."],
    scene: handoffScene
  },
  {
    file: "work-context-switching.png",
    eyebrow: "WORK CONTINUITY",
    lines: ["Switch tasks", "without losing", "context."],
    scene: lanesScene
  },
  {
    file: "end-of-day-shutdown.png",
    eyebrow: "EVENING RESET",
    lines: ["A shutdown ritual", "for the work you", "did not finish."],
    size: 58,
    gap: 72,
    scene: shutdownScene
  },
  {
    file: "creative-idea-capture.png",
    eyebrow: "CREATIVE CONTINUITY",
    lines: ["Capture the idea", "before the spark", "fades."],
    size: 60,
    gap: 74,
    scene: sparkScene
  }
];

for (const card of cards) {
  const size = card.size ?? 64;
  const gap = card.gap ?? 78;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${BG}"/>
  ${card.scene}
  <text x="60" y="205" fill="${BLUE}" font-family="${FONT}" font-size="25" font-weight="700" letter-spacing="5.5">${card.eyebrow}</text>
  ${textLines(60, 285, card.lines, size, gap)}
</svg>`;

  const out = resolve(OUT, card.file);
  const info = await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, palette: true, quality: 92, effort: 10 })
    .toFile(out);
  console.log(`${card.file}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(1)} KB`);
}
