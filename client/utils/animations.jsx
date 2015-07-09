const Animations = {
  props: {
    animations: {},
    animationCount: 0
  },

  stop(name) {
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
      this.stop(name);
    }

    if (!animations[name]) {
      this.props.animationCount++;
      animations[name] = {};
    }
  },

  _getCurrentTime() {
    return new Date().getTime();
  },

  animate(name, start, end, duration, easingFunction, onUpdate, onComplete) {
    const {animations} = this.props;
    const startTime = this._getCurrentTime();
    var timePassed;

    this._registerStart(name);

    const animationLoop = () => {
      if (animations[name]) {
        timePassed = this._getCurrentTime() - startTime;

        if (timePassed >= duration) {
          this.stop(name);
          onUpdate(end);
          if (onComplete) {
            onComplete();
          }
          return;
        }

        onUpdate( (end - start) * easingFunction(timePassed / duration) + start );

        animations[name].raf = window.requestAnimationFrame(animationLoop);
      }
    };
    animationLoop();
  },

  getAnimations() {
    return this.props.animations;
  },

  stopAll() {
    Object.keys(this.props.animations).forEach(name => {
      this.stop(name);
    });
  }
};

export default Animations;
