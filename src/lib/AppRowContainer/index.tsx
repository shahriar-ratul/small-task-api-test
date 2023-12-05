import React from "react";
import { Row } from "antd";
import PropTypes from "prop-types";
import { StyledAppRowContainer } from "./index.styled";
import AppAnimate from "../AppAnimate";

interface AppRowContainerProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const AppRowContainer = ({
  children,
  style,
  ...others
}: AppRowContainerProps) => {
  return (
    <StyledAppRowContainer style={style}>
      <AppAnimate>
        <Row
          style={{ flexDirection: "row" }}
          gutter={{ xs: 16, sm: 16, md: 32 }}
          {...others}
        >
          {children}
        </Row>
      </AppAnimate>
    </StyledAppRowContainer>
  );
};

export default AppRowContainer;
AppRowContainer.propTypes = {
  children: PropTypes.node,
  style: PropTypes.any
};
