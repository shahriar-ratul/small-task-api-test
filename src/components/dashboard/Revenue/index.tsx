import React from "react";

import {
  StyledAppProgressCircular,
  StyledDollerIcon,
  StyledRevCircularProgress,
  StyledRevCircularProgressContent,
  StyledRevCirProgressContentBottom,
  StyledRevenueCard
} from "./index.styled";

const Revenue = () => {
  return (
    <StyledRevenueCard title="Revenue" heightFull>
      <StyledRevCircularProgress>
        <StyledAppProgressCircular
          strokeColor="#0A8FDC"
          percent={70}
          strokeWidth={10}
          format={() => (
            <StyledRevCircularProgressContent>
              <div className="ant-row">
                <StyledDollerIcon>$</StyledDollerIcon>
                <h3>600</h3>
              </div>
              <p>Sales</p>
            </StyledRevCircularProgressContent>
          )}
        />
      </StyledRevCircularProgress>
      <StyledRevCirProgressContentBottom>
        <div>
          <p>$ 2,000</p>
          <span>Target</span>
        </div>
        <div>
          <p>$ 1,500</p>
          <span>Current</span>
        </div>
      </StyledRevCirProgressContentBottom>
    </StyledRevenueCard>
  );
};

export default Revenue;
