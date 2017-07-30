import React from "react";
import styled from "styled-components";

const Row = styled.div`
  display: flex;
  justify-content: center;
`;
const Key = styled.div`
  display: flex;
  width: 25px;
  height: 25px;
  justify-content: center;
  align-items: center;
  border: 2px solid rgba(0,0,0,0.1);
  margin: 2px;
  border-radius: 3px;
  color: rgba(0,0,0,0.2);
  font-size: 14px;
`;

const ArrowKeys = () =>
  <div>
    <Row>
      <Key>
        <i className="fa fa-angle-up" />
      </Key>
    </Row>
    <Row>
      <Key>
        <i className="fa fa-angle-left" />
      </Key>
      <Key>
        <i className="fa fa-angle-down" />
      </Key>
      <Key>
        <i className="fa fa-angle-right" />
      </Key>
    </Row>
  </div>;

export default ArrowKeys;
