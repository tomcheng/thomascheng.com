const Animations = {
  props: {
    animations: {}
  },

  _registerStart(name) {
    const {animations} = this.props;

    if (animations[name]) {
      this.stop(name);
    }

    if (!animations[name]) {
      animations[name] = {};
    }
  },

  _getCurrentTime() {
    return new Date().getTime();
  },

  stop(name) {
    const {animations} = this.props;

    if (animations[name]) {
      if (animations[name].raf) {
        window.cancelAnimationFrame(animations[name].raf);
      }
      delete animations[name];
    }
  },

  animate({name, start, end, duration, easing, onUpdate}) {
    const {animations} = this.props,
          startTime = this._getCurrentTime();
    let timePassed;

    this._registerStart(name);

    const animationLoop = () => {
      if (animations[name]) {
        timePassed = this._getCurrentTime() - startTime;

        if (timePassed >= duration) {
          this.stop(name);
          onUpdate(end);
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
