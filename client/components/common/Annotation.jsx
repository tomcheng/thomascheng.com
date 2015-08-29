import React from "react";
import TouchHandler from "components/common/TouchHandler.jsx";

export default React.createClass({
  propTypes: {
    annotation: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return { tooltipIsShowing: false };
  },

  componentDidMount() {
    this._bodyEl = document.getElementsByTagName('body')[0];
    this._renderTooltip();
  },

  componentDidUpdate() {
    this._renderTooltip();
  },

  componentWillUnmount() {
    React.unmountComponentAtNode(this._tooltipTarget);

    if (this._tooltipTarget) {
      document.body.removeChild(this._tooltipTarget);
      this._tooltipTarget = null;
    }
  },

  _renderTooltip() {
    const boundingBox = React.findDOMNode(this.refs.indicator).getBoundingClientRect();

    if (!this._tooltipTarget) {
      this._mountTooltipTarget();
    }

    React.render(
      <Tooltip
        top={boundingBox.top + this._bodyEl.scrollTop + boundingBox.height / 2}
        left={boundingBox.left + boundingBox.width / 2}
        message={this.props.annotation.message}
        isShowing={this.state.tooltipIsShowing}
      />,
      this._tooltipTarget
    );
  },

  _mountTooltipTarget() {
    this._tooltipTarget = document.createElement('div');
    document.body.appendChild(this._tooltipTarget);
  },

  _handleClick(evt) {
    this.setState({ tooltipIsShowing: !this.state.tooltipIsShowing });
  },

  render() {
    const {left, top, message} = this.props.annotation;

    return (
      <TouchHandler
        onTap={this._handleClick}
        stopPropagation>
        <div
          ref="indicator"
          className="annotation-indicator"
          style={{
            left: (left * 100) + "%",
            top: (top * 100) + "%"
          }}
        />
      </TouchHandler>
    );
  },
});

const Tooltip = React.createClass({
  propTypes: {
    isShowing: React.PropTypes.bool,
    message: React.PropTypes.node,
    left: React.PropTypes.number,
    top: React.PropTypes.number
  },

  getInitialState() {
    return {
      width: 0,
      height: 0
    };
  },

  componentDidMount() {
    const box = React.findDOMNode(this).getBoundingClientRect();

    this.setState({
      width: box.width,
      height: box.height
    });
  },

  render() {
    const {isShowing, message, top, left} = this.props,
          {width, height} = this.state;

    return (
      <div className="annotation-tooltip" style={{
        left: left,
        top: top,
        opacity: isShowing ? 1 : 0,
        marginLeft: -width / 2,
        marginTop: -height - 20
      }}>
        {message}
      </div>
    );
  }
});
