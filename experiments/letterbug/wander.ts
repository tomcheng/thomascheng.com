import { type Env, type Point, clamp, rand, turnTowards } from "./creature";

/** How far inside the edge of the page a confined wanderer tries to stay. */
const INSET = 36;

/**
 * A point that ambles: mostly straight, with lazy turns, heading back towards
 * the middle when it strays past the edge. Both species steer with one.
 */
export class Wander {
  x: number;
  y: number;
  heading: number;
  private turn = 0;
  private untilTurn = 0;
  private home: Point | null = null;

  constructor(x: number, y: number, heading: number) {
    this.x = x;
    this.y = y;
    this.heading = heading;
  }

  advance(
    dt: number,
    speed: number,
    env: Env,
    options: {
      agility: number;
      confined: boolean;
      flee: Point | null;
      drift?: number;
    }
  ) {
    const { agility, confined, flee, drift = 0 } = options;
    let desired: number | null = null;
    let rate = agility * 1.5;

    const outside =
      this.x < INSET ||
      this.y < INSET ||
      this.x > env.width - INSET ||
      this.y > env.height - INSET;

    if (flee) {
      desired = Math.atan2(this.y - flee.y, this.x - flee.x);
      rate = agility * 4;
      // Fleeing straight off the page would empty it; bend along the edge.
      if (confined && outside) desired = null;
    }
    if (desired === null && confined && outside) {
      this.home ??= {
        x: env.width * rand(0.25, 0.75),
        y: env.height * rand(0.25, 0.75)
      };
      desired = Math.atan2(this.home.y - this.y, this.home.x - this.x);
    }
    if (!outside) this.home = null;

    if (desired !== null) {
      const diff = turnTowards(this.heading, desired);
      this.heading += clamp(diff, -rate * dt, rate * dt);
    } else {
      this.untilTurn -= dt;
      if (this.untilTurn <= 0) {
        this.untilTurn = rand(0.4, 1.8);
        this.turn = Math.random() < 0.3 ? 0 : rand(-1, 1) * agility * 0.8;
      }
      this.heading += this.turn * dt;
    }

    const direction = this.heading + drift;
    this.x += Math.cos(direction) * speed * dt;
    this.y += Math.sin(direction) * speed * dt;
  }
}
