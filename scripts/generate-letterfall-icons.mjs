import sharp from "sharp";

// Renders Letterfall's app icons from its one hand-written source, the SVG
// that also serves as the favicon. Run after editing that file:
//   node scripts/generate-letterfall-icons.mjs
const DIR = "experiments/letterfall/public";
const SOURCE = `${DIR}/icon.svg`;
const BACKGROUND = "#fcfcfa";

const render = size => sharp(SOURCE, { density: 300 }).resize(size, size);

await render(192).png().toFile(`${DIR}/icon-192.png`);
await render(512).png().toFile(`${DIR}/icon-512.png`);
// iOS rounds the corners itself, and wants no transparency.
await render(180).flatten({ background: BACKGROUND }).png().toFile(
  `${DIR}/apple-touch-icon.png`
);
// A maskable icon may be cropped to a circle 80% across, so the artwork is
// drawn smaller on a full bleed of the page colour.
const inset = Math.round(512 * 0.07);
await render(512 - inset * 2)
  .extend({
    top: inset,
    bottom: inset,
    left: inset,
    right: inset,
    background: BACKGROUND,
  })
  .png()
  .toFile(`${DIR}/icon-maskable-512.png`);
