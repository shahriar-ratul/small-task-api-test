import React from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import { Dropdown } from "antd";
import { FaChevronDown } from "react-icons/fa";

import PropTypes from "prop-types";
import {
  StyledCrUserDesignation,
  StyledCrUserInfo,
  StyledCrUserInfoAvatar,
  StyledCrUserInfoContent,
  StyledCrUserInfoInner,
  StyledUserArrow,
  StyledUsername,
  StyledUsernameInfo
} from "./index.styled";
// import Cookies from "js-cookie";
import { useAppDispatch } from "@/store/hooks";

const UserInfo = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const logout = () => {
    dispatch({ type: "auth/logout" });
    router.push("/login");
  };

  const items = [
    {
      key: 1,
      label: <div onClick={() => router.push("/my-profile")}>My Profile</div>
    },
    {
      key: 2,
      label: <div onClick={() => logout()}>Logout</div>
    }
  ];

  return (
    <>
      <StyledCrUserInfo
        style={{
          backgroundColor: "#f5f5f5",
          color: "#000"
        }}
        className={clsx("cr-user-info", {
          light: "light"
        })}
      >
        <Dropdown
          menu={{ items }}
          trigger={["click"]}
          placement="bottomRight"
          overlayStyle={{
            zIndex: 1052,
            minWidth: 150
          }}
        >
          <StyledCrUserInfoInner className="ant-dropdown-link">
            <StyledCrUserInfoAvatar src="/assets/images/avatar/A11.jpg" />

            <StyledCrUserInfoContent className="cr-user-info-content">
              <StyledUsernameInfo>
                <StyledUsername
                  className={clsx("text-truncate", {
                    light: "light"
                  })}
                >
                  admin user
                </StyledUsername>
                <StyledUserArrow className="cr-user-arrow">
                  <FaChevronDown />
                </StyledUserArrow>
              </StyledUsernameInfo>
              <StyledCrUserDesignation className="text-truncate">
                System Manager
              </StyledCrUserDesignation>
            </StyledCrUserInfoContent>
          </StyledCrUserInfoInner>
        </Dropdown>
      </StyledCrUserInfo>
    </>
  );
};

export default UserInfo;

UserInfo.propTypes = {
  hasColor: PropTypes.bool
};
