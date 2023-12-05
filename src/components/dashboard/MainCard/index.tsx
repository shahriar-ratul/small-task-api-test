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
import Link from "next/link";

const { Title } = Typography;

interface SalesStateProps {
  icon: string;
  link: string;
  title: string;
  bgColor: string;
  color: string;
}

const MainCard = ({ icon, title, bgColor, link, color }: SalesStateProps) => {
  return (
    <Link href={link}>
      <StyledStateCard
        className="card-hover"
        style={{
          backgroundColor: bgColor
        }}
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
              {title}
            </Title>
          </StyledStateContent>
        </StyledRow>
      </StyledStateCard>
    </Link>
  );
};

export default MainCard;

MainCard.propTypes = {
  state: PropTypes.object
};
