import React from "react";
import PropTypes from "prop-types";
import SimpleBarReact from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

interface AppScrollbarProps {
  children: React.ReactNode;
  className?: string;
}

const AppScrollbar = ({
  children,
  className,
  ...others
}: AppScrollbarProps) => {
  return (
    <SimpleBarReact
      {...others}
      className={className}
      forceVisible="y"
      autoHide={true}
    >
      {children}
    </SimpleBarReact>
  );
};

export default AppScrollbar;

AppScrollbar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
