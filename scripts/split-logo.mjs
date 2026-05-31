/**
 * Split the logo SVG compound path into center character + barbed wire ring.
 * Uses a proper SVG path parser to track absolute positions.
 */

import { readFileSync, writeFileSync } from 'fs';

const svg = readFileSync('/home/vyrus-extreme/Projects/outcasttattoo/public/logo.svg', 'utf8');

// Extract the d attribute (multiline)
const dMatch = svg.match(/\bd="([\s\S]*?)"/);
const d = dMatch[1].replace(/\n\s*/g, ' ').trim();

// Split off the outer rectangle
const firstZ = d.indexOf('Z');
const outerRect = d.substring(0, firstZ + 1).trim();
const rest = d.substring(firstZ + 1).trim();

// Split into subpaths on "z m" boundaries
const parts = rest.split(/z\s+m/i);
const segments = parts.map((seg, i) => {
  if (i === 0) return seg.trim() + ' z';
  return 'm ' + seg.trim() + ' z';
});

console.log(`Found ${segments.length} subpaths\n`);

// Minimal SVG path parser: tracks current point through commands
// Only needs to handle relative commands (all our subpaths use relative)
function parsePath(pathStr, startX, startY) {
  const points = [];
  let x = startX, y = startY;
  points.push([x, y]);

  // Tokenize: split into command + numbers groups
  const tokens = pathStr.match(/[a-zA-Z][^a-zA-Z]*/g) || [];

  for (const token of tokens) {
    const cmd = token[0];
    const nums = (token.substring(1).match(/-?\d+\.?\d*/g) || []).map(Number);

    switch (cmd) {
      case 'm': // relative moveto
        if (nums.length >= 2) {
          x += nums[0]; y += nums[1];
          points.push([x, y]);
          // Implicit lineto for remaining pairs
          for (let i = 2; i < nums.length - 1; i += 2) {
            x += nums[i]; y += nums[i + 1];
            points.push([x, y]);
          }
        }
        break;
      case 'M': // absolute moveto
        if (nums.length >= 2) {
          x = nums[0]; y = nums[1];
          points.push([x, y]);
          for (let i = 2; i < nums.length - 1; i += 2) {
            x = nums[i]; y = nums[i + 1];
            points.push([x, y]);
          }
        }
        break;
      case 'c': // relative cubic bezier (6 params per curve)
        for (let i = 0; i < nums.length - 5; i += 6) {
          // Control points (for bounding we include them)
          points.push([x + nums[i], y + nums[i + 1]]);
          points.push([x + nums[i + 2], y + nums[i + 3]]);
          x += nums[i + 4]; y += nums[i + 5];
          points.push([x, y]);
        }
        break;
      case 'C': // absolute cubic
        for (let i = 0; i < nums.length - 5; i += 6) {
          points.push([nums[i], nums[i + 1]]);
          points.push([nums[i + 2], nums[i + 3]]);
          x = nums[i + 4]; y = nums[i + 5];
          points.push([x, y]);
        }
        break;
      case 'l': // relative lineto
        for (let i = 0; i < nums.length - 1; i += 2) {
          x += nums[i]; y += nums[i + 1];
          points.push([x, y]);
        }
        break;
      case 'L': // absolute lineto
        for (let i = 0; i < nums.length - 1; i += 2) {
          x = nums[i]; y = nums[i + 1];
          points.push([x, y]);
        }
        break;
      case 'h': // relative horizontal
        for (const n of nums) { x += n; points.push([x, y]); }
        break;
      case 'H': // absolute horizontal
        for (const n of nums) { x = n; points.push([x, y]); }
        break;
      case 'v': // relative vertical
        for (const n of nums) { y += n; points.push([x, y]); }
        break;
      case 'V': // absolute vertical
        for (const n of nums) { y = n; points.push([x, y]); }
        break;
      case 's': // relative smooth cubic (4 params)
        for (let i = 0; i < nums.length - 3; i += 4) {
          points.push([x + nums[i], y + nums[i + 1]]);
          x += nums[i + 2]; y += nums[i + 3];
          points.push([x, y]);
        }
        break;
      case 'S': // absolute smooth cubic
        for (let i = 0; i < nums.length - 3; i += 4) {
          points.push([nums[i], nums[i + 1]]);
          x = nums[i + 2]; y = nums[i + 3];
          points.push([x, y]);
        }
        break;
      case 'z': case 'Z':
        // Close path — return to start (handled externally)
        break;
      default:
        // Unhandled command — skip
        break;
    }
  }
  return points;
}

