import PropTypes from "prop-types";
import React, { memo } from "react";

interface AppAnimateProps {
  children: React.ReactNode;
  loading?: boolean;
  delay?: number;
}

const AppAnimate = ({ children, ...props }: AppAnimateProps) => {
  return <div {...props}>{children}</div>;
};

AppAnimate.propTypes = {
  children: PropTypes.element.isRequired,
  loading: PropTypes.bool
};

AppAnimate.defaultProps = {};

export default memo(AppAnimate);
