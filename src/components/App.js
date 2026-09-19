import React from "react";
import { Routes, Route } from "react-router-dom";
import Navigation from "./navigation/Navigation";
import Home from "./route-handlers/Home";
import AcademicWork from "./route-handlers/AcademicWork";
import Games from "./route-handlers/Games";
import Apps from "./route-handlers/Apps";
import Contact from "./route-handlers/Contact";
import Resume from "./route-handlers/Resume";
import NotFound from "./NotFound/NotFoundComponent";
import Container from "./common/Container";

const App = () => (
  <Container>
    <Navigation />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/games" element={<Games />} />
      <Route path="/apps" element={<Apps />} />
      <Route path="/design" element={<AcademicWork />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Container>
);

export default App;
