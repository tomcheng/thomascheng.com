import React from "react";
import BeforeAfter from "components/common/BeforeAfter.jsx";
import Carousel from "components/common/Carousel.jsx";
import PageFooter from "components/common/PageFooter.jsx";

export default React.createClass({
  render() {
    return (
      <div>
        <h2>FreshBooks</h2>
        <div className="push-bottom">
          FreshBooks is a cloud-based accounting software service designed for
          small business owners and serves over five million users.
        </div>
        <div className="push-bottom">
          <Carousel
            images={[
              require("images/freshbooks/styleguide-1.png"),
              require("images/freshbooks/styleguide-2.png"),
              require("images/freshbooks/styleguide-3.png"),
              require("images/freshbooks/styleguide-4.png")
            ]}
            slug="style-guide"
            title="Style Guide"
          />
        </div>
        {freshbooks.map((comparison, i) => (
          <div key={comparison.slug} className="push-bottom">
            <BeforeAfter
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
    title: "Dashboard",
    beforeDimensions: [ 840, 449 ],
    afterDimensions: [ 840, 1074 ]
  },
  {
    slug: "reports",
    title: "Reports Page",
    beforeDimensions: [ 1077, 334 ],
    afterDimensions: [ 840, 594 ]
  },
  {
    slug: "client",
    title: "Client Page",
    beforeDimensions: [ 840, 714 ],
    afterDimensions: [ 840, 651 ]
  },
  {
    slug: "timer",
    title: "Time-tracker",
    beforeDimensions: [ 840, 660 ],
    afterDimensions: [ 840, 740 ]
  }
];
