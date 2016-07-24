import React from "react";
import breakpoints from "utils/breakpoints";

const withResponsiveness = Target => class extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isMobile: window.innerWidth <= breakpoints.xs.max,
      isMdAndUp: window.innerWidth > breakpoints.md.min,
    };
  }

  componentDidMount () {
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount () {
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize = () => {
    const isMobile = window.innerWidth <= breakpoints.xs.max;
    const isMdAndUp = window.innerWidth > breakpoints.md.min;

    if (isMobile !== this.state.isMobile || isMdAndUp !== this.state.isMdAndUp) {
      this.setState({ isMobile, isMdAndUp });
    }
  };

  render () {
    return <Target {...this.props} {...this.state} />;
  }
};

export default withResponsiveness;
