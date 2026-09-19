import React from "react";
import breakpoints from "../utils/breakpoints";

type WithResponsivenessProps = { isMobile: boolean };

type WithResponsivenessState = { isMobile: boolean };

function withResponsiveness<P extends WithResponsivenessProps>(
  Target: React.ComponentType<P>
): React.ComponentType<Omit<P, "isMobile">> {
  return class extends React.Component<
    Omit<P, "isMobile">,
    WithResponsivenessState
  > {
    state: WithResponsivenessState = {
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
      return <Target {...(this.props as P)} {...this.state} />;
    }
  };
}

export default withResponsiveness;
