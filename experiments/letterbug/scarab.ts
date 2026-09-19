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

const DEG = Math.PI / 180;

// Design space: about 110 units from horn to tail, facing up the page.
const DESIGN_LENGTH = 110;
const HIT_CENTRE_Y = -2;
const HIT_HALF_WIDTH = 30;
const HIT_HALF_LENGTH = 54;
/** Design units walked per full leg cycle. */
const STRIDE = 46;

interface LegSpec {
  x: number;
  y: number;
  /** Resting direction of the femur on the right side; 0 is straight out. */
  femur: number;
  /** How much further the tibia turns at the knee. */
  knee: number;
  femurLength: number;
  tibiaLength: number;
  swing: number;
}

const LEGS: LegSpec[] = [
  {
    x: 17,
    y: -33,
    femur: -36,
    knee: -44,
    femurLength: 19,
    tibiaLength: 22,
    swing: 17
  },
  {
    x: 22,
    y: -6,
    femur: 8,
    knee: 40,
    femurLength: 19,
    tibiaLength: 22,
    swing: 19
  },
  {
    x: 21,
    y: 17,
    femur: 42,
    knee: 36,
    femurLength: 23,
    tibiaLength: 27,
    swing: 16
  }
];

interface Style {
  horn: string;
  tibia: string;
  femur: string;
  head: string;
  /** Knocked out of the pronotum in the page colour. */
  crest: string;
  /** How many nested ridges each wing case has. */
  ridges: number;
}

const randomStyle = (): Style => ({
  horn: pick(["Y", "V", "T", "Y", "W"]),
  tibia: pick(["}", "E", "J", "}"]),
  femur: pick(["I", "l", "I"]),
  head: pick(["o", "e", "a"]),
  crest: pick([":", "÷", "¨", "=", "«"]),
  ridges: pick([3, 4, 4])
});

export class Scarab implements Creature {
  dead = false;
  readonly counts = true;
  private wander: Wander;
  private scale: number;
  private style = randomStyle();
  private cruise: number;
  private speed = 0;
  private gait = rand(0, Math.PI * 2);
  private clock = rand(0, 10);
  private pause = 0;
  private untilPause = rand(1.5, 6);
  private panic = 0;
  private fleeFrom: Point | null = null;

  constructor(x: number, y: number, heading: number, length: number) {
    this.wander = new Wander(x, y, heading);
    this.scale = length / DESIGN_LENGTH;
    // Small ones scuttle, big ones trundle.
    this.cruise = rand(26, 40) / Math.sqrt(this.scale);
  }

  update(dt: number, env: Env) {
    this.clock += dt;
    this.panic = Math.max(0, this.panic - dt);
    if (this.panic === 0) this.fleeFrom = null;

    if (this.pause > 0) {
      this.pause -= dt;
    } else {
      this.untilPause -= dt;
      if (this.untilPause <= 0) {
        this.pause = rand(0.4, 1.8);
        this.untilPause = rand(2, 7);
      }
    }

    const target =
      this.panic > 0 ? this.cruise * 2.4 : this.pause > 0 ? 0 : this.cruise;
    this.speed += (target - this.speed) * Math.min(1, dt * 7);
    this.wander.advance(dt, this.speed, env, {
      agility: 1.1,
      confined: true,
      flee: this.fleeFrom
    });
    this.gait += ((this.speed * dt) / this.scale / STRIDE) * Math.PI * 2;
  }

  startle(from: Point, reach: number) {
    if (Math.hypot(this.wander.x - from.x, this.wander.y - from.y) > reach)
      return;
    this.panic = rand(0.9, 1.6);
    this.pause = 0;
    this.fleeFrom = from;
  }

  private frame(): Frame {
    return {
      x: this.wander.x,
      y: this.wander.y,
      // The shell rocks a touch with each step.
      rot: this.wander.heading + Math.PI / 2 + Math.sin(this.gait) * 0.035,
      scale: this.scale
    };
  }

