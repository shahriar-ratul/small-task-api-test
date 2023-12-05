import React from "react";
import PropTypes from "prop-types";

interface AppImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

const AppImage = ({ src, alt, ...props }: AppImageProps) => {
  return (
    <picture>
      <img src={src} alt={alt} {...props} />
    </picture>
  );
};

export default AppImage;
AppImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object
};
