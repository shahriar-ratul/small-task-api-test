import styled from "styled-components";
import Link from "next/link";

export const Logo = styled.img`
  display: inline-block;
  height: 50px;
  vertical-align: middle;
`;

const TitleWrapper = styled.div`
  position: relative;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  line-height: 64px;
  transition: all 0.3s;
`;

const LogoTitle = () => (
  <TitleWrapper>
    <Link href="/">
      <Logo src="/images/logo.png" alt="logo" />
    </Link>
  </TitleWrapper>
);

export default LogoTitle;
