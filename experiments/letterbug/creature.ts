import type { Glyph } from "./glyphs";
import type { Splat } from "./gore";

export interface Point {
  x: number;
  y: number;
}

/** What a creature can see and do to the world around it. */
export interface Env {
  width: number;
  height: number;
  addSplat(splat: Splat): void;
}

export interface Creature {
  /** Gone: either squished, or wandered off for good. */
  dead: boolean;
  /** Whether it fills one of the population's places. */
  readonly counts: boolean;
  update(dt: number, env: Env): void;
  pose(): Glyph[];
  /**
   * Presses a thumb of `radius` down at `at`. Returns null on a miss;
   * otherwise whatever crawls away from the mess (possibly nothing).
   */
  squish(at: Point, radius: number, env: Env): Creature[] | null;
  /** Something violent happened at `from`. */
  startle(from: Point, reach: number): void;
}

export const rand = (min: number, max: number) =>
  min + Math.random() * (max - min);

export const pick = <T>(items: readonly T[]): T =>
  items[Math.floor(Math.random() * items.length)];

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** The signed shortest turn from one heading to another. */
export const turnTowards = (from: number, to: number) => {
  const diff = (to - from) % (Math.PI * 2);
  if (diff > Math.PI) return diff - Math.PI * 2;
  if (diff < -Math.PI) return diff + Math.PI * 2;
  return diff;
};
