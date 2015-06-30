import React from 'react/addons';

import Carousel from 'nuka-carousel';

export default React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    description: React.PropTypes.string,
    slug: React.PropTypes.string.isRequired,
    images: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      description: '',
      images: 1
    };
  },

  _getImages() {
    const {slug, images} = this.props;
    let imageObjects = [];

    for (let i = 0; i < images; i++) {
      imageObjects.push(
        <img key={i} src={require("images/" + slug + "-" + (i + 1) + ".jpg")} />
      );
    }
    return imageObjects;
  },

  render() {
    const {title, description} = this.props;

    return (
      <div className="piece">
        <Carousel>
          {this._getImages()}
        </Carousel>
        <h4 className="piece__title">{title}</h4>
        <div className="piece__description">{description}</div>
      </div>
    );
  }
});
