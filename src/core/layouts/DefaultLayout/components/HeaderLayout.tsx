import {
  ControlOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Layout, Dropdown, Button, Space, Avatar } from "antd";

import type { MenuProps } from "antd";
import Link from "next/link";
import { useState } from "react";
import styled from "styled-components";
import "@DefaultLayout/components/style/Header.module.css";
import LogoTitle from "./LogoTitle";
// import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/store/hooks";

const TriggerBlock = styled.div`
  display: inline-block;
  height: 100%;
`;

const HeaderBlock = styled(TriggerBlock)`
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: ${({ theme }) => theme.font.size.lg};
`;

export const StyledCrUserInfoAvatar = styled(Avatar)`
  font-size: 24px;
  background-color: ${({ theme }) => theme.palette.orange[6]};
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const items: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <Link href="/">
        <Space>
          <UserOutlined />
          Profile
        </Space>
      </Link>
    )
  },
  {
    type: "divider"
  },
  {
    key: "2",
    label: (
      <Link href="/">
        <Space>
          <ControlOutlined />
          Change Password
        </Space>
      </Link>
    )
  },
  {
    type: "divider"
  },
  {
    key: "3",
    label: (
      <Space>
        <LogoutOutlined />
        Logout
      </Space>
    )
  },
  {
    type: "divider"
  }
];

interface HeaderLayoutProps {
  collapsed: boolean;
  handleToggle: () => void;
}

const HeaderLayout = ({ collapsed, handleToggle }: HeaderLayoutProps) => {
  const { Header } = Layout;

  const router = useRouter();

  const [open, setOpen] = useState(false);

  const dispatch = useAppDispatch();

  const logout = () => {
    dispatch({ type: "auth/logout" });
    router.push("/login");
  };

  const handleMenuClick: MenuProps["onClick"] = e => {
    if (e.key === "3") {
      setOpen(false);
      logout();
    }
  };

  const handleOpenChange = (flag: boolean) => {
    setOpen(flag);
  };

  return (
    <Header
      style={{
        background: "#fff",
        padding: 0,
        boxShadow: "0 1px 4px rgba(0,21,41,.08)",
        display: "flex",
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%"
      }}
    >
      <TriggerBlock>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => handleToggle()}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64
          }}
        />
      </TriggerBlock>

      <LogoTitle />

      <div
        style={{
          marginLeft: "auto"
        }}
      >
        <Dropdown
          menu={{
            items,
            onClick: handleMenuClick
          }}
          onOpenChange={handleOpenChange}
          open={open}
          className="flex justify-center"
        >
          <HeaderBlock className="">
            <a onClick={e => e.preventDefault()}>
              <Space className=" rounded-full">
                <StyledCrUserInfoAvatar src="/images/avatar/A11.jpg" />
              </Space>
            </a>
          </HeaderBlock>
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderLayout;
