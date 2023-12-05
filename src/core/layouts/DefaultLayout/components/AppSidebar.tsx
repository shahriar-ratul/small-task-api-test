import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

import UserInfo from "../components/UserInfo";

import {
  StyledAppMainSidebar,
  StyledAppSidebarScrollbar
} from "./style/AppSidebar.styled";
import MenuLayout from "./MenuLayout";

interface AppSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  closeDrawer: () => void;
  onBreakpoint: (collapsed: boolean) => void;
  children?: React.ReactNode;
}

const AppSidebar = ({
  collapsed,
  setCollapsed,
  closeDrawer
}: AppSidebarProps) => {
  const firstMounted = useRef(false);

  useEffect(() => {
    firstMounted.current = true;
  }, []);

  return (
    <StyledAppMainSidebar
      collapsed={collapsed}
      onBreakpoint={(collapsed: boolean) => {
        if (firstMounted.current) {
          setCollapsed(collapsed);
        }
      }}
      /* style={{
  overflow: 'auto',
  height: '100vh',
  position: 'fixed',
  width: "256px",
  left: 0,
  top: 0,
  bottom: 0,
  boxShadow: '4px 0 8px 0 rgba(0,21,41,0.35)',
  zIndex: 1000,
  backgroundColor: '#fff',
}} */
    >
      <UserInfo />
      <StyledAppSidebarScrollbar>
        <MenuLayout collapsed={collapsed} closeDrawer={closeDrawer} />
      </StyledAppSidebarScrollbar>
    </StyledAppMainSidebar>
  );
};

export default AppSidebar;

AppSidebar.propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
  closeDrawer: PropTypes.func
};
