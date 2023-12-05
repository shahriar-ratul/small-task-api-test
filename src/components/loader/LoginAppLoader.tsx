import { Spin } from "antd";
import Image from "next/image";

const LoginAppLoader = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          margin: "10px 0",
          padding: "10px",
          textAlign: "center",
          background: "rgba(0, 0, 0, 0.05)",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.15)",
          borderRadius: "4px",
          display: "inline-block",
          cursor: "wait"
        }}
      >
        <Image src="/images/icon.png" width={40} height={40} alt="logo" />
        <Spin
          size="default"
          style={{
            margin: "10px 0",
            padding: "10px 20px"
          }}
        />
      </div>
    </div>
  );
};

export default LoginAppLoader;
