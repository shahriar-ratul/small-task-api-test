import AppLoader from "@/lib/AppLoader";
import CarList from "@/modules/car/CarList";

import { useAppSelector } from "@/store/hooks";

const Home = () => {
  const auth = useAppSelector(state => state.auth);

  return (
    <>
      {auth.isLoading && <AppLoader />}
      {!auth.isLoading && <CarList />}
    </>
  );
};

Home.guestGuard = true;
export default Home;
