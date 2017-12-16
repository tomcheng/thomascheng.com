import React from "react";
import styled from "styled-components";
import NudgeBottom from "../common/NudgeBottom";

const Container = styled.div`
  text-align: center;
  margin-top: 25px;
`;

const Contact = () => (
  <Container>
    <NudgeBottom>
      <h4>Thank you for your interest.</h4>
    </NudgeBottom>
    The best way to contact me is by email:&nbsp;
    <a href="mailto:info@thomascheng.com">info@thomascheng.com</a>
  </Container>
);

export default Contact;
