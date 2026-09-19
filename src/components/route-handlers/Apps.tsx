import CarouselPage from "../common/CarouselPage";
import imgLetterfall from "../../images/miscellaneous/letterfall.png";
import img0 from "../../images/miscellaneous/insultinstitute.png";

const Apps = () => (
  <CarouselPage
    pieces={[
      {
        type: "link",
        title: "Letterfall",
        url: "https://thomascheng.com/letterfall",
        width: 704,
        height: 468,
        image: imgLetterfall
      },
      {
        type: "link",
        title: "Insult Institute",
        url: "https://insultinstitute.org",
        width: 704,
        height: 468,
        image: img0
      }
    ]}
  />
);

export default Apps;
