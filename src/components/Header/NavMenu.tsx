"use client";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Divider,
  Box,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import Link from "next/link";
import { VscListFlat } from "react-icons/vsc";
import { AppLogo } from "../AppLogo";
import classes from "./HeaderMenu.module.css";
import React from "react";

export const NavMenu = ({
  logoUrl,
  visibleNavLinks,
}: {
  logoUrl?: string;
  visibleNavLinks: any[];
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button bg="#f8cf2c" ref={btnRef} onClick={onOpen}>
        <VscListFlat />
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <AppLogo src={logoUrl} />
          </DrawerHeader>
          <Divider />
          <DrawerBody>
            {visibleNavLinks.map((link) => (
              <Link key={link.href} href={link.href} className={classes.link}>
                <Box
                  width="100%"
                  p="10px"
                  _hover={{ bgColor: "#f8cf2c", color: "black" }}
                >
                  {link.label}
                </Box>
              </Link>
            ))}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
