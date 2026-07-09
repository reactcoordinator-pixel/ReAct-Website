"use client";
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Divider,
  useDisclosure,
} from "@heroui/react";
import Link from "next/link";
import { VscListFlat } from "react-icons/vsc";
import { AppLogo } from "../AppLogo";
import classes from "./HeaderMenu.module.css";

export const NavMenu = ({
  logoUrl,
  visibleNavLinks,
}: {
  logoUrl?: string;
  visibleNavLinks: any[];
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button isIconOnly className="bg-[#f8cf2c] text-black" onPress={onOpen}>
        <VscListFlat size={22} />
      </Button>
      <Drawer isOpen={isOpen} placement="left" onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                <AppLogo src={logoUrl} />
              </DrawerHeader>
              <Divider />
              <DrawerBody>
                {visibleNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={classes.link}
                    onClick={onClose}
                  >
                    <div className="w-full p-2.5 rounded-md hover:bg-[#f8cf2c] hover:text-black transition-colors">
                      {link.label}
                    </div>
                  </Link>
                ))}
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};
