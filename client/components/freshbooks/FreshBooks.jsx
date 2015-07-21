import React from "react";

import Comparator from "components/common/Comparator.jsx";

export default React.createClass({
  render() {
    return (
      <div>
        <Comparator
          before={{
            url: require("images/freshbooks-dashboard-before.png"),
            width: 840,
            height: 775
          }}
          after={{
            url: require("images/freshbooks-dashboard-after.png"),
            width: 840,
            height: 1255
          }}
          description="A redesign to make account data more approachable and easier to understand."
          slug="dashboard" />
        <Comparator
          before={{
            url: require("images/client-before.png"),
            width: 840,
            height: 1318
          }}
          after={{
            url: require("images/client-after.png"),
            width: 840,
            height: 1000
          }}
          description="A redesign to make account data more approachable and easier to understand."
          slug="client" />
      </div>
    );
  }
});
