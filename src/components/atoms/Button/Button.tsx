import styles from './Button.module.css';
import classNames from "classnames";
import type { MouseEventHandler, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      className={classNames(
        styles.button,
        styles[variant],
        styles[size],
        {
          [styles.disabled]: disabled,
          [styles.loading]: loading,
        }
      )}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? "Cargando..." : children}
    </button>
  );
}