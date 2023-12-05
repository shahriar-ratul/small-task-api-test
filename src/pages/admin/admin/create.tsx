import DefaultLayout from "@/core/layouts/DefaultLayout";
import AppLoader from "@/lib/AppLoader";

import NewAdmin from "@/modules/admin/NewAdmin";

import { useAppSelector } from "@/store/hooks";
import type { ReactNode } from "react";

const Home = () => {
  const auth = useAppSelector(state => state.auth);

  return (
    <>
      {auth.isLoading && <AppLoader />}
      {!auth.isLoading && <NewAdmin />}
    </>
  );
};

Home.getLayout = (page: ReactNode) => <DefaultLayout>{page}</DefaultLayout>;

export default Home;
