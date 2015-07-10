import React from 'react';
import classNames from 'classnames';

import Carousel from 'components/carousel/Carousel.jsx';

export default React.createClass({
  propTypes: {
    description: React.PropTypes.string,
    imageCount: React.PropTypes.number,
    slug: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired
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
    const {description, slug, title} = this.props;

    return (
      <div style={{ marginBottom: 30}}>
        <Carousel
          description={description}
          images={this._getImages()}
          slug={slug}
          title={title} />
      </div>
    );
  }
});
