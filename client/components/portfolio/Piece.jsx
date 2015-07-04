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
        <Carousel
          images={this._getImages()} />
        <h4 className="piece__title">{title}</h4>
        <div className="piece__description">{description}</div>
      </div>
    );
  }
});

const customDecorators = [
  {
    component: React.createClass({
      render() {
        const buttonClasses = classNames({
          'carousel__button': true,
          'carousel__button--is-disabled': this.props.currentSlide === 0
        });
        return (
          <button
            className={buttonClasses}
            onClick={this.props.previousSlide}>
            <i className='fa fa-long-arrow-left' />
          </button>
        )
      }
    }),
    position: 'CenterLeft'
  },
  {
    component: React.createClass({
      render() {
        const buttonClasses = classNames({
          'carousel__button': true,
          'carousel__button--is-disabled': this.props.currentSlide + this.props.slidesToScroll >= this.props.slideCount
        });
        return (
          <button
            className={buttonClasses}
            onClick={this.props.nextSlide}>
            <i className='fa fa-long-arrow-right' />
          </button>
        )
      }
    }),
    position: 'CenterRight'
  },
  {
    component: React.createClass({
      render() {
        var self = this;
        var indexes = this.getIndexes(self.props.slideCount, self.props.slidesToScroll);
        return (
          <ul className='carousel__indicators'>
            {
              indexes.map(function(index) {
                const buttonClasses = classNames({
                  'carousel__indicator__button': true,
                  'carousel__indicator__button--is-active': self.props.currentSlide === index
                });
                return (
                  <li className='carousel__indicator' key={index}>
                    <button
                      className={buttonClasses}
                      onClick={self.props.goToSlide.bind(null, index)}>
                      &bull;
                    </button>
                  </li>
                )
              })
            }
          </ul>
        )
      },
      getIndexes(count, inc) {
        var arr = [];
        for (var i = 0; i < count; i += inc) {
          arr.push(i);
        }
        return arr;
      }
    }),
    position: 'BottomCenter'
  }

];
