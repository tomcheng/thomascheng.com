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
        <Carousel decorators={customDecorators}>
          {this._getImages()}
        </Carousel>
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
        const buttonClasses = React.addons.classSet({
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
        const buttonClasses = React.addons.classSet({
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
                const buttonClasses = React.addons.classSet({
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
