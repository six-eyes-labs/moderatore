import { Dosis } from "next/font/google";
import "./globals.css";
import { WagmiProvider } from "@/config/WagmiProvider";
import { ReduxProvider } from "@/store/provider";

const dosis = Dosis({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={dosis.className}>
        <WagmiProvider>
          <ReduxProvider>{children}</ReduxProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
