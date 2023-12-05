import AppAsyncComponent from "@/lib/AppAsyncComponent";

export default AppAsyncComponent(
  () => import("@Modules/errorPage/Error404"),
  false
);
