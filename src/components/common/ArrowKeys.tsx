import styled from "styled-components";
import Icon from "./Icon";

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
  border: 2px solid rgba(0, 0, 0, 0.1);
  margin: 2px;
  border-radius: 3px;
  color: rgba(0, 0, 0, 0.2);
  font-size: 14px;
`;

const ArrowKeys = () => (
  <div>
    <Row>
      <Key>
        <Icon name="angle-up" />
      </Key>
    </Row>
    <Row>
      <Key>
        <Icon name="angle-left" />
      </Key>
      <Key>
        <Icon name="angle-down" />
      </Key>
      <Key>
        <Icon name="angle-right" />
      </Key>
    </Row>
  </div>
);

export default ArrowKeys;
