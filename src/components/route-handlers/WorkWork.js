import React from "react";
import CarouselPage from "../common/CarouselPage";

const WorkWork = ({ isMobile }) =>
  <CarouselPage
    groups={[
      {
        title: "QCloud",
        description:
          "QCloud is a quality control application for packagers and manufacturers. The " +
          "application was redesigned to make workflows simpler and less error prone while " +
          "adopting a more modern aesthetic.",
        pieces: [
          {
            type: "carousel",
            title: "QCloud Redesign",
            width: 1024,
            height: 768,
            images: [
              require("../../images/qcloud/forms-after.png"),
              require("../../images/qcloud/form-creation-after.png"),
              require("../../images/qcloud/sheet-filling-landscape-after.png"),
            ]
          }
        ]
      },
      {
        title: "FreshBooks",
        description:
          "FreshBooks is an invoicing/accounting solution for small business owners. " +
          "A style guide was developed and a consistent visual language was applied " +
          "throughout the application.",
        pieces: [
          {
            type: "carousel",
            title: "Style Guide",
            width: 1080,
            height: 660,
            images: [
              require("../../images/freshbooks/styleguide-1.png"),
              require("../../images/freshbooks/styleguide-2.png"),
              require("../../images/freshbooks/styleguide-3.png"),
              require("../../images/freshbooks/styleguide-4.png")
            ]
          },
          {
            type: "carousel",
            title: "Web App Redesign",
            width: 840,
            height: 710,
            images: [
              require("../../images/freshbooks/dashboard-after.png"),
              require("../../images/freshbooks/client-after.png"),
              require("../../images/freshbooks/reports-after.png"),
              require("../../images/freshbooks/timer-after.png")
            ]
          }
        ]
      }
    ]}
  />;

export default WorkWork;
