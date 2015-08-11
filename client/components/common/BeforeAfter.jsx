import React from "react";
import classNames from "classnames";
import Animations from 'utils/animations.jsx';
import Easings from 'utils/easings.jsx';

export default React.createClass({
  propTypes: {
    before: React.PropTypes.object.isRequired,
    after: React.PropTypes.object.isRequired,
    description: React.PropTypes.string.isRequired,
    slug: React.PropTypes.string.isRequired
  },

  getInitialState() {
    return {
      showing: 'after',
      width: 0
    };
  },

  componentDidMount() {
    this._setDimensions();

    window.addEventListener('resize', this._setDimensions);
    window.addEventListener('orientationchange', this._setDimensions);
    window.addEventListener('scroll', this._setFixed);
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this._setDimensions);
    window.removeEventListener('orientationchange', this._setDimensions);
    window.removeEventListener('scroll', this._setFixed);
  },

  _setDimensions() {
    this.setState({ width: React.findDOMNode(this.refs.frame).offsetWidth });
  },

  _switchToBefore() {
    this.setState({ showing: "before" });
  },

  _switchToAfter() {
    this.setState({ showing: "after" });
  },

  _toggleShowing() {
    this.setState({ showing: this.state.showing === "before" ? "after" : "before" });
  },

  render() {
    const {before, after, title, description} = this.props,
          {showing, width} = this.state,
          aspectRatio = Math.max(before.height/before.width, after.height/after.width),
          height = Math.ceil(aspectRatio * width);

    return (
      <div>
        <div className="push-bottom-xs">
          <h4>{title}</h4>
          <div>{description}</div>
        </div>
        <div className="before-after__buttons">
          <div
            onClick={this._switchToBefore}
            className={classNames("before-after__button", {
              "is-active": showing === "before"
            })}>
            Before
          </div>
          <div
            onClick={this._switchToAfter}
            className={classNames("before-after__button", {
              "is-active": showing === "after"
            })}>
            After
          </div>
        </div>
        <div className="before-after" onClick={this._toggleShowing}>
          <div className="before-after__frame" ref="frame" style={{ height }}>
            <div
              className={classNames("before-after__image-wrapper", {
                "is-active": showing === "before"
              })}>
              <img className="before-after__image" src={before.url} />
            </div>
            <div
              className={classNames("before-after__image-wrapper", {
                "is-active": showing === "after"
              })}>
              <img className="before-after__image" src={after.url} />
            </div>
          </div>
        </div>
      </div>
    );
  }
});
