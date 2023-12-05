import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { StyledCard } from "./index.styled";

interface AppCardProps {
  title?: React.ReactNode;
  extra?: React.ReactNode;
  children?: React.ReactNode;
  cover?: React.ReactNode;
  className?: string;
  heightFull?: boolean;
  style?: React.CSSProperties;
  actions?: React.ReactNode[];
}

const AppCard = ({
  title,
  extra,
  children,
  cover,
  className,
  actions,
  heightFull,
  style,
  ...rest
}: AppCardProps) => {
  return (
    <StyledCard
      className={clsx({ heightFull: heightFull }, className)}
      title={title}
      extra={extra ? extra : null}
      cover={cover}
      actions={actions}
      style={style}
      bordered={false}
      {...rest}
    >
      {children}
    </StyledCard>
  );
};

export default AppCard;

AppCard.propTypes = {
  action: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  extra: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node,
  cover: PropTypes.any,
  className: PropTypes.string,
  actions: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  heightFull: PropTypes.bool
};

AppCard.defaultProps = {};
