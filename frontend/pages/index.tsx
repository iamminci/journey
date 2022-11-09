import Landing from "@components/Landing";
import { useTron } from "@components/TronProvider";
import withTransition from "@components/withTransition";
import Explore from "@components/Explore";

function Home() {
  const { address } = useTron();

  return !address ? <Landing /> : <Explore />;
}

export default withTransition(Home);