  private legs(): Part[] {
    const parts: Part[] = [];
    LEGS.forEach((leg, i) => {
      for (const side of [1, -1]) {
        // Alternating tripods: front and back of one side move with the
        // middle of the other.
        const phase = this.gait + ((i + (side > 0 ? 0 : 1)) % 2) * Math.PI;
        const swing = Math.sin(phase);
        const lift = Math.cos(phase);
        const femurAngle = (leg.femur + leg.swing * swing) * DEG;
        const femur = limb(
          this.style.femur,
          leg.x,
          leg.y,
          femurAngle,
          leg.femurLength * (1 + 0.05 * lift),
          { face: "bold" }
        );
        const tibiaAngle =
          femurAngle + (leg.knee + leg.swing * 0.5 * lift) * DEG;
        const tibia = limb(
          this.style.tibia,
          femur.x,
          femur.y,
          tibiaAngle,
          leg.tibiaLength,
          {
            face: "bold"
          }
        );
        const claw = limb(",", tibia.x, tibia.y, tibiaAngle + 25 * DEG, 8, {
          face: "bold",
          rot: Math.PI
        });
        for (const p of [femur.part, tibia.part, claw.part]) {
          parts.push(side > 0 ? p : mirror(p));
        }
      }
    });
    return parts;
  }

  private body(): Part[] {
    const parts: Part[] = [];
    const { style } = this;
    const sway = Math.sin(this.clock * (this.pause > 0 ? 5 : 3)) * 0.22;

    // Antennae: a stalk with a fanned club.
    const stalk = limb("f", 7, -63, -62 * DEG + sway, 17, { face: "italic" });
    const club = part("*", stalk.x, stalk.y, 8, {
      face: "bold",
      rot: sway * 2
    });
    parts.push(stalk.part, mirror(stalk.part), club, mirror(club));

    // Head and horn.
    parts.push(part(style.horn, 0, -74, 20, { face: "bold" }));
    parts.push(part(style.head, 0, -58, 18, { face: "bold" }));
    const eye = part(".", 10, -56, 4.5, { face: "bold" });
    parts.push(eye, mirror(eye));

    // Wing cases: nested parentheses make the ridges, shortest outermost so
    // the whole thing rounds off, and a bar down the seam.
    for (let i = 0; i < style.ridges; i++) {
      const t = i / (style.ridges - 1);
      const ridge = part(")", 6 + t * 21, 15 + t * 2, 64 - t * t * 16, {
        face: i === style.ridges - 1 ? "bold" : "regular"
      });
      parts.push(ridge, mirror(ridge));
    }
    parts.push(part("|", 0, 16, 58));
    parts.push(part("v", 0, 47, 9, { face: "bold" }));
    // Pits along the shell.
    for (let row = 0; row < 4; row++) {
      const pit = part(":", 3.2, 0 + row * 11, 5.5);
      parts.push(pit, mirror(pit));
    }

    // Pronotum: a D on its back is a dome. Smaller ones nested inside it
    // fill the hollow with ridges, and a crest sits in the last of them.
    for (const [size, y] of [
      [54, -28],
      [37, -25.5],
      [22, -23.5]
    ]) {
      parts.push(part("D", 0, y, size, { face: "bold", rot: -90 * DEG }));
    }
    parts.push(
      part(style.crest, 0, -36, 13, { fit: "w", color: PAPER, face: "bold" })
    );
    parts.push(part("v", 0, -12, 8, { face: "bold", color: PAPER }));
    return parts;
  }

  pose(): Glyph[] {
    const frame = this.frame();
    return [...this.legs(), ...this.body()].map(p => place(p, frame));
  }

  squish(at: Point, radius: number, env: Env): Creature[] | null {
    // Test the thumb against the shell's ellipse, in the bug's own space.
    const { x, y, heading } = this.wander;
    const rot = heading + Math.PI / 2;
    const dx = at.x - x;
    const dy = at.y - y;
    const lx = (dx * Math.cos(rot) + dy * Math.sin(rot)) / this.scale;
    const ly =
      (-dx * Math.sin(rot) + dy * Math.cos(rot)) / this.scale - HIT_CENTRE_Y;
    const reach = radius / this.scale;
    if (
      (lx / (HIT_HALF_WIDTH + reach)) ** 2 +
        (ly / (HIT_HALF_LENGTH + reach)) ** 2 >
      1
    ) {
      return null;
    }

    const splat = new Splat();
    const centre = { x, y };
    const size = this.scale * DESIGN_LENGTH;
    splat.smear(centre, size * 0.3, Math.round(4 + size / 16));
    splat.burst(
      centre,
      at,
      size * 0.32,
      Math.round(80 + size * 1.1),
      380 + size * 3
    );
    // A few real pieces survive: mostly legs, sometimes a bit of shell.
    for (const glyph of this.pose()) {
      if (glyph.color === PAPER) continue;
      const tough = "EJ}IlYVTW),".includes(glyph.ch);
      if (Math.random() < (tough ? 0.3 : 0.12)) splat.keep(glyph, at, 260);
    }
    env.addSplat(splat);
    this.dead = true;
    return [];
  }
}
