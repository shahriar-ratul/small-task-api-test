import React from "react";
import { Row } from "antd";
import PropTypes from "prop-types";
import { StyledAppRowContainer } from "./index.styled";
import AppAnimate from "../AppAnimate";

interface AppRowSimpleContainerProps {
  children: React.ReactNode;
}

const AppRowSimpleContainer = ({ children }: AppRowSimpleContainerProps) => {
  return (
    <StyledAppRowContainer>
      <AppAnimate>
        <Row gutter={{ xs: 16, sm: 16, md: 32 }}>{children}</Row>
      </AppAnimate>
    </StyledAppRowContainer>
  );
};

export default AppRowSimpleContainer;
AppRowSimpleContainer.propTypes = {
  children: PropTypes.node
};
