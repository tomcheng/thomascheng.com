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

  animate(name, start, end, duration, easing, onUpdate, onComplete) {
    const {animations} = this.props;
    const startTime = this._getCurrentTime();
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
  }
};

export default Animations;
