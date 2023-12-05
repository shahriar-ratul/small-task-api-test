export const defaultTheme = {
  spacing: 4,
  cardRadius: "16px",
  cardRadius30: "30px",
  cardShadow: "0 0 5px 5px rgba(0,0,0,0.03)",
  palette: {
    mode: "light", // semi-dark ,dark , light
    borderColor: "#000000",
    dividerColor: "rgba(0, 0, 0, 0.06)",
    tooltipBg: "rgba(0, 0, 0, 0.75)",
    background: "#F4F7FE",
    primary: {
      main: "#0A8FDC",
      contrastText: "#fff"
    },
    secondary: {
      main: "#F04F47"
    },
    success: {
      main: "#52c41a", // '#11C15B',
      light: "#D9F5E5"
    },
    warning: {
      main: "#FF5252",
      light: "#FFECDC"
    },
    gray: {
      50: "#fafafa",
      100: "#F5F5F5", // #F5F6FA,
      200: "#eeeeee", // #edf2f7',
      300: "#E0E0E0",
      400: "#bdbdbd", // #c5c6cb,
      500: "#9e9e9e", // #A8A8A8',
      600: "#757575", // #666666',
      700: "#616161", // '#4a5568',
      800: "#201e21",
      900: "#212121", // '#1a202c',
      A100: "#d5d5d5",
      A200: "#aaaaaa",
      A400: "#303030",
      A700: "#616161"
    },
    black: "#000",
    white: "#FFFFFF",
    orange: {
      5: "#ffa940",
      6: "#fa8c16"
    },
    cyan: {
      7: "#08979c"
    },
    red: {
      6: "#f5222d"
    },
    green: {
      3: "#b7eb8f",
      5: "#73d13d",
      6: "#52c41a",
      7: "#389e0d"
    },
    blue: {
      5: "#40a9ff",
      7: "#096dd9",
      8: "#3E54AC"
    },
    purple: {
      5: "#9254de",
      6: "#722ed1",
      7: "#5B4B8A",
      8: "#7858A6"
    },
    text: {
      primary: "rgb(17, 24, 39)",
      secondary: "rgb(107, 114, 128)",
      disabled: "rgb(149, 156, 169)",
      hint: "rgb(174, 175, 184)"
    }
  },
  status: {
    danger: "orange"
  },
  divider: "rgba(224, 224, 224, 1)",
  font: {
    family: ["Poppins", "sans-serif"].join(","),
    weight: {
      light: "300",
      regular: "400",
      medium: "500",
      bold: "600",
      extraBold: "700"
    },
    size: {
      base: "14px",
      lg: "16px",
      sm: "12px"
    }
  },
  sidebar: {
    light: {
      sidebarBgColor: "#fff",
      sidebarTextColor: "rgba(0, 0, 0, 0.60)",
      sidebarHeaderColor: "#fff",
      sidebarMenuSelectedBgColor: "#F4F7FE",
      sidebarMenuSelectedTextColor: "rgba(0, 0, 0, 0.87)",
      mode: "light"
    },
    dark: {
      sidebarBgColor: "#313541",
      sidebarTextColor: "#fff",
      sidebarHeaderColor: "#313541",
      sidebarMenuSelectedBgColor: "#F4F7FE",
      sidebarMenuSelectedTextColor: "rgba(0, 0, 0, 0.87)",
      mode: "dark"
    }
  },
  breakpoints: {
    xs: 480,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600
  },
  sizes: {
    line: {
      base: 1.35
    },
    borderRadius: {
      base: "4px",
      circle: "50%"
    },
    framed: {
      base: "20px"
    }
  }
};
