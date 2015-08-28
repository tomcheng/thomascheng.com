import React from "react";
import BeforeAfter from "components/common/BeforeAfter.jsx";
import TwoUp from "components/common/TwoUp.jsx";
import PageFooter from "components/common/PageFooter.jsx";

export default React.createClass({
  propTypes: {
    isMobile: React.PropTypes.bool
  },

  render() {
    const {isMobile} = this.props,
          Component = isMobile ? BeforeAfter : TwoUp;

    return (
      <div>
        {freshbooks.map((comparison, i) => (
          <div key={comparison.slug}>
            <Component
              before={{
                url: require("images/freshbooks/" + comparison.slug + "-before.png"),
                width: comparison.beforeDimensions[0],
                height: comparison.beforeDimensions[1]
              }}
              after={{
                url: require("images/freshbooks/" + comparison.slug + "-after.png"),
                width: comparison.afterDimensions[0],
                height: comparison.afterDimensions[1]
              }}
              description={comparison.description}
              annotations={comparison.annotations}
              title={comparison.title}
              slug={comparison.slug}
              isMobile={isMobile}
            />
            {i !== freshbooks.length - 1 ? <hr className="divider--short" /> : null}
          </div>
        ))}
        <PageFooter />
      </div>
    );
  }
});

const freshbooks = [
  {
    slug: "dashboard",
    title: "FreshBooks Dashboard",
    beforeDimensions: [ 840, 449 ],
    afterDimensions: [ 840, 1074 ]
  },
  {
    slug: "reports",
    title: "FreshBooks Reports Page",
    beforeDimensions: [ 1077, 334 ],
    afterDimensions: [ 840, 594 ]
  },
  {
    slug: "client",
    title: "FreshBooks Client Page",
    beforeDimensions: [ 840, 714 ],
    afterDimensions: [ 840, 651 ]
  },
  {
    slug: "timer",
    title: "FreshBooks Time-tracker",
    beforeDimensions: [ 840, 660 ],
    afterDimensions: [ 840, 740 ]
  }
];
