
import DefaultLayout from "@/core/layouts/DefaultLayout";
import AppLoader from "@/lib/AppLoader";
import AdminList from "@/modules/admin/AdminList";
import { useAppSelector } from "@/store/hooks";
import type { ReactNode } from "react";

const Home = () => {
  const auth = useAppSelector(state => state.auth);

  return (
    <>
      {auth.isLoading && <AppLoader />}
      {!auth.isLoading && <AdminList />}
    </>
  );
};

Home.getLayout = (page: ReactNode) => <DefaultLayout>{page}</DefaultLayout>;

export default Home;
