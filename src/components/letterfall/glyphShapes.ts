import { isSimple, makeCCW, quickDecomp } from "poly-decomp";

export type Point = { x: number; y: number };

/**
 * A glyph's collision geometry, in pixels at REFERENCE_SIZE, relative to the
 * point the glyph is drawn from (left edge, alphabetic baseline). Scale by
 * `size / REFERENCE_SIZE` to get the geometry for any font size.
 */
export type GlyphShape = {
  /** Convex pieces that together cover the letterform, concavities intact. */
  parts: Point[][];
  /** Convex hull of the whole glyph, for letters too small to need more. */
  hull: Point[];
  /** Middle of the glyph's bounding box. */
  centre: Point;
};

export const REFERENCE_SIZE = 160;
export const FONT_FAMILY = 'Lora, Georgia, "Times New Roman", Times, serif';
export const REFERENCE_FONT = `400 ${REFERENCE_SIZE}px ${FONT_FAMILY}`;

// The glyph is drawn into a square this many font-sizes wide, with the origin
// inset far enough that no overhang or descender can clip.
const CANVAS_SCALE = 2;
const ORIGIN_X = REFERENCE_SIZE * 0.5;
const ORIGIN_Y = REFERENCE_SIZE * 1.35;
const ALPHA_THRESHOLD = 110;
// Islands smaller than this are anti-aliasing specks, not part of the letter.
const MIN_ISLAND_PIXELS = 24;
// Outline simplification tolerance, in reference pixels. At 2px of 160 the
// polygon is visually indistinguishable from the glyph at any on-screen size
// while keeping a letter to a few dozen vertices.
const SIMPLIFY_TOLERANCE = 2;

const cache = new Map<string, GlyphShape>();
const inkCache = new Map<string, { filled: Uint8Array; size: number }>();
let scratch: CanvasRenderingContext2D | null = null;

export const clearGlyphShapes = () => {
  cache.clear();
  inkCache.clear();
};

export const getGlyphShape = (char: string): GlyphShape => {
  let shape = cache.get(char);
  if (!shape) {
    shape = buildGlyphShape(char);
    cache.set(char, shape);
  }
  return shape;
};

const getScratch = () => {
  if (!scratch) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = REFERENCE_SIZE * CANVAS_SCALE;
    scratch = canvas.getContext("2d", { willReadFrequently: true })!;
  }
  return scratch;
};

/** Draw the glyph at reference size and threshold it to ink / not ink. */
const rasterise = (char: string) => {
  const ctx = getScratch();
  const size = ctx.canvas.width;
  ctx.clearRect(0, 0, size, size);
  ctx.font = REFERENCE_FONT;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#000";
  ctx.fillText(char, ORIGIN_X, ORIGIN_Y);

  const { data } = ctx.getImageData(0, 0, size, size);
  const filled = new Uint8Array(size * size);
  for (let i = 0; i < filled.length; i++) {
    filled[i] = data[i * 4 + 3] > ALPHA_THRESHOLD ? 1 : 0;
  }
  return { filled, size };
};

/**
 * A test for whether a point, in the same coordinates as GlyphShape, lies on
 * the glyph's actual ink. Unlike the collision shape this knows about
 * counters: the middle of an "o" is not ink.
 */
export const inkSampler = (char: string) => {
  let mask = inkCache.get(char);
  if (!mask) {
    mask = rasterise(char);
    inkCache.set(char, mask);
  }
  const { filled, size } = mask;
  return (x: number, y: number) => {
    const px = Math.floor(x + ORIGIN_X);
    const py = Math.floor(y + ORIGIN_Y);
    return (
      px >= 0 &&
      py >= 0 &&
      px < size &&
      py < size &&
      filled[py * size + px] === 1
    );
  };
};

const buildGlyphShape = (char: string): GlyphShape => {
  const { filled, size } = rasterise(char);

  const outlines = traceOutlines(filled, size).map(outline =>
    simplifyClosed(outline, SIMPLIFY_TOLERANCE).map(p => ({
      x: p.x - ORIGIN_X,
      y: p.y - ORIGIN_Y
    }))
  );

  const hull = convexHull(outlines.flat());
  const xs = hull.map(p => p.x);
  const ys = hull.map(p => p.y);
  return {
    parts: outlines.flatMap(decompose),
    hull,
    centre: {
      x: (Math.min(...xs) + Math.max(...xs)) / 2,
      y: (Math.min(...ys) + Math.max(...ys)) / 2
    }
  };
};

// Directions in clockwise screen order: east, south, west, north.
const DX = [1, 0, -1, 0];
const DY = [0, 1, 0, -1];

/**
 * Outer boundary of every 4-connected island of filled pixels, as a closed
 * clockwise loop of pixel-corner coordinates. Counters (the hole in an "o")
 * are deliberately not traced: nothing can get inside one, so they are solid
 * as far as collisions go.
 */
