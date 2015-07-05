import React from 'react';
import classNames from 'classnames';

import Carousel from 'components/carousel/Carousel.jsx';

export default React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    description: React.PropTypes.string,
    slug: React.PropTypes.string.isRequired,
    imageCount: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      description: '',
      imageCount: 1
    };
  },

  _getImages() {
    const {slug, imageCount} = this.props,
          images = [];

    for (let i = 0; i < imageCount; i++) {
      images.push(
        require("images/" + slug + "-" + (i + 1) + ".jpg")
      );
    }

    return images;
  },

  render() {
    const {title, description} = this.props;

    return (
      <div className="piece">
        <div className="carousel-wrapper">
          <Carousel
            images={this._getImages()} />
        </div>
        <h4 className="piece__title">{title}</h4>
        <div className="piece__description">{description}</div>
      </div>
    );
  }
});
