import React from "react";
import { useRouter } from "next/router";

import Icon from "@/assets/icon/500.svg";
import {
  StyledErrorButton,
  StyledErrorContainer,
  StyledErrorContent,
  StyledErrorImage,
  StyledErrorPara
} from "../index.styled";
import AppPageMeta from "@/lib/AppPageMeta";
import AppAnimate from "@/lib/AppAnimate";

const Error403 = () => {
  const router = useRouter();

  const onGoBackToHome = () => {
    router.back();
  };

  return (
    <>
      <AppPageMeta title="Server Error" />
      <AppAnimate delay={200}>
        <StyledErrorContainer key="server_error">
          <StyledErrorImage>
            <Icon />
          </StyledErrorImage>
          <StyledErrorContent>
            <h3>Server Error</h3>
            <StyledErrorPara>
              <p className="mb-0">
                Server Error.please come back later and try again!
              </p>
            </StyledErrorPara>
            <StyledErrorButton type="primary" onClick={onGoBackToHome}>
              Go Back
            </StyledErrorButton>
          </StyledErrorContent>
        </StyledErrorContainer>
      </AppAnimate>
    </>
  );
};

export default Error403;
