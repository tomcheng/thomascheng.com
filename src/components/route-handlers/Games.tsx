import CarouselPage from "../common/CarouselPage";
import img0 from "../../images/miscellaneous/socks.png";
import img1 from "../../images/miscellaneous/dumpling-run.png";
import img2 from "../../images/miscellaneous/zenhues.png";
import img3 from "../../images/miscellaneous/bunch-of-quotes.png";
import img4 from "../../images/miscellaneous/blockturnal.png";
import img5 from "../../images/miscellaneous/voronoia.png";
import img6 from "../../images/miscellaneous/roshamboai.png";

const Games = () => (
  <CarouselPage
    pieces={[
      {
        type: "link",
        title: "Socks",
        url: "https://gameswithstrangers.com",
        width: 704,
        height: 468,
        image: img0
      },
      {
        type: "link",
        title: "Dumpling Run",
        url: "https://dumplingrun.com",
        width: 704,
        height: 468,
        image: img1
      },
      {
        type: "link",
        title: "Zen Hues",
        url: "https://zenhues.com",
        width: 704,
        height: 468,
        image: img2
      },
      {
        type: "link",
        title: "Bunch of Quotes",
        url: "https://bunchofquotes.com",
        width: 704,
        height: 468,
        image: img3
      },
      {
        type: "link",
        title: "Blockturnal",
        url: "https://blockturnal.com",
        width: 704,
        height: 468,
        image: img4
      },
      {
        type: "link",
        title: "Voronoia",
        url: "https://voronoia.com",
        width: 704,
        height: 468,
        image: img5
      },
      {
        type: "link",
        title: "Roshambo AI",
        url: "https://roshamboai.com",
        width: 704,
        height: 468,
        image: img6
      }
    ]}
  />
);

export default Games;
