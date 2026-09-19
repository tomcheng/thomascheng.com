import "./style.css";
import { createBugWorld } from "./world";

const canvas = document.getElementById("surface") as HTMLCanvasElement;
const params = new URLSearchParams(window.location.search);

// ?debug adds a HUD; ?zoo shows one large specimen of each species instead of
// a population, for working on how they look.
createBugWorld(canvas, { debug: params.has("debug"), zoo: params.has("zoo") });
