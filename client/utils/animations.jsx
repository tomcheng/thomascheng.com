const Animations = {
  props: {
    animations: {},
    animationCount: 0
  },

  _stop(name) {
    const {animations} = this.props;

    if (animations[name]) {
      if (animations[name].raf) {
        window.cancelAnimationFrame(animations[name].raf);
      }
      delete animations[name];
      this.props.animationCount--;
    }
  },

  _registerStart(name) {
    const {animations} = this.props;

    if (animations[name]) {
      this._stop(name);
    }

    if (!animations[name]) {
      this.props.animationCount++;
      animations[name] = {};
    }
  },

  _stopAllAnimations() {
    Object.keys(this.props.animations).forEach(name => {
      this._stop(name);
    });
  },

  _getCurrentTime() {
    return new Date().getTime();
  },

  animate(name, start, end, duration, velocity, onUpdate, onComplete) {
    const {animations} = this.props;
    const startTime = this._getCurrentTime();
    const easing = this._getEasingFunction(velocity);
    var timePassed;

    this._registerStart(name);

    const animationLoop = () => {
      if (animations[name]) {
        timePassed = this._getCurrentTime() - startTime;

        if (timePassed >= duration) {
          this._stop(name);
          onUpdate(end);
          if (onComplete) {
            onComplete();
          }
          return;
        }

        onUpdate( (end - start) * easing(timePassed / duration) + start );

        animations[name].raf = window.requestAnimationFrame(animationLoop);
      }
    };
    animationLoop();
  },

  _getEasingFunction(v) {
      return (k) => --k * k * k + 1;
//    return (t) => (v - 2)*t*t*t + (3 - 2*v)*t*t + v*t;
  }

};

export default Animations;
