import styled from "styled-components";
import AppScrollbar from "@/lib/AppScrollbar";

export const StyledUserSidebarScrollbar = styled(AppScrollbar)`
  max-height: 100vh;

  .appMainFixedFooter & {
    max-height: calc(100vh - 46px);
  }
`;
