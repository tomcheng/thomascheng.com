import { type Creature, type Env, type Point, pick, rand } from "./creature";
import {
  type Frame,
  type Glyph,
  type Part,
  PAPER,
  limb,
  mirror,
  part,
  place
} from "./glyphs";
import { Splat } from "./gore";
import { Wander } from "./wander";

// Design space per segment: about 16 units across the plate, facing up.
const SPACING = 9.5;
const HIT_RADIUS = 8;
const LEG_LENGTH = 12;
/** Design units crawled per full leg cycle. */
const STRIDE = 20;
/** How far the leg wave lags from one segment to the next. */
const WAVE_LAG = 0.75;
const OFFSCREEN = 50;

interface Style {
  plate: { ch: string; rot: number; size: number };
  leg: string;
  head: string;
}

const PLATES: Style["plate"][] = [
  { ch: "8", rot: Math.PI / 2, size: 17 },
  { ch: "H", rot: 0, size: 11 },
  { ch: "B", rot: -Math.PI / 2, size: 17 },
  { ch: "0", rot: Math.PI / 2, size: 16 },
  { ch: "E", rot: -Math.PI / 2, size: 16 }
];

const randomStyle = (): Style => ({
  plate: pick(PLATES),
  leg: pick(["(", "l", "{", "f", "!", "1"]),
  head: pick(["Q", "O", "G", "D"])
});

interface Node {
  x: number;
  y: number;
  /** Its place along the original animal, which sets taper and leg timing. */
  index: number;
  of: number;
  kind: "head" | "plate" | "tail";
  /** Set once a severed piece starts crawling tail-first. */
  reversed: boolean;
}

const taper = (node: Node) => {
  const t = node.index / Math.max(1, node.of - 1);
  const neck = node.index === 1 ? 0.9 : 1;
  return (1 - 0.4 * t ** 1.6) * neck;
};

/** The same run of segments, led from its other end. */
const turnedAround = (nodes: Node[]): Node[] =>
  nodes
    .slice()
    .reverse()
    .map(n => ({ ...n, reversed: !n.reversed }));

export class Centipede implements Creature {
  dead = false;
  private nodes: Node[];
  private style: Style;
  private unit: number;
  private wander: Wander;
  private cruise: number;
  private gait: number;
  private clock = rand(0, 10);
  private panic = 0;
  private fleeFrom: Point | null = null;
  private leadFacing = 0;
  private untilSwap = rand(2, 4);
  /** Seconds of recoil left after losing part of its body. */
  private shock = 0;
  /** Seconds a headless piece has left to thrash; null for the real animal. */
  private life: number | null;

  private constructor(init: {
    nodes: Node[];
    style: Style;
    unit: number;
    heading: number;
    cruise: number;
    gait: number;
    life: number | null;
  }) {
    this.nodes = init.nodes;
    this.style = init.style;
    this.unit = init.unit;
    this.cruise = init.cruise;
    this.gait = init.gait;
    this.life = init.life;
    this.wander = new Wander(init.nodes[0].x, init.nodes[0].y, init.heading);
  }

