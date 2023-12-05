/* eslint-disable @typescript-eslint/no-explicit-any */
import dynamic from "next/dynamic";
import React from "react";
import AppLoader from "../AppLoader";

const AppAsyncComponent = (importComponent: any, ssr = true) => {
  return dynamic(importComponent, {
    loading: () => <AppLoader />,
    ssr: ssr
  });
};
export default AppAsyncComponent;
