/**
 * Lightweight, dependency-free replacements for the handful of Mantine/Chakra
 * layout primitives the app used — so we can drop those UI frameworks entirely.
 * All render plain elements + Tailwind; unknown framework props are ignored.
 */
import React from "react";

type Div = React.HTMLAttributes<HTMLDivElement>;

const SIZE: Record<string, string> = {
  xs: "max-w-screen-sm",
  sm: "max-w-screen-md",
  md: "max-w-screen-lg",
  lg: "max-w-screen-xl",
  xl: "max-w-[1400px]",
};

// Mantine Container
export function Container({
  size = "lg",
  className = "",
  children,
  // swallow mantine-only props
  fluid,
  ...rest
}: Div & { size?: string; fluid?: boolean }) {
  return (
    <div className={`mx-auto w-full px-4 ${SIZE[size] || SIZE.lg} ${className}`} {...rest}>
      {children}
    </div>
  );
}

// Mantine/Chakra Flex
export function Flex({
  className = "",
  children,
  direction,
  justify,
  align,
  gap,
  wrap,
  ...rest
}: Div & { direction?: string; justify?: string; align?: string; gap?: any; wrap?: string }) {
  return (
    <div className={`flex ${className}`} {...rest}>
      {children}
    </div>
  );
}

// Mantine Center
export function Center({ className = "", children, ...rest }: Div) {
  return (
    <div className={`flex items-center justify-center ${className}`} {...rest}>
      {children}
    </div>
  );
}

// Mantine Group (horizontal flex row)
export function Group({
  className = "",
  children,
  justify,
  gap,
  h,
  visibleFrom,
  ...rest
}: Div & { justify?: string; gap?: any; h?: string; visibleFrom?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`} {...rest}>
      {children}
    </div>
  );
}

// Mantine Box
export function Box({ className = "", children, ...rest }: Div) {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
}

// Mantine Text
export function Text({
  className = "",
  children,
  span,
  fw,
  fz,
  c,
  mt,
  ...rest
}: React.HTMLAttributes<HTMLParagraphElement> & {
  span?: boolean;
  fw?: any;
  fz?: any;
  c?: string;
  mt?: any;
}) {
  const Cmp: any = span ? "span" : "p";
  return (
    <Cmp className={className} {...rest}>
      {children}
    </Cmp>
  );
}

// Mantine/Chakra Image -> plain img (framework sizing props swallowed)
export function Image({
  src,
  alt = "",
  className = "",
  width,
  height,
  fit,
  radius,
  ...rest
}: React.ImgHTMLAttributes<HTMLImageElement> & { fit?: string; radius?: any }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src as string} alt={alt} className={className} {...rest} />
  );
}
