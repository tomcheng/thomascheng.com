import React from "react";
import breakpoints from "../utils/breakpoints";

const withResponsiveness = Target =>
  class extends React.Component {
    state = {
      isMobile: window.innerWidth <= breakpoints.xs.max
    };

    componentDidMount() {
      window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
      window.removeEventListener("resize", this.handleResize);
    }

    handleResize = () => {
      const isMobile = window.innerWidth <= breakpoints.xs.max;

      if (isMobile !== this.state.isMobile) {
        this.setState({ isMobile });
      }
    };

    render() {
      return <Target {...this.props} {...this.state} />;
    }
  };

export default withResponsiveness;
