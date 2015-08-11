import React from "react";

import BeforeAfter from "components/common/BeforeAfter.jsx";

export default React.createClass({
  render() {
    return (
      <div>
        {Comparisons.map(comparison => (
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
              title={comparison.title}
              description={comparison.description}
              slug={comparison.slug} />
          </div>
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