const traceOutlines = (filled: Uint8Array, size: number): Point[][] => {
  const at = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < size && y < size && filled[y * size + x] === 1;
  const visited = new Uint8Array(filled.length);
  const outlines: Point[][] = [];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const index = y * size + x;
      if (!filled[index] || visited[index]) continue;

      // Flood the island so it is only traced once, counting its pixels.
      let pixels = 0;
      const stack = [index];
      visited[index] = 1;
      while (stack.length) {
        const current = stack.pop()!;
        pixels++;
        const px = current % size;
        const py = (current - px) / size;
        for (let d = 0; d < 4; d++) {
          const nx = px + DX[d];
          const ny = py + DY[d];
          if (!at(nx, ny)) continue;
          const next = ny * size + nx;
          if (visited[next]) continue;
          visited[next] = 1;
          stack.push(next);
        }
      }
      if (pixels < MIN_ISLAND_PIXELS) continue;

      // (x, y) is the island's topmost-leftmost pixel, so its top-left corner
      // is on the outer boundary. Walk the pixel edges from there with the
      // island always on the right-hand side until we are back at the start.
      const outline: Point[] = [];
      let cx = x;
      let cy = y;
      let dir = 0;
      do {
        // The two pixels ahead of this corner, to the right and left of the
        // direction of travel.
        let right: boolean;
        let left: boolean;
        if (dir === 0) {
          right = at(cx, cy);
          left = at(cx, cy - 1);
        } else if (dir === 1) {
          right = at(cx - 1, cy);
          left = at(cx, cy);
        } else if (dir === 2) {
          right = at(cx - 1, cy - 1);
          left = at(cx - 1, cy);
        } else {
          right = at(cx, cy - 1);
          left = at(cx - 1, cy - 1);
        }
        const turned = !right ? (dir + 1) % 4 : left ? (dir + 3) % 4 : dir;
        if (turned !== dir) outline.push({ x: cx, y: cy });
        dir = turned;
        cx += DX[dir];
        cy += DY[dir];
      } while (cx !== x || cy !== y);
      outline.push({ x, y });
      outlines.push(outline);
    }
  }
  return outlines;
};

const distanceToSegment = (p: Point, a: Point, b: Point) => {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const lengthSq = abx * abx + aby * aby;
  const t = lengthSq
    ? Math.max(
        0,
        Math.min(1, ((p.x - a.x) * abx + (p.y - a.y) * aby) / lengthSq)
      )
    : 0;
  return Math.hypot(p.x - (a.x + abx * t), p.y - (a.y + aby * t));
};

/** Ramer-Douglas-Peucker on an open run of points; keeps both endpoints. */
const simplifyOpen = (points: Point[], tolerance: number): Point[] => {
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack: [number, number][] = [[0, points.length - 1]];
  while (stack.length) {
    const [first, last] = stack.pop()!;
    let worst = 0;
    let worstIndex = -1;
    for (let i = first + 1; i < last; i++) {
      const d = distanceToSegment(points[i], points[first], points[last]);
      if (d > worst) {
        worst = d;
        worstIndex = i;
      }
    }
    if (worst > tolerance) {
      keep[worstIndex] = 1;
      stack.push([first, worstIndex], [worstIndex, last]);
    }
  }
  return points.filter((_, i) => keep[i]);
};

/**
 * Simplify a closed loop by splitting it at its first point and the point
 * farthest from it, so neither half degenerates to a zero-length baseline.
 */
const simplifyClosed = (loop: Point[], tolerance: number): Point[] => {
  if (loop.length < 4) return loop;
  let far = 0;
  let farDistance = 0;
  for (let i = 1; i < loop.length; i++) {
    const d = Math.hypot(loop[i].x - loop[0].x, loop[i].y - loop[0].y);
    if (d > farDistance) {
      farDistance = d;
      far = i;
    }
  }
  const there = simplifyOpen(loop.slice(0, far + 1), tolerance);
  const back = simplifyOpen([...loop.slice(far), loop[0]], tolerance);
  return [...there.slice(0, -1), ...back.slice(0, -1)];
};

const cross = (o: Point, a: Point, b: Point) =>
  (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

/** Andrew's monotone chain. */
const convexHull = (points: Point[]): Point[] => {
  const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  if (sorted.length < 3) return sorted;
  const build = (source: Point[]) => {
    const chain: Point[] = [];
    for (const p of source) {
      while (
        chain.length >= 2 &&
        cross(chain[chain.length - 2], chain[chain.length - 1], p) <= 0
      ) {
        chain.pop();
      }
      chain.push(p);
    }
    chain.pop();
    return chain;
  };
  return [...build(sorted), ...build(sorted.reverse())];
};

const polygonArea = (polygon: Point[]) => {
  let twice = 0;
  for (let i = 0; i < polygon.length; i++) {
    const a = polygon[i];
    const b = polygon[(i + 1) % polygon.length];
    twice += a.x * b.y - b.x * a.y;
  }
  return Math.abs(twice) / 2;
};

/** Split one outline into convex pieces, dropping degenerate slivers. */
const decompose = (outline: Point[]): Point[][] => {
  if (outline.length < 3) return [];
  const polygon = outline.map(p => [p.x, p.y] as [number, number]);
  // A self-touching outline cannot be decomposed reliably; its hull is a
  // safe, if less interesting, stand-in.
  if (!isSimple(polygon)) return [convexHull(outline)];
  makeCCW(polygon);
  return quickDecomp(polygon)
    .map(piece => piece.map(([x, y]) => ({ x, y })))
    .filter(piece => piece.length >= 3 && polygonArea(piece) > 1);
};
