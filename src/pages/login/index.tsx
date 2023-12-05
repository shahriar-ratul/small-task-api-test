import AuthLayout from "@/core/layouts/AuthLayout";
import AppLoader from "@/lib/AppLoader";
import LoginComponent from "@/modules/auth/LoginComponent";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import type { ReactNode } from "react";

const LoginPage = () => {
  const router = useRouter();
  const token = Cookies.get("token");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && token !== "undefined") {
      router.replace("/admin");
      setLoading(false);
    }
    setLoading(false);
  }, [router, token]);

  return (
    <>
      {loading && <AppLoader />}
      <LoginComponent />
    </>
  );
};

LoginPage.getLayout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>;
LoginPage.guestGuard = true;
export default LoginPage;
