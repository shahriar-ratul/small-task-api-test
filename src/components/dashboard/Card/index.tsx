import React from "react";
import PropTypes from "prop-types";
import {
  StyledCard,
  StyledCardContent,
  StyledCardContentMain,
  StyledCardInfo,
  StyledDrThumb,
  StyledTime
} from "./index.styled";
import AppImage from "@/lib/AppImage";

interface CardProps {
  bgColor: string;
  icon: string;
  time: string;
  category: string;
  name: string;
}

const Card = ({ bgColor, icon, time, category, name }: CardProps) => {
  return (
    <StyledCard
      heightFull
      style={{ backgroundColor: bgColor }}
      className="card-hover"
    >
      <StyledCardInfo>
        <StyledDrThumb>
          <AppImage src={icon} alt="icon" />
        </StyledDrThumb>
        <StyledCardContent>
          <StyledCardContentMain>
            <h5 className="text-truncate">{category}</h5>
            <p className="text-truncate">{name}</p>
          </StyledCardContentMain>
          <StyledTime>{time}</StyledTime>
        </StyledCardContent>
      </StyledCardInfo>
    </StyledCard>
  );
};

export default Card;

Card.propTypes = {
  data: PropTypes.object
};
