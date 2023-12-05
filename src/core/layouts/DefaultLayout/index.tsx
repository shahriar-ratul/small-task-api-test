import React, { useContext, useEffect, useState } from "react";
import { Layout } from "antd";
import LogoTitle from "./components/LogoTitle";
import MenuLayout from "./components/MenuLayout";
import MainLayout from "./components/MainWrapper";
import HeaderLayout from "./components/HeaderLayout";
import DrawerLayout from "./components/DrawerLayout";
import AppSidebar from "./components/AppSidebar";

import AppAxios from "@/services/AppAxios";

import { useRouter } from "next/router";
import Cookies from "js-cookie";

import AppImageLoader from "@/components/loader/AppImageLoader";
import { useAppSelector } from "@/store/hooks";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const { Content, Footer } = Layout;

  const auth = useAppSelector(state => state.auth);

  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
    if (window.innerWidth < 576) setDrawerVisible(!drawerVisible);
  };

  const [loading, setLoading] = useState(true);
  const router = useRouter();


  // update ability with permissions
  useEffect(() => {
    if (!auth.isLoggedIn) return;

    setLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, auth]);

  return (
    <>
      {auth.isLoading && <AppImageLoader />}
      {loading && <AppImageLoader />}
      {!loading && (
        <Layout>
          <AppSidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            closeDrawer={() => setDrawerVisible(false)}
            onBreakpoint={toggle}
          ></AppSidebar>

          <Layout className="site-layout">
            <MainLayout collapsed={collapsed}>
              <HeaderLayout collapsed={collapsed} handleToggle={toggle} />
              <Content
                className="min-h-screen min-w-screen"
                style={{
                  margin: "20px 16px 15px 16px",
                  minHeight: "100vh !important"
                }}
              >
                {children}
              </Content>
              <Footer
                style={{
                  textAlign: "center",
                  backgroundColor: "#fff"
                }}
              >
                {new Date().getFullYear()} &copy; All Rights Reserved.
              </Footer>
            </MainLayout>
          </Layout>

          <DrawerLayout
            drawerVisible={drawerVisible}
            closeDrawer={() => setDrawerVisible(false)}
          >
            <LogoTitle />

            <MenuLayout
              style={{ minHeight: "100vh" }}
              closeDrawer={() => setDrawerVisible(false)}
            />
          </DrawerLayout>
        </Layout>
      )}
    </>
  );
};

export default DefaultLayout;
