// components/SocialIcons.tsx
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandYoutube,
  IconBrandTiktok,
  IconBrandGithub,
  IconBrandDiscord,
  IconBrandTelegram,
  IconBrandWhatsapp,
  IconMail,
  IconWorld,
  IconLink,
} from "@tabler/icons-react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaTiktok,
  FaGithub,
  FaDiscord,
  FaTelegram,
  FaWhatsapp,
  FaEnvelope,
  FaGlobe,
  FaLink,
} from "react-icons/fa";

export const iconMap = {
  facebook: { Tabler: IconBrandFacebook, FA: FaFacebook, label: "Facebook" },
  instagram: {
    Tabler: IconBrandInstagram,
    FA: FaInstagram,
    label: "Instagram",
  },
  linkedin: { Tabler: IconBrandLinkedin, FA: FaLinkedin, label: "LinkedIn" },
  twitter: { Tabler: IconBrandTwitter, FA: FaTwitter, label: "Twitter/X" },
  youtube: { Tabler: IconBrandYoutube, FA: FaYoutube, label: "YouTube" },
  tiktok: { Tabler: IconBrandTiktok, FA: FaTiktok, label: "TikTok" },
  github: { Tabler: IconBrandGithub, FA: FaGithub, label: "GitHub" },
  discord: { Tabler: IconBrandDiscord, FA: FaDiscord, label: "Discord" },
  telegram: { Tabler: IconBrandTelegram, FA: FaTelegram, label: "Telegram" },
  whatsapp: { Tabler: IconBrandWhatsapp, FA: FaWhatsapp, label: "WhatsApp" },
  email: { Tabler: IconMail, FA: FaEnvelope, label: "Email" },
  website: { Tabler: IconWorld, FA: FaGlobe, label: "Website" },
  other: { Tabler: IconLink, FA: FaLink, label: "Other" },
};

export type IconType = keyof typeof iconMap;

export const getIconComponent = (
  iconName: string,
  size: number = 20,
  useFA: boolean = false,
) => {
  const icon = iconMap[iconName as IconType] || iconMap.other;
  const Component = useFA ? icon.FA : icon.Tabler;
  return <Component size={size} />;
};

export const getAvailableIcons = () =>
  Object.entries(iconMap).map(([key, value]) => ({
    id: key,
    label: value.label,
  }));