  static spawn(x: number, y: number, heading: number, unit: number) {
    const count = Math.round(rand(12, 20));
    const nodes: Node[] = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        // Laid out straight behind the head; the taper tightens it up on
        // the first step.
        x: x - Math.cos(heading) * i * SPACING * unit,
        y: y - Math.sin(heading) * i * SPACING * unit,
        index: i,
        of: count,
        kind: i === 0 ? "head" : i === count - 1 ? "tail" : "plate",
        reversed: false
      });
    }
    return new Centipede({
      nodes,
      style: randomStyle(),
      unit,
      heading,
      cruise: rand(55, 85),
      gait: rand(0, Math.PI * 2),
      life: null
    });
  }

  get counts() {
    return this.life === null;
  }

  private get headless() {
    return this.life !== null;
  }

  update(dt: number, env: Env) {
    this.clock += dt;
    this.panic = Math.max(0, this.panic - dt);
    if (this.panic === 0 && !this.headless) this.fleeFrom = null;

    let speed = this.cruise * (this.panic > 0 ? 2 : 1);
    let drift = Math.sin(this.gait * 0.35) * 0.35;
    if (this.shock > 0) {
      // Just cut in two: the head end does not bolt. It flinches, slows to a
      // drag with a bit of a weave, and gradually gets back to crawling.
      this.shock = Math.max(0, this.shock - dt);
      const hurt = Math.min(1, this.shock / 2);
      speed = this.cruise * (1 - 0.6 * hurt);
      drift += Math.sin(this.clock * 3.5) * 0.55 * hurt;
    }
    if (this.life !== null) {
      this.life -= dt;
      if (this.life <= 0) return this.expire(env);
      // No head, no plan. The piece creeps aimlessly, curling slowly one way
      // and then the other with its legs still rippling, and runs down.
      const vigour = Math.min(1, this.life / 3);
      speed = this.cruise * 0.3 * vigour;
      drift = Math.sin(this.clock * 2.6) * 1.2 * (0.4 + 0.6 * vigour);
      // Legs keep working whether or not it gets anywhere.
      this.gait += dt * 3.5 * vigour;
      // Now and then the other end has a go.
      this.untilSwap -= dt;
      if (this.untilSwap <= 0 && this.nodes.length > 1) {
        this.untilSwap = rand(2, 4);
        this.nodes = turnedAround(this.nodes);
        const [lead, next] = this.nodes;
        this.wander.heading = Math.atan2(lead.y - next.y, lead.x - next.x);
      }
    }
    this.leadFacing = this.wander.heading + drift * 0.6;

    const lead = this.nodes[0];
    this.wander.x = lead.x;
    this.wander.y = lead.y;
    this.wander.advance(dt, speed, env, {
      agility: this.headless ? 2.2 : 1.6,
      confined: !this.headless,
      // A severed piece recoils from the thumb for a moment, no more.
      flee: this.headless && this.panic === 0 ? null : this.fleeFrom,
      drift
    });
    lead.x = this.wander.x;
    lead.y = this.wander.y;
    this.gait += ((speed * dt) / this.unit / STRIDE) * Math.PI * 2;

    // Each segment is dragged along at a fixed distance from the one ahead.
    for (let i = 1; i < this.nodes.length; i++) {
      const ahead = this.nodes[i - 1];
      const node = this.nodes[i];
      const dx = node.x - ahead.x;
      const dy = node.y - ahead.y;
      const d = Math.hypot(dx, dy) || 1;
      const gap = (SPACING * this.unit * (taper(ahead) + taper(node))) / 2;
      node.x = ahead.x + (dx / d) * gap;
      node.y = ahead.y + (dy / d) * gap;
    }

    if (this.headless) {
      const gone = this.nodes.every(
        n =>
          n.x < -OFFSCREEN ||
          n.y < -OFFSCREEN ||
          n.x > env.width + OFFSCREEN ||
          n.y > env.height + OFFSCREEN
      );
      if (gone) this.dead = true;
    }
  }

  /** A spent piece stops where it is and fades like the rest of the mess. */
  private expire(env: Env) {
    const splat = new Splat();
    const here = this.nodes[0];
    for (const glyph of this.pose()) splat.keep(glyph, here, 0);
    env.addSplat(splat);
    this.dead = true;
  }

  startle(from: Point, reach: number) {
    // Too busy with its own problems to be frightened by anything else.
    if (this.headless || this.shock > 0) return;
    const head = this.nodes[0];
    if (Math.hypot(head.x - from.x, head.y - from.y) > reach) return;
    this.panic = rand(0.9, 1.6);
    this.fleeFrom = from;
  }

  private frameOf(i: number): Frame {
    const node = this.nodes[i];
    const ahead = this.nodes[i - 1];
    const facing = ahead
      ? Math.atan2(ahead.y - node.y, ahead.x - node.x)
      : this.leadFacing;
    return {
      x: node.x,
      y: node.y,
      rot: facing + Math.PI / 2 + (node.reversed ? Math.PI : 0),
      scale: this.unit * taper(node)
    };
  }

  private partsOf(node: Node): Part[] {
    const parts: Part[] = [];
    const { style } = this;
    const direction = node.reversed ? -1 : 1;
    const phase = this.gait * direction - node.index * WAVE_LAG;
    // Legs lengthen towards the back, as they do on the real thing.
    const stretch = 1 + 0.55 * (node.index / node.of) ** 2;

    if (node.kind !== "head") {
      for (const side of [1, -1]) {
        const swing = Math.sin(phase + (side > 0 ? 0 : Math.PI));
        const leg = limb(
          style.leg,
          5,
          0,
          0.12 + swing * 0.5,
          LEG_LENGTH * stretch
        );
        const foot = limb("'", leg.x, leg.y, 0.5 + swing * 0.7, 3.5, {
          face: "bold"
        });
        for (const p of [leg.part, foot.part])
          parts.push(side > 0 ? p : mirror(p));
      }
    }

    if (node.kind === "tail") {
      const sway = Math.sin(this.clock * 4) * 0.15;
      const cercus = limb("(", 3, 3, Math.PI / 2 - 0.4 + sway, 22);
      parts.push(cercus.part, mirror(cercus.part));
    }

    if (node.kind === "head") {
      const sway = Math.sin(this.clock * 3.3) * 0.25;
      const feeler = limb("(", 4, -6, -1.05 + sway, 20);
      const tip = limb("~", feeler.x, feeler.y, -0.7 + sway * 2, 12, {
        fit: "w",
        rot: Math.PI / 2
      });
      const fang = part(")", 5.5, -9.5, 10, { face: "bold", rot: -0.55 });
      parts.push(feeler.part, mirror(feeler.part), tip.part, mirror(tip.part));
      parts.push(fang, mirror(fang));
      parts.push(part(style.head, 0, 0, 18, { face: "bold" }));
      parts.push(part("o", 0, 0.5, 10.5, { face: "bold" }));
      parts.push(part(".", 0, 0.5, 4, { face: "bold" }));
      const eye = part(".", 7.5, -5.5, 4, { face: "bold" });
      parts.push(eye, mirror(eye));
      return parts;
    }

    parts.push(
      part(style.plate.ch, 0, 0, style.plate.size, {
        face: "bold",
        rot: style.plate.rot
      })
    );
    return parts;
  }

  private poseByNode(): Glyph[][] {
    return this.nodes.map((node, i) => {
      const frame = this.frameOf(i);
      return this.partsOf(node).map(p => place(p, frame));
    });
  }

  pose(): Glyph[] {
    // Tail first, so each segment overlaps the one behind it.
    return this.poseByNode().reverse().flat();
  }

  squish(at: Point, radius: number, env: Env): Creature[] | null {
    const hit = this.nodes.map(
      n =>
        Math.hypot(n.x - at.x, n.y - at.y) <
        radius + HIT_RADIUS * this.unit * taper(n)
    );
    if (!hit.includes(true)) return null;

    const pose = this.poseByNode();
    const splat = new Splat();
    this.nodes.forEach((node, i) => {
      if (!hit[i]) return;
      const size = this.unit * taper(node);
      const big = node.kind === "head" ? 2 : 1;
      splat.smear(node, 5 * size, big);
      splat.burst(node, at, 6 * size, Math.round(rand(14, 20)) * big, 330);
      for (const glyph of pose[i]) {
        if (glyph.color !== PAPER && Math.random() < 0.22)
          splat.keep(glyph, at, 220);
      }
    });
    env.addSplat(splat);
    this.dead = true;

    // Whatever runs of segments are left each become their own animal.
    const pieces: Creature[] = [];
    let run: Node[] = [];
    const flush = () => {
      if (run.length > 0) pieces.push(this.sever(run, at));
      run = [];
    };
    this.nodes.forEach((node, i) => {
      if (hit[i]) flush();
      else run.push(node);
    });
    flush();
    return pieces;
  }

  private sever(nodes: Node[], wound: Point): Centipede {
    const intact = nodes[0].kind === "head" && !nodes[0].reversed;
    if (!intact) {
      // Lead with whichever end is further from the thumb.
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const d = (n: Node) => Math.hypot(n.x - wound.x, n.y - wound.y);
      if (d(last) > d(first)) {
        nodes = turnedAround(nodes);
      }
    }
    const lead = nodes[0];
    const heading =
      nodes.length > 1
        ? Math.atan2(lead.y - nodes[1].y, lead.x - nodes[1].x)
        : Math.atan2(lead.y - wound.y, lead.x - wound.x);
    const piece = new Centipede({
      nodes,
      style: this.style,
      unit: this.unit,
      heading: intact ? this.wander.heading : heading,
      cruise: this.cruise,
      gait: this.gait,
      life: intact ? null : rand(5, 9)
    });
    if (intact) {
      // It never moves at full pace again with less of itself to move.
      piece.shock = rand(2.5, 4);
      piece.cruise = this.cruise * 0.8;
    } else {
      piece.panic = rand(0.5, 0.9);
      piece.fleeFrom = wound;
    }
    return piece;
  }
}
