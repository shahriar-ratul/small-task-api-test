import React from "react";
import { Layout } from "antd";
import PropTypes from "prop-types";

const { Sider } = Layout;

interface MainSidebarProps {
  children: React.ReactNode;
  className?: string;
  collapsed?: boolean;
  props?: object;
  onBreakpoint?: (broken: boolean) => void;
}

const MainSidebar = ({
  children,
  className,
  collapsed = false,
  ...props
}: MainSidebarProps) => {
  return (
    <Sider
      theme="light"
      breakpoint="lg"
      onBreakpoint={props.onBreakpoint}
      className={className}
      style={{
        backgroundColor: "#fff",
        color: "#000",
        boxShadow: "4px 0 8px 0 rgba(0,21,41,0.2)",
        zIndex: 1000,

        height: "100vh",
        position: "fixed",
        width: "256px"
      }}
      collapsed={collapsed}
      {...props}
    >
      {children}
    </Sider>
  );
};

export default MainSidebar;
MainSidebar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.any,
  collapsed: PropTypes.bool
};
