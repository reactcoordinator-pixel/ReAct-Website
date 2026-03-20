"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@chakra-ui/react";
import Newsletter from "@/components/Common/Newsletter";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import { useNavigation } from "@/hooks/useNavigation";
import { IconType, iconMap } from "@/components/SocialIcons";
import { Spinner } from "@heroui/react";

const FooterSocialIcon = ({ iconName }: { iconName: string }) => {
  const IconComponent = iconMap[iconName as IconType]?.FA;
  if (!IconComponent) {
    return (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    );
  }
  const Icon = IconComponent;
  return <Icon className="w-6 h-6" />;
};
const Footer = () => {
  const { data: navData, isLoading: navLoading } = useNavigation();
  const { data: socialData, isLoading: socialLoading } = useSocialLinks();

  if (navLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#272727]">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  const logoUrl = navData?.logo || "/logo.png";
  const copyright =
    navData?.copyright ||
    `© ${new Date().getFullYear()} ReAct. All rights reserved`;

  // Filter only visible links
  const quickLinks = (navData?.footerQuickLinks || []).filter(
    (link) => link.visible,
  );
  const supportLinks = (navData?.footerSupportLinks || []).filter(
    (link) => link.visible,
  );
  const bottomLinks = (navData?.footerBottomLinks || []).filter(
    (link) => link.visible,
  );

  // Social links shown in footer
  const footerSocialLinks =
    socialData?.links.filter((link) => link.showInFooter) || [];

  // Email (from social links CMS)
  const email = socialData?.email;

  return (
    <>
      <footer className="border-t mt-0 border-stroke text-white bg-[#272727]">
        <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
          <div className="py-20 lg:py-25">
            <div className="flex flex-wrap gap-8 lg:justify-between lg:gap-0">
              {/* Logo & Description Column */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: -20 },
                  visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
                className="animate_top w-1/2 lg:w-1/4"
              >
                <Link href="/" className="relative inline-block">
                  <Image
                    width={150}
                    height={150}
                    src={logoUrl}
                    alt="ReAct Logo"
                  />
                </Link>
                <p className="mb-10 mt-5">Refugee Action for Change (ReAct)</p>
                {email && (
                  <Link
                    href={`mailto:${email.address}`}
                    className="font-medium text-white text-xl block mt-4"
                  >
                    {email.address}
                  </Link>
                )}
              </motion.div>

              {/* Links Columns */}
              <div className="flex w-full flex-col gap-8 md:flex-row md:justify-between md:gap-0 lg:w-2/3 xl:w-7/12">
                {/* Quick Links */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: -20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ duration: 1, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="animate_top"
                >
                  <h4 className="mb-9 text-itemtitle2 font-medium text-white">
                    Quick Links
                  </h4>
                  <ul className="list-none space-y-3">
                    {quickLinks.map((link, index) => (
                      <li key={index}>
                        <Link
                          href={link.href}
                          className="inline-block hover:text-primary transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Support Links */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: -20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ duration: 1, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="animate_top"
                >
                  <h4 className="mb-9 text-itemtitle2 font-medium text-white">
                    Support
                  </h4>
                  <ul className="list-none space-y-3">
                    {supportLinks.map((link, index) => (
                      <li key={index}>
                        <Link
                          href={link.href}
                          className="inline-block hover:text-primary transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Newsletter */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: -20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ duration: 1, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="animate_top"
                >
                  <h4 className="mb-9 text-itemtitle2 font-medium text-white">
                    Newsletter
                  </h4>
                  <p className="mb-4 w-[90%]">
                    Subscribe to receive future updates.
                  </p>
                  <Newsletter />
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="flex flex-col mx-0 px-4 bg-black flex-wrap items-center justify-center border-t border-stroke py-4 lg:flex-row lg:justify-between">
          {/* Bottom Links */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 1, delay: 0.1 }}
            viewport={{ once: true }}
            className="animate_top"
          >
            <ul className="flex items-center gap-8 list-none flex-wrap justify-center">
              {bottomLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Copyright */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 1, delay: 0.1 }}
            viewport={{ once: true }}
            className="animate_top my-4 lg:my-0"
          >
            <p>{copyright}</p>
          </motion.div>

          {/* Social Icons */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 1, delay: 0.1 }}
            viewport={{ once: true }}
            className="animate_top"
          >
            {socialLoading ? (
              <Spinner size="sm" color="warning" />
            ) : (
              <ul className="flex items-center gap-5 list-none">
                {footerSocialLinks.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.name}
                      className="hover:text-[#f8cf2c] transition-colors"
                    >
                      <FooterSocialIcon iconName={link.icon} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
