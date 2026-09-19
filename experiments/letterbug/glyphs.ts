// Everything on screen is a glyph: one character, drawn about the centre of
// its ink rather than its text origin, so that rotating or mirroring it turns
// it in place. Bugs are designed as lists of Parts in their own design space
// (facing up the page, -y forward) and placed into the world each frame.

export const INK = "#0a0a0a";
export const PAPER = "#fcfcfa";

export type Face = "regular" | "bold" | "italic";

const REFERENCE_SIZE = 100;
const FAMILY = 'Lora, Georgia, "Times New Roman", Times, serif';
const FONTS: Record<Face, string> = {
  regular: `400 ${REFERENCE_SIZE}px ${FAMILY}`,
  bold: `700 ${REFERENCE_SIZE}px ${FAMILY}`,
  italic: `italic 400 ${REFERENCE_SIZE}px ${FAMILY}`
};

export const FONT_LOADS = [
  `400 20px Lora`,
  `700 20px Lora`,
  `italic 400 20px Lora`
];

/** A glyph in world space. `scale` multiplies the reference-size glyph. */
export interface Glyph {
  ch: string;
  face: Face;
  x: number;
  y: number;
  rot: number;
  scale: number;
  flip: boolean;
  color: string;
}

/** A glyph in a bug's design space. `size` is the ink height (or width). */
export interface Part {
  ch: string;
  face: Face;
  x: number;
  y: number;
  rot: number;
  size: number;
  fit: "h" | "w";
  flip: boolean;
  color: string;
}

export interface Frame {
  x: number;
  y: number;
  rot: number;
  scale: number;
}

interface Metrics {
  cx: number;
  cy: number;
  w: number;
  h: number;
}

const measuring = document.createElement("canvas").getContext("2d")!;
const metricsCache = new Map<string, Metrics>();

/** Measurements taken before the webfont arrived are of the fallback. */
export function clearMetrics() {
  metricsCache.clear();
}

function metrics(ch: string, face: Face): Metrics {
  const key = face + ch;
  let found = metricsCache.get(key);
  if (!found) {
    measuring.font = FONTS[face];
    measuring.textBaseline = "alphabetic";
    measuring.textAlign = "left";
    const m = measuring.measureText(ch);
    found = {
      cx: (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2,
      cy: (m.actualBoundingBoxDescent - m.actualBoundingBoxAscent) / 2,
      w: Math.max(1, m.actualBoundingBoxLeft + m.actualBoundingBoxRight),
      h: Math.max(1, m.actualBoundingBoxAscent + m.actualBoundingBoxDescent)
    };
    metricsCache.set(key, found);
  }
  return found;
}

export function part(
  ch: string,
  x: number,
  y: number,
  size: number,
  options: Partial<Omit<Part, "ch" | "x" | "y" | "size">> = {}
): Part {
  return {
    ch,
    x,
    y,
    size,
    face: "regular",
    rot: 0,
    fit: "h",
    flip: false,
    color: INK,
    ...options
  };
}

/** The same part on the other side of the bug's centre line. */
export function mirror(p: Part): Part {
  return { ...p, x: -p.x, rot: -p.rot, flip: !p.flip };
}

/**
 * A glyph used as a limb segment: it starts at (x0, y0), runs `length` along
 * `angle` with the top of the letter leading, and reports where it ends so
 * the next segment can hang off it.
 */
export function limb(
  ch: string,
  x0: number,
  y0: number,
  angle: number,
  length: number,
  options: Partial<Omit<Part, "ch" | "x" | "y" | "size">> = {}
) {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const { rot = 0, ...rest } = options;
  return {
    part: part(ch, x0 + (dx * length) / 2, y0 + (dy * length) / 2, length, {
      ...rest,
      rot: angle + Math.PI / 2 + rot
    }),
    x: x0 + dx * length,
    y: y0 + dy * length
  };
}

export function place(p: Part, frame: Frame): Glyph {
  const m = metrics(p.ch, p.face);
  const cos = Math.cos(frame.rot);
  const sin = Math.sin(frame.rot);
  return {
    ch: p.ch,
    face: p.face,
    x: frame.x + (p.x * cos - p.y * sin) * frame.scale,
    y: frame.y + (p.x * sin + p.y * cos) * frame.scale,
    rot: frame.rot + p.rot,
    scale: (p.size / (p.fit === "w" ? m.w : m.h)) * frame.scale,
    flip: p.flip,
    color: p.color
  };
}

/** A free-floating glyph sized by font size, for debris. */
export function loose(
  ch: string,
  face: Face,
  x: number,
  y: number,
  fontSize: number,
  rot: number,
  color: string
): Glyph {
  return {
    ch,
    face,
    x,
    y,
    rot,
    scale: fontSize / REFERENCE_SIZE,
    flip: false,
    color
  };
}

/** Roughly how far a glyph's ink reaches from its centre, in world pixels. */
export function reach(g: Glyph) {
  const m = metrics(g.ch, g.face);
  return (Math.hypot(m.w, m.h) / 2) * g.scale;
}

/**
 * Draws glyphs in order. `pixelRatio` and the origin are folded into each
 * glyph's transform, so the caller's own transform is ignored and left reset.
 */
export function drawGlyphs(
  ctx: CanvasRenderingContext2D,
  glyphs: readonly Glyph[],
  pixelRatio: number,
  originX = 0,
  originY = 0
) {
  let face: Face | null = null;
  let color: string | null = null;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  for (const g of glyphs) {
    if (g.face !== face) {
      face = g.face;
      ctx.font = FONTS[face];
    }
    if (g.color !== color) {
      color = g.color;
      ctx.fillStyle = color;
    }
    const m = metrics(g.ch, g.face);
    const k = g.scale * pixelRatio;
    const cos = Math.cos(g.rot) * k;
    const sin = Math.sin(g.rot) * k;
    const side = g.flip ? -1 : 1;
    ctx.setTransform(
      cos * side,
      sin * side,
      -sin,
      cos,
      (g.x - originX) * pixelRatio,
      (g.y - originY) * pixelRatio
    );
    ctx.fillText(g.ch, -m.cx, -m.cy);
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}
