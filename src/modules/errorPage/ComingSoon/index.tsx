import React from "react";

import AppAnimate from "@/lib/AppAnimate";
import Icon from "@/assets/icon/comingsoon.svg";

import {
  StyledErrorButton,
  StyledErrorContainer,
  StyledErrorContent,
  StyledErrorImageLg,
  StyledErrorPara
} from "../index.styled";
import AppPageMeta from "@/lib/AppPageMeta";
import { useRouter } from "next/router";

const ComingSoon = () => {
  const router = useRouter();
  const onGoBackToHome = () => {
    router.back();
  };

  return (
    <>
      <AppPageMeta title="Coming Soon" />
      <AppAnimate delay={200}>
        <StyledErrorContainer key="coming_soon">
          <StyledErrorImageLg>
            <Icon />
          </StyledErrorImageLg>
          <div>
            <StyledErrorContent>
              <h3>Coming Soon</h3>
              <StyledErrorPara>
                <p className="mb-0">page is under construction</p>
                <p className="mb-0">We will notify you when its ready</p>
              </StyledErrorPara>
            </StyledErrorContent>
            <StyledErrorButton type="primary" onClick={onGoBackToHome}>
              Go Back
            </StyledErrorButton>
          </div>
        </StyledErrorContainer>
      </AppAnimate>
    </>
  );
};

export default ComingSoon;
