import { useState } from "react";
import NoAvatar from "../assets/img/NoAvatar copy.png";

const useAvatar = (initialSrc) => {
  const [imgSrc, setImgSrc] = useState(initialSrc || NoAvatar);

  const handleImageError = () => {
    setImgSrc(NoAvatar);
  };

  return [imgSrc, handleImageError];
};

export default useAvatar;
