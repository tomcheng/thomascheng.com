import React from 'react';

import Comparator from "components/common/Comparator.jsx";

export default React.createClass({
  propTypes: {
    slug: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    description: React.PropTypes.string.isRequired,
    beforeDimensions: React.PropTypes.array.isRequired,
    afterDimensions: React.PropTypes.array.isRequired
  },

  render() {
    const {slug, title, description, beforeDimensions, afterDimensions} = this.props;

    return (
      <div className="push-bottom">
        <Comparator
          before={{
            url: require("images/freshbooks/" + slug + "-before.png"),
            width: beforeDimensions[0],
            height:beforeDimensions[1]
          }}
          after={{
            url: require("images/freshbooks/" + slug + "-after.png"),
            width: afterDimensions[0],
            height: afterDimensions[1]
          }}
          title={title}
          description={description}
          slug={slug} />
      </div>
    );
  }
});
