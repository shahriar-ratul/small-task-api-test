import React from "react";
import ProtoTypes from "prop-types";

import { Progress } from "antd";
import type { ProgressGradient } from "antd/es/progress/progress";

interface AppCircularProgressProps {
  percent: number;
  rest?: object;
  strokeColor?: string | string[] | ProgressGradient;
  strokeWidth?: number;
  format?: () => React.ReactNode;
  trailColor?: string;
}

const AppCircularProgress = ({
  percent,
  strokeColor,
  strokeWidth,
  format,
  trailColor,
  ...rest
}: AppCircularProgressProps) => {
  return (
    <Progress
      type="circle"
      strokeColor={strokeColor}
      percent={percent}
      strokeWidth={strokeWidth}
      format={format}
      trailColor={trailColor}
      size={80}
      {...rest}
    />
  );
};
export default AppCircularProgress;

AppCircularProgress.propTypes = {
  percent: ProtoTypes.number
};

AppCircularProgress.defaultProps = {};
