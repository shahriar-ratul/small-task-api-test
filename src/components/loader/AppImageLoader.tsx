import { Spin } from "antd";
import Image from "next/image";

const AppImageLoader = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          margin: "10px 0",
          padding: "10px 20px",
          textAlign: "center",
          background: "rgba(0, 0, 0, 0.05)",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.15)",
          borderRadius: "4px",
          display: "inline-block",
          cursor: "progress"
        }}
      >
        <Image
          src="/images/icon.png"
          width={30}
          height={30}
          alt="logo"
          style={{
            objectFit: "contain"
          }}
        />
        <Spin
          size="large"
          style={{
            marginTop: 10,
            marginBottom: 20,
            padding: "10px 20px"
          }}
        />
      </div>
    </div>
  );
};

export default AppImageLoader;
