import React from "react";
import BeforeAfter from "components/common/BeforeAfter.js";
import Carousel from "components/common/Carousel.js";
import PageFooter from "components/common/PageFooter.js";
import breakpoints from "utils/breakpoints.js";

const WorkWork = ({ windowWidth }) => {
  const isMd = windowWidth > breakpoints.md.min;
  const isMobile = windowWidth <= breakpoints.xs.max;

  return (
    <div>
      <h2>QCloud</h2>
      <div className="push-bottom">
        QCloud is a quality control solution designed for contract packagers and manufacturers.
      </div>
      {qcloud.map((comparison, i) => (
        <div key={comparison.slug} className="push-bottom">
          <BeforeAfter
            before={{
              url: require("images/qcloud/" + comparison.slug + "-before.png"),
              width: comparison.beforeDimensions[0],
              height: comparison.beforeDimensions[1],
            }}
            after={{
              url: require("images/qcloud/" + comparison.slug + "-after.png"),
              width: comparison.afterDimensions[0],
              height: comparison.afterDimensions[1],
            }}
            description={comparison.description}
            title={comparison.title}
            slug={comparison.slug}
            showBrowserChrome
          />
        </div>
      ))}
      <div className="push-bottom">
        <BeforeAfter
          before={{
            url: isMd
              ? require("images/qcloud/sheet-filling-landscape-before.png")
              : require("images/qcloud/sheet-filling-before.png"),
            width: isMd ? 1024 : 768,
            height: isMd ? 768 : 640,
          }}
          after={{
            url: isMd
              ? require("images/qcloud/sheet-filling-landscape-after.png")
              : require("images/qcloud/sheet-filling-after.png"),
            width: isMd ? 1024 : 768,
            height: isMd ? 768 : 640,
          }}
          description={"Make form filling more obvious and less error-prone " +
            "by using buttons instead of dropdowns for Pass/Fail checks."}
          title="Sheet Filling"
          slug="sheet-filling"
          showBrowserChrome
        />
      </div>

      <hr className="divider--short" />

      <h2>FreshBooks</h2>
      <div className="push-bottom">
        FreshBooks is a cloud-based accounting software service designed for
        small business owners and serves over five million users world-wide.
      </div>
      <div className="push-bottom">
        <Carousel
          slug="style-guide"
          title="Style Guide"
          description={"Develop a playful yet straightforward visual language " +
            "for the application and provide a resource to enforce consistency."}
          images={[
            require("images/freshbooks/styleguide-1.png"),
            require("images/freshbooks/styleguide-2.png"),
            require("images/freshbooks/styleguide-3.png"),
            require("images/freshbooks/styleguide-4.png"),
          ]}
          width={1080}
          height={660}
          isMobile={isMobile}
        />
      </div>
      {freshbooks.map((comparison, i) => (
        <div key={comparison.slug} className="push-bottom">
          <BeforeAfter
            before={{
              url: require("images/freshbooks/" + comparison.slug + "-before.png"),
              width: comparison.beforeDimensions[0],
              height: comparison.beforeDimensions[1],
            }}
            after={{
              url: require("images/freshbooks/" + comparison.slug + "-after.png"),
              width: comparison.afterDimensions[0],
              height: comparison.afterDimensions[1],
            }}
            description={comparison.description}
            title={comparison.title}
            slug={comparison.slug}
          />
        </div>
      ))}
      <PageFooter />
    </div>
  );
};

WorkWork.propTypes = {
  windowWidth: React.PropTypes.number.isRequired,
};

export default WorkWork;

const qcloud = [
  {
    slug: "forms",
    title: "Forms Page",
    description: "Simplify the user interface and reduce unnecessary " +
      "information to make the content more approachable.",
    beforeDimensions: [ 1024, 768 ],
    afterDimensions: [ 1024, 768 ],
  },
  {
    slug: "form-creation",
    title: "Form Creation",
    description: "Make form creation more intuitive by providing a WYSIWYG interface.",
    beforeDimensions: [ 1024, 768 ],
    afterDimensions: [ 1024, 768 ],
  },
];

const freshbooks = [
  {
    slug: "dashboard",
    title: "Dashboard",
    description: "Show users pertinent information from their account and " +
      "give them insight into how their business is doing.",
    beforeDimensions: [ 840, 449 ],
    afterDimensions: [ 840, 710 ],
  },
  {
    slug: "reports",
    title: "Reports Page",
    description: "Add descriptions and organize reports so they are more " +
      "understandable and less over-whelming.",
    beforeDimensions: [ 1077, 334 ],
    afterDimensions: [ 840, 594 ],
  },
  {
    slug: "client",
    title: "Client Page",
    description: "Simplify elements on the page to make it friendlier and " +
      "visually consistent with the rest of the application.",
    beforeDimensions: [ 840, 714 ],
    afterDimensions: [ 840, 651 ],
  },
];
