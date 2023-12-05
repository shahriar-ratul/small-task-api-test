import React from "react";
import PropsTypes from "prop-types";

interface AppAnimateGroupProps {
  children: React.ReactNode;
  loading: React.ReactNode;
}

const AppAnimateGroup = ({ children, ...props }: AppAnimateGroupProps) => {
  return <div {...props}>{children}</div>;
};

export default AppAnimateGroup;
AppAnimateGroup.propTypes = {
  children: PropsTypes.node,
  loading: PropsTypes.node
};
