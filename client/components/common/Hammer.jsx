import React from 'react';
import Hammer from 'hammerjs';

export default React.createClass({
  displayName: 'Hammer',

  componentDidMount() {
    this.hammer = new Hammer.Manager(React.findDOMNode(this), { recognizers: Hammer.defaults.preset });

    if (this.props.options) {
      Object.keys(this.props.options).forEach(option => {
        if (option === 'recognizers') {
          Object.keys(this.props.options.recognizers).forEach(function(gesture) {
            var recognizer = this.hammer.get(gesture);
            recognizer.set(this.props.options.recognizers[gesture]);
          }, this);
        } else {
          var key = option;
          var optionObj = {};
          optionObj[key] = this.props.options[option];
          this.hammer.set(optionObj);
        }
      });
    }

    if (this.props.requireFailure) {
      Object.keys(this.props.requireFailure).forEach(requirer => {
        var required = this.props.requireFailure[requirer];
        this.hammer.get(requirer).requireFailure(required);
      });
    }

    if (this.props.vertical) {
      this.hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
      this.hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    }

    if (this.props.action)          this.hammer.on('tap press', this.props.action);
    if (this.props.onTap)           this.hammer.on('tap', this.props.onTap);
    if (this.props.onDoubleTap)     this.hammer.on('doubletap', this.props.onDoubleTap);
    if (this.props.onPan)           this.hammer.on('pan', this.props.onPan);
    if (this.props.onSwipe)         this.hammer.on('swipe', this.props.onSwipe);
    if (this.props.onPress)         this.hammer.on('press', this.props.onPress);
    if (this.props.onPinch)         this.hammer.on('pinch', this.props.onPinch);
    if (this.props.onRotate)        this.hammer.on('rotate', this.props.onRotate);
  },

  componentWillUnmount() {
    if (this.hammer) {
        this.hammer.stop();
        this.hammer.destroy();
    }
    this.hammer = null;
  },

  render() {
    return <div>{this.props.children}</div>;
  }

});
