import React from "react";
import { Typography } from "antd";
import PropTypes from "prop-types";

import {
  StyledRow,
  StyledStateCard,
  StyledStateContent,
  StyledStateThumb
} from "./index.styled";
import AppImage from "@/lib/AppImage";

const { Title } = Typography;

interface SalesCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  value: string;
  title: string;
  bgColor: string;
  color: string;
}

const SalesCard = ({ icon, value, title, bgColor, color }: SalesCardProps) => {
  return (
    <StyledStateCard
      className="card-hover"
      style={{ backgroundColor: bgColor }}
    >
      <StyledRow>
        <StyledStateThumb>
          <AppImage src={icon} alt={title} />
        </StyledStateThumb>
        <StyledStateContent>
          <Title
            className="text-truncate"
            level={3}
            style={{
              color: color
            }}
          >
            {value}
          </Title>
          <p
            className="text-truncate"
            style={{
              color: color
            }}
          >
            {title}
          </p>
        </StyledStateContent>
      </StyledRow>
    </StyledStateCard>
  );
};

export default SalesCard;

SalesCard.propTypes = {
  state: PropTypes.object
};
