import React from "react";
import PropTypes from "prop-types";
import {
  StyledAuth,
  StyledAuthCard,
  StyledAuthCardHeader,
  StyledAuthMainContent,
  StyledAuthWelContent,
  StyledAuthWellAction,
  StyledAuthWrap
} from "./AuthLayout.styled";
import AppLogo from "@/lib/AppLogo";
import type { ReactNode } from "react";
interface IAuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: IAuthLayoutProps) => {
  return (
    <StyledAuth>
      <div>
        <StyledAuthWrap key={"wrap"}>
          <StyledAuthCard>
            <StyledAuthWellAction>
              <StyledAuthWelContent>
                <h2>Welcome to Dashboard!</h2>
                <p>
                  lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </StyledAuthWelContent>
            </StyledAuthWellAction>
            <StyledAuthMainContent>
              <StyledAuthCardHeader>
                <AppLogo />
              </StyledAuthCardHeader>
              {children}
            </StyledAuthMainContent>
          </StyledAuthCard>
        </StyledAuthWrap>
      </div>
    </StyledAuth>
  );
};

export default AuthLayout;

AuthLayout.propTypes = {
  children: PropTypes.node
};
