import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Container = styled.div`
  cursor: pointer;
`;

const Image = styled.img`
  width: 100%;
  display: ${props => props.visible ? "block" : "none"}
`;

class RandomImage extends React.Component {
  static propTypes = {
    images: PropTypes.array.isRequired,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      imageShown: Math.floor(Math.random() * this.props.images.length),
    };
  }

  handleClick = () => {
    this.setState({
      imageShown: (this.state.imageShown + 1) % this.props.images.length,
    });
  };

  render() {
    const { images, className } = this.props;
    const { imageShown } = this.state;

    return (
      <Container onClick={this.handleClick} className={className}>
        {images.map((image, i) => (
          <Image key={image} visible={imageShown === i} src={image} />
        ))}
      </Container>
    );
  }
}

export default RandomImage;
