import React from "react";
import BeforeAfter from "components/common/BeforeAfter.jsx";
import Carousel from "components/common/Carousel.jsx";
import PageFooter from "components/common/PageFooter.jsx";

export default React.createClass({
  render() {
    return (
      <div>
        <h2>QCloud</h2>
        <div className="push-bottom">
          QCloud is a quality control solution designed for packagers and manufacturers.
        </div>
        {qcloud.map((comparison, i) => (
          <div key={comparison.slug} className="push-bottom">
            <BeforeAfter
              before={{
                url: require("images/qcloud/" + comparison.slug + "-before.png"),
                width: comparison.beforeDimensions[0],
                height: comparison.beforeDimensions[1]
              }}
              after={{
                url: require("images/qcloud/" + comparison.slug + "-after.png"),
                width: comparison.afterDimensions[0],
                height: comparison.afterDimensions[1]
              }}
              description={comparison.description}
              annotations={comparison.annotations}
              title={comparison.title}
              slug={comparison.slug}
              showBrowserChrome={true}
            />
          </div>
        ))}

        <hr className="divider--short" />

        <h2>FreshBooks</h2>
        <div className="push-bottom">
          FreshBooks is a cloud-based accounting software service designed for
          small business owners and serves over five million users world-wide.
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

const qcloud = [
  {
    slug: "forms",
    title: "Forms Page",
    beforeDimensions: [ 1024, 768 ],
    afterDimensions: [ 1024, 768 ]
  },
  {
    slug: "form-creation",
    title: "Form Creation",
    beforeDimensions: [ 1024, 768 ],
    afterDimensions: [ 1024, 768 ]
  },
  {
    slug: "inspector-view",
    title: "Inspector View",
    beforeDimensions: [ 768, 950 ],
    afterDimensions: [ 768, 950 ]
  }
];

const freshbooks = [
  {
    slug: "dashboard",
    title: "Dashboard",
    beforeDimensions: [ 840, 449 ],
    afterDimensions: [ 840, 710 ]
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
  // {
  //   slug: "timer",
  //   title: "Time-tracker",
  //   beforeDimensions: [ 840, 660 ],
  //   afterDimensions: [ 840, 740 ]
  // }
];
