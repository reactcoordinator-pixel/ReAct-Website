import "@/styles/globals.css";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { HeroUIProvider } from "@heroui/react";
import { ChakraProvider } from "@chakra-ui/react";

// Dynamically import MantineProvider with SSR disabled
const MantineProvider = dynamic(
  () => import("@mantine/core").then((mod) => mod.MantineProvider),
  { ssr: false },
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider>
      <ChakraProvider>
        <HeroUIProvider>
          <Component {...pageProps} />
        </HeroUIProvider>
      </ChakraProvider>
    </MantineProvider>
  );
}
