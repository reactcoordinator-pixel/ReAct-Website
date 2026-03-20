"use client";
import { Group, Box } from "@mantine/core";
import { Link } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { CiMail } from "react-icons/ci";
import { NavMenu } from "./NavMenu";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import { useNavigation } from "@/hooks/useNavigation";
import { Skeleton } from "@heroui/react"; // ← HeroUI Skeleton
import classes from "./HeaderMenu.module.css";
import { IconType, iconMap } from "@/components/SocialIcons";

// Dynamic icon component
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

  const logoUrl = navData?.logo || "/logo.png"; // fallback to default if undefined
  const visibleNavLinks = (navData?.navigationLinks || [])
    .filter((l) => l.visible)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const headerSocial = socialData?.links.filter((l) => l.showInHeader) || [];
  const email = socialData?.email;

  return (
    <Box style={{ overflow: "hidden", position: "relative" }}>
      {/* Top bar with social */}
      <Flex bg="#000" alignItems="center" justifyContent="space-between">
        <Flex alignItems="center" px={2} gap={3}>
          {socialLoading ? (
            // 5 skeleton circles for social icons
            <>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="w-6 h-6 rounded-full" />
              ))}
            </>
          ) : headerSocial.length > 0 ? (
            headerSocial.map((link) => (
              <Link
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.name}
              >
                <DynamicIcon iconName={link.icon} size={22} />
              </Link>
            ))
          ) : null}
        </Flex>

        {/* Email section */}
        {socialLoading ? (
          <Flex
            alignItems="center"
            px={2}
            style={{
              height: "2rem",
              borderBottomLeftRadius: 15,
            }}
            bg="#f8cf2c"
            gap={2}
          >
            <Skeleton className="w-6 h-6 rounded" />
            <Skeleton className="h-4 w-32 rounded-full" />
          </Flex>
        ) : email?.showInHeader ? (
          <Flex
            alignItems="center"
            px={2}
            style={{
              height: "2rem",
              borderBottomLeftRadius: 15,
            }}
            bg="#f8cf2c"
          >
            <CiMail
              size={23}
              style={{ padding: "2px", fontWeight: "800" }}
              color="#000"
            />
            <Link
              href={`mailto:${email.address}`}
              style={{ color: "#000", fontSize: ".79rem" }}
              ml="0.2rem"
            >
              {email.address}
            </Link>
          </Flex>
        ) : null}
      </Flex>

      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          {/* Logo */}
          <Link href="/" style={{ width: "12rem" }}>
            <div className="relative">
              {navLoading ? (
                <Skeleton className="absolute bottom-[-28px] w-16 h-16 rounded-lg" />
              ) : (
                <Image
                  className="absolute bottom-[-59px] md:bottom-[-66px]"
                  src={logoUrl}
                  width={140}
                  height={140}
                  alt="logo"
                />
              )}
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <div className="relative bottom-3.5 md:hidden">
            {navLoading ? (
              <Skeleton className="w-12 h-12 rounded-full" />
            ) : (
              <NavMenu logoUrl={logoUrl} visibleNavLinks={visibleNavLinks} />
            )}
          </div>

          {/* Desktop Navigation Links */}
          <Group h="100%" gap={0} visibleFrom="sm">
            {navLoading ? (
              // 5 skeleton text placeholders for nav links
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
          </Group>
        </Group>
      </header>
    </Box>
  );
}
