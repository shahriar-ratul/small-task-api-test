import AppCard from "@/lib/AppCard";
import styled from "styled-components";

export const StyledCard = styled(AppCard)`
  color: ${({ theme }) => theme.palette.primary.contrastText};
`;

export const StyledCardInfo = styled.div`
  display: flex;
`;

export const StyledDrThumb = styled.div`
  align-self: center;
  margin-right: 12px;
`;

export const StyledCardContent = styled.div`
  width: calc(100% - 45px);
  display: flex;
  align-items: center;
`;

export const StyledCardContentMain = styled.div`
  flex: 1;
  overflow: hidden;
  margin-right: 8px;

  & h5 {
    font-size: ${({ theme }) => theme.font.size.base};
    font-weight: ${({ theme }) => theme.font.weight.bold};
    color: ${({ theme }) => theme.palette.primary.contrastText};
    margin-bottom: 2px;
  }

  & p {
    margin-bottom: 0;
  }
`;

export const StyledTime = styled.span`
  margin-left: auto;
  display: flex;
  align-items: center;
  border-radius: ${({ theme }) => theme.sizes.borderRadius.circle};
  justify-content: center;
  width: 50px;
  height: 50px;
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.palette.text.secondary};
  background-color: ${({ theme }) => theme.palette.background.paper};

  @media screen and (max-width: 1600px) and (min-width: 1200px) {
    display: none;
  }
`;
