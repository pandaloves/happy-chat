import { useState } from "react";
import NoAvatar from "../assets/img/NoAvatar.png";

const SpecificUser = ({ src, username }) => {
  const [imgSrc, setImgSrc] = useState(src || NoAvatar);

  const handleImageError = () => {
    setImgSrc(NoAvatar);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <div className="avatar">
        <div className="w-24 rounded-full">
          <img src={imgSrc} alt="avatar" onError={handleImageError} />
        </div>
      </div>
      {username && <span className="text-xl">{username || "Unknown"}</span>}
    </div>
  );
};

export default SpecificUser;
