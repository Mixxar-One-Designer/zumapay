import React from "react";

interface Props {
  src?: string;
  size?: number;
}

const Avatar: React.FC<Props> = ({ src, size = 80 }) => {
  return (
    <div
      className="rounded-full border-2 border-primary overflow-hidden"
      style={{ width: size, height: size }}
    >
      <img src={src || "/avatar.png"} alt="avatar" className="w-full h-full object-cover" />
    </div>
  );
};

export default Avatar;