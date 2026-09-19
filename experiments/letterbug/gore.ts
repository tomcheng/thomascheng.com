import { type Point, pick, rand } from "./creature";
import { type Face, type Glyph, INK, drawGlyphs, loose, reach } from "./glyphs";

const REDS = ["#6b0a10", "#4f060b", "#7d0d14", "#3a0407", "#5c0810", "#8c1118"];
const BLACK_SHARE = 0.27;

// Small marks that read as flecks, strings and lumps rather than as text.
const BITS = [..."....,,,,;;::''''\"\"~~~**°^`´¨¸••‚„sscea§%&øç{}()÷=«»"];
const LUMPS = [..."&§%@*ß3S8"];
const FACES: Face[] = ["bold", "bold", "regular", "italic"];

const DRAG = 7.5;
const SETTLE = 0.75;
const HOLD = 2.4;
const FADE = 2.8;
/** Settled splats are flattened to a bitmap, unless absurdly large. */
const MAX_RASTER = 1400;

type Mote = Glyph & { vx: number; vy: number; spin: number };

const gutColor = () => (Math.random() < BLACK_SHARE ? INK : pick(REDS));

/** The mess left by one press of the thumb: gore, plus whatever parts survive. */
export class Splat {
  private smears: Mote[] = [];
  private motes: Mote[] = [];
  private remnants: Mote[] = [];
  private age = 0;
  private settled = false;
  private raster: HTMLCanvasElement | null = null;
  private rasterX = 0;
  private rasterY = 0;

  get done() {
    return this.age > HOLD + FADE;
  }

  /** Flecks thrown from around `from`, away from the thumb at `thumb`. */
  burst(
    from: Point,
    thumb: Point,
    spread: number,
    count: number,
    power: number
  ) {
    for (let i = 0; i < count; i++) {
      const a = rand(0, Math.PI * 2);
      const r = spread * Math.sqrt(Math.random());
      const x = from.x + Math.cos(a) * r;
      const y = from.y + Math.sin(a) * r;
      let dx = x - thumb.x;
      let dy = y - thumb.y;
      const d = Math.hypot(dx, dy);
      if (d < 1) {
        dx = Math.cos(a);
        dy = Math.sin(a);
      } else {
        dx /= d;
        dy /= d;
      }
      // Most flecks land close; a few fly.
      const speed = power * (0.15 + Math.random() ** 2.4);
      const skew = rand(-0.6, 0.6);
      this.motes.push({
        ...loose(
          pick(BITS),
          pick(FACES),
          x,
          y,
          5 + 15 * Math.random() ** 1.8,
          a,
          gutColor()
        ),
        vx: (dx * Math.cos(skew) - dy * Math.sin(skew)) * speed,
        vy: (dx * Math.sin(skew) + dy * Math.cos(skew)) * speed,
        spin: rand(-9, 9)
      });
    }
  }

  /** A few fat, slow lumps underneath: the wet middle of the splat. */
  smear(at: Point, spread: number, count: number) {
    for (let i = 0; i < count; i++) {
      const a = rand(0, Math.PI * 2);
      const r = spread * Math.random() * 0.6;
      this.smears.push({
        ...loose(
          pick(LUMPS),
          "bold",
          at.x + Math.cos(a) * r,
          at.y + Math.sin(a) * r,
          rand(13, 24),
          a,
          pick(REDS)
        ),
        vx: Math.cos(a) * rand(10, 70),
        vy: Math.sin(a) * rand(10, 70),
        spin: rand(-2, 2)
      });
    }
  }

  /** A real body part, knocked loose (or, with no power, left where it lay). */
  keep(glyph: Glyph, thumb: Point, power: number) {
    const a =
      Math.atan2(glyph.y - thumb.y, glyph.x - thumb.x) + rand(-0.5, 0.5);
    const speed = power * rand(0.25, 1);
    this.remnants.push({
      ...glyph,
      vx: Math.cos(a) * speed,
      vy: Math.sin(a) * speed,
      spin: power ? rand(-7, 7) : 0
    });
  }

  update(dt: number) {
    this.age += dt;
    if (this.age > SETTLE) return;
    const keepShare = Math.exp(-DRAG * dt);
    for (const group of [this.smears, this.motes, this.remnants]) {
      for (const m of group) {
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        m.rot += m.spin * dt;
        m.vx *= keepShare;
        m.vy *= keepShare;
        m.spin *= keepShare;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, pixelRatio: number) {
    if (this.age > SETTLE && !this.settled) this.flatten(pixelRatio);
    ctx.globalAlpha = Math.max(0, Math.min(1, 1 - (this.age - HOLD) / FADE));
    if (this.raster) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(
        this.raster,
        Math.round(this.rasterX * pixelRatio),
        Math.round(this.rasterY * pixelRatio)
      );
    } else {
      drawGlyphs(ctx, this.smears, pixelRatio);
      drawGlyphs(ctx, this.motes, pixelRatio);
      drawGlyphs(ctx, this.remnants, pixelRatio);
    }
    ctx.globalAlpha = 1;
  }

  /** Once nothing moves any more, hundreds of glyphs become one image. */
  private flatten(pixelRatio: number) {
    this.settled = true;
    const all = [...this.smears, ...this.motes, ...this.remnants];
    if (all.length === 0) return;
    let left = Infinity;
    let top = Infinity;
    let right = -Infinity;
    let bottom = -Infinity;
    for (const g of all) {
      const r = reach(g) + 2;
      left = Math.min(left, g.x - r);
      top = Math.min(top, g.y - r);
      right = Math.max(right, g.x + r);
      bottom = Math.max(bottom, g.y + r);
    }
    left = Math.floor(left);
    top = Math.floor(top);
    // Too big to be worth a bitmap: keep drawing it glyph by glyph.
    if (right - left > MAX_RASTER || bottom - top > MAX_RASTER) return;
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil((right - left) * pixelRatio);
    canvas.height = Math.ceil((bottom - top) * pixelRatio);
    const rctx = canvas.getContext("2d");
    if (!rctx) return;
    drawGlyphs(rctx, all, pixelRatio, left, top);
    this.raster = canvas;
    this.rasterX = left;
    this.rasterY = top;
  }
}
