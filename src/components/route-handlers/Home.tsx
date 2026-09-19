import withResponsiveness from "../../higher-order-components/withResponsiveness";
import HomeMobile from "./HomeMobile";
import HomeDesktop from "./HomeDesktop";

type HomeProps = {
  isMobile: boolean;
};

const Home = ({ isMobile }: HomeProps) => (isMobile ? <HomeMobile /> : <HomeDesktop />);

export default withResponsiveness(Home);
