import React from "react";

export default React.createClass({
  propTypes: {
    images: React.PropTypes.array.isRequired
  },

  getInitialState() {
    return {
      imageShown: Math.floor(Math.random() * this.props.images.length)
    };
  },

  _handleClick() {
    this.setState({
      imageShown: (this.state.imageShown + 1) % this.props.images.length
    });
  },

  render() {
    const {images} = this.props,
          {imageShown} = this.state;

    return (
      <div onClick={this._handleClick} style={{ cursor: "pointer" }}>
        {images.map((image, i) => (
          <img key={i} style={{
            width: "100%",
            display: imageShown === i ? "block" : "none"
          }} src={image} />
        ))}
      </div>
    );
  }
});
