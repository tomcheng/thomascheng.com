import React from "react";
import CarouselPage from "../common/CarouselPage";

const UiUx = ({ isMobile }) => (
  <CarouselPage
    pieces={[
      {
        type: "carousel",
        title: "QCloud",
        width: 1024,
        height: 768,
        images: [
          require("../../images/qcloud/forms-after.png"),
          require("../../images/qcloud/form-creation-after.png"),
          require("../../images/qcloud/sheet-filling-landscape-after.png")
        ]
      },
      {
        type: "carousel",
        title: "FreshBooks",
        width: 840,
        height: 710,
        images: [
          require("../../images/freshbooks/dashboard-after.png"),
          require("../../images/freshbooks/client-after.png"),
          require("../../images/freshbooks/reports-after.png"),
          require("../../images/freshbooks/timer-after.png")
        ]
      },
      {
        type: "carousel",
        title: "FreshBooks Style Guide",
        width: 1080,
        height: 660,
        images: [
          require("../../images/freshbooks/styleguide-1.png"),
          require("../../images/freshbooks/styleguide-2.png"),
          require("../../images/freshbooks/styleguide-3.png"),
          require("../../images/freshbooks/styleguide-4.png")
        ]
      }
    ]}
  />
);

export default UiUx;
