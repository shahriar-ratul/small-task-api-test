import DefaultLayout from "@/core/layouts/DefaultLayout";
import AppLoader from "@/lib/AppLoader";
import EditAdmin from "@/modules/admin/EditAdmin";

import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

const Home = () => {
  const auth = useAppSelector(state => state.auth);

  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      {auth.isLoading && <AppLoader />}
      {!auth.isLoading && <EditAdmin id={id} />}
    </>
  );
};

Home.getLayout = (page: ReactNode) => <DefaultLayout>{page}</DefaultLayout>;

export default Home;
