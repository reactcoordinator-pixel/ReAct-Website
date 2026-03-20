import { Providers } from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NextTopLoader from "nextjs-toploader";

export const metadata = {
  title: "ReAct Malaysia",
  description: "Under Development Of Muhammad Ahmad",
};

const RootLayout = ({ children }) => (
  <Providers>
    <NextTopLoader color="#f8cf2c" />
    <Header />
    <main className="min-h-screen">{children}</main>
    <Footer />
  </Providers>
);

export default RootLayout;
