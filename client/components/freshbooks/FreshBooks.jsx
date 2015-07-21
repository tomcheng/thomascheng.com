import React from "react";

import Comparator from "components/common/Comparator.jsx";
import Carousel from "components/common/Carousel.jsx";
import Comparison from "components/freshbooks/Comparison.jsx";

export default React.createClass({
  render() {
    return (
      <div>
        <div className="push-bottom">
          <Carousel
            description="This helped maintain design consistency across the application."
            images={[
              require("images/freshbooks/styleguide-1.png"),
              require("images/freshbooks/styleguide-2.png"),
              require("images/freshbooks/styleguide-3.png"),
              require("images/freshbooks/styleguide-4.png")
            ]}
            title="Style Guide"
            slug="styleguide" />
        </div>
        {Comparisons.map(comparison => (
          <Comparison key={comparison.slug} {...comparison} />
        ))}
      </div>
    );
  }
});

const Comparisons = [
  {
    slug: "dashboard",
    title: "Dashboard",
    description: "A redesign to make account data more approachable and easier to understand.",
    beforeDimensions: [ 840, 449 ],
    afterDimensions: [ 840, 1074 ]
  },
  {
    slug: "client",
    title: "Client",
    description: "Create a layout that uses the same visual language as the rest of the app.",
    beforeDimensions: [ 840, 714 ],
    afterDimensions: [ 840, 651 ]
  },
  {
    slug: "reports",
    title: "Reports",
    description: "Make reports easier to find and understand.",
    beforeDimensions: [ 1077, 334 ],
    afterDimensions: [ 840, 594 ]
  },
  {
    slug: "timer",
    title: "Timer",
    description: "Design a more friendly and approachable timer for users to track their time.",
    beforeDimensions: [ 840, 660 ],
    afterDimensions: [ 840, 740 ]
  }
];
