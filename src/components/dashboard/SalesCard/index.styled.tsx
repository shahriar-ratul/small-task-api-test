import AppCard from "@/lib/AppCard";
import styled from "styled-components";

export const StyledStateCard = styled(AppCard)`
  color: white;

  & h3 {
    color: white;
  }
`;

export const StyledRow = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledStateThumb = styled.div`
  margin-right: 16px;

  & img {
    height: 50px;
    width: auto;

    @media screen and (min-width: ${({ theme }) => theme.breakpoints.xl}px) {
      width: 50px;
    }

    @media screen and (min-width: ${({ theme }) => theme.breakpoints.xxl}px) {
      width: auto;
    }
  }
`;

export const StyledStateContent = styled.div`
  position: relative;
  width: calc(100% - 70px);

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.xl}px) {
    width: calc(100% - 62px);
  }

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.xxl}px) {
    width: calc(100% - 70px);
  }

  & h3 {
    margin-bottom: 2px;
  }

  & p {
    margin-bottom: 0;
  }
`;
