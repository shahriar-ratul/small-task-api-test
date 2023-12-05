import React from "react";
import { useRouter } from "next/router";

import Icon from "@/assets/icon/403.svg";
import {
  StyledErrorButton,
  StyledErrorContainer,
  StyledErrorContent,
  StyledErrorImage,
  StyledErrorPara
} from "../index.styled";
import AppPageMeta from "@/lib/AppPageMeta";
import AppAnimate from "@/lib/AppAnimate";

const Forbidden = () => {
  const router = useRouter();

  const onGoBackToHome = () => {
    router.back();
  };

  return (
    <>
      <AppPageMeta title="UnAuthorized " />
      <AppAnimate delay={200}>
        <StyledErrorContainer key="page_not_found">
          <StyledErrorImage>
            <Icon />
          </StyledErrorImage>
          <StyledErrorContent>
            <h3> You are not authorized! 🔐 </h3>
            <StyledErrorPara>
              <p className="mb-0">
                You don&prime;t have permission to access this page. Go Back!
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

export default Forbidden;
