/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from "next/router";
import mainRoutes from "@/core/routes/mainRoutes";
import { StyledVerticalNav } from "./style/menu.styled";
import { useEffect, useState } from "react";

interface MenuLayoutProps {
  style?: React.CSSProperties;
  closeDrawer: () => void;
  collapsed?: boolean;
}

const MenuLayout = ({ style, closeDrawer, collapsed }: MenuLayoutProps) => {
  const router = useRouter();
  const currentPath = router.route;

  const [loading, setLoading] = useState(true);
  const [defaultOpen, setDefaultOpen] = useState<string[]>([]);

  useEffect(() => {
    if (!router.isReady) return;

    const { asPath } = router;
    // check is current path has role permission or admin
    const routeSegments = asPath.split("/").filter(i => i);
    //  remove first segment
    routeSegments.shift();

    if (!collapsed) {
      if (
        routeSegments.includes("role") ||
        routeSegments.includes("admin") ||
        routeSegments.includes("permission")
      ) {
        setDefaultOpen(["user-management"]);
      }
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return !loading ? (
    <StyledVerticalNav
      theme="light"
      mode="inline"
      selectedKeys={[currentPath]}
      defaultSelectedKeys={[currentPath]}
      defaultOpenKeys={defaultOpen}
      // defaultOpenKeys={["user-management"]}
      selectable
      style={{
        ...style
      }}
      onClick={({ key }) => {
        closeDrawer();
        router.push(key);
      }}
      items={mainRoutes}
    />
  ) : null;
};

export default MenuLayout;
