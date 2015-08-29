import React from "react";
import RandomImage from "components/common/RandomImage.jsx";

export default React.createClass({
  render() {
    return (
      <div className="push-top">
        <RandomImage
          images={[
            require("images/logos/logo_1.jpg"),
            require("images/logos/logo_2.jpg"),
            require("images/logos/logo_3.jpg"),
            require("images/logos/logo_4.jpg"),
            require("images/logos/logo_5.jpg"),
            require("images/logos/logo_6.jpg")
          ]}
        />
      </div>
    );
  },
});
