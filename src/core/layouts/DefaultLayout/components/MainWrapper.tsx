import { Layout } from "antd";
import styled, { css } from "styled-components";

interface MainWrapperProps {
  collapsed: boolean;
  children: React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MainWrapper = styled(({ collapsed, ...props }: MainWrapperProps) => (
  <Layout {...props} />
))`
  transition: 0.2s all;
  margin-left: 250px;
  ${({ collapsed }) =>
    collapsed &&
    css`
      @media (min-width: 1200px) {
        margin-left: 80px;
      }
      margin-left: 0px;
    `};

  @media (max-width: 575.98px) {
    margin-left: 0;
  }
`;
interface MainLayoutProps {
  children: React.ReactNode;
  collapsed: boolean;
}

const MainLayout = ({ children, collapsed }: MainLayoutProps) => (
  <MainWrapper collapsed={collapsed}>{children}</MainWrapper>
);

export default MainLayout;
