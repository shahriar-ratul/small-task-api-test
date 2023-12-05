import MainCard from "@/components/dashboard/MainCard";
import AppAnimate from "@/lib/AppAnimate";
import AppRowContainer from "@/lib/AppRowContainer";
import { Col } from "antd";
import React from "react";

const MainDashboard = () => {
  return (
    <>
      <AppAnimate>
        <AppRowContainer
          style={{
            height: "80vh",
            margin: "0 30px"
          }}
        >
          <Col xs={24} sm={12} md={6}>
            <MainCard
              bgColor="#0A8FDC"
              color="#fff"
              icon="/images/icons/shopping-cart.png"
              title="Purchase Module"
              link="/admin/purchase"
            />
          </Col>
        </AppRowContainer>
      </AppAnimate>
    </>
  );
};

export default MainDashboard;
