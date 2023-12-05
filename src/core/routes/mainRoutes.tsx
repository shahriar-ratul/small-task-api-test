import {
  CloudServerOutlined,
  DashboardOutlined,
  FundViewOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  TeamOutlined
} from "@ant-design/icons";

const mainRoutes = [
  {
    key: "/admin",
    label: "Dashboard",
    icon: <DashboardOutlined />,
  },
  {
    key: "/admin/admin",
    label: "admin",
    icon: <ShopOutlined />,
  },
  {
    key: "/admin/inventory",
    label: "Inventory",
    icon: <CloudServerOutlined />,

  },
  {
    key: "/admin/pos",
    label: "Sales & POS",
    icon: <ShoppingCartOutlined />,

  },
  {
    key: "/admin/accounting",
    label: "Accounting",
    icon: <FundViewOutlined />,

  },
  {
    key: "/admin/hr",
    label: "HRM",
    icon: <TeamOutlined />,
  },
];

export default mainRoutes;
