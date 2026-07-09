"use client";
import Link from "next/link";
import Image from "next/image";
import { CiMail } from "react-icons/ci";
import { NavMenu } from "./NavMenu";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import { useNavigation } from "@/hooks/useNavigation";
import { Skeleton } from "@heroui/react";
import classes from "./HeaderMenu.module.css";
import { IconType, iconMap } from "@/components/SocialIcons";

const DynamicIcon = ({
  iconName,
  size = 20,
}: {
  iconName: string;
  size?: number;
}) => {
  const IconComponent = iconMap[iconName as IconType]?.Tabler;
  if (!IconComponent) return <span>🔗</span>;
  return <IconComponent size={size} color="#fff" />;
};

export default function HeaderMenu() {
  const { data: navData, isLoading: navLoading } = useNavigation();
  const { data: socialData, isLoading: socialLoading } = useSocialLinks();

  const logoUrl = navData?.logo || "/logo.png";
  const visibleNavLinks = (navData?.navigationLinks || [])
    .filter((l) => l.visible)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const headerSocial = socialData?.links.filter((l) => l.showInHeader) || [];
  const email = socialData?.email;

  return (
    <div className="relative overflow-hidden">
      {/* Top bar with social */}
      <div className="flex items-center justify-between bg-black">
        <div className="flex items-center gap-3 px-2">
          {socialLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="w-6 h-6 rounded-full" />
              ))}
            </>
          ) : (
            headerSocial.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.name}
              >
                <DynamicIcon iconName={link.icon} size={22} />
              </a>
            ))
          )}
        </div>

        {/* Email section */}
        {socialLoading ? (
          <div className="flex items-center gap-2 px-2 h-8 bg-[#f8cf2c] rounded-bl-[15px]">
            <Skeleton className="w-6 h-6 rounded" />
            <Skeleton className="h-4 w-32 rounded-full" />
          </div>
        ) : email?.showInHeader ? (
          <div className="flex items-center px-2 h-8 bg-[#f8cf2c] rounded-bl-[15px]">
            <CiMail size={23} style={{ padding: "2px" }} color="#000" />
            <a
              href={`mailto:${email.address}`}
              className="ml-1 text-black text-[0.79rem]"
            >
              {email.address}
            </a>
          </div>
        ) : null}
      </div>

      <header className={classes.header}>
        <div className="flex items-center justify-between h-full w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            {navLoading ? (
              <Skeleton className="h-16 w-16 rounded-lg" />
            ) : (
              <Image
                className="h-16 w-auto object-contain"
                src={logoUrl}
                width={301}
                height={292}
                alt="ReAct logo"
                priority
                unoptimized
              />
            )}
          </Link>

          {/* Mobile Menu Button */}
          <div className="relative bottom-3.5 sm:hidden">
            {navLoading ? (
              <Skeleton className="w-12 h-12 rounded-full" />
            ) : (
              <NavMenu logoUrl={logoUrl} visibleNavLinks={visibleNavLinks} />
            )}
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden sm:flex items-center h-full">
            {navLoading ? (
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-6 w-24 mx-4 rounded-full" />
                ))}
              </>
            ) : (
              visibleNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center h-full px-4 text-black font-medium text-sm hover:text-red-500"
                >
                  {link.label}
                </Link>
              ))
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
