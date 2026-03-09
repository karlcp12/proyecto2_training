import "./Avatar.css";

interface AvatarProps {
  src: string;
  size?: number;
}

export const Avatar = ({ src, size = 40 }: AvatarProps) => {
  return (
    <img
      className="avatar"
      src={src}
      alt="User avatar"
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
};