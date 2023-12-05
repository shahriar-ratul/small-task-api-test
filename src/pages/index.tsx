import AppLoader from "@/lib/AppLoader";
import MainDashboard from "@/modules/dashboard/MainDashboard";

import { useAppSelector } from "@/store/hooks";

const Home = () => {
  const auth = useAppSelector(state => state.auth);

  return (
    <>
      {auth.isLoading && <AppLoader />}
      {!auth.isLoading && <MainDashboard />}
    </>
  );
};

export default Home;
