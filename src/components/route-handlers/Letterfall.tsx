import { useEffect, useRef } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { createLettersWorld } from "../letterfall/lettersWorld";

// The rest of the site scrolls under a fixed nav; this page is a fixed,
// full-bleed surface, so it undoes the body offsets and pins the viewport for
// as long as it is mounted.
const PageStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    overflow: hidden;
    overscroll-behavior: none;
  }

  body {
    position: fixed;
    inset: 0;
    padding-top: 0 !important;
    background-color: #fcfcfa;
  }
`;

const Surface = styled.canvas`
  position: fixed;
  inset: 0;
  display: block;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
`;

const Letterfall = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Letterfall";
    const debug = new URLSearchParams(window.location.search).has("debug");
    const world = createLettersWorld(canvasRef.current!, { debug });
    return () => {
      world.destroy();
      document.title = previousTitle;
    };
  }, []);

  return (
    <>
      <PageStyle />
      <Surface
        ref={canvasRef}
        role="img"
        aria-label="Hold a finger down in open space to pour letters; touch a letter to pop it."
      />
    </>
  );
};

export default Letterfall;
