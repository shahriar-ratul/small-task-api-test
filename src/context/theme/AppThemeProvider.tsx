import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { ConfigProvider } from "antd";
import type { ReactNode } from "react";

import { StyleSheetManager, ThemeProvider } from "styled-components";
import { defaultTheme } from "./defaultConfig";
// import { defaultConfig } from 'next/dist/server/config-shared'
import isPropValid from "@emotion/is-prop-valid";
const ThemeContext = createContext(defaultTheme);
export const useThemeContext = () => useContext(ThemeContext);

interface Props {
  children: ReactNode;
}

const AppThemeProvider = ({ children }: Props) => {
  const [theme] = useState(defaultTheme);

  return (
    <StyleSheetManager
      enableVendorPrefixes
      shouldForwardProp={(propName, elementToBeRendered) => {
        return typeof elementToBeRendered === "string"
          ? isPropValid(propName)
          : true;
      }}
    >
      <ThemeProvider theme={theme}>
        <ConfigProvider
          // locale={theme.locale}
          theme={{
            token: {
              colorPrimary: theme.palette.primary.main,
              colorBgContainer: theme.palette.background
            }
          }}
        >
          {children}
        </ConfigProvider>
      </ThemeProvider>
    </StyleSheetManager>
  );
};

export default React.memo(AppThemeProvider);

AppThemeProvider.propTypes = {
  children: PropTypes.node.isRequired
};
