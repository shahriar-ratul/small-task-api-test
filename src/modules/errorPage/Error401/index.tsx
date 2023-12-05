import React from "react";

import AppAnimate from "@/lib/AppAnimate";
import Icon from "@/assets/icon/401.svg";

import {
  StyledErrorButton,
  StyledErrorContainer,
  StyledErrorContent,
  StyledErrorImageLg,
  StyledErrorPara
} from "../index.styled";
import AppPageMeta from "@/lib/AppPageMeta";
import { useRouter } from "next/router";

const Error401 = () => {
  const router = useRouter();
  const onGoBackToHome = () => {
    router.push("/login");
  };

  return (
    <>
      <AppPageMeta title="unauthenticated" />
      <AppAnimate delay={200}>
        <StyledErrorContainer key="unauthenticated">
          <StyledErrorImageLg>
            <Icon />
          </StyledErrorImageLg>
          <div>
            <StyledErrorContent>
              <h3>unauthenticated</h3>
              <StyledErrorPara>
                <p className="mb-0">You are not authenticated for this page!</p>
                <p className="mb-0">Please login to continue</p>
              </StyledErrorPara>
            </StyledErrorContent>
            <StyledErrorButton type="primary" onClick={onGoBackToHome}>
              Go Back
            </StyledErrorButton>
          </div>
          {/* <AppInfoView /> */}
        </StyledErrorContainer>
      </AppAnimate>
    </>
  );
};

export default Error401;
