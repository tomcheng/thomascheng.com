import React from "react";
import BeforeAfter from "components/common/BeforeAfter.jsx";
import TwoUp from "components/common/TwoUp.jsx";
import Carousel from "components/common/Carousel.jsx";
import PageFooter from "components/common/PageFooter.jsx";
import breakPoints from "utils/breakpoints.jsx";

export default React.createClass({
  propTypes: {
    windowWidth: React.PropTypes.number.isRequired
  },

  render() {
    const {windowWidth} = this.props,
          Component = windowWidth <= breakPoints.sm.max ? BeforeAfter : TwoUp;

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
            />
            <hr className="divider--short" />
          </div>
        ))}
        <Carousel
          images={[
            require("images/freshbooks/styleguide-1.png"),
            require("images/freshbooks/styleguide-2.png"),
            require("images/freshbooks/styleguide-3.png"),
            require("images/freshbooks/styleguide-4.png")
          ]}
          slug="style-guide"
          title="FreshBooks Style Guide"
        />
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
    afterDimensions: [ 840, 1074 ],
    annotations: [
      {
        message: (
          <div style={{ width: 200 }}>
            One of FreshBooks core tenets is getting users paid, so this information was brought to the forefront.
          </div>
        ),
        top: 0.095,
        left: 0.73
      },
      {
        message: "Show Tooltip",
        top: 0.36,
        left: 0.763
      }
    ]
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
