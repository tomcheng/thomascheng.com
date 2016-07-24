import React from "react";

class RandomImage extends React.Component {
  static propTypes = {
    images: React.PropTypes.array.isRequired,
  };

  constructor (props) {
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

  render () {
    const { images } = this.props;
    const { imageShown } = this.state;

    return (
      <div onClick={this.handleClick} style={{ cursor: "pointer" }}>
        {images.map((image, i) => (
          <img
            key={image}
            style={{
              width: "100%",
              display: imageShown === i ? "block" : "none",
            }}
            src={image}
          />
        ))}
      </div>
    );
  }
}

export default RandomImage;
