import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";


const useUploadAvatar = () => {
  const [imageUrl, setImageUrl] = useState("");

  const handleUploadAvatar = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("key", import.meta.env.VITE_AVATAR_API_KEY);
    formData.append("image", file);

    try {
      const response = await axios.post(
        import.meta.env.VITE_AVATAR_API_URL,
        formData
      );

      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      const data = response.data;
      const uploadedImageUrl = data.data.url;
      setImageUrl(uploadedImageUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed: " + error.toString());
    }
  };

  return {
    imageUrl,
    handleUploadAvatar,
  };
};

export default useUploadAvatar;
