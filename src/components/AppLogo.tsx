import { Image } from "@heroui/react";
import Link from "next/link";

export const AppLogo = ({ src = "/logo.png" }: { src?: string }) => {
  return (
    <Link href="/">
      <Image src={src} alt="logo" height={100} width={160} />
    </Link>
  );
};
