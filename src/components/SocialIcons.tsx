// components/SocialIcons.tsx — icons from react-icons (Font Awesome) only.
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

// `Tabler` is kept as a key for backward compatibility with callers, but now
// points at the same react-icons component as `FA` (Tabler pack removed).
export const iconMap = {
  facebook: { Tabler: FaFacebook, FA: FaFacebook, label: "Facebook" },
  instagram: { Tabler: FaInstagram, FA: FaInstagram, label: "Instagram" },
  linkedin: { Tabler: FaLinkedin, FA: FaLinkedin, label: "LinkedIn" },
  twitter: { Tabler: FaTwitter, FA: FaTwitter, label: "Twitter/X" },
  youtube: { Tabler: FaYoutube, FA: FaYoutube, label: "YouTube" },
  tiktok: { Tabler: FaTiktok, FA: FaTiktok, label: "TikTok" },
  github: { Tabler: FaGithub, FA: FaGithub, label: "GitHub" },
  discord: { Tabler: FaDiscord, FA: FaDiscord, label: "Discord" },
  telegram: { Tabler: FaTelegram, FA: FaTelegram, label: "Telegram" },
  whatsapp: { Tabler: FaWhatsapp, FA: FaWhatsapp, label: "WhatsApp" },
  email: { Tabler: FaEnvelope, FA: FaEnvelope, label: "Email" },
  website: { Tabler: FaGlobe, FA: FaGlobe, label: "Website" },
  other: { Tabler: FaLink, FA: FaLink, label: "Other" },
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
