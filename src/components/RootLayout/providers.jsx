"use client";

import { HeroUIProvider } from "@heroui/react";
import { MantineProvider } from "@mantine/core";
import { ChakraProvider } from "@chakra-ui/react";
import "@mantine/core/styles.css";

export function Providers({ children }) {
  return (
    <MantineProvider>
      <ChakraProvider>
        <HeroUIProvider>{children}</HeroUIProvider>{" "}
      </ChakraProvider>
    </MantineProvider>
  );
}
