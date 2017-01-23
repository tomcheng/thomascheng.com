import React from "react";
import withResponsiveness from "../../higher-order-components/withResponsiveness";
import BeforeAfter from "../common/BeforeAfter";
import Carousel from "../common/Carousel";
import PageFooter from "../common/PageFooter";
import ShortDivider from "../common/ShortDivider";
import PushBottom from "../common/PushBottom";
import NudgeBottom from "../common/NudgeBottom";
import SectionTitle from "../common/SectionTitle";

const QCLOUD = [
  {
    slug: "forms",
    title: "Forms Page Redesign",
    beforeDimensions: [ 1024, 768 ],
    afterDimensions: [ 1024, 768 ],
  },
  {
    slug: "form-creation",
    title: "Form Creation Redesign",
    beforeDimensions: [ 1024, 768 ],
    afterDimensions: [ 1024, 768 ],
  },
];

const FRESHBOOKS = [
  {
    slug: "dashboard",
    title: "Dashboard Redesign",
    beforeDimensions: [ 840, 449 ],
    afterDimensions: [ 840, 710 ],
  },
  {
    slug: "reports",
    title: "Reports Page Redesign",
    beforeDimensions: [ 1077, 334 ],
    afterDimensions: [ 840, 594 ],
  },
  {
    slug: "client",
    title: "Client Page Redesign",
    beforeDimensions: [ 840, 714 ],
    afterDimensions: [ 840, 651 ],
  },
];

const WorkWork = ({ isMobile, isMdAndUp }) => (
  <div>
    <NudgeBottom>
      <SectionTitle>QCloud</SectionTitle>
    </NudgeBottom>
    <PushBottom>
      QCloud is a quality control application for packagers and manufacturers. The application was
      redesigned to make workflows simpler and less error prone while adopting a more modern aesthetic.
    </PushBottom>
    {QCLOUD.map((comparison, i) => (
      <PushBottom key={comparison.slug}>
        <BeforeAfter
          before={{
            url: require("../../images/qcloud/" + comparison.slug + "-before.png"),
            width: comparison.beforeDimensions[0],
            height: comparison.beforeDimensions[1],
          }}
          after={{
            url: require("../../images/qcloud/" + comparison.slug + "-after.png"),
            width: comparison.afterDimensions[0],
            height: comparison.afterDimensions[1],
          }}
          description={comparison.description}
          title={comparison.title}
          slug={comparison.slug}
          showBrowserChrome
        />
      </PushBottom>
    ))}
    <PushBottom>
      <BeforeAfter
        before={{
          url: isMdAndUp
            ? require("../../images/qcloud/sheet-filling-landscape-before.png")
            : require("../../images/qcloud/sheet-filling-before.png"),
          width: isMdAndUp ? 1024 : 768,
          height: isMdAndUp ? 768 : 640,
        }}
        after={{
          url: isMdAndUp
            ? require("../../images/qcloud/sheet-filling-landscape-after.png")
            : require("../../images/qcloud/sheet-filling-after.png"),
          width: isMdAndUp ? 1024 : 768,
          height: isMdAndUp ? 768 : 640,
        }}
        description={"Make form filling more obvious and less error-prone " +
          "by using buttons instead of dropdowns for Pass/Fail checks."}
        title="Sheet Filling"
        slug="sheet-filling"
        showBrowserChrome
      />
    </PushBottom>

    <ShortDivider />

    <NudgeBottom>
      <SectionTitle>FreshBooks</SectionTitle>
    </NudgeBottom>
    <PushBottom>
      FreshBooks is an invoicing/accounting solution for small business owners. A style guide was
      developed and a consistent visual language was applied throughout the application.
    </PushBottom>
    <PushBottom>
      <Carousel
        slug="style-guide"
        title="Style Guide"
        images={[
          require("../../images/freshbooks/styleguide-1.png"),
          require("../../images/freshbooks/styleguide-2.png"),
          require("../../images/freshbooks/styleguide-3.png"),
          require("../../images/freshbooks/styleguide-4.png"),
        ]}
        width={1080}
        height={660}
        isMobile={isMobile}
      />
    </PushBottom>
    {FRESHBOOKS.map((comparison, i) => (
      <PushBottom key={comparison.slug}>
        <BeforeAfter
          before={{
            url: require("../../images/freshbooks/" + comparison.slug + "-before.png"),
            width: comparison.beforeDimensions[0],
            height: comparison.beforeDimensions[1],
          }}
          after={{
            url: require("../../images/freshbooks/" + comparison.slug + "-after.png"),
            width: comparison.afterDimensions[0],
            height: comparison.afterDimensions[1],
          }}
          description={comparison.description}
          title={comparison.title}
          slug={comparison.slug}
        />
      </PushBottom>
    ))}
    <PageFooter />
  </div>
);

WorkWork.propTypes = {
  isMdAndUp: React.PropTypes.bool.isRequired,
  isMobile: React.PropTypes.bool.isRequired,
};

export default withResponsiveness(WorkWork);
