import { Drawer } from "antd";
import styled from "styled-components";

const StyledDrawer = styled(Drawer)`
  .ant-drawer-wrapper-body {
    overflow: hidden !important;
  }
  @media (max-width: 575.98px) {
    .ant-drawer-wrapper {
      width: 256px !important;
    }
  }
`;

interface DrawerLayoutProps {
  drawerVisible: boolean;
  closeDrawer: () => void;
  children?: React.ReactNode;
}

const DrawerLayout = ({
  drawerVisible,
  closeDrawer,
  children
}: DrawerLayoutProps) => (
  <StyledDrawer
    placement="left"
    closable={false}
    onClose={closeDrawer}
    open={drawerVisible}
    bodyStyle={{
      margin: 0,
      padding: 0
    }}
    style={{
      width: "auto"
    }}
  >
    {children}
  </StyledDrawer>
);

export default DrawerLayout;
