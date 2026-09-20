import "./style.css";
import { createLettersWorld } from "./lettersWorld";
import { showNutrient } from "./nutrient";

const canvas = document.getElementById("surface") as HTMLCanvasElement;
// ?debug draws the collision outlines and a cost readout, and binds "p" to
// pop every letter at once.
const debug = new URLSearchParams(window.location.search).has("debug");
const nutrient = showNutrient();
createLettersWorld(canvas, { debug, onDrain: nutrient.add });