// Track start positions and compute real bounding boxes
let prevStart = [0, 0];
const classified = [];

for (let i = 0; i < segments.length; i++) {
  const seg = segments[i];
  const match = seg.match(/^m\s*(-?[\d.]+)\s*[,\s]\s*(-?[\d.]+)/i);
  const mdx = match ? parseFloat(match[1]) : 0;
  const mdy = match ? parseFloat(match[2]) : 0;
  const absStart = [prevStart[0] + mdx, prevStart[1] + mdy];

  // Parse to get all absolute points
  const points = parsePath(seg, prevStart[0], prevStart[1]);

  // Compute bounding box
  const xs = points.map(p => p[0]);
  const ys = points.map(p => p[1]);
  const bbox = {
    minX: Math.min(...xs), maxX: Math.max(...xs),
    minY: Math.min(...ys), maxY: Math.max(...ys),
  };

  // Compute centroid from bounding box center
  const cx = (bbox.minX + bbox.maxX) / 2;
  const cy = (bbox.minY + bbox.maxY) / 2;

  // Distance of bbox center from canvas center (200, 200)
  const dist = Math.sqrt((cx - 200) ** 2 + (cy - 200) ** 2);

  // How much of this path is within the canvas?
  const inCanvas = points.filter(p => p[0] >= -10 && p[0] <= 410 && p[1] >= -10 && p[1] <= 410).length;
  const pctInCanvas = ((inCanvas / points.length) * 100).toFixed(0);

  classified.push({
    index: i,
    absStart,
    bbox,
    bboxCenter: [cx, cy],
    dist,
    pctInCanvas,
    segLength: seg.length,
    numPoints: points.length,
    segment: seg
  });

  prevStart = absStart;
}

// Print info sorted by index
console.log('idx | bbox center    | dist  | bbox                           | inCanvas | len');
console.log('────┼────────────────┼───────┼────────────────────────────────┼──────────┼──────');
classified.forEach(s => {
  const cx = s.bboxCenter[0].toFixed(0).padStart(4);
  const cy = s.bboxCenter[1].toFixed(0).padStart(4);
  const d = s.dist.toFixed(0).padStart(5);
  const b = `(${s.bbox.minX.toFixed(0)},${s.bbox.minY.toFixed(0)})-(${s.bbox.maxX.toFixed(0)},${s.bbox.maxY.toFixed(0)})`;
  console.log(` ${s.index.toString().padStart(2)} | (${cx},${cy}) | ${d} | ${b.padEnd(30)} | ${s.pctInCanvas.padStart(4)}% | ${s.segLength}`);
});

// Try to identify center vs ring based on how much is in-canvas
// and bounding box extent
console.log('\n\n=== Classification Strategy ===');
console.log('Subpaths within 0-400 canvas (bbox contained):');
const inCanvas = classified.filter(s =>
  s.bbox.minX >= -20 && s.bbox.maxX <= 420 &&
  s.bbox.minY >= -20 && s.bbox.maxY <= 420
);
console.log(`  In-canvas: ${inCanvas.length} paths (indices: ${inCanvas.map(s => s.index).join(', ')})`);

const outCanvas = classified.filter(s =>
  s.bbox.minX < -20 || s.bbox.maxX > 420 ||
  s.bbox.minY < -20 || s.bbox.maxY > 420
);
console.log(`  Out-of-canvas: ${outCanvas.length} paths (indices: ${outCanvas.map(s => s.index).join(', ')})`);

// For in-canvas paths, classify by distance from center
console.log('\nIn-canvas paths by distance from center:');
const sortedInCanvas = [...inCanvas].sort((a, b) => a.dist - b.dist);
sortedInCanvas.forEach(s => {
  const cx = s.bboxCenter[0].toFixed(0).padStart(4);
  const cy = s.bboxCenter[1].toFixed(0).padStart(4);
  const size = `${(s.bbox.maxX - s.bbox.minX).toFixed(0)}x${(s.bbox.maxY - s.bbox.minY).toFixed(0)}`;
  console.log(`  #${s.index.toString().padStart(2)} dist=${s.dist.toFixed(0).padStart(4)} center=(${cx},${cy}) size=${size.padStart(8)} len=${s.segLength}`);
});
