import React from "react";
import Navigation from "./components/navigation/Navigation";

const links = [
  {
    path: "/work",
    title: "Work",
  },
  {
    path: "/academic-work",
    title: "Academic Work",
  },
  {
    path: "/miscellany",
    title: "Miscellany",
  },
  {
    path: "/contact",
    title: "Contact",
    hiddenOnMobile: true,
  },
];

class App extends React.Component {
  constructor (props) {
    super(props);

    this.state = { windowWidth: 0 };
  }

  componentDidMount () {
    this.getWindowWidth();
    window.addEventListener("resize", this.getWindowWidth);
  }

  componentWillUnmount () {
    window.removeEventListener("resize", this.getWindowWidth);
  }

  getWindowWidth = () => {
    this.setState({ windowWidth: window.innerWidth });
  };

  render () {
    const { windowWidth } = this.state;

    return (
      <div className="container">
        <Navigation links={links} location={this.props.location} />
        {React.cloneElement(this.props.children, { windowWidth })}
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.element.isRequired,
  location: React.PropTypes.shape({
    pathname: React.PropTypes.string.isRequired,
  }).isRequired,
};

export default App;
